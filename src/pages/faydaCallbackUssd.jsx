/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import { ConstentRoutes } from "../utilities/routesConst";
import { useRecaptchaToken } from "../hooks/useRecaptchaToken";

const FaydaCallbackUssd = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getRecaptchaPayload } = useRecaptchaToken();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const [data, setData] = useState(null);
  const [updateSubData, setUpdateSubData] = useState(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const stateFromUrl = searchParams.get("state");
    const codeVerifier = localStorage.getItem("fayda_code_verifier");
    const stateStored = localStorage.getItem("fayda_state");
    const callbackLockKey =
      code && stateFromUrl ? `fayda_callback_ussd_${code}_${stateFromUrl}` : null;

    // Guard against duplicate calls in dev StrictMode and fast re-renders.
    if (callbackLockKey) {
      const lockState = sessionStorage.getItem(callbackLockKey);
      if (lockState === "in_progress" || lockState === "done") {
        return;
      }
      sessionStorage.setItem(callbackLockKey, "in_progress");
    }

    // if (!code || !stateFromUrl) {
    //   setStatus("error");
    //   setMessage("Invalid or missing callback parameters. Please try verifying again.");
    //   return;
    // }

    // if (stateFromUrl !== stateStored) {
    //   setStatus("error");
    //   setMessage("State mismatch. Please try verifying again.");
    //   return;
    // }

    const exchangeToken = async () => {
      try {
        const tokens = await getRecaptchaPayload("fayda_token_exchange", { silent: true });
        const res = await APICall(
          "post",
          {
            code,
            code_verifier: codeVerifier,
            state: stateFromUrl,
            ...(tokens || {}),
          },
          EndPoints.customer.faydaToken
        );
        const data = res?.data ?? res;
        setData(data);

        // After token exchange, update Fayda sub
        const sub = data?.user?.sub;
        if (sub && data?.fayda_count < 5) {
          const faydaTokenHeader =
            localStorage.getItem("temp_token");
          const subTokens = await getRecaptchaPayload("fayda_update_sub", { silent: true });
          const updateSubHeaders =
            faydaTokenHeader
              ? {
                "X-Fayda-Token": faydaTokenHeader,
              }
              : null;
          const subRes = await APICall(
            "post",
            {
              sub,
              ...(subTokens || {}),
            },
            EndPoints.customer.faydaUpdateSub,
            updateSubHeaders
          );
          setUpdateSubData(subRes?.data ?? subRes);
          setStatus("success");
          setMessage(subRes?.message || "Fayda verification successful.");
          // if (window.opener) {
        }
        localStorage.removeItem("fayda_code_verifier");
        localStorage.removeItem("fayda_state");
        localStorage.removeItem("temp_token");
        if (callbackLockKey) {
          sessionStorage.setItem(callbackLockKey, "done");
        }
      } catch (err) {
        setStatus("error");
        setMessage(err || err?.message || "Verification failed. Please try again.");
        localStorage.removeItem("fayda_code_verifier");
        localStorage.removeItem("fayda_state");
        localStorage.removeItem("temp_token");
        if (callbackLockKey) {
          sessionStorage.removeItem(callbackLockKey);
        }
      }
    };

    exchangeToken();
  }, [searchParams, navigate, getRecaptchaPayload]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {status === "loading" && (
        <>
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[#555]">Verifying with Fayda...</p>
        </>
      )}
      {
        data?.fayda_count >= 5 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-4 bg-blue-50 border border-blue-300 rounded-lg text-center">
            <p className="text-[#008fd5] font-semibold text-base">
              {"Fayda verification limit reached."}
            </p>
            <p className="text-[#008fd5]  text-sm">
              {"You have exceeded the maximum number of verifications for the selected Fayda (NID). Please use a different mobile number or verify with another Fayda (NID) linked to your mobile number."}
            </p>
          </div>
        ) : (
          <>
            {status === "success" && (
              <>
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-4 text-white text-2xl">✓</div>
                <p className="text-green-700 font-medium">{message}</p>
                <p className="text-sm text-[#555] mt-1">You can close this window.</p>
              </>
            )}
            {status === "error" && (
              <>
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center mb-4 text-white text-2xl">✕</div>
                <p className="text-red-700 font-medium">{message}</p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-secondary text-white rounded-xl"
                  onClick={() => navigate(ConstentRoutes.registerNormalUser)}
                >
                  Back to Registration
                </button>
              </>
            )}
          </>
        )
      }
      <>
        {status === "success" && (
          <>
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-4 text-white text-2xl">✓</div>
            <p className="text-green-700 font-medium">{message}</p>
            <p className="text-sm text-[#555] mt-1">You can close this window.</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center mb-4 text-white text-2xl">✕</div>
            <p className="text-red-700 font-medium">{message}</p>
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-secondary text-white rounded-xl"
              onClick={() => navigate(ConstentRoutes.registerNormalUser)}
            >
              Back to Registration
            </button>
          </>
        )}
      </>
    </div>
  );
};

export default FaydaCallbackUssd;
