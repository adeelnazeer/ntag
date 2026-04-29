/* eslint-disable react/prop-types */
import { Button } from "@material-tailwind/react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import TickIcon from "../assets/images/tick.png";
import { ConstentRoutes } from "../utilities/routesConst";
import { useRecaptchaToken } from "../hooks/useRecaptchaToken";
import { useRegisterHook } from "./hooks/useRegisterHook";
import OtpInput from "react-otp-input";
import { TbCircleCheck, TbIdBadge } from "react-icons/tb";

const STEPPER_LINE_TOP = "1.375rem";

const GetLabel = ({ name }) => (
    <label className="text-[14px] text-[#555] font-[500]">
        {name} <span className="text-red-500">*</span>
    </label>
);

const FaydaVerifyStepper = ({ currentStep, t, nameTagLabel }) => {
    const steps = useMemo(
        () => [
            {
                id: 1,
                label: t("auth:stepper.step1"),
            },
            {
                id: 2,
                label: t("auth:stepper.step2"),
            },
        ],
        [t]
    );

    const currentTitle = steps.find((s) => s.id === currentStep)?.label ?? "";

    return (
        <div className="flex flex-col gap-5 w-full">
            <div className="w-full rounded-2xl bg-secondary px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 shadow-sm">
                <p className="text-white text-sm sm:text-base font-medium leading-snug">
                    {nameTagLabel}
                </p>
            </div>

            <div className="relative w-full max-w-xl mx-auto px-1 sm:px-4 pt-1 pb-1">
                <div
                    className="absolute left-[calc(25%+0.55rem)] right-[calc(25%+0.55rem)] h-0.5 bg-[#E0E0E0] z-0 pointer-events-none"
                    style={{ top: STEPPER_LINE_TOP }}
                    aria-hidden
                />
                <div className="relative z-[1] grid grid-cols-2 gap-0">
                    {steps.map((step) => {
                        const isCurrent = currentStep === step.id;
                        const isDone = currentStep > step.id;
                        const active = isCurrent || isDone;
                        return (
                            <div key={step.id} className="flex flex-col items-center text-center min-w-0">
                                <div
                                    className={[
                                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold transition-colors",
                                        isCurrent
                                            ? "border-[3px] border-secondary text-secondary"
                                            : active
                                              ? "border-2 border-secondary text-secondary"
                                              : "border border-[#D1D5DB] text-[#9CA3AF]",
                                    ].join(" ")}
                                >
                                    {step.id}
                                </div>
                                <p
                                    className={[
                                        "mt-2 text-[11px] sm:text-xs font-medium leading-tight px-0.5 max-w-[7.5rem] sm:max-w-none",
                                        isCurrent ? "text-secondary" : active ? "text-secondary" : "text-[#9CA3AF]",
                                    ].join(" ")}
                                >
                                    {step.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="relative flex items-center justify-center w-full py-1">
                <div className="absolute inset-x-0 top-1/2 h-px bg-[#E0E0E0] -translate-y-1/2" aria-hidden />
                <span className="relative z-[1] rounded-full bg-secondary px-4 py-1.5 text-xs sm:text-sm font-medium text-white whitespace-nowrap shadow-sm">
                    {t("common.form.step", { defaultValue: "Step" })} {currentStep} — {currentTitle}
                </span>
            </div>
        </div>
    );
};

const FaydaVerifyUssd = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [searchParams] = useSearchParams();
    const { getRecaptchaPayload } = useRecaptchaToken();
    const registerData = useRegisterHook();
    const { token } = useParams();

    const [currentStep, setCurrentStep] = useState(1);
    const [verifyFaydaLoading, setVerifyFaydaLoading] = useState(false);
    const [faydaVerified, setFaydaVerified] = useState(false);
    const [alreadyVerified, setAlreadyVerified] = useState(false);
    const [verifyLinkLoading, setVerifyLinkLoading] = useState(false);
    const [verifyLinkData, setVerifyLinkData] = useState(null);
    const [otpRequested, setOtpRequested] = useState(false);
    const [otpId, setOtpId] = useState(null);
    const [otpCode, setOtpCode] = useState("");
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [checkOtpFaydaLoading, setCheckOtpFaydaLoading] = useState(false);

    const isFaydaVerified = Boolean(faydaVerified || state?.faydaData?.success);

    const msisdn = useMemo(() => {
        const phone = verifyLinkData?.msisdn || verifyLinkData?.phone_number || "";
        return String(phone || "").replace(/^\+/, "");
    }, [verifyLinkData]);

    const phoneForCheckOtpFayda = useMemo(() => {
        const d = String(msisdn || "").replace(/\D/g, "");
        if (!d) return "";
        if (d.startsWith("251") && d.length >= 12) return `+${d}`;
        if (d.length === 9 && d.startsWith("9")) return `+251${d}`;
        return `+${d}`;
    }, [msisdn]);

    useEffect(() => {
        if (isFaydaVerified) {
            setCurrentStep(2);
        }
    }, [isFaydaVerified]);

    const handleSendOtp = async () => {
        if (!msisdn) return;
        setOtpError("");
        setAlreadyVerified(false);
        setOtpVerifying(true);
        try {
            const tokens = await getRecaptchaPayload("fayda_send_otp", { silent: true });
            const payload = {
                msisdn,
                otp_type: "IND",
                channel: "WEB",
                transaction_type: "OTP_GENRATION",
                otp_verification_purpose: "OTP_VERIFICATION",
                ...(tokens || {}),
            };
            const res = await APICall("post", payload, EndPoints.customer.generateOtp);
            if (res?.success) {
                const id = res?.data?.otp_id || res?.otp_id;
                setOtpRequested(true);
                setOtpId(id);
                if (id) localStorage.setItem("otp", id);
                setOtpCode("");
                setOtpVerified(false);
            } else {
                setOtpError(res?.message || "Failed to send OTP");
            }
        } catch (e) {
            setOtpError(typeof e === "string" ? e : e?.message || "Failed to send OTP");
        } finally {
            setOtpVerifying(false);
        }
    };

    useEffect(() => {
        if (!token) return;

        let cancelled = false;
        (async () => {
            setVerifyLinkLoading(true);
            try {
                const tokens = await getRecaptchaPayload("fayda_verify_link", { silent: true });
                const payload = {
                    token,
                    ...(tokens || {}),
                };
                const res = await APICall("post", payload, EndPoints.customer.faydaVerifyLink);
                if (cancelled) return;
                const data = res?.data ?? res;
                setVerifyLinkData(data);
                localStorage.setItem("temp_token", data?.temp_token);
                const status = data?.fayda_verification_status || data?.fayda_verification?.status;
                if (status === "VERIFIED") setFaydaVerified(true);
                if (data?.fayda_verification?.is_registered === true) setFaydaVerified(true);
            } catch (e) {
                if (!cancelled) {
                    console.error("Fayda verify/link error", e);
                }
            } finally {
                if (!cancelled) setVerifyLinkLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, state]);

    const handleVerifyFayda = async () => {
        setVerifyFaydaLoading(true);
        try {
            const tokens = await getRecaptchaPayload("fayda_auth", { silent: true });
            const payload = tokens ?? null;

            const res = await APICall("post", payload, EndPoints.customer.faydaAuthUrl);
            const { auth_url, code_verifier, state: faydaState } = res || {};
            if (!auth_url || !code_verifier || !faydaState) {
                console.error("Fayda auth response missing required fields", res);
                return;
            }
            localStorage.setItem("fayda_code_verifier", code_verifier);
            localStorage.setItem("fayda_state", faydaState);
            window.location.replace(auth_url);
        } catch (err) {
            console.error("Fayda auth-url error", err);
        } finally {
            setVerifyFaydaLoading(false);
        }
    };

    useEffect(() => {
        const onMessage = (e) => {
            if (e.origin !== window.location.origin || e.data?.type !== "FAYDA_VERIFIED" || !e.data?.success) return;
            setFaydaVerified(true);
        };
        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, []);

    useEffect(() => {
        if (state?.from === "fayda" && state?.faydaData?.success) {
            setFaydaVerified(true);
        }
    }, [state]);

    const nameTagLabel = t("nameTag");

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full max-w-7xl mx-auto px-4 py-4 flex-1">
                <div className="max-w-3xl mx-auto mt-6 p-4 pb-8 bg-[#fff] rounded-[24px] shadow-sm">
                    <div className="flex flex-col gap-4">
                        <FaydaVerifyStepper currentStep={currentStep} t={t} nameTagLabel={nameTagLabel} />

                        <div className="md:w-5/6 w-full mx-auto font-serif">
                            {currentStep === 1 && (
                                <>
                                    {alreadyVerified ? (
                                        <div className="mt-6">
                                            <div
                                                className="flex items-start gap-3 rounded-2xl border border-[#e3ebe0] bg-[#f3f7f0] px-4 py-4"
                                                role="status"
                                            >
                                                <TbCircleCheck
                                                    className="mt-0.5 h-6 w-6 shrink-0 text-[#7a8b71]"
                                                    strokeWidth={1.35}
                                                    aria-hidden
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold leading-snug text-[#3f6b32]">
                                                        {t("common.form.alreadyVerifiedTitle", {
                                                            defaultValue: "Already verified",
                                                        })}
                                                    </p>
                                                    <p className="mt-1 text-sm leading-snug text-[#7a8b71]">
                                                        {t("common.form.faydaAlreadyVerifiedHelper", {
                                                            defaultValue:
                                                                "Your Fayda Identity is already verified at NameTAG platform.",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mt-3">
                                                <h3 className="text-lg font-medium">{t("auth:step1.heading")}</h3>
                                                <p className="text-sm mt-2 mb-3 text-gray-600">
                                                    {t("auth:step1.description")}
                                                </p>
                                                <GetLabel name={t("common.form.mobileNo", { defaultValue: "Mobile No" })} />
                                                <div className="mt-2 flex items-center gap-2">
                                                    <div className="relative items-center flex w-full">
                                                        <div
                                                            className="w-full rounded-xl px-4 py-2 border border-[#8A8AA033] bg-white outline-none text-[#555]"
                                                            aria-readonly
                                                        >
                                                            {msisdn ? `+${msisdn}` : verifyLinkLoading ? "…" : "-"}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            disabled={!msisdn || otpVerifying || verifyLinkLoading}
                                                            className={`!absolute right-3 bg-[#f5f5f5] p-2 shadow-sm border border-[#8A8AA033] text-xs font-medium rounded ${
                                                                !msisdn || otpVerifying || verifyLinkLoading
                                                                    ? "opacity-50 cursor-not-allowed"
                                                                    : "cursor-pointer hover:bg-gray-100"
                                                            }`}
                                                            onClick={handleSendOtp}
                                                        >
                                                            {otpVerifying
                                                                ? t("common.form.pleaseWait", { defaultValue: "Please wait..." })
                                                                : otpRequested
                                                                  ? t("common.form.resendOtp", { defaultValue: "Resend OTP" })
                                                                  : t("common.form.sentOtp", { defaultValue: "Send OTP" })}
                                                        </button>
                                                    </div>
                                                </div>
                                                {otpError && <p className="text-left mt-1 text-sm text-[#FF0000]">{otpError}</p>}
                                            </div>

                                            <div className="mt-3">
                                                <GetLabel
                                                    name={t("common.form.verificationCode", { defaultValue: "Verification Code" })}
                                                />
                                                <div className="relative mt-2 items-center flex w-full">
                                                    <OtpInput
                                                        value={otpCode ?? ""}
                                                        onChange={(value) => {
                                                            const v = String(value || "").replace(/\D/g, "").slice(0, 6);
                                                            setOtpCode(v);
                                                        }}
                                                        numInputs={6}
                                                        containerStyle="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-6"
                                                        inputStyle={{
                                                            backgroundColor: "white",
                                                            outline: "none",
                                                            fontSize: "1rem",
                                                            textAlign: "center",
                                                        }}
                                                        renderInput={(inputProps) => (
                                                            <input
                                                                {...inputProps}
                                                                type="text"
                                                                inputMode="numeric"
                                                                className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-white outline-none text-center text-base box-border ${inputProps.className || ""}`}
                                                                style={{
                                                                    ...inputProps.style,
                                                                    width: undefined,
                                                                    minWidth: undefined,
                                                                    border: otpError ? "1px solid red" : "1px solid #8A8AA033",
                                                                }}
                                                                disabled={!otpRequested || otpVerified}
                                                                onKeyDown={(e) => {
                                                                    const key = e.key;
                                                                    const ctrl = e.ctrlKey || e.metaKey;
                                                                    const allowed = [
                                                                        "Backspace",
                                                                        "Delete",
                                                                        "Tab",
                                                                        "Enter",
                                                                        "Escape",
                                                                        "ArrowLeft",
                                                                        "ArrowRight",
                                                                        "Home",
                                                                        "End",
                                                                    ];
                                                                    if (allowed.includes(key) || ctrl) return;
                                                                    if (!/^\d$/.test(key)) e.preventDefault();
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-center justify-end">
                                                <Button
                                                    type="button"
                                                    className="bg-secondary"
                                                    disabled={
                                                        !registerData?.isRecaptchaReady ||
                                                        !msisdn ||
                                                        !phoneForCheckOtpFayda ||
                                                        !otpCode ||
                                                        String(otpCode).length !== 6 ||
                                                        checkOtpFaydaLoading
                                                    }
                                                    onClick={async () => {
                                                        const code = otpCode;
                                                        if (!code || String(code).length !== 6) return;
                                                        setCheckOtpFaydaLoading(true);
                                                        try {
                                                            const res = await registerData.handleCheckOtpFayda(
                                                                code,
                                                                phoneForCheckOtpFayda
                                                            );
                                                            const isRegistered =
                                                                res?.data?.is_registered === true ||
                                                                res?.data?.fayda?.isregistered === true ||
                                                                res?.data?.fayda?.is_registered === true;

                                                            if (isRegistered) {
                                                                setAlreadyVerified(true);
                                                                setOtpVerified(true);
                                                                return;
                                                            }

                                                            if (res?.success) {
                                                                setOtpVerified(true);
                                                                setCurrentStep(2);
                                                            }
                                                        } finally {
                                                            setCheckOtpFaydaLoading(false);
                                                        }
                                                    }}
                                                >
                                                    {checkOtpFaydaLoading
                                                        ? t("common.form.pleaseWait", { defaultValue: "Please wait..." })
                                                        : t("auth:common.next")}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}

                            {currentStep === 2 && (
                                <div className="w-full mt-4 mx-auto pb-4">
                                    <h3 className="text-lg font-medium">{t("auth:step2.heading")}</h3>
                                    <p className="text-sm mt-2 mb-6 text-gray-600">
                                        {t("auth:step2.description")}
                                    </p>
                                    <div className="flex flex-col">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                            <div className="flex min-w-0 flex-1 items-start gap-3">
                                                <div
                                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#f5f9f2]"
                                                    aria-hidden
                                                >
                                                    {isFaydaVerified ? (
                                                        <img className="h-7 w-7 object-contain" src={TickIcon} alt="" />
                                                    ) : (
                                                        <TbIdBadge className="h-7 w-7 text-[#7a8b71]" strokeWidth={1.25} aria-hidden />
                                                    )}
                                                </div>
                                                <div className="min-w-0 pt-0.5">
                                                    {isFaydaVerified ? (
                                                        <>
                                                            <p className="text-base font-medium leading-snug text-[#7a8b71]">
                                                                {t("common.form.faydaVerifiedTitle", {
                                                                    defaultValue: "Identity verified",
                                                                })}
                                                            </p>
                                                            <p className="mt-1 text-sm leading-snug text-[#7a8b71]/90">
                                                                {t("common.form.faydaVerifiedSubtitle", {
                                                                    defaultValue: "You can continue with registration.",
                                                                })}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-base font-medium leading-snug text-[#7a8b71]">
                                                                {t("auth:step2.verification_title")}
                                                            </p>
                                                            <p className="mt-1 text-sm leading-snug text-[#7a8b71]/90">
                                                                {t("auth:step2.verification_subtitle")}
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="w-full shrink-0 rounded-md bg-secondary px-5 py-2.5 text-sm font-bold text-white shadow-sm sm:w-auto sm:self-start"
                                                onClick={() => {
                                                    if (isFaydaVerified) {
                                                        navigate(ConstentRoutes.registerNormalUser);
                                                        return;
                                                    }
                                                    handleVerifyFayda();
                                                }}
                                                disabled={verifyFaydaLoading || (currentStep === 2 && !isFaydaVerified && !otpVerified)}
                                            >
                                                {verifyFaydaLoading
                                                    ? t("common.form.opening", { defaultValue: "Opening..." })
                                                    : isFaydaVerified
                                                      ? t("auth:common.next")
                                                      : t("auth:step2.verify_button")}
                                            </button>
                                        </div>
                                        {!isFaydaVerified && (
                                            <p className="mt-6 text-sm leading-relaxed text-gray-600">
                                                {t("auth:step2.after_text")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                   
                </div>
            </div>
        </div>
    );
};

export default FaydaVerifyUssd;
