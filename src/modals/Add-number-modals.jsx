import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import { IoMdCloseCircle } from "react-icons/io";
import CountdownTimer from '../components/counter';
import APICall from '../network/APICall';
import EndPoints from '../network/EndPoints';
import { useRegisterHook } from '../pages/hooks/useRegisterHook';
import TickIcon from '../assets/images/tick.png';
import { Checkbox } from '@material-tailwind/react';

const AddNumberModal = ({ isOpen, onClose, onAddNumber, customerId }) => {
  const registerData = useRegisterHook();
  const [phoneError, setPhoneError] = useState("");
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [value, setValue] = useState("+2519");
  const [stateNewNumber, setStateNewNumber] = useState({
    term: false,
    verification_code: ""
  });
  const [processingAction, setProcessingAction] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);

  // Reset state when modal opens/closes

  const resetForm = () => {
    setValue("+2519");
    setIsValidPhone(false);
    setPhoneError("");
    setPhoneVerified(false);
    setVerifyingPhone(false);
    setOtpVerified(false);
    setOtpRequested(false);
    setStateNewNumber({
      term: false,
      verification_code: ""
    });
    registerData.setExpirationTime(null);
  };
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);


  const validatePhoneNumber = (phone) => {
    if (!phone) {
      setPhoneError("Mobile Number is required");
      setIsValidPhone(false);
      return false;
    }

    const cleanNumber = phone.replace('+251', '').replace(/\s/g, '');

    if (!cleanNumber.startsWith('9')) {
      setPhoneError("Mobile Numbers must start with 9");
      setIsValidPhone(false);
      return false;
    }

    if (cleanNumber.length !== 9) {
      setPhoneError("Mobile Number must be 9 digits after country code");
      setIsValidPhone(false);
      return false;
    }

    setPhoneError("");
    setIsValidPhone(true);
    return true;
  };

  const verifyPhoneNumber = async (phone) => {
    if (!validatePhoneNumber(phone)) return;
    const cleanedPhone = phone.startsWith("+") ? phone.slice(1) : phone;

    setVerifyingPhone(true);

    try {
      // Check if Mobile Number is unique
      const response = await APICall("post", { phone_number: cleanedPhone }, EndPoints.customer.verifyAccount);

      if (response?.success) {
        setPhoneVerified(true);
        setPhoneError("");
      } else {
        setPhoneVerified(false);
        setPhoneError(response?.message || "Mobile Number already exists");
      }
    } catch (error) {
      console.error("Error verifying Mobile Number:", error);
      setPhoneVerified(false);
      setPhoneError("Error verifying Mobile Number");
    } finally {
      setVerifyingPhone(false);
    }
  };

  const handleGetOtp = () => {
    if (isValidPhone && phoneVerified) {
      setOtpRequested(true);
      registerData.handleGetOtp(value);
    }
  };

  const handleVerifyOtp = () => {
    if (stateNewNumber.verification_code.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP code");
      return;
    }

    registerData.handleVerifyOtp(stateNewNumber.verification_code, null, false);

    const checkVerificationStatus = setInterval(() => {
      if (registerData.verified) {
        clearInterval(checkVerificationStatus);
        setOtpVerified(true);
        toast.success("OTP verified successfully!");
      }
    }, 500);

    // Clear interval after 5 seconds to avoid memory leaks
    setTimeout(() => {
      clearInterval(checkVerificationStatus);
    }, 5000);
  };

  const handleSubmit = async () => {
    if (!registerData.verified && !otpVerified) {
      toast.error("Please verify the OTP code first");
      return;
    }

    if (!stateNewNumber.term) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setProcessingAction(true);

    try {
      const payload = {
        corp_customer_account_id: customerId,
        msisdn: value.replace(/^\+/, '')
      };

      const response = await APICall("post", payload, EndPoints.customer.CreateNumber);

      if (response?.success) {
        toast.success("Mobile Number added successfully");
        onAddNumber();
        onClose();
      } else {
        toast.error(response?.message || "Failed to add Mobile Number");
      }
    } catch (error) {
      console.error("Error adding Mobile Number:", error);
      toast.error("Error adding Mobile Number");
    } finally {
      setProcessingAction(false);
    }
  };

  // Handle OTP expiration
  const handleOtpExpired = () => {
    if (registerData?.handleExipre) {
      registerData.handleExipre();
    }
    setOtpVerified(false)
    registerData.setVerified(false)
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 p-2 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6">
        <div
          className="absolute right-4 top-4 cursor-pointer text-xl text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <IoMdCloseCircle />
        </div>

        <div className="mt-2 mb-4">
          <h5 className="font-bold text-gray-900 text-lg">
            Add New Mobile Number
          </h5>
        </div>

        <div className="border-t border-gray-200 py-4">
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Mobile Number <span className="text-red-500">*</span>
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
                  setPhoneVerified(false);
                  validatePhoneNumber(phone);
                  setOtpVerified(false)
                  // If complete number entered (including +251 and 9 digits)
                  if (phone && phone.length === 13) {
                    verifyPhoneNumber(phone);
                  }
                }}
                limitMaxLength={13}
                disabled={registerData?.expirationTime}
              />
              {verifyingPhone ? (
                <div className="absolute right-3 p-2">
                  <div className="h-4 w-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : registerData?.expirationTime ? (
                <CountdownTimer
                  expirationTime={registerData?.expirationTime}
                  onExpire={handleOtpExpired}
                />
              ) : (
                value && !registerData?.expirationTime && (
                  <div className="flex items-center">
                    {phoneVerified && (
                      <div className="absolute right-16 p-2">
                        <img src={TickIcon} alt="Verified" className="h-5 w-5" />
                      </div>
                    )}
                    <button
                      type="button"
                      className={`absolute right-3 bg-gray-100 p-2 shadow-sm border border-gray-200 
                      ${!isValidPhone || !phoneVerified ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'} 
                      text-xs font-medium rounded-lg`}
                      onClick={handleGetOtp}
                      disabled={!isValidPhone || !phoneVerified}
                    >
                      {otpRequested ? "Resend OTP" : "Get OTP"}
                    </button>
                  </div>
                )
              )}
            </div>
            {value && phoneError && (
              <p className="text-red-500 text-xs mt-1">{phoneError}</p>
            )}
          </div>

          {registerData?.expirationTime && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Verification Code <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  placeholder="Phone verification code"
                  maxLength={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 bg-white outline-none focus:border-secondary"
                  value={stateNewNumber?.verification_code}
                  onChange={(e) => setStateNewNumber(st => ({
                    ...st, verification_code: e.target.value
                  }))}
                  disabled={otpVerified || registerData.verified}
                />
                {!otpVerified && !registerData.verified && (
                  <button
                    type="button"
                    className={`absolute right-3 bg-gray-100 p-2 shadow-sm border border-gray-200 
                    ${stateNewNumber.verification_code.length !== 4 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'} 
                    text-xs font-medium rounded-lg`}
                    onClick={handleVerifyOtp}
                    disabled={stateNewNumber.verification_code.length !== 4}
                  >
                    Verify OTP
                  </button>
                )}
                {(otpVerified || registerData.verified) && (
                  <div className="absolute right-3 p-2">
                    <img src={TickIcon} alt="Verified" className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-xl mt-3 text-gray-600">
            <div className="flex items-start">
              {/* <div className="flex items-center h-5 mt-1"> */}
              <Checkbox
                checked={stateNewNumber?.term}
                onChange={(e) => setStateNewNumber(st => ({
                  ...st, term: e.target.checked
                }))} />
              {/* <input
                  id="terms"
                  type="checkbox"
                  checked={stateNewNumber?.term}
                  onChange={(e) => setStateNewNumber(st => ({
                    ...st, term: e.target.checked
                  }))}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-secondary"
                /> */}
              {/* </div> */}
              <label htmlFor="terms" className="ml-2 text-sm cursor-pointer">
                I confirm this Mobile Number belongs to me and consent to its use for NameTAG services
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 flex gap-4">
          <button
            className="flex-1 py-2.5 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
            onClick={onClose}
            disabled={processingAction}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2.5 bg-secondary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-colors"
            onClick={handleSubmit}
            disabled={!(registerData.verified || otpVerified) || !stateNewNumber?.term || processingAction}
          >
            {processingAction ? "Adding..." : "Add Number"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNumberModal;