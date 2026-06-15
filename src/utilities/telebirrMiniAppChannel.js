export const TELEBIRR_MINI_CHANNEL_KEY = "telebirrMiniAppChannel";

const ENTRY_SEGMENTS = {
  super_mini: "super",
  partner_mini: "partner",
};

/** Persist super | partner from mini-app entry route. */
export const saveTelebirrMiniAppChannel = (channel) => {
  if (channel !== "super" && channel !== "partner") return null;
  localStorage.setItem(TELEBIRR_MINI_CHANNEL_KEY, channel);
  console.log("[telebirr] mini app channel saved", {
    channel,
    path: window.location.pathname,
  });
  return channel;
};

/**
 * Detects /super_mini or /partner_mini (final path segment) and persists channel.
 * @param {string} [pathname]
 * @returns {"super"|"partner"|null}
 */
export const captureTelebirrMiniAppEntry = (pathname = window.location.pathname) => {
  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) return null;

  const last = segments[segments.length - 1];
  const channel = ENTRY_SEGMENTS[last];
  if (!channel) return null;

  return saveTelebirrMiniAppChannel(channel);
};

export const getTelebirrMiniAppChannel = () =>
  localStorage.getItem(TELEBIRR_MINI_CHANNEL_KEY);

export const isTelebirrMiniAppEntry = () => {
  const channel = getTelebirrMiniAppChannel();
  return channel === "super" || channel === "partner";
};

/** API `channel` field sent to buy-tag endpoints. */
export const getTelebirrAppTypeChannel = () => {
  const channel = getTelebirrMiniAppChannel();
  if (channel === "super") return "MINI_SUPERAPP";
  if (channel === "partner") return "MINI_PARTNERAPP";
  if (typeof window.consumerapp?.evaluate === "function") return "MINI_SUPERAPP";
  return "WEB";
};

/** Telebirr business_type for a given app channel (Select must match an Option). */
export const getTelebirrDefaultBusinessType = (appChannel = getTelebirrAppTypeChannel()) => {
  if (appChannel === "MINI_PARTNERAPP") return "TransferToOtherOrg";
  if (appChannel === "MINI_SUPERAPP") return "BuyGoods";
  return null;
};
