let erudaStarted = false;

const isTelebirrMiniApp = () =>
  typeof window.consumerapp?.evaluate === "function";

const shouldEnableEruda = () => {
  if (import.meta.env.VITE_ENABLE_ERUDA === "false") {
    return false;
  }
  return (
    import.meta.env.DEV ||
    import.meta.env.VITE_ENABLE_ERUDA === "true" ||
    isTelebirrMiniApp()
  );
};

/** Wait for telebirr WebView bridge (not available on first paint in some builds). */
const waitForMiniAppBridge = async (maxMs = 4000) => {
  if (shouldEnableEruda()) {
    return true;
  }
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (shouldEnableEruda()) {
      return true;
    }
  }
  return false;
};

/**
 * Mobile debug console for telebirr mini app WebView.
 * @see https://github.com/liriliri/eruda
 *
 * Enabled: dev | VITE_ENABLE_ERUDA=true | telebirr consumerapp bridge
 * Disabled: VITE_ENABLE_ERUDA=false
 */
export async function initEruda() {
  if (typeof window === "undefined" || erudaStarted) {
    return;
  }

  const enabled = await waitForMiniAppBridge();
  if (!enabled) {
    return;
  }

  try {
    const mod = await import("eruda");
    const api = mod.default ?? mod;
    if (typeof api?.init !== "function") {
      throw new Error("eruda.init is not available");
    }
    api.init();
    if (typeof api.show === "function") {
      api.show();
    }
    erudaStarted = true;
    console.log("[eruda] console opened");
  } catch (error) {
    console.error("[eruda] init failed", error);
  }
}
