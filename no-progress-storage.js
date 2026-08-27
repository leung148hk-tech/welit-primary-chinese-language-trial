/* JCMKEC direct-play edition: session-only in-memory storage.
 * It has the same small API the legacy question scripts expect, but it is never
 * written to browser storage and is discarded whenever the page is changed or reloaded.
 */
(() => {
  'use strict';
  const data = new Map();
  const storage = Object.freeze({
    get length() { return data.size; },
    key(index) { return Array.from(data.keys())[Number(index)] ?? null; },
    getItem(key) { const normalised = String(key); return data.has(normalised) ? data.get(normalised) : null; },
    setItem(key, value) { data.set(String(key), String(value)); },
    removeItem(key) { data.delete(String(key)); },
    clear() { data.clear(); }
  });
  Object.defineProperty(window, '__jcmkecSessionStore', {
    value: storage,
    configurable: false,
    writable: false
  });
})();
