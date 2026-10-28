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
  const listeners = new Set();
  const originals = new Map();
  const properties = new Map();
  let frame = null;
  let sidebar = null;
  let center = null;
  let active = false;
  let open = false;
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
    if (open === next) return;
    open = next;
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
    const enabled = media.matches && !!shell
      && !html.hasAttribute('data-windows-titlebar') && !html.hasAttribute('data-platform');
    if (!enabled) {
      if (active) restore();
      active = false; frame = sidebar = center = null; publish(false); return;
    }
    if (frame !== shell.frame) {
      restore();
      ({frame, sidebar, center} = shell);
    }
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
    for (const stat of frame.querySelectorAll('[data-composer-dock] [data-composer-stat]')) {
      const pill = stat.firstElementChild;
      const label = pill?.lastElementChild;
      if (label?.tagName === 'SPAN' && !label.querySelector('svg')) {
        attr(label, 'data-dsh-mobile-stat-label', compactStat(label.textContent ?? ''));
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
  function keydown(event) {
    if (event.key === 'Escape' && open && !doc.querySelector('[role="dialog"], [role="menu"]')) {
      event.preventDefault(); close();
    }
  }
  // Observe shell mounting/replacement and host sidebar state, not every message mutation attribute.
  const observer = new win.MutationObserver(schedule);
  observer.observe(doc.getElementById('root') ?? doc.body, {
    childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['data-sidebar-collapsed'],
  });
  media.addEventListener('change', schedule);
  win.addEventListener('resize', schedule);
  win.visualViewport?.addEventListener('resize', schedule);
  win.visualViewport?.addEventListener('scroll', schedule);
  doc.addEventListener('focusin', schedule);
  doc.addEventListener('focusout', schedule);
  doc.addEventListener('keydown', keydown);
  sync();
  return {
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    getSnapshot() { return open; },
    close,
    dispose() {
      disposed = true;
      if (raf) win.cancelAnimationFrame(raf);
      observer.disconnect();
      media.removeEventListener('change', schedule);
      win.removeEventListener('resize', schedule);
      win.visualViewport?.removeEventListener('resize', schedule);
      win.visualViewport?.removeEventListener('scroll', schedule);
      doc.removeEventListener('focusin', schedule);
      doc.removeEventListener('focusout', schedule);
      doc.removeEventListener('keydown', keydown);
      restore(); style.remove(); listeners.clear();
    },
  };
}
