/* eslint-disable react/prop-types */
import { Input } from "@headlessui/react";
import { Button, Checkbox, Typography } from "@material-tailwind/react";
import CountdownTimer from "../../../components/counter";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import TickIcon from '../../../assets/images/tick.png';
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { ConstentRoutes } from "../../../utilities/routesConst";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useTranslation } from "react-i18next";
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

const GetLabel = ({ name }) => {
  return (
    <label className="text-[14px] text-[#555] font-[500]">
      {name} <span className=" text-red-500">*</span>
    </label>
  );
};

const CompanyForm = ({
  register,
  errors,
  watch,
  setValue,
  Controller,
  getValues,
  control,
  registerData,
  setData,
  touchedFields,
  dirtyFields,
}) => {
  const watchAllFields = watch();
  const { t } = useTranslation(["common"])
  const [phone, setPhone] = useState();
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [isGetCodeDisabled, setIsGetCodeDisabled] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [lastVerifiedCode, setLastVerifiedCode] = useState(null);
  const lastVerifiedCodeRef = useRef(null);


  // Initialize phone number and track original phone number (don't mark as dirty/touched)
  useEffect(() => {
    const phoneValue = watchAllFields?.phone_number;
    if (phoneValue && phoneValue !== phone) {
      setPhone(phoneValue);
      if (!originalPhoneNumber) {
        setOriginalPhoneNumber(phoneValue);
      }
    } else if (!phoneValue && !phone) {
      setValue("phone_number", "+2519", {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      setPhone("+2519");
      setOriginalPhoneNumber("+2519");
    }
  }, [watchAllFields?.phone_number, phone, originalPhoneNumber, setValue]);

  // Auto-verify OTP when 6 digits are entered (reset state only; actual API call is from OtpInput onChange for iOS)
  useEffect(() => {
    const verificationCode = watchAllFields?.verification_code;
    const codeString = verificationCode?.toString();
    const isVerified = registerData?.verified;

    // Reset lastVerifiedCode if user changes the code (code length is less than 6)
    if (codeString && codeString.length < 6) {
      setLastVerifiedCode(null);
      lastVerifiedCodeRef.current = null;
    }

    // Reset lastVerifiedCode if verification succeeds
    if (isVerified) {
      setLastVerifiedCode(null);
      lastVerifiedCodeRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchAllFields?.verification_code, registerData?.verified]);

  // Reset verification when phone number changes after OTP is verified
  useEffect(() => {
    const phoneValue = watchAllFields?.phone_number;
    if (originalPhoneNumber && phoneValue && phoneValue !== originalPhoneNumber && registerData?.verified) {
      // Phone number changed after verification, reset everything
      setValue("verification_code", "");
      setLastVerifiedCode(null);
      if (registerData.setVerified) {
        registerData.setVerified(false);
      }
      if (registerData.setExpirationTime) {
        registerData.setExpirationTime(null);
      }
      setOtpExpired(false);
      setIsGetCodeDisabled(false);
      setIsVerifyingOtp(false);
      // Update original phone number to new value
      setOriginalPhoneNumber(phoneValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchAllFields?.phone_number, originalPhoneNumber, registerData?.verified, setValue]);

  const lastValidatedPhoneRef = useRef(null);
  const validationTimeoutRef = useRef(null);

  // Handle validation - only call API when value length > 3 (or 9 digits for phone)
  const handleValidation = useCallback((value, fieldName) => {
    if (!['account_id', 'email', 'phone_number', 'company_name'].includes(fieldName) || !value || value.trim() === '') {
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
    if (e.key === 'Enter' || e.key === 'Tab') {
      handleValidation(value, fieldName);
    }
  };

  // Handle field blur for validation (debounced API called on blur only, not on change)
  const handleBlur = (value, fieldName) => {
    if (!['account_id', 'email', 'phone_number', 'company_name'].includes(fieldName) || !value || value.trim() === '') {
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
      // account_id, company_name
      if (cleanValue.length > 3) {
        debouncedValidation(value, fieldName);
      }
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return false;
    const cleanNumber = phoneNumber.replace('+251', '').replace(/\s/g, '');
    return cleanNumber.startsWith('9') && cleanNumber.length === 9;
  };

  const handleOtpRequest = (phoneNumber) => {
    if ((!isGetCodeDisabled || otpExpired) && validatePhoneNumber(phoneNumber)) {
      setIsGetCodeDisabled(true);
      setOtpExpired(false);
      setOriginalPhoneNumber(phoneNumber);
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

    if (fieldName === 'company_name') {
      setData(st => ({ ...st, company_name: value }));
    }

    if (registerData?.state?.success?.[fieldName]) {
      registerData.resetFieldValidation(fieldName);
    }
  };

  const requiredFields = [
    'company_name',
    'account_id',
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
    <div className="flex flex-col gap-4">
      <style>{autofillStyle}</style>
      <div className="flex justify-between">
        <h1></h1>
        <Typography className="text-[#555] md:text-base text-[16px] font-semibold">
          <span className="text-secondary">{t("common.form.stepIndicator", { current: 1, total: 2 })}</span>
        </Typography>
      </div>
      <div className="flex justify-between flex-col md:flex-row items-center py-3 md:gap-0 gap-6">
        <Button className=" bg-secondary text-white">
          {t("corpAccountTitle")}
        </Button>
      </div>
      <hr></hr>
      <div className=" md:w-5/6 w-full mx-auto">
        <div className="py-3">
          <Typography className="text-[#555] md:text-base text-[16px]  font-semibold">
            {t("common.accountInfo")}
          </Typography>
        </div>
        <hr className="mt-3 mb-5"></hr>

        {/* Company Name Field */}
        <div>
          <GetLabel name={t("common.form.companyName")} />
          <div className="mt-2  flex items-center gap-2">
            <Input
              className="w-full rounded-xl px-4 py-2 bg-white outline-none "
              placeholder={t("common.form.companyName")}
              style={
                errors?.company_name
                  ? { border: "1px solid red" }
                  : { border: "1px solid #8A8AA033" }
              }
              {...register("company_name", {
                required: t("common.form.errors.companyNameRequired"),
                minLength: {
                  value: 3,
                  message: t("common.form.errors.companyNameMinLength") || "Company name must be at least 3 characters"
                },
                validate: value => !/^\d+$/.test(value) || t("common.form.errors.companyNameNoDigits")
              })}
              onChange={(e) => handleChange(e, "company_name")}
              onBlur={(e) => handleBlur(e.target.value, "company_name")}
              maxLength={30}
              onKeyDown={(e) => handleKeyPress(e, e.target.value, "company_name")}
            />
            {registerData?.state?.success?.company_name && !errors.company_name &&
              <div>
                <img className="w-5" src={TickIcon} alt="" />
              </div>
            }
          </div>
          {(errors.company_name || registerData?.state?.error?.company_name) && (
            <p className="text-left mt-1 text-sm text-[#FF0000]">
              {errors.company_name?.message || registerData?.state?.error?.company_name}
            </p>
          )}
        </div>

        {/* Username Field */}
        <div>
          <GetLabel name={t("common.form.userName")} />
          <div className="mt-2  flex items-center gap-2">
            <Input
              className=" w-full rounded-xl px-4 py-2 bg-white outline-none "
              placeholder={t("common.form.userName")}
              maxLength={50}
              style={
                errors?.account_id
                  ? { border: "1px solid red" }
                  : { border: "1px solid #8A8AA033" }
              }
              {...register("account_id", {
                required: t("common.form.errors.userName"),
                minLength: {
                  value: 3,
                  message: t("common.form.errors.usernameMinLength") || "Username must be at least 3 characters"
                }
              })}
              onChange={(e) => handleChange(e, "account_id")}
              onBlur={(e) => handleBlur(e.target.value, "account_id")}
              onKeyDown={(e) => handleKeyPress(e, e.target.value, "account_id")}
            />
            {registerData?.state?.success?.account_id && !errors.account_id &&
              <div>
                <img className="w-5" src={TickIcon} alt="" />
              </div>
            }
          </div>
          {(errors.account_id || registerData?.state?.error?.account_id) && (
            <p className="text-left mt-1 text-sm text-[#FF0000]">
              {errors.account_id?.message || registerData?.state?.error?.account_id}
            </p>
          )}
        </div>



        {/* Password Field */}
        <div>
          <GetLabel name={t("common.form.password")} />
          <div className=" mt-2 relative">
            <Input
              className=" w-full rounded-xl px-4 py-2 bg-white outline-none "
              placeholder={t("common.form.password")}
              maxLength={15}
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: t("common.form.errors.password"),
                minLength: {
                  value: 5,
                  message: t("common.form.errors.passwordMinLength"),
                },
                maxLength: {
                  value: 15,
                  message: t("common.form.errors.passwordMaxLength"),
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{5,15}$/,
                  message: t("common.form.errors.passwordPattern")
                }
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
              {showPassword ? <AiOutlineEye size={22} /> : <AiOutlineEyeInvisible size={22} />}
            </div>
          </div>
          {errors.password && (
            <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.password.message}</p>
          )}
          <p className="text-xs text-gray-600 mt-1">
            {t("common.form.passwordLength")}
          </p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <GetLabel name={t("common.form.confirmPassword")} />
          <div className=" mt-2  relative">
            <Input
              className="w-full rounded-xl px-4 py-2 bg-white outline-none "
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
                    return t("common.form.errors.passwordsDoNotMatch");
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
              {showConfirmPassword ? <AiOutlineEye size={22} /> : <AiOutlineEyeInvisible size={22} />}
            </div>
          </div>
          {errors.confirm_password && (
            <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.confirm_password.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="text-[14px] text-[#555] font-[500]">{t("common.form.email")}</label>
          <div className="mt-2  flex items-center gap-2">
            <Input
              className="w-full rounded-xl px-4 py-2 bg-white outline-none "
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
            {registerData?.state?.success?.email && !errors.email &&
              <div>
                <img className="w-5" src={TickIcon} alt="" />
              </div>
            }
          </div>
          {(errors.email || registerData?.state?.error?.email) && (
            <p className="text-left mt-1 text-sm text-[#FF0000]">
              {errors.email?.message || registerData?.state?.error?.email}
            </p>
          )}
        </div>

        {/* Phone Number Field */}
        <div>
          <GetLabel name={t("common.form.mobileNo")} />
          <div className="mt-2 flex items-center gap-2">
            <div className="relative items-center flex w-full">
              <Controller
                name="phone_number"
                control={control}
                defaultValue=""
                rules={{
                  required: t("common.form.errors.mobileNumberRequired"),
                  validate: (value) => validatePhoneNumber(value)
                }}
                render={({ field }) => {
                  return (
                    <PhoneInput
                      className="w-full rounded-xl px-4 py-2 border border-[#8A8AA033] bg-white outline-none"
                      defaultCountry="ET"
                      international
                      countryCallingCodeEditable={false}
                      flagUrl={"/et.png"}
                      value={field.value}
                      limitMaxLength={true}
                      disabled={registerData?.expirationTime}
                      countries={["ET"]}
                      onChange={(value) => {
                        field.onChange(value);
                        setPhone(value);

                        // Clear OTP and verification code if phone number changes from original
                        if (originalPhoneNumber && value !== originalPhoneNumber) {
                          setValue("verification_code", "");
                          setLastVerifiedCode(null); // Reset last verified code
                          localStorage.removeItem("otp");
                          if (registerData.setVerified) {
                            registerData.setVerified(false);
                          }
                          setOtpExpired(false);
                          setIsGetCodeDisabled(false);
                          setIsVerifyingOtp(false);
                          // Reset expiration time
                          if (registerData.setExpirationTime) {
                            registerData.setExpirationTime(null);
                          }
                          // Update original phone number to new value
                          setOriginalPhoneNumber(value);
                        }

                        // Reset success state when field is modified
                        if (registerData?.state?.success?.phone_number) {
                          registerData.resetFieldValidation("phone_number");
                        }

                        // Check if phone number is valid
                        const isValid = validatePhoneNumber(value);
                        setIsValidPhone(isValid);

                        // Only validate complete numbers (debounced, and only if number actually changed)
                        const cleanNumber = value ? value.replace(/^\+/, "").replace(/\s/g, "") : "";
                        if (cleanNumber?.length > 9) {
                          debouncedValidation(value, "phone_number");
                        } else {
                          lastValidatedPhoneRef.current = null;
                        }
                      }}

                    />
                  );
                }}
              />
              {registerData?.expirationTime && !isNaN(new Date(registerData?.expirationTime).getTime()) ? (
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
                    !areRequiredFieldsValid ||
                    (isGetCodeDisabled && !otpExpired) ||
                    !registerData?.isRecaptchaReady
                  }
                  className={`!absolute right-3 bg-[#f5f5f5] p-2 shadow-sm border border-[#8A8AA033] 
    ${(hasBackendError || !isValidPhone || !areRequiredFieldsValid || (isGetCodeDisabled && !otpExpired) || !registerData?.isRecaptchaReady)
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-gray-100"
                    } text-xs font-medium rounded`}
                  onClick={() => {
                    !isGetCodeDisabled &&
                      !hasBackendError &&
                      isValidPhone &&
                      areRequiredFieldsValid &&
                      registerData?.isRecaptchaReady &&
                     setValue("verification_code", "");
                    handleOtpRequest(phone)
                  }}
                >
                  {!registerData?.isRecaptchaReady ? t("common.form.pleaseWait") :
                    otpExpired ? t("common.form.resendOtp") :
                      isGetCodeDisabled ? t("common.form.pleaseWait") :
                        registerData?.isResend ? t("common.form.resendOtp") : t("common.form.sentOtp")}
                </button>

              )}
            </div>
            {registerData?.state?.success?.phone_number && !errors.phone_number &&
              <div>
                <img className="w-5" src={TickIcon} alt="" />
              </div>
            }
          </div>
          {phone && !isValidPhone && (touchedFields?.phone_number || dirtyFields?.phone_number) && (
            <p className="text-left text-sm mt-1  text-[#FF0000]">
              {t("common.form.mobileError")}
            </p>
          )}
          {(errors.phone_number || registerData?.state?.error?.phone_number) && (
            <p className="text-left mt-1 text-sm text-[#FF0000]">
              {errors.phone_number?.message || registerData?.state?.error?.phone_number}
            </p>
          )}
        </div>

        {/* Verification Code Field */}
        <div>
          <GetLabel name={t("common.form.verificationCode")} />
          <div className="relative mt-2 items-center flex w-full">
            <Controller
              name="verification_code"
              control={control}
              defaultValue=""
              rules={{
                required: t("common.form.errors.verificationCode"),
                pattern: { value: /^\d{6}$/, message: t("common.form.errors.verificationCode") },
                minLength: { value: 6, message: t("common.form.errors.verificationCode") },
              }}
              render={({ field }) => (
                <OtpInput
                  value={field.value ?? ""}
                  onChange={(value) => {
                    field.onChange(value);
                    // Trigger verify as soon as 6 digits are entered (reliable on iOS where watch() can lag)
                    const code = (value ?? "").toString().trim();
                    if (
                      code.length === 6 &&
                      registerData?.expirationTime &&
                      !registerData?.verified &&
                      registerData?.handleVerifyOtp &&
                      code !== lastVerifiedCodeRef.current
                    ) {
                      lastVerifiedCodeRef.current = code;
                      setLastVerifiedCode(code);
                      setIsVerifyingOtp(true);
                      registerData.handleVerifyOtp(code, null, false);
                      setTimeout(() => setIsVerifyingOtp(false), 2000);
                    } else if (code.length < 6) {
                      lastVerifiedCodeRef.current = null;
                      setLastVerifiedCode(null);
                    }
                  }}
                  numInputs={6}
                  placeholder={t("common.form.verificationCode")}
                  containerStyle="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-6"
                  inputStyle={{
                    backgroundColor: registerData?.verified ? "#f5f5f5" : "white",
                    outline: "none",
                    fontSize: "1rem",
                    textAlign: "center",
                    cursor: registerData?.verified ? "not-allowed" : "text",
                  }}
                  renderInput={(inputProps) => (
                    <input
                      {...inputProps}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      disabled={registerData?.verified}
                      className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-white outline-none text-center text-base box-border ${inputProps.className || ""} ${registerData?.verified ? "!bg-[#f5f5f5] cursor-not-allowed" : ""}`}
                      style={{
                        ...inputProps.style,
                        width: undefined,
                        minWidth: undefined,
                        border: errors?.verification_code
                          ? "1px solid red"
                          : "1px solid #8A8AA033",
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
            {isVerifyingOtp && !registerData?.verified && (
              <div className="absolute right-3 p-2">
                <div className="h-4 w-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {registerData?.verified && !isVerifyingOtp && (
              <div className="absolute right-3 p-2">
                <img src={TickIcon} alt="Verified" className="h-5 w-5" />
              </div>
            )}
          </div>
          {errors.verification_code && (
            <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.verification_code.message}</p>
          )}
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="col-span-2">
          <div className=" rounded-xl mt-3 text-[#555]">
            <div className=" flex items-center">
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
              <Typography className="text-sm cursor-pointer ">
                <span className="text-[#5B6AB0] hover:underline"
                  onClick={() => {
                    window.open(ConstentRoutes.termofuse, '_blank');
                  }}
                >{t("common.form.errors.termAndCondition")} </span>
              </Typography>
            </div>
            {errors.term && (
              <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.term.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;