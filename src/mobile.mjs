export const BREAKPOINT = 767;

// iOS home-screen chrome reads Apple metadata separately from theme-color.
// Use opaque styles (never black-translucent), preserving the existing safe
// viewport: no content is moved underneath system time/battery indicators.
export function installStandaloneChrome(win) {
  const doc = win.document, html = doc.documentElement;
  const standalone = win.matchMedia('(display-mode: standalone)');
  const phone = win.matchMedia('(max-width: 767px), (pointer: coarse) and (max-height: 767px)');
  const saved = new Map();
  let created = null, active = false;
  const oldBackground = html.style.getPropertyValue('--dsh-mobile-chrome-background');
  const oldPriority = html.style.getPropertyPriority('--dsh-mobile-chrome-background');
  const oldMarker = html.getAttribute('data-dsh-mobile-standalone');
  function reset() {
    if (!active) return;
    for (const [meta, content] of saved) {
      if (content === null) meta.removeAttribute('content'); else meta.setAttribute('content', content);
    }
    saved.clear(); created?.remove(); created = null;
    if (oldMarker === null) html.removeAttribute('data-dsh-mobile-standalone'); else html.setAttribute('data-dsh-mobile-standalone', oldMarker);
    if (oldBackground) html.style.setProperty('--dsh-mobile-chrome-background', oldBackground, oldPriority);
    else html.style.removeProperty('--dsh-mobile-chrome-background');
    active = false;
  }
  function sync() {
    const native = html.hasAttribute('data-platform') || html.hasAttribute('data-windows-titlebar');
    if (native || !phone.matches || !(standalone.matches || win.navigator.standalone === true)) { reset(); return; }
    active = true;
    const dark = doc.body.hasAttribute('data-ds-dark-theme') || win.getComputedStyle(html).colorScheme === 'dark';
    let metas = [...doc.head.querySelectorAll('meta[name="apple-mobile-web-app-status-bar-style"]')];
    if (!metas.length) {
      created = doc.createElement('meta'); created.name = 'apple-mobile-web-app-status-bar-style';
      doc.head.append(created); metas = [created];
    }
    for (const meta of metas) {
      if (meta !== created && !saved.has(meta)) saved.set(meta, meta.getAttribute('content'));
      const content = dark ? 'black' : 'default';
      if (meta.content !== content) meta.content = content;
    }
    const background = win.getComputedStyle(doc.body).backgroundColor;
    if (html.style.getPropertyValue('--dsh-mobile-chrome-background') !== background) html.style.setProperty('--dsh-mobile-chrome-background', background);
    if (!html.hasAttribute('data-dsh-mobile-standalone')) html.setAttribute('data-dsh-mobile-standalone', '');
  }
  const observer = new win.MutationObserver(sync);
  observer.observe(html, {attributes: true, attributeFilter: ['style', 'class', 'data-ds-theme-source', 'data-platform', 'data-windows-titlebar']});
  observer.observe(doc.body, {attributes: true, attributeFilter: ['style', 'class', 'data-ds-dark-theme']});
  standalone.addEventListener('change', sync); phone.addEventListener('change', sync);
  win.addEventListener('pageshow', sync);
  sync();
  return () => { observer.disconnect(); standalone.removeEventListener('change', sync); phone.removeEventListener('change', sync); win.removeEventListener('pageshow', sync); reset(); };
}

export function compactStat(text) {
  return text.replace(/(\d[\d,.]*)\s*(?:轮|turns?)/gi, '$1r')
    .replace(/(\d[\d,.]*)\s*(?:步|steps?)/gi, '$1s')
    .replace(/缓存命中\s*|Cache hit\s*/gi, 'H ')
    .replace(/\s*tok\/s/gi, '/s').replace(/\s*tok\b/gi, '')
    .replace(/\s*·\s*/g, ' · ').replace(/\s+/g, ' ').trim();
}

export function viewportGeometry(win) {
  const vv = win.visualViewport;
  // Never counteract intentional pinch zoom or turn it into a keyboard resize.
  if (vv && Math.abs(vv.scale - 1) > 0.02) return null;
  return {
    height: Math.max(1, Math.round(vv?.height ?? win.innerHeight)),
    top: Math.max(0, Math.round(vv?.offsetTop ?? 0)),
    keyboard: !!vv && win.innerHeight - vv.height > 120,
  };
}

/** DOM compatibility adapter, isolated here rather than coupled to hashed CSS classes.
 * Only published shell/composer data markers and the shell's immediate columns are used.
 * Unsupported shell structure fails closed; never replace root, move React nodes or editor state.
 */
