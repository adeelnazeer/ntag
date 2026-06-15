const EDGE_QUOTE_PAIRS = [
  ['"', '"'],
  ["'", "'"],
  ["\u201c", "\u201d"],
  ["\u2018", "\u2019"],
];

const stripEdgeQuotes = (str) => {
  let t = str.trim();
  let changed = true;
  while (changed) {
    changed = false;
    for (const [open, close] of EDGE_QUOTE_PAIRS) {
      if (t.startsWith(open) && t.endsWith(close)) {
        t = t.slice(open.length, t.length - close.length).trim();
        changed = true;
      }
    }
  }
  return t;
};

/** Backend may return sign=... with \\/ instead of / — telebirr rejects invalid signature. */
const fixTelebirrEscapes = (s) => s.replace(/\\+\//g, "/");

/** Already a telebirr prepay query string — skip quote/JSON unwrapping that can corrupt sign. */
const isTelebirrRawRequestQuery = (s) =>
  typeof s === "string" && /^appid=/i.test(s.trim());

/** Explicit failure codes from native bridge (official sample passes no args on success). */
export const isTelebirrPaymentFailure = (result) => {
  if (result == null || result === "") return false;
  if (typeof result === "boolean") return result;
  if (typeof result === "number") return result === 0;

  if (typeof result === "string") {
    const t = result.trim();
    if (!t) return false;
    try {
      return isTelebirrPaymentFailure(JSON.parse(t));
    } catch {
      return /"(code|resultCode|errCode)"\s*:\s*("[1-9]\d*"|failed|cancel)/i.test(
        t
      );
    }
  }

  if (typeof result === "object") {
    const code =
      result.code ??
      result.errCode ??
      result.resultCode ??
      result.status ??
      result.response_code;
    if (code != null) {
      const c = String(code).toLowerCase();
      if (c === "0" || c === "00" || c === "success" || c === "succeed") {
        return false;
      }
      return true;
    }
    if (result.success === false) return true;
  }

  return false;
};

/** Official checkout sample calls callback with no args after payment — empty means done. */
export const isTelebirrPaymentSuccess = (result) =>
  !isTelebirrPaymentFailure(result);

const REQUIRED_RAW_REQUEST_KEYS = [
  "appid",
  "merch_code",
  "nonce_str",
  "prepay_id",
  "timestamp",
  "sign_type",
  "sign",
];

/** Parse query string; sign value may contain '=' but not unencoded '&'. */
export const parseTelebirrRawRequestFields = (rawRequest) => {
  if (typeof rawRequest !== "string" || !rawRequest.trim()) return {};
  const s = rawRequest.trim();
  const signMarker = "&sign=";
  const signIdx = s.lastIndexOf(signMarker);
  if (signIdx === -1) {
    const fields = {};
    for (const part of s.split("&")) {
      const eq = part.indexOf("=");
      if (eq > 0) fields[part.slice(0, eq)] = part.slice(eq + 1);
    }
    return fields;
  }
  const fields = {};
  const prefix = s.slice(0, signIdx);
  for (const part of prefix.split("&")) {
    const eq = part.indexOf("=");
    if (eq > 0) fields[part.slice(0, eq)] = part.slice(eq + 1);
  }
  fields.sign = s.slice(signIdx + signMarker.length);
  return fields;
};

export const validateRawRequestStructure = (rawRequest) => {
  const trimmed = typeof rawRequest === "string" ? rawRequest.trim() : "";
  if (!trimmed) {
    return { valid: false, error: "rawRequest is empty", fields: {} };
  }
  if (!/^appid=[^&]+&/i.test(trimmed)) {
    return {
      valid: false,
      error:
        'rawRequest must start with "appid=" (got malformed or sign-only payload)',
      fields: parseTelebirrRawRequestFields(trimmed),
      preview: trimmed.slice(0, 80),
    };
  }
  const fields = parseTelebirrRawRequestFields(trimmed);
  const missing = REQUIRED_RAW_REQUEST_KEYS.filter((k) => !fields[k]);
  if (missing.length) {
    return {
      valid: false,
      error: `rawRequest missing: ${missing.join(", ")}`,
      fields,
    };
  }
  if (fields.sign_type !== "SHA256WithRSA") {
    return {
      valid: false,
      error: `sign_type must be SHA256WithRSA (got ${fields.sign_type})`,
      fields,
    };
  }
  return { valid: true, fields };
};

/** Buy-tag API may return a string, { rawRequest }, or split field object. */
export const extractRawRequestFromBuyTagResponse = (res) => {
  const data = res?.data;
  if (typeof data === "string") return data.trim();
  if (!data || typeof data !== "object") return null;
  if (typeof data.rawRequest === "string") return data.rawRequest.trim();

  if (data.appid && data.prepay_id && data.sign) {
    const maps = {
      appid: data.appid,
      merch_code: data.merch_code,
      nonce_str: data.nonce_str,
      prepay_id: data.prepay_id,
      timestamp: data.timestamp,
      sign_type: data.sign_type || "SHA256WithRSA",
    };
    let raw = "";
    for (const [key, value] of Object.entries(maps)) {
      if (value != null && value !== "") raw += `${key}=${value}&`;
    }
    return `${raw}sign=${data.sign}`;
  }

  return null;
};

export const parseTelebirrCallbackResult = (result) => {
  if (result == null || result === "") return null;
  if (typeof result === "object") return result;
  if (typeof result === "string") {
    try {
      return JSON.parse(result);
    } catch {
      return { message: result };
    }
  }
  return null;
};

/** Normalizes mini-app callback `result` into flat params for /individual/call-back. */
export const normalizeTelebirrCallbackParams = (result) => {
  if (result instanceof URLSearchParams) {
    const params = {};
    for (const [key, value] of result.entries()) {
      params[key] = value;
    }
    return params;
  }

  const parsed = parseTelebirrCallbackResult(result);
  if (!parsed || typeof parsed !== "object") return {};

  if (typeof parsed.biz_content === "string") {
    try {
      return { ...parsed, ...JSON.parse(parsed.biz_content) };
    } catch {
      // keep parsed as-is
    }
  }

  return { ...parsed };
};

export const isTelebirrCallbackPaymentSuccess = (params) => {
  if (!params || typeof params !== "object") return false;
  const tradeStatus = params.trade_status ?? params.tradeStatus;
  if (tradeStatus === "PAY_SUCCESS" || tradeStatus === "Completed") return true;

  const resultCode = String(params.resultCode ?? params.code ?? "");
  if (resultCode === "0" || resultCode === "00") return true;

  const result = String(params.result ?? "").toLowerCase();
  return result === "success" || result === "succeed";
};

/** User-facing message for native bridge / gateway errors. */
export const getTelebirrPaymentErrorMessage = (result) => {
  const parsed = parseTelebirrCallbackResult(result);
  if (!parsed) return "Payment was not completed.";

  const errorCode = String(parsed.errorCode ?? parsed.errCode ?? "");
  const message = parsed.message || parsed.msg || "";

  if (errorCode === "4" || /connection error/i.test(message)) {
    return (
      "Telebirr could not reach the payment server (connection error). " +
      "Check mobile data/Wi‑Fi, try again, or ask backend to verify Fabric gateway URL and InApp preOrder environment."
    );
  }
  if (parsed.result === "fail" || parsed.resultCode === "-1") {
    return message || "Telebirr payment failed.";
  }
  return message || "Payment was not completed.";
};

/**
 * Unwraps API payment payload when returned as a JSON-encoded or quoted string
 * (e.g. "\"appid=...&sign=...\"" or "%22appid=...%22") so quotes are not sent to telebirr.
 */
export const normalizeRawRequest = (input) => {
  if (input == null) return null;
  if (typeof input === "object") {
    if (typeof input.rawRequest === "string") {
      return normalizeRawRequest(input.rawRequest);
    }
    return null;
  }
  if (typeof input !== "string") return null;

  let s = input.trim();
  if (!s) return null;

  if (/%22|%27/i.test(s)) {
    try {
      const decoded = decodeURIComponent(s);
      if (decoded !== s) s = decoded.trim();
    } catch {
      // keep original
    }
  }

  let prev = "";
  while (s !== prev) {
    prev = s;
    s = stripEdgeQuotes(s);

    if (s.startsWith('\\"') && s.endsWith('\\"')) {
      s = s.slice(2, -2).trim();
      continue;
    }

    if (
      (s.startsWith('"') && s.endsWith('"')) ||
      (s.startsWith("'") && s.endsWith("'"))
    ) {
      try {
        const parsed = JSON.parse(s);
        if (typeof parsed === "string") {
          s = parsed.trim();
          continue;
        }
      } catch {
        s = s.slice(1, -1).trim();
      }
    }
  }

  s = stripEdgeQuotes(s);
  s = fixTelebirrEscapes(s);
  // Official Step 4: only rawRequest.trim() — do not re-encode sign (breaks RSA verify).
  if (isTelebirrRawRequestQuery(s)) {
    return s.trim();
  }
  return s ? s.trim() : null;
};

/** True when value is a full http(s) redirect URL, not a telebirr rawRequest query string. */
export const isTelebirrPaymentUrl = (value) => {
  const normalized = normalizeRawRequest(value);
  return Boolean(normalized && /^https?:\/\//i.test(normalized));
};

/**
 * Redirect only for full payment URLs. Never pass rawRequest query strings to location.replace
 * (that would navigate to /customer/buy-tag/%22appid=...%22).
 */
export const redirectToTelebirrPayment = (value) => {
  const normalized = normalizeRawRequest(value);
  if (!normalized || !isTelebirrPaymentUrl(normalized)) {
    return false;
  }
  window.location.replace(normalized);
  return true;
};

/** Ignore callbacks that fire before the native drawer had time to open (failed evaluate). */
const MIN_PAY_DRAWER_MS = 800;

/**
 * Starts telebirr payment inside the mini super app via window.consumerapp.evaluate.
 * @param {string} rawRequest - Payment raw request string from buy-tag API (res.data)
 * @param {{ onComplete?: (result?: unknown) => void, onError?: (result?: unknown, meta?: object) => void }} [options]
 * @returns {boolean} true if payment was handed off to the native app
 */

export const startTelebirrMiniAppPay = (rawRequest, options = {}) => {
  const trimmed = normalizeRawRequest(rawRequest);

  if (!trimmed) {
    console.warn("[telebirr] startTelebirrMiniAppPay: missing rawRequest", {
      rawRequest,
    });
    return false;
  }

  const validation = validateRawRequestStructure(trimmed);
  if (!validation.valid) {
    console.error("[telebirr] invalid rawRequest — will not call evaluate", {
      error: validation.error,
      preview: validation.preview,
      fieldKeys: Object.keys(validation.fields || {}),
      inputType: typeof rawRequest,
      inputPreview:
        typeof rawRequest === "string"
          ? rawRequest.slice(0, 80)
          : rawRequest,
    });
    options.onError?.(
      { message: validation.error },
      { premature: true, invalidRawRequest: true }
    );
    return false;
  }

  const hasConsumerApp = typeof window.consumerapp?.evaluate === "function";
  if (!hasConsumerApp) {
    console.warn("[telebirr] consumerapp.evaluate not available — not in Super App");
    return false;
  }

  // Step 4 (official): register callback before evaluate.
  const payInvokeAt = Date.now();
  window.handleinitDataCallback = function (result) {
    const elapsedMs = Date.now() - payInvokeAt;
    const premature = elapsedMs < MIN_PAY_DRAWER_MS;
    const failed = !premature && isTelebirrPaymentFailure(result);

    console.log("[telebirr] payment callback", {
      result,
      elapsedMs,
      premature,
      failed,
    });

    if (premature) {
      console.error(
        "[telebirr] instant callback — native rejected rawRequest (check backend sign / prepay_id / InApp trade_type)",
        { result, elapsedMs }
      );
      options.onError?.(result, { premature: true, elapsedMs });
      return;
    }

    if (failed) {
      const parsed = parseTelebirrCallbackResult(result);
      if (parsed?.errorCode === "4" || parsed?.errorCode === 4) {
        console.error(
          "[telebirr] errorCode 4 = Telebirr app cannot reach payment gateway. " +
            "Frontend rawRequest is valid; fix backend Fabric URL, InApp preOrder env, or device network.",
          { parsed, elapsedMs }
        );
      }
      options.onError?.(result, { premature: false, elapsedMs, parsed });
      return;
    }

    // Official sample: no-arg callback after drawer = done → redirect to origin.
    if (typeof options.onComplete === "function") {
      options.onComplete(result);
      return;
    }
    window.location.href = window.location.origin;
  };

  const payParams = {
    rawRequest: trimmed,
    functionCallBackName: "handleinitDataCallback",
  };

  const obj = JSON.stringify({
    functionName: "js_fun_start_pay",
    params: payParams,
  });

  const fields = validation.fields;
  const tsSec = Number(fields.timestamp);
  const timestampAgeSeconds = Number.isFinite(tsSec)
    ? Math.floor(Date.now() / 1000 - tsSec)
    : null;
  console.log("[telebirr] evaluate", {
    rawRequestLength: trimmed.length,
    fieldOrder: REQUIRED_RAW_REQUEST_KEYS.filter((k) => fields[k]).join(","),
    appid: fields.appid,
    merch_code: fields.merch_code,
    prepay_id: fields.prepay_id,
    sign_type: fields.sign_type,
    signLength: fields.sign?.length,
    timestamp: fields.timestamp,
    timestampAgeSeconds,
    timestampStale:
      timestampAgeSeconds != null && timestampAgeSeconds > 7200,
    hasConsumerApp,
  });

  try {
    window.consumerapp.evaluate(obj);
    console.log("[telebirr] evaluate called OK");
    return true;
  } catch (err) {
    console.error("[telebirr] evaluate failed", err, { obj });
    return false;
  }
};
