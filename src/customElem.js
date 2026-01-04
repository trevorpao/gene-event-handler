'use strict';

// Lightweight custom element handler registry with dedupe, per-element guarding, and optional logging.
// Handler contract: fn(node) => html string | Node | DocumentFragment (default action: replace node)
// Options: { overwrite?: boolean, mode?: 'replace'|'append'|'prepend'|'before'|'after'|'none' }
const handlers = new Map();

function register(name, fn, options = {}) {
  if (!name || typeof name !== 'string') return false;
  if (typeof fn !== 'function') return false;
  const overwrite = options.overwrite === true;
  if (!overwrite && handlers.has(name)) return false;
  const mode = options.mode || 'replace';
  handlers.set(name, { fn, mode });
  return true;
}

function unregister(name) {
  return handlers.delete(name);
}

function toFragment(node, htmlOrNode) {
  if (!htmlOrNode && htmlOrNode !== 0) return null;
  if (htmlOrNode instanceof DocumentFragment) return htmlOrNode;
  if (htmlOrNode instanceof Node) return htmlOrNode;
  const doc = node.ownerDocument || document;
  const range = doc.createRange();
  range.selectNode(node);
  return range.createContextualFragment(String(htmlOrNode));
}

function insertByMode(node, frag, mode) {
  if (!frag) return;
  const parent = node.parentNode;
  if (!parent && mode !== 'none') return;

  switch (mode) {
    case 'append':
      node.appendChild(frag);
      break;
    case 'prepend':
      node.insertBefore(frag, node.firstChild);
      break;
    case 'before':
      parent.insertBefore(frag, node);
      break;
    case 'after':
      parent.insertBefore(frag, node.nextSibling);
      break;
    case 'replace':
      parent.insertBefore(frag, node);
      parent.removeChild(node);
      break;
    case 'none':
    default:
      break;
  }
}

function apply(root = document, options = {}) {
  const scope = root || document;
  const logger = options.logger || (() => {});
  const debug = !!options.debug;

  handlers.forEach((entry, name) => {
    const nodes = scope.querySelectorAll(name);
    if (!nodes || nodes.length === 0) return;

    nodes.forEach(node => {
      const flag = `data-gee-tagged-${name}`;
      if (node.getAttribute(flag) === '1') return;
      node.setAttribute(flag, '1');

      try {
        const res = entry.fn(node);
        if (res && typeof res.then === 'function') {
          // async handler
          res.then(out => insertByMode(node, toFragment(node, out), entry.mode))
            .catch(err => logger(`customElem ${name} error: ${err && err.message ? err.message : err}`));
        } else {
          const frag = toFragment(node, res);
          insertByMode(node, frag, entry.mode);
        }
      } catch (err) {
        if (debug && typeof console !== 'undefined') {
          console.warn(`customElem ${name} error`, err);
        }
        logger(`customElem ${name} error: ${err && err.message ? err.message : err}`);
      }
    });
  });
}

function list() {
  return Array.from(handlers.keys());
}

export default { register, unregister, apply, list };
