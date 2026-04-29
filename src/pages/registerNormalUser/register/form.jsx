/* eslint-disable react/prop-types */
import { Input } from "@headlessui/react";
import { Button, Checkbox, Typography } from "@material-tailwind/react";
import CountdownTimer from "../../../components/counter";
import { useRegisterHook } from "../../hooks/useRegisterHook";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import TickIcon from "../../../assets/images/tick.png";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { ConstentRoutes } from "../../../utilities/routesConst";
import { useLocation, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import AccountConfirmation from "../../../modals/account-confirmation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { TbCircleCheck, TbIdBadge } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import APICall from "../../../network/APICall";
import EndPoints from "../../../network/EndPoints";
import { useRecaptchaToken } from "../../../hooks/useRecaptchaToken";
import OtpInput from "react-otp-input";


// Apply CSS fix for autofill styling
const autofillStyle = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: #000 !important;
    -webkit-box-shadow: 0 0 0px 1000px white inset;
  }
`;

const GetLabel = ({ name, required = true }) => {
    return (
        <label className="text-[14px] text-[#555] font-[500]">
            {name} {required && <span className=" text-red-500">*</span>}
        </label>
    );
};

const STEPPER_LINE_TOP = "1.375rem"; // aligns with circle centers (w-11 h-11)

const RegistrationStepper = ({ currentStep, t, nameTagLabel, titleLabel }) => {
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
            {
                id: 3,
                label: t("auth:stepper.step3"),
            },
        ],
        [t]
    );

    const currentTitle = steps.find((s) => s.id === currentStep)?.label ?? "";

    return (
        <div className="flex flex-col gap-5 w-full">
            <div className="w-full rounded-2xl bg-secondary px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 shadow-sm">
                <p className="text-white text-sm sm:text-base font-medium leading-snug">
                    {nameTagLabel} — {titleLabel}
                </p>
            </div>

            <div className="relative w-full max-w-xl mx-auto px-1 sm:px-4 pt-1 pb-1">
                <div
                    className="absolute left-[calc(16.67%+0.55rem)] right-[calc(16.67%+0.55rem)] h-0.5 bg-[#E0E0E0] z-0 pointer-events-none"
                    style={{ top: STEPPER_LINE_TOP }}
                    aria-hidden
                />
                <div className="relative z-[1] grid grid-cols-3 gap-0">
                    {steps.map((step) => {
                        const isCurrent = currentStep === step.id;
                        const isDone = currentStep > step.id;
                        const active = isCurrent || isDone;
                        return (
                            <div
                                key={step.id}
                                className="flex flex-col items-center text-center min-w-0"
                            >
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

const UserForm = () => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        getValues,
        control,
        formState: { errors, touchedFields, dirtyFields },
    } = useForm({
        msisdn: "", mode: "onChange", // ✅ Real-time validation on typing
    });
    const { t } = useTranslation()
    const registerData = useRegisterHook();
    const { getRecaptchaPayload } = useRecaptchaToken();
    const [data, setData] = useState(null);
    const watchAllFields = watch();
    const navigate = useNavigate();
    const [phone, setPhone] = useState();
    const [isValidPhone, setIsValidPhone] = useState(false);
    const [isGetCodeDisabled, setIsGetCodeDisabled] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [otpExpired, setOtpExpired] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [verifyFaydaLoading, setVerifyFaydaLoading] = useState(false);
    const [faydaVerified, setFaydaVerified] = useState(false);
    const [checkOtpFaydaLoading, setCheckOtpFaydaLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [alreadyVerified, setAlreadyVerified] = useState(false);
    const { state } = useLocation();

    const isFaydaVerified = Boolean(faydaVerified || state?.faydaData?.success);

    const faydaRegisteredPhoneDisplay = useMemo(() => {
        const raw = String(state?.faydaUser?.phone_number ?? "").trim();
        if (!raw) return "";
        if (raw.startsWith("+251")) return raw;
        if (raw.startsWith("251")) return `+${raw}`;
        const normalized = raw.startsWith("0") ? raw.slice(1) : raw;
        return `+251${normalized}`;
    }, [state?.faydaUser?.phone_number]);

    useEffect(() => {
        if (isFaydaVerified) {
            setCurrentStep(3);
        }
    }, [isFaydaVerified]);

    // Set initial phone prefix without marking field as user-edited
    useEffect(() => {
        const current = getValues("phone_number");
        if (!current) {
            setValue("phone_number", "+2519", {
                shouldDirty: false,
                shouldTouch: false,
                shouldValidate: false,
            });
            setPhone("+2519");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Handle validation when field loses focus or on key press - only for username, email, and phone_number
    const lastValidatedPhoneRef = useRef(null);
    const handleValidation = useCallback((value, fieldName) => {
        if (!['username', 'email', 'phone_number'].includes(fieldName) || !value || value.trim() === '') {
            return;
        }
        const cleanValue = value.replace(/\s/g, "").replace(/^\+/, "");
        if (fieldName === 'phone_number') {
            const cleanNumber = value ? value.replace(/^\+/, "").replace(/\s/g, "") : "";
            if (cleanNumber.length > 9) {
                if (cleanNumber === lastValidatedPhoneRef.current) return;
                lastValidatedPhoneRef.current = cleanNumber;
                registerData.verifyAccount({ phone_number: cleanNumber }, "phone_number");
            } else {
                lastValidatedPhoneRef.current = null;
            }
            return;
        }
        if (cleanValue.length > 3) {
            registerData.verifyAccount({ [fieldName]: cleanValue }, fieldName);
        }
    }, [registerData]);

    const validationTimeoutRef = useRef(null);
    const debouncedValidation = useCallback((value, fieldName) => {
        if (validationTimeoutRef.current) {
            clearTimeout(validationTimeoutRef.current);
        }
        validationTimeoutRef.current = setTimeout(() => {
            validationTimeoutRef.current = null;
            handleValidation(value, fieldName);
        }, 500);
    }, [handleValidation]);

    useEffect(() => {
        return () => {
            if (validationTimeoutRef.current) clearTimeout(validationTimeoutRef.current);
        };
    }, []);

    // Handle key press for validation
    const handleKeyPress = (e, value, fieldName) => {
        // Only validate username, email, and phone_number
        if (['username', 'email', 'phone_number'].includes(fieldName) && (e.key === "Enter" || e.key === "Tab")) {
            handleValidation(value, fieldName);
        }
    };

    // Handle field blur for validation (debounced API called on blur only, not on change)
    const handleBlur = (value, fieldName) => {
        if (!['username', 'email', 'phone_number'].includes(fieldName) || !value || value.trim() === '') {
            return;
        }
        const cleanValue = value.replace(/\s/g, "").replace(/^\+/, "");
        if (fieldName === 'email') {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            if (emailRegex.test(value)) {
                debouncedValidation(value, fieldName);
            }
        } else if (fieldName === 'phone_number') {
            const cleanNumber = value ? value.replace(/\+251|\s/g, "") : "";
            if (cleanNumber.length === 9) debouncedValidation(value, fieldName);
        } else {
            // username
            if (cleanValue.length > 3) {
                debouncedValidation(value, fieldName);
            }
        }
    };

    const handleVerifyFayda = async () => {
        setVerifyFaydaLoading(true);
        try {
            const tokens = await getRecaptchaPayload("fayda_auth", { silent: true });
            const payload = tokens ?? null;

            const res = await APICall("post", payload, EndPoints.customer.faydaAuthUrl);
            const { auth_url, code_verifier, state } = res || {};
            if (!auth_url || !code_verifier || !state) {
                console.error("Fayda auth response missing required fields", res);
                return;
            }
            localStorage.setItem("fayda_code_verifier", code_verifier);
            localStorage.setItem("fayda_state", state);
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

    // Prefill form when coming back from Fayda redirect with user data
    useEffect(() => {
        if (!state?.from || state.from !== "fayda") return;
        const faydaUser = state?.faydaUser || state?.faydaData?.user;
        if (!faydaUser) return;

        const { name, phone_number, email } = faydaUser;

        if (name) {
            const parts = String(name).trim().split(/\s+/);
            if (parts[0]) {
                setValue("first_name", parts[0], { shouldValidate: true, shouldDirty: true });
            }
            if (parts.length > 1) {
                // Use remaining parts as father/last name
                setValue("last_name", parts.slice(1).join(" "), { shouldValidate: true, shouldDirty: true });
            }
        }

        if (email) {
            setValue("email", email, { shouldValidate: true, shouldDirty: true });
        }

        if (state?.faydaData?.success) {
            setFaydaVerified(true);
        }
    }, [state, setValue]);

    const validatePhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return false;
        const cleanNumber = phoneNumber.replace("+251", "").replace(/\s/g, "");
        return cleanNumber.startsWith("9") && cleanNumber.length === 9;
    };

    const handleOtpRequest = (phoneNumber) => {
        if ((!isGetCodeDisabled || otpExpired) && validatePhoneNumber(phoneNumber)) {
            setIsGetCodeDisabled(true);
            setOtpExpired(false);
            registerData.handleGetOtp(phoneNumber);
            setTimeout(() => {
                setIsGetCodeDisabled(false);
            }, 30000);
        }
    };

    const handleExpire = () => {
        registerData.handleExipre();
        setOtpExpired(true);
    };

    // Handle change for fields that need validation
    const handleChange = (e, fieldName) => {
        const value = e.target.value;
        setValue(fieldName, value, {
            shouldValidate: true,
            shouldDirty: true
        });

        // Reset success state when field is modified to remove tick icon
        if (registerData?.state?.success?.[fieldName]) {
            registerData.resetFieldValidation && registerData.resetFieldValidation(fieldName);
        }
    };


    const onSubmit = (data) => {
        setData({
            ...data,
            fayda_token: state?.faydaData?.access_token,
            sub: state?.faydaUser?.sub,
        });
        setConfirmModal(true);
    };

    const handleSubmitData = async () => {
        if (submitLoading) return;
        setSubmitLoading(true);
        try {
            await registerData.handleIndividualRegister(data, reset, setConfirmModal);
        } finally {
            setSubmitLoading(false);
        }
    };
    const requiredFields = [
        'first_name',
        'last_name',
        'username',
        'password',
        "phone_number",
        'confirm_password',
    ];

    const areRequiredFieldsValid = requiredFields.every((field) => {
        const value = getValues(field);
        return value && !errors[field];
    });

    const hasBackendError = useMemo(() => {
        const e = registerData?.state?.error || registerData?.error;
        if (!e) return false;
        // If it's an object with any truthy value/message, treat as error
        if (typeof e === "object") return Object.values(e).some(Boolean);
        // If it’s a string or boolean
        return Boolean(e);
    }, [registerData]);

    return (
        <>
            <style>{autofillStyle}</style>
            <form
                action=""
                className="w-full max-w-7xl mx-auto px-4 py-4 flex-1"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="on"
            >
                <div className="max-w-3xl mx-auto mt-6 p-4 pb-8 bg-[#fff] rounded-[24px] shadow-sm">
                    <div className="flex flex-col gap-4">
                        <RegistrationStepper
                            currentStep={currentStep}
                            t={t}
                            nameTagLabel={t("nameTag")}
                            titleLabel={t("indAccountTitle")}
                        />
                        <div className="md:w-5/6 w-full mx-auto">
                            {currentStep === 3 && (
                                <div className="mb-6">
                                    <h3 className="text-lg pt-3 font-medium">
                                        {t("auth:step3.heading")}
                                    </h3>
                                    {state?.fayda_count >= 5 && (
                                        <div className="flex mt-2 flex-col items-center gap-2 px-6 py-4 bg-blue-50 border border-blue-300 rounded-lg text-center">
                                            <p className="text-[#008fd5] font-semibold text-base">
                                                {t("auth:step3.limit_error_title")}
                                            </p>
                                            <p className="text-[#008fd5]  text-sm">
                                                {t("auth:step3.limit_error")}
                                            </p>
                                        </div>
                                    )}
                                    {!alreadyVerified &&
                                        <div
                                            className="mt-2 flex items-center gap-3 rounded-lg border border-[#e3ebe0] bg-[#f3f7f0] px-4 py-3 font-serif"
                                            role="status"
                                        >
                                            <TbCircleCheck
                                                className="h-6 w-6 shrink-0 text-[#7a8b71]"
                                                strokeWidth={1.35}
                                                aria-hidden
                                            />
                                            <p className="text-sm leading-snug text-[#7a8b71] md:text-[15px]">
                                                {t("auth:step3.auto_fill")}
                                            </p>
                                        </div>
                                    }
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="w-full mt-4 mx-auto pb-4 font-serif">
                                    <h3 className="text-lg font-medium">
                                        {t("auth:step2.heading")}
                                    </h3>
                                    <p className="text-sm mt-2 mb-6 text-gray-600">{t("auth:step2.description")}</p>
                                    <div className="flex  flex-col">
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
                                                                    defaultValue:
                                                                        "You can continue with registration.",
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
                                                        setCurrentStep(3);
                                                        return;
                                                    }
                                                    handleVerifyFayda();
                                                }}
                                                disabled={verifyFaydaLoading}
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


                            {currentStep === 3 && (
                                <>
                                    <div className="">
                                        <GetLabel name={t("common.form.mobileNo")} required={false} />
                                        <div className="mt-2 flex items-center gap-2">
                                            <Input

                                                className="w-full rounded-xl px-4 py-2 bg-white outline-none"
                                                placeholder={t("common.form.mobileNo")}
                                                disabled
                                                value={`+${localStorage.getItem("phone_number")}`}
                                                style={
                                                    { border: "1px solid #8A8AA033" }
                                                }
                                            />

                                        </div>

                                    </div>
                                    {faydaRegisteredPhoneDisplay && (
                                        <div className="mt-2">
                                            <GetLabel name={t("auth:step3.registered_number")} required={false} />
                                            <div className="mt-2 flex items-center gap-2">
                                                <Input
                                                    className="w-full rounded-xl px-4 py-2 bg-white outline-none"
                                                    placeholder="Fayda Number"
                                                    disabled
                                                    value={faydaRegisteredPhoneDisplay}
                                                    style={{ border: "1px solid #8A8AA033" }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {alreadyVerified && (
                                        <div className="mt-4">
                                            <div className="rounded-xl border border-[#c5ddb8] bg-white px-4 py-2 sm:px-5 sm:py-2">
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="text-sm sm:text-base text-gray-900">
                                                        {t("common.form.faydaVerificationCardTitle", {
                                                            defaultValue: "Fayda Verification",
                                                        })}
                                                    </span>
                                                    <span
                                                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#b8d4a8] bg-[#f3f7f0] px-2.5 py-1 text-xs font-medium text-[#3f6b32]"
                                                        role="status"
                                                    >
                                                        <span
                                                            className="h-2 w-2 shrink-0 rounded-full bg-secondary"
                                                            aria-hidden
                                                        />
                                                        {t("common.verified", { defaultValue: "Verified" })}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="mt-2 mb-3 text-left text-xs sm:text-xs text-gray-900">
                                                {t("common.form.faydaAlreadyVerifiedHelper", {
                                                    defaultValue:
                                                        "Your Fayda Identity is already verified at NameTAG platform.",
                                                })}
                                            </p>
                                        </div>
                                    )}
                                    <div className="mt-2">
                                        <GetLabel name={t("common.form.firstName")} />
                                        <div className="mt-2 flex items-center gap-2">
                                            <Input
                                                className="w-full rounded-xl px-4 py-2 bg-white outline-none"
                                                placeholder={t("common.form.firstName")}
                                                style={
                                                    errors?.first_name
                                                        ? { border: "1px solid red" }
                                                        : { border: "1px solid #8A8AA033" }
                                                }
                                                {...register("first_name", {
                                                    required: t("common.form.errors.firstName"),
                                                    minLength: { value: 3, message: t("common.form.errors.minLength") },
                                                    validate: value => !/^\d+$/.test(value) || "First name cannot consist of only digits"
                                                })}
                                                readOnly={true}
                                                onChange={(e) => handleChange(e, "first_name")}
                                                onBlur={(e) => handleBlur(e.target.value, "first_name")}
                                                maxLength={30}
                                                onKeyDown={(e) => handleKeyPress(e, e.target.value, "first_name")}
                                            />
                                            {registerData?.state?.success?.first_name && !errors.first_name && (
                                                <div>
                                                    <img className="w-5" src={TickIcon} alt="" />
                                                </div>
                                            )}
                                        </div>
                                        {(errors.first_name || registerData?.state?.error?.first_name) && (
                                            <p className="text-left mt-1 text-sm text-[#FF0000]">
                                                {errors.first_name?.message || registerData?.state?.error?.first_name}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            {currentStep === 3 && (
                                <div className="mt-2">
                                    <GetLabel name={t("common.form.fatherName")} />
                                    <div className="mt-2 flex items-center gap-2">
                                        <Input
                                            className="w-full rounded-xl px-4 py-2 bg-white outline-none"
                                            placeholder={t("common.form.fatherName")}
                                            style={
                                                errors?.last_name
                                                    ? { border: "1px solid red" }
                                                    : { border: "1px solid #8A8AA033" }
                                            }
                                            {...register("last_name", {
                                                required: t("common.form.errors.fatherName"),
                                                minLength: { value: 3, message: t("common.form.errors.minLength") },
                                                validate: value => !/^\d+$/.test(value) || "Father name cannot consist of only digits"
                                            })}
                                            readOnly={true}
                                            onChange={(e) => handleChange(e, "last_name")}
                                            onBlur={(e) => handleBlur(e.target.value, "last_name")}
                                            maxLength={30}
                                            onKeyDown={(e) => handleKeyPress(e, e.target.value, "last_name")}
                                        />
                                        {registerData?.state?.success?.last_name && !errors.last_name && (
                                            <div>
                                                <img className="w-5" src={TickIcon} alt="" />
                                            </div>
                                        )}
                                    </div>
                                    {(errors.last_name || registerData?.state?.error?.last_name) && (
                                        <p className="text-left mt-1 text-sm text-[#FF0000]">
                                            {errors.last_name?.message || registerData?.state?.error?.last_name}
                                        </p>
                                    )}
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="mt-2">
                                    <GetLabel name={t("common.form.userName")} />
                                    <div className="mt-2 flex items-center gap-2">
                                        <Input
                                            className="w-full rounded-xl px-4 py-2 bg-white outline-none"
                                            placeholder={t("common.form.userName")}
                                            maxLength={30}
                                            style={
                                                errors?.username
                                                    ? { border: "1px solid red" }
                                                    : { border: "1px solid #8A8AA033" }
                                            }
                                            {...register("username", {
                                                required: t("common.form.errors.userName"),
                                                minLength: { value: 3, message: t("common.form.errors.minLength") },
                                                validate: value => value.length >= 3 || "Username must be at least 3 characters"
                                            })}
                                            onChange={(e) => handleChange(e, "username")}
                                            onBlur={(e) => handleBlur(e.target.value, "username")}
                                            onKeyDown={(e) => handleKeyPress(e, e.target.value, "username")}
                                        />
                                        {registerData?.state?.success?.username && !errors.username && (
                                            <div>
                                                <img className="w-5" src={TickIcon} alt="" />
                                            </div>
                                        )}
                                    </div>
                                    {(errors.username || registerData?.state?.error?.username) && (
                                        <p className="text-left mt-1 text-sm text-[#FF0000]">
                                            {errors.username?.message || registerData?.state?.error?.username}
                                        </p>
                                    )}
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="mt-2">
                                    <GetLabel name={t("common.form.password")} />
                                    <div className="relative mt-2 ">
                                        <Input
                                            className="w-full rounded-xl px-4 py-2 bg-white outline-none"
                                            placeholder={t("common.form.password")}
                                            maxLength={15}
                                            type={showPassword ? "text" : "password"}
                                            {...register("password", {
                                                required: t("common.form.errors.password"),
                                                minLength: {
                                                    value: 5,
                                                    message: "Password must be at least 5 characters",
                                                },
                                                maxLength: {
                                                    value: 15,
                                                    message: "Password cannot exceed 15 characters",
                                                },
                                                pattern: {
                                                    value:
                                                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{5,15}$/,
                                                    message:
                                                        "Password must contain at least one uppercase letter, one lowercase letter, and one special character",
                                                },
                                            })}
                                            style={
                                                errors?.password
                                                    ? { border: "1px solid red" }
                                                    : { border: "1px solid #8A8AA033" }
                                            }
                                            onContextMenu={(e) => e.preventDefault()} // disable right-click
                                            onCopy={(e) => e.preventDefault()}        // disable copy
                                            onCut={(e) => e.preventDefault()}         // disable cut
                                            onPaste={(e) => e.preventDefault()}
                                        />
                                        <div
                                            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            {!showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
                                        </div>
                                    </div>
                                    {errors.password && (
                                        <p className="text-left mt-1 text-sm text-[#FF0000]">
                                            {errors.password.message}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-600 mt-1">
                                        {t("common.form.passwordLength")}
                                    </p>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="mt-2">
                                    <GetLabel name={t("common.form.confirmPassword")} />
                                    <div className="mt-2 relative">
                                        <Input
                                            className=" w-full rounded-xl px-4 py-2 bg-white outline-none"
                                            placeholder={t("common.form.confirmPassword")}
                                            type={showConfirmPassword ? "text" : "password"}
                                            maxLength={15}
                                            style={
                                                errors?.confirm_password ||
                                                    watchAllFields?.password != watchAllFields?.confirm_password
                                                    ? { border: "1px solid red" }
                                                    : { border: "1px solid #8A8AA033" }
                                            }
                                            {...register("confirm_password", {
                                                required: t("common.form.errors.confirmPassword"),
                                                validate: (val) => {
                                                    if (watch("password") != val) {
                                                        return "passwords do not match";
                                                    }
                                                    return true;
                                                },
                                            })}
                                            onContextMenu={(e) => e.preventDefault()} // disable right-click
                                            onCopy={(e) => e.preventDefault()}        // disable copy
                                            onCut={(e) => e.preventDefault()}         // disable cut
                                            onPaste={(e) => e.preventDefault()}
                                        />
                                        <div
                                            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        >
                                            {!showConfirmPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
                                        </div>
                                    </div>
                                    {errors.confirm_password && (
                                        <p className="text-left mt-1 text-sm text-[#FF0000]">
                                            {errors.confirm_password.message}
                                        </p>
                                    )}
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="mt-2">
                                    <label className="text-[14px] text-[#555] font-[500]">
                                        {t("common.form.email")}
                                    </label>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Input
                                            className="w-full rounded-xl px-4 py-2 bg-white outline-none"
                                            placeholder={t("common.form.email")}
                                            maxLength={50}
                                            style={
                                                errors?.email
                                                    ? { border: "1px solid red" }
                                                    : { border: "1px solid #8A8AA033" }
                                            }
                                            {...register("email", {
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: t("common.form.errors.email")
                                                }
                                            })}
                                            onChange={(e) => handleChange(e, "email")}
                                            onBlur={(e) => handleBlur(e.target.value, "email")}
                                            onKeyDown={(e) => handleKeyPress(e, e.target.value, "email")}
                                        />
                                        {registerData?.state?.success?.email && !errors.email && (
                                            <div>
                                                <img className="w-5" src={TickIcon} alt="" />
                                            </div>
                                        )}
                                    </div>
                                    {(errors.email || registerData?.state?.error?.email) && (
                                        <p className="text-left mt-1 text-sm text-[#FF0000]">
                                            {errors.email?.message || registerData?.state?.error?.email}
                                        </p>
                                    )}
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium">
                                        {t("auth:step1.heading")}
                                    </h3>
                                    <p className="text-sm mt-2 mb-3 text-gray-600">{t("auth:step1.description")}</p>
                                    <GetLabel name={t("common.form.mobileNo")} />
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="relative items-center flex w-full">
                                            <Controller
                                                name="phone_number"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: currentStep === 1 ? "Phone number is required" : false,
                                                    validate: (value) =>
                                                        validatePhoneNumber(value)
                                                }}
                                                render={({ field }) => {
                                                    return (
                                                        <PhoneInput
                                                            className="w-full rounded-xl px-4 py-2 border border-[#8A8AA033] bg-white outline-none"
                                                            defaultCountry="ET"
                                                            international
                                                            countryCallingCodeEditable={false}
                                                            value={field.value}
                                                            limitMaxLength={true}
                                                            flagUrl={"/et.png"}
                                                            disabled={registerData?.expirationTime}
                                                            countries={["ET"]}
                                                            onChange={(value) => {
                                                                // Ensure the value starts with "+2519"
                                                                if (!value) {
                                                                    value = "+2519";
                                                                } else if (!value.startsWith("+2519")) {
                                                                    // If user tries to change the prefix or remove the 9
                                                                    const cleanValue = value.replace(/^\+251/, '');
                                                                    if (cleanValue === '' || !cleanValue.startsWith('9')) {
                                                                        value = "+2519";
                                                                    } else {
                                                                        value = "+251" + cleanValue;
                                                                    }
                                                                }

                                                                field.onChange(value);
                                                                setPhone(value);

                                                                // Reset success state when field is modified
                                                                if (registerData?.state?.success?.phone_number) {
                                                                    registerData.resetFieldValidation &&
                                                                        registerData.resetFieldValidation("phone_number");
                                                                }

                                                                // Check if phone number is valid
                                                                const isValid = validatePhoneNumber(value);
                                                                setIsValidPhone(isValid);

                                                                // Only validate complete numbers
                                                                const cleanNumber = value ? value.replace(/^\+/, "").replace(/\s/g, "") : "";
                                                                if (cleanNumber.length > 9) {
                                                                    debouncedValidation(value, "phone_number");
                                                                } else {
                                                                    lastValidatedPhoneRef.current = null;
                                                                }
                                                            }}
                                                        />
                                                    );
                                                }}
                                            />
                                            {registerData?.expirationTime ? (
                                                <CountdownTimer
                                                    expirationTime={registerData?.expirationTime}
                                                    onExpire={handleExpire}
                                                />
                                            ) : (
                                                <button
                                                    type="button"
                                                    disabled={
                                                        hasBackendError ||
                                                        !isValidPhone ||
                                                        (isGetCodeDisabled && !otpExpired)
                                                    }
                                                    className={`!absolute right-3 bg-[#f5f5f5] p-2 shadow-sm border border-[#8A8AA033] 
                                                     ${(hasBackendError || !isValidPhone || (isGetCodeDisabled && !otpExpired))
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : "cursor-pointer hover:bg-gray-100"
                                                        } text-xs font-medium rounded`}
                                                    onClick={() =>
                                                        !isGetCodeDisabled &&
                                                        isValidPhone &&
                                                        !hasBackendError &&
                                                        handleOtpRequest(phone)
                                                    }
                                                >
                                                    {!registerData?.isRecaptchaReady ? t("common.form.pleaseWait") :
                                                        otpExpired ? "Resend OTP" :
                                                            isGetCodeDisabled ? t("common.form.pleaseWait") :
                                                                registerData?.isResend ? t("common.form.resendOtp") : t("common.form.sentOtp")}
                                                </button>

                                            )}
                                        </div>
                                        {registerData?.state?.success?.phone_number && !errors.phone_number && (
                                            <div>
                                                <img className="w-5" src={TickIcon} alt="" />
                                            </div>
                                        )}
                                    </div>
                                    {phone && !isValidPhone && (touchedFields?.phone_number || dirtyFields?.phone_number) && (
                                        <p className="text-left mt-1 text-sm text-[#FF0000]">
                                            {t("auth:step1.mobile_error")}
                                        </p>
                                    )}
                                    {(errors.phone_number || registerData?.state?.error?.phone_number) && (
                                        <p className="text-left mt-1 text-sm text-[#FF0000]">
                                            {errors.phone_number?.message || registerData?.state?.error?.phone_number}
                                        </p>
                                    )}
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="mt-3">
                                    <GetLabel name={t("common.form.verificationCode")} />
                                    <div className="relative mt-2 items-center flex w-full">
                                        <Controller
                                            name="verification_code"
                                            control={control}
                                            defaultValue=""
                                            rules={{
                                                required: currentStep === 1 ? t("common.form.errors.verificationCode") : false,
                                                pattern: { value: /^\d{6}$/, message: t("common.form.errors.verificationCode") },
                                                minLength: { value: 6, message: t("common.form.errors.verificationCode") },
                                            }}
                                            render={({ field }) => (
                                                <OtpInput
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
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
                                                                border: errors?.verification_code ? "1px solid red" : "1px solid #8A8AA033",
                                                            }}
                                                            onKeyDown={(e) => {
                                                                const key = e.key;
                                                                const ctrl = e.ctrlKey || e.metaKey;
                                                                const allowed = ["Backspace", "Delete", "Tab", "Enter", "Escape", "ArrowLeft", "ArrowRight", "Home", "End"];
                                                                if (allowed.includes(key) || ctrl) return;
                                                                if (!/^\d$/.test(key)) e.preventDefault();
                                                            }}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors.verification_code && (
                                        <p className="text-left mt-1 text-sm text-[#FF0000]">
                                            {errors.verification_code.message}
                                        </p>
                                    )}
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="mt-6 flex items-center justify-end">
                                    <Button
                                        type="button"
                                        className="bg-secondary"
                                        disabled={
                                            hasBackendError ||
                                            !registerData?.isRecaptchaReady ||
                                            !isValidPhone ||
                                            !watch("verification_code") ||
                                            String(watch("verification_code")).length !== 6 ||
                                            checkOtpFaydaLoading
                                        }
                                        onClick={async () => {
                                            const code = getValues("verification_code");
                                            localStorage.setItem("phone_number", phone?.replace("+", ""));
                                            if (!code || String(code).length !== 6) return;
                                            setCheckOtpFaydaLoading(true);
                                            try {
                                                const res = await registerData.handleCheckOtpFayda(code, phone);
                                                console.log(res);
                                                if (res?.data?.is_registered == true) {
                                                    setCurrentStep(3);
                                                    setFaydaVerified(true);
                                                    setAlreadyVerified(true);
                                                    setValue("first_name", res?.data?.name, { shouldValidate: true, shouldDirty: true });
                                                    setValue("email", res?.data?.email, { shouldValidate: true, shouldDirty: true });
                                                    setValue("last_name", res?.data?.father_name, { shouldValidate: true, shouldDirty: true });

                                                } else {
                                                    if (res?.success) {
                                                        setCurrentStep(2)
                                                    }
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
                            )}

                            {currentStep === 3 && (
                                <div className="col-span-2">
                                    <div className="py-3 rounded-xl mt-3 text-[#555]">
                                        <div className="flex items-center">
                                            <Checkbox
                                                {...register("term", {
                                                    required: t("common.form.errors.termAndCondition"),
                                                })}
                                                style={
                                                    errors.term
                                                        ? { border: "1px solid red" }
                                                        : { border: "1px solid #8A8AA033" }
                                                }
                                            />
                                            <Typography className="text-sm cursor-pointer leading-[40px]">
                                                <span
                                                    className="text-[#5B6AB0] hover:underline"
                                                    onClick={() => {
                                                        window.open(ConstentRoutes.termofuse, "_blank");
                                                    }}
                                                >
                                                    {t("common.termAndCondition")}{" "}
                                                </span>
                                            </Typography>
                                        </div>
                                        {errors.term && (
                                            <p className="text-left mt-1 text-sm text-[#FF0000]">
                                                {errors.term.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {currentStep === 3 && (
                        <div className={` gap-6 flex justify-center ${state?.fayda_count >= 5 ? "" : "mt-6"}`}>
                            <Button
                                className="bg-secondary"
                                type="submit"
                                disabled={state?.fayda_count >= 5}
                            >
                                {t("common.form.submit")}
                            </Button>
                        </div>
                    )}
                    <div className="mt-3">
                        <Typography className="text-[#555] text-center md:text-base text-[16px] font-semibold">
                            {t("common.form.alreadyAccount")}{" "}
                            <span
                                className="text-secondary cursor-pointer"
                                onClick={() => navigate(ConstentRoutes.login)}
                            >
                                {t("login.login")}
                            </span>
                        </Typography>
                    </div>
                </div>
            </form>
            <AccountConfirmation
                isOpen={confirmModal}
                setIsOpen={setConfirmModal}
                handleSubmit={handleSubmitData}
                loading={submitLoading}
            />
        </>
    );
};

export default UserForm;






