export function installMobile(ctx, css, win = window) {
  const doc = win.document;
  const html = doc.documentElement;
  const media = win.matchMedia(`(max-width: ${BREAKPOINT}px)`);
  // Phone landscape may exceed the layout breakpoint. Keep text inflation
  // prevention active through rotation without enabling the narrow layout there.
  const textMedia = win.matchMedia(`(max-width: ${BREAKPOINT}px), (pointer: coarse) and (max-height: ${BREAKPOINT}px)`);
  const listeners = new Set();
  const originals = new Map();
  const properties = new Map();
  let frame = null;
  let sidebar = null;
  let center = null;
  let active = false;
  let open = false;
  let navigation = 'inactive';
  let raf = 0;
  let disposed = false;
  const style = doc.createElement('style');
  style.setAttribute('data-dsh-mobile-style', '');
  style.textContent = css;
  doc.head.append(style);
  const stopStandaloneChrome = installStandaloneChrome(win);

  function remember(el, name) {
    let attrs = originals.get(el);
    if (!attrs) { attrs = new Map(); originals.set(el, attrs); }
    if (!attrs.has(name)) attrs.set(name, el.getAttribute(name));
  }
  function attr(el, name, value) {
    if (!el) return;
    remember(el, name);
    if (value === null) { if (el.hasAttribute(name)) el.removeAttribute(name); }
    else if (el.getAttribute(name) !== value) el.setAttribute(name, value);
  }
  function property(name, value) {
    if (!properties.has(name)) properties.set(name, [html.style.getPropertyValue(name), html.style.getPropertyPriority(name)]);
    html.style.setProperty(name, value);
  }
  function restore() {
    for (const [name, [value, priority]] of properties) {
      if (value) html.style.setProperty(name, value, priority); else html.style.removeProperty(name);
    }
    properties.clear();
    for (const [el, attrs] of originals) for (const [name, value] of attrs) {
      if (value === null) el.removeAttribute(name); else el.setAttribute(name, value);
    }
    originals.clear();
  }
  function publish(next) {
    open = next;
    const state = active ? (open ? 'open' : 'closed') : 'inactive';
    if (navigation === state) return;
    navigation = state;
    for (const listener of listeners) listener();
  }
  function findShell() {
    const right = doc.querySelector('#root [data-rightbar-col]');
    const candidate = right?.parentElement;
    if (!candidate?.querySelector(':scope > [data-shell-overlay]')) return null;
    const children = [...candidate.children];
    const index = children.indexOf(right);
    if (index !== 2 || !children[0] || !children[1]) return null;
    return { frame: candidate, sidebar: children[0], center: children[1] };
  }
  function sync() {
    raf = 0;
    if (disposed) return;
    const shell = findShell();
    const browserShell = !!shell && !html.hasAttribute('data-windows-titlebar') && !html.hasAttribute('data-platform');
    const enabled = media.matches && browserShell;
    function syncTextSizing() {
      attr(html, 'data-dsh-mobile-text-sizing', browserShell && textMedia.matches ? '' : null);
    }
    if (!enabled) {
      if (active) restore();
      syncTextSizing();
      active = false; frame = sidebar = center = null; publish(false); return;
    }
    if (frame !== shell.frame) {
      restore();
      ({frame, sidebar, center} = shell);
    }
    syncTextSizing();
    active = true;
    attr(html, 'data-dsh-mobile', '');
    attr(frame, 'data-dsh-mobile-frame', '');
    attr(sidebar, 'data-dsh-mobile-sidebar', '');
    attr(center, 'data-dsh-mobile-center', '');
    const expanded = !frame.hasAttribute('data-sidebar-collapsed');
    // The drawer is an overlay; prevent keyboard/tab/pointer interaction behind it.
    const backgrounds = [center, frame.querySelector(':scope > [data-shell-bottom]'), frame.querySelector(':scope > [data-rightbar-col]')];
    for (const element of backgrounds) {
      if (!element) continue;
      if (expanded) attr(element, 'inert', '');
      else if (originals.get(element)?.has('inert')) {
        const previous = originals.get(element).get('inert');
        if (previous === null) element.removeAttribute('inert'); else element.setAttribute('inert', previous);
        originals.get(element).delete('inert');
      }
    }
    publish(expanded);
    for (const editor of center.querySelectorAll('[data-composer-input][contenteditable="true"]')) {
      attr(editor, 'enterkeyhint', 'enter');
    }
    // Keep hover-revealed action strips permanently laid out on touch screens.
    // iOS may consume the first tap to reveal display:none hover descendants.
    for (const row of sidebar.querySelectorAll('[data-row-key]')) {
      const key = row.getAttribute('data-row-key') ?? '';
      if (!/^(workspace|session):/.test(key)) continue;
      for (const child of row.children) {
        if (child.tagName === 'SPAN' && child.querySelector('button')) {
          attr(child, 'data-dsh-mobile-row-actions', '');
        }
      }
    }
    for (const stat of frame.querySelectorAll('[data-composer-dock] [data-composer-stat]')) {
      const pill = stat.firstElementChild;
      const label = pill?.lastElementChild;
      if (label?.tagName === 'SPAN' && !label.querySelector('svg')) {
        attr(label, 'data-dsh-mobile-stat-label', compactStat(label.textContent ?? ''));
      }
    }
    // Header-only adapter: keep React's labels and event handlers untouched.
    const leading = center.querySelector('[data-conversation-header-leading]');
    const header = leading?.closest('header');
    if (header) {
      attr(header, 'data-dsh-mobile-header', '');
      const corner = header.querySelector('[data-conversation-header-corner]');
      if (corner) {
        attr(corner.parentElement, 'data-dsh-mobile-title-row', '');
        const row = corner.parentElement;
        const cluster = row?.firstElementChild;
        if (cluster && cluster !== corner && cluster.querySelector('nav')) {
          attr(cluster, 'data-dsh-mobile-title-cluster', '');
          const actions = cluster.querySelector('nav')?.nextElementSibling;
          if (actions) attr(actions, 'data-dsh-mobile-header-actions', '');
        }
        const utilities = corner.previousElementSibling;
        if (utilities && utilities !== cluster && utilities.tagName === 'DIV') attr(utilities, 'data-dsh-mobile-utilities', '');
      }
      for (const button of header.querySelectorAll('button[aria-expanded][aria-label]')) {
        const label = button.getAttribute('aria-label') ?? '';
        if (/^(?:更多会话视图|More conversation views)(?:\s*·|$)/i.test(label)) {
          attr(button, 'data-dsh-mobile-hidden-view-more', '');
          // Hide its anchor as well, so no empty flex gap remains.
          const anchor = button.parentElement;
          if (anchor?.parentElement?.querySelector('[data-conversation-tabs]')) attr(anchor, 'data-dsh-mobile-hidden-view-more', '');
        }
        const kind = /后台任务|background jobs?/i.test(label) ? 'jobs'
          : /子智能体|subagents?/i.test(label) && button.getAttribute('aria-haspopup') === 'tree' ? 'agents' : null;
        const count = [...button.children].find(child => child.tagName === 'SPAN' && /^\s*\d+\s*(?:个\s*)?(?:子智能体|后台任务|subagents?|background jobs?)/i.test(child.textContent ?? ''));
        if (kind && count) {
          attr(button, 'data-dsh-mobile-header-counter', kind);
          attr(count, 'data-dsh-mobile-header-count', (count.textContent ?? '').match(/\d+/)?.[0] ?? '0');
        }
      }
    }
    const geometry = viewportGeometry(win);
    if (geometry) {
      property('--dsh-mobile-height', `${geometry.height}px`);
      property('--dsh-mobile-top', `${geometry.top}px`);
      attr(html, 'data-dsh-mobile-keyboard', geometry.keyboard ? '' : null);
    }
  }
  function schedule() { if (!disposed && !raf) raf = win.requestAnimationFrame(sync); }
  function close() { if (active && frame && !frame.hasAttribute('data-sidebar-collapsed')) ctx.layout.toggleSidebar(); }
  function sidebarDoubleClick(event) {
    if (!active) return;
    const row = event.target?.closest?.('[data-row-key^="session:"]');
    if (!row || !sidebar?.contains(row) || event.target.closest('button, input, textarea, [role="menuitem"]')) return;
    // Suppress only the row title's desktop rename shortcut, never its menu.
    event.preventDefault();
    event.stopPropagation();
  }
  let pendingSubmit = null;
  let submitTimer = 0;
  let compositionUntil = 0;
  function clearPendingSubmit() {
    pendingSubmit = null;
    if (submitTimer) win.clearTimeout(submitTimer);
    submitTimer = 0;
  }
  function checkSubmitted() {
    const editor = pendingSubmit;
    if (!editor) return;
    if (!active || !editor.isConnected || doc.activeElement !== editor) { clearPendingSubmit(); return; }
    // Only a send-button click arms this; dismiss after the host clears the draft.
    if (!(editor.textContent ?? '').replace(/[\s\u200b]/g, '') && !editor.querySelector('[data-composer-text-ref]')) {
      clearPendingSubmit();
      editor.blur();
    }
  }
  function composition(event) {
    if (event.target?.closest?.('[data-composer-input]')) {
      compositionUntil = event.type === 'compositionstart' ? Infinity : Date.now() + 20;
      clearPendingSubmit();
    }
  }
  let inputActions = null;
  function composerEnter(event) {
    clearPendingSubmit();
    const editor = event.target?.closest?.('[data-composer-input][contenteditable="true"]');
    if (!active || !editor || !center?.contains(editor) || event.key !== 'Enter'
      || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey
      || event.isComposing || event.keyCode === 229 || Date.now() < compositionUntil
      || editor.hasAttribute('data-composer-composing')
      || editor.hasAttribute('aria-activedescendant') || !inputActions) return;
    // Consume the plain Enter before Lexical's submit keymap. Public insertion
    // preserves selection/undo and draft persistence, including an empty draft.
    event.preventDefault();
    event.stopPropagation();
    if (inputActions.insertText('\n', inputActions.captureInsertion())) {
      inputActions.persistDraft();
    }
  }
  function composerSend(event) {
    clearPendingSubmit();
    if (!active) return;
    const button = event.target?.closest?.('[data-composer-card] button');
    if (!button || !center?.contains(button) || button.disabled
      || !/^(发送消息|排队发送|插话发送|Send message|Queue message|Steer message)$/.test(button.getAttribute('aria-label') ?? '')) return;
    const editor = button.closest('[data-composer-card]').querySelector('[data-composer-input][contenteditable="true"]');
    if (!editor || doc.activeElement !== editor) return;
    pendingSubmit = editor;
    submitTimer = win.setTimeout(clearPendingSubmit, 1500);
    win.queueMicrotask(() => { if (!disposed) checkSubmitted(); });
  }
  function keydown(event) {
    if (event.key === 'Escape' && open && !doc.querySelector('[role="dialog"], [role="menu"]')) {
      event.preventDefault(); close();
    }
  }
  // Observe shell mounting/replacement and host sidebar state, not every message mutation attribute.
  const observer = new win.MutationObserver(() => { schedule(); checkSubmitted(); });
  observer.observe(doc.getElementById('root') ?? doc.body, {
    childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['data-sidebar-collapsed'],
  });
  media.addEventListener('change', schedule);
  textMedia.addEventListener('change', schedule);
  win.addEventListener('orientationchange', schedule);
  win.addEventListener('resize', schedule);
  win.visualViewport?.addEventListener('resize', schedule);
  win.visualViewport?.addEventListener('scroll', schedule);
  doc.addEventListener('focusin', schedule);
  doc.addEventListener('focusout', schedule);
  doc.addEventListener('keydown', keydown);
  doc.addEventListener('dblclick', sidebarDoubleClick, true);
  doc.addEventListener('keydown', composerEnter, true);
  doc.addEventListener('click', composerSend, true);
  doc.addEventListener('compositionstart', composition, true);
  doc.addEventListener('compositionend', composition, true);
  sync();
  return {
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    getSnapshot() { return navigation; },
    setInputActions(actions) {
      inputActions = actions;
      return () => { if (inputActions === actions) inputActions = null; };
    },
    toggle() { if (active) ctx.layout.toggleSidebar(); },
    close,
    dispose() {
      disposed = true;
      clearPendingSubmit();
      if (raf) win.cancelAnimationFrame(raf);
      observer.disconnect();
      media.removeEventListener('change', schedule);
      textMedia.removeEventListener('change', schedule);
      win.removeEventListener('orientationchange', schedule);
      win.removeEventListener('resize', schedule);
      win.visualViewport?.removeEventListener('resize', schedule);
      win.visualViewport?.removeEventListener('scroll', schedule);
      doc.removeEventListener('focusin', schedule);
      doc.removeEventListener('focusout', schedule);
      doc.removeEventListener('keydown', keydown);
      doc.removeEventListener('dblclick', sidebarDoubleClick, true);
      doc.removeEventListener('keydown', composerEnter, true);
      doc.removeEventListener('click', composerSend, true);
      inputActions = null;
      doc.removeEventListener('compositionstart', composition, true);
      doc.removeEventListener('compositionend', composition, true);
      restore(); stopStandaloneChrome(); style.remove(); listeners.clear();
    },
  };
}
