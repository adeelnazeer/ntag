import { useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "react-toastify";

/**
 * Shared reCAPTCHA v3 helper: returns both keys many backends expect.
 *
 * @param {string} action - Google reCAPTCHA action name (register in admin / use consistently).
 * @param {{ silent?: boolean }} options - If silent: no toasts, return null on failure (optional flows like register).
 * @returns {Promise<{ recaptcha_token: string, captcha_token: string } | null>}
 */
export function useRecaptchaToken() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getRecaptchaPayload = useCallback(
    async (action, { silent = false } = {}) => {
      if (!executeRecaptcha) {
        if (!silent) {
          toast.error("Security check is loading. Please wait a moment and try again.");
        }
        return null;
      }
      let token = "";
      try {
        token = await executeRecaptcha(action);
      } catch (e) {
        console.warn("reCAPTCHA error:", e);
        if (!silent) {
          toast.error("Security verification failed. Please try again.");
        }
        return null;
      }
      if (!token) {
        if (!silent) {
          toast.error("Security verification failed. Please try again.");
        }
        return null;
      }
      return {
        recaptcha_token: token,
      };
    },
    [executeRecaptcha]
  );

  return {
    getRecaptchaPayload,
    isRecaptchaReady: !!executeRecaptcha,
  };
}
