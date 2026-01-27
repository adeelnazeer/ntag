/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import { IoMdCloseCircle } from "react-icons/io";
import CountdownTimer from "../components/counter";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import TickIcon from "../assets/images/tick.png";
import { useTranslation } from "react-i18next";

const ComplaintModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(["common", "complaint"]);
  
  const [phoneError, setPhoneError] = useState("");
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [value, setValue] = useState("+2519");
  const [verificationCode, setVerificationCode] = useState("");
  const [expirationTime, setExpirationTime] = useState(null);
  const [otpId, setOtpId] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Reset state when modal opens/closes
  const resetForm = () => {
    setValue("+2519");
    setIsValidPhone(false);
    setPhoneError("");
    setVerifyingPhone(false);
    setOtpVerified(false);
    setOtpRequested(false);
    setVerificationCode("");
    setExpirationTime(null);
    setOtpId(null);
    setVerifyingOtp(false);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const validatePhoneNumber = (phone) => {
    if (!phone) {
      setPhoneError(t("complaint.modal.phoneRequired", { defaultValue: "Mobile Number is required" }));
      setIsValidPhone(false);
      return false;
    }

    const cleanNumber = phone.replace("+251", "").replace(/\s/g, "");

    if (!cleanNumber.startsWith("9")) {
      setPhoneError(t("complaint.modal.mustStart9", { defaultValue: "Mobile Numbers must start with 9" }));
      setIsValidPhone(false);
      return false;
    }

    if (cleanNumber.length !== 9) {
      setPhoneError(t("complaint.modal.invalidLength", { defaultValue: "Mobile Number must be 9 digits after country code" }));
      setIsValidPhone(false);
      return false;
    }

    setPhoneError("");
    setIsValidPhone(true);
    return true;
  };

  const handleGetOtp = async () => {
    if (!validatePhoneNumber(value)) return;

    setOtpRequested(true);
    setVerifyingPhone(true);

    try {
      const cleanedPhone = value.replace(/^\+/, "");
      const data = {
        msisdn: cleanedPhone,
        otp_type: "IND",
        channel: "SMS",
        transaction_type: "OTP_GENRATION",
      };

      const response = await APICall("post", data, EndPoints.customer.generateOtp);

      if (response?.success) {
        toast.success(response?.message || t("complaint.modal.otpSent", { defaultValue: "OTP sent successfully" }));
        setExpirationTime(response.data.expiration_time);
        setOtpId(response?.data?.otp_id);
        localStorage.setItem("guestOtp", response?.data?.otp_id);
      } else {
        toast.error(response?.message || t("complaint.modal.otpFailed", { defaultValue: "Failed to send OTP" }));
        setOtpRequested(false);
      }
    } catch (error) {
      console.error("Error generating OTP:", error);
      toast.error(t("complaint.modal.otpFailed", { defaultValue: "Failed to send OTP" }));
      setOtpRequested(false);
    } finally {
      setVerifyingPhone(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (verificationCode.length !== 6) {
      toast.error(t("complaint.modal.invalidOtp", { defaultValue: "Please enter a valid 6-digit OTP code" }));
      return;
    }

    if (!otpId) {
      toast.error(t("complaint.modal.otpIdMissing", { defaultValue: "OTP ID not found. Please request OTP again." }));
      return;
    }

    setVerifyingOtp(true);

    try {
      const data = {
        otp_id: otpId,
        otp_code: verificationCode,
        transaction_type: "OTP_GENRATION",
      };

      const response = await APICall("post", data, EndPoints.customer.guestVerifyOtp);

      if (response?.success) {
        setOtpVerified(true);
        toast.success(response?.message || t("complaint.modal.otpVerified", { defaultValue: "OTP verified successfully!" }));
        setExpirationTime(null);
        
        // Store guest token and phone number for guest endpoints
        // Check multiple possible locations for guest_token in the response
        const guestToken = response?.data?.guest_token || 
                          response?.data?.token || 
                          response?.guest_token || 
                          response?.token;
        
        if (guestToken) {
          localStorage.setItem("cToken", guestToken);
          console.log("Guest token stored successfully");
        } else {
          console.error("Guest token not found in response:", response);
          toast.error("Guest token not received. Please try again.");
          return;
        }
        
        localStorage.setItem("guestPhone", value.replace(/^\+/, ""));
        
        // Navigate to guest/block page after a short delay
        setTimeout(() => {
          navigate("/guest/block", { 
            state: { 
              phoneNumber: value.replace(/^\+/, "")
            } 
          });
          onClose();
        }, 1000);
      } else {
        toast.error(response?.message || t("complaint.modal.verifyFailed", { defaultValue: "OTP verification failed" }));
        setOtpVerified(false);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error?.response?.data?.message || t("complaint.modal.verifyFailed", { defaultValue: "OTP verification failed" }));
      setOtpVerified(false);
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Handle OTP expiration
  const handleOtpExpired = () => {
    setOtpVerified(false);
    setExpirationTime(null);
    setOtpId(null);
    setOtpRequested(false);
    setVerificationCode("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 p-2 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6">
        <div
          className="absolute right-4 top-4 cursor-pointer text-xl text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <IoMdCloseCircle />
        </div>

        <div className="mt-2 mb-4">
          <h5 className="font-bold text-gray-900 text-lg">
            {t("complaint.modal.title", { defaultValue: "Complaint" })}
          </h5>
          <p className="text-sm mt-2 text-gray-600">
            {t("complaint.modal.description", { defaultValue: "Enter your mobile number to view blocked numbers" })}
          </p>
        </div>

        <div className="border-t border-gray-200 py-4">
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              {t("complaint.modal.mobileNumber", { defaultValue: "Mobile Number" })}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center w-full">
              <PhoneInput
                defaultCountry="ET"
                international
                flagUrl={`https://flagcdn.com/w40/et.png`}
                countryCallingCodeEditable={false}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 bg-white outline-none"
                value={value}
                onChange={(phone) => {
                  setValue(phone);
                  validatePhoneNumber(phone);
                  setOtpVerified(false);
                  setOtpRequested(false);
                  setExpirationTime(null);
                  setOtpId(null);
                  setVerificationCode("");
                }}
                limitMaxLength={13}
                disabled={!!expirationTime && !otpVerified}
              />
              {verifyingPhone ? (
                <div className="absolute right-3 p-2">
                  <div className="h-4 w-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : expirationTime ? (
                <CountdownTimer
                  expirationTime={expirationTime}
                  onExpire={handleOtpExpired}
                />
              ) : (
                value &&
                !expirationTime && (
                  <button
                    type="button"
                    className={`absolute right-3 bg-gray-100 p-2 shadow-sm border border-gray-200 
                    ${
                      !isValidPhone
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-gray-200"
                    } 
                    text-xs font-medium rounded-lg`}
                    onClick={handleGetOtp}
                    disabled={!isValidPhone}
                  >
                    {otpRequested 
                      ? t("complaint.modal.resendOtp", { defaultValue: "Resend OTP" }) 
                      : t("complaint.modal.getOtp", { defaultValue: "Get OTP" })}
                  </button>
                )
              )}
            </div>
            {value && phoneError && (
              <p className="text-red-500 text-xs mt-1">{phoneError}</p>
            )}
          </div>

          {expirationTime && !otpVerified && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                {t("complaint.modal.verificationCode", { defaultValue: "Verification Code" })}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  placeholder={t("complaint.modal.otpPlaceholder", { defaultValue: "Enter 6-digit OTP" })}
                  maxLength={6}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 bg-white outline-none focus:border-secondary"
                  value={verificationCode}
                  onChange={(e) => {
                    const code = e.target.value.replace(/\D/g, "");
                    setVerificationCode(code);
                  }}
                  disabled={otpVerified || verifyingOtp}
                />
                {!otpVerified && (
                  <button
                    type="button"
                    className={`absolute right-3 bg-gray-100 p-2 shadow-sm border border-gray-200 
                    ${verificationCode.length !== 6 || verifyingOtp ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'} 
                    text-xs font-medium rounded-lg`}
                    onClick={handleVerifyOtp}
                    disabled={verificationCode.length !== 6 || verifyingOtp}
                  >
                    {verifyingOtp 
                      ? t("complaint.modal.verifying", { defaultValue: "Verifying..." })
                      : t("complaint.modal.verifyOtp", { defaultValue: "Verify OTP" })}
                  </button>
                )}
                {otpVerified && (
                  <div className="absolute right-3 p-2">
                    <img src={TickIcon} alt="Verified" className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        <div className="border-t border-gray-200 pt-4 flex gap-4">
          <button
            className="flex-1 py-2.5 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
            onClick={onClose}
            disabled={verifyingOtp}
          >
            {t("complaint.modal.cancelBtn", { defaultValue: "Cancel" })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;

