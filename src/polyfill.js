/**
 * Mini-program WebView compatibility polyfill.
 *
 * MUST be the first import in main.jsx.
 *
 * Problem: In Alipay/Telebirr/MaCLE mini-program WebViews, window.localStorage
 * and window.sessionStorage are proxied through the native JS bridge (native.js).
 * The bridge processes calls asynchronously via a callback that uses
 * `onInvokeFinished`. If that callback object is undefined (bridge not fully
 * initialised, or unsupported context), native.js throws:
 *   "Cannot read properties of undefined (reading 'onInvokeFinished')"
 * This error is asynchronous – it fires INSIDE native.js's callback, so our
 * own try/catch blocks cannot intercept it.
 *
 * Fix: Completely replace window.localStorage / window.sessionStorage with a
 * pure in-memory implementation before any other module code runs. This ensures
 * the bridge is never invoked for storage calls.
 *
 * In a normal browser the mini-program bridge is absent, so we keep real
 * localStorage (with a try-catch safety net). Detection is done by looking for
 * Alipay / WeChat / generic mini-program bridge globals in window.
 */

(function patchStorage() {
  if (typeof window === 'undefined') return;

  // ── Environment detection ──────────────────────────────────────────────────
  const isMiniProgram =
    'AlipayJSBridge' in window ||
    'my' in window ||
    'wx' in window ||
    /AlipayClient|MicroMessenger|AliApp|miniProgram/i.test(
      window.navigator?.userAgent || ''
    );

  // ── In-memory storage factory ──────────────────────────────────────────────
  function createMemoryStorage() {
    const store = Object.create(null);
    return {
      getItem(key) {
        return Object.prototype.hasOwnProperty.call(store, key)
          ? store[key]
          : null;
      },
      setItem(key, value) {
        store[key] = value == null ? null : String(value);
      },
      removeItem(key) {
        delete store[key];
      },
      clear() {
        const keys = Object.keys(store);
        for (let i = 0; i < keys.length; i++) delete store[keys[i]];
      },
      get length() {
        return Object.keys(store).length;
      },
      key(index) {
        return Object.keys(store)[index] ?? null;
      },
    };
  }

  // ── Safe wrapper (browser fallback) ───────────────────────────────────────
  // Wraps real localStorage with try/catch + memory fallback. Used in plain
  // browsers where the bridge is absent and localStorage is a real Storage.
  function createSafeStorage(real) {
    const mem = createMemoryStorage();
    return {
      getItem(key) {
        try { return real.getItem(key); } catch { return mem.getItem(key); }
      },
      setItem(key, value) {
        try { real.setItem(key, value); } catch { /* ignore */ }
        mem.setItem(key, value); // always keep in-memory copy in sync
      },
      removeItem(key) {
        try { real.removeItem(key); } catch { /* ignore */ }
        mem.removeItem(key);
      },
      clear() {
        try { real.clear(); } catch { /* ignore */ }
        mem.clear();
      },
      get length() {
        try { return real.length; } catch { return mem.length; }
      },
      key(index) {
        try { return real.key(index); } catch { return mem.key(index); }
      },
    };
  }

  // ── Apply patch ────────────────────────────────────────────────────────────
  const lsPatch = isMiniProgram
    ? createMemoryStorage()
    : createSafeStorage(window.localStorage);

  const ssPatch = isMiniProgram
    ? createMemoryStorage()
    : createSafeStorage(window.sessionStorage);

  try {
    Object.defineProperty(window, 'localStorage', {
      get() { return lsPatch; },
      configurable: true,
    });
    Object.defineProperty(window, 'sessionStorage', {
      get() { return ssPatch; },
      configurable: true,
    });
  } catch {
    // Some environments don't allow redefining window.localStorage.
    // As a last-resort fallback, suppress the specific bridge error.
    window.addEventListener('error', function (e) {
      if (
        e.message && e.message.includes('onInvokeFinished') &&
        e.filename && e.filename.includes('native.js')
      ) {
        e.preventDefault();
      }
    });
  }

  // ── Suppress residual bridge errors ───────────────────────────────────────
  // Belt-and-suspenders: if any other bridge call still slips through, suppress
  // the specific onInvokeFinished TypeError so it does not surface as uncaught.
  window.addEventListener('error', function (e) {
    if (
      e.message &&
      e.message.includes('onInvokeFinished') &&
      e.filename &&
      e.filename.includes('native.js')
    ) {
      e.preventDefault();
    }
  });
})();
