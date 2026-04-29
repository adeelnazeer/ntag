/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import { ConstentRoutes } from "../utilities/routesConst";
import { useRecaptchaToken } from "../hooks/useRecaptchaToken";

const FaydaCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getRecaptchaPayload } = useRecaptchaToken();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const tokenExchangeStartedForSearchRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const stateFromUrl = params.get("state");
    const codeVerifier = localStorage.getItem("fayda_code_verifier");
    const stateStored = localStorage.getItem("fayda_state");

    if (!code || !stateFromUrl || !codeVerifier || !stateStored) {
      setStatus("error");
      setMessage("Invalid or missing callback parameters. Please try verifying again.");
      return;
    }

    if (stateFromUrl !== stateStored) {
      setStatus("error");
      setMessage("State mismatch. Please try verifying again.");
      return;
    }

    // Avoid duplicate POST: effect was re-running when `getRecaptchaPayload` changed after
    // ReCAPTCHA finished loading, and `searchParams` can get a new object reference each render.
    if (tokenExchangeStartedForSearchRef.current === location.search) {
      return;
    }
    tokenExchangeStartedForSearchRef.current = location.search;

    const exchangeToken = async () => {
      try {
        const appSessionToken = localStorage.getItem("token");
        if (appSessionToken) {
          const getTok = await getRecaptchaPayload("fayda_token_exchange", { silent: true });
          const getTokenRes = await APICall(
            "post",
            {
              code,
              code_verifier: codeVerifier,
              state: stateFromUrl,
              ...(getTok || {}),
            },
            EndPoints.customer.faydaGetToken
          );
          if (!getTokenRes?.success) {
            setStatus("error");
            setMessage(getTokenRes?.message || "Could not finalize Fayda verification.");
            tokenExchangeStartedForSearchRef.current = null;
            return;
          }
          localStorage.removeItem("fayda_code_verifier");
          localStorage.removeItem("fayda_state");
          setStatus("success");
          setMessage(getTokenRes?.message || "Fayda verification successful.");
          setTimeout(() => navigate(ConstentRoutes.dashboardCustomer), 800);
          return;
        }

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
        localStorage.removeItem("fayda_code_verifier");
        localStorage.removeItem("fayda_state");

        setStatus("success");
        setMessage("Fayda verification successful.");
        if (window.opener) {
          window.opener.postMessage?.(
            { type: "FAYDA_VERIFIED", success: true, access_token: data?.tokens?.access_token, user: data?.user },
            window.location.origin
          );
          setTimeout(() => window.close(), 1500);
        } else {
          setTimeout(() => navigate(ConstentRoutes.registerNormalUser, {
            state: {
              from: "fayda",
              access_token: data?.tokens?.access_token,
              faydaUser: data?.user,
              faydaData: data,
              fayda_count: data?.fayda_count
            },
          }), 1500);
        }
      } catch (err) {
        console.log("err", err?.response?.data?.message);
        setStatus("error");
        setMessage(err?.response?.data?.message || err?.message || err || "Verification failed. Please try again.");
        tokenExchangeStartedForSearchRef.current = null;
      }
    };

    exchangeToken();
    // Intentionally only `location.search`: including `getRecaptchaPayload` re-runs this effect
    // when ReCAPTCHA finishes loading and caused a duplicate token exchange.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- navigate/getRecaptchaPayload are stable; one exchange per callback URL
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {status === "loading" && (
        <>
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[#555]">Verifying with Fayda...</p>
        </>
      )}
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
            onClick={() => {
              if (localStorage.getItem("token")) {
                navigate(ConstentRoutes.dashboardCustomer)
              } else {
                navigate(ConstentRoutes.registerNormalUser)
              }
            }}
          >
            Back to Registration
          </button>
        </>
      )}
    </div>
  );
};

export default FaydaCallback;
