export const BREAKPOINT = 767;

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
    // A prevented Enter alone also means completion selection or blocked send.
    // Only dismiss after the host actually consumes/clears the draft.
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
  function composerEnter(event) {
    clearPendingSubmit();
    const editor = event.target?.closest?.('[data-composer-input][contenteditable="true"]');
    if (!active || !editor || !center?.contains(editor) || event.key !== 'Enter'
      || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey || event.repeat
      || event.isComposing || event.keyCode === 229 || Date.now() < compositionUntil
      || editor.hasAttribute('data-composer-composing')
      || !(editor.textContent ?? '').trim()
      || editor.hasAttribute('aria-activedescendant')) return;
    pendingSubmit = editor;
    submitTimer = win.setTimeout(clearPendingSubmit, 1500);
    // Run after Lexical/React's original key handlers; never consume the event.
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
  doc.addEventListener('compositionstart', composition, true);
  doc.addEventListener('compositionend', composition, true);
  sync();
  return {
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    getSnapshot() { return navigation; },
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
      doc.removeEventListener('compositionstart', composition, true);
      doc.removeEventListener('compositionend', composition, true);
      restore(); style.remove(); listeners.clear();
    },
  };
}
