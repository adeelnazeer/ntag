/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import CountdownTimer from '../components/counter';
import APICall from '../network/APICall';
import EndPoints from '../network/EndPoints';
import { useRegisterHook } from '../pages/hooks/useRegisterHook';
import TickIcon from '../assets/images/tick.png';

const AddNumberComponent = ({ isChangeNumberFlow = false, setNewNumber = () => { }, setDisableBtn = () => { } }) => {
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
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpRequested, setOtpRequested] = useState(false);

    // Always keep +2519 at the start
    const handlePhoneChange = (phone) => {
        if (!phone || !phone.startsWith("+2519")) {
            phone = "+2519";
        }
        setValue(phone);
        setPhoneVerified(false);
        setOtpVerified(false);
        validatePhoneNumber(phone);
        // If complete number entered (including +251 and 9 digits)
        if (phone && phone.length === 13) {
            verifyPhoneNumber(phone);
        }
    };

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
            const response = await APICall("post", { phone_number: cleanedPhone }, EndPoints.customer.verifyAccount);
            if (response?.success) {
                setPhoneVerified(true);
                setPhoneError("");
            } else {
                setPhoneVerified(false);
                setPhoneError(response?.message || "Mobile Number already exists");
            }
        } catch (error) {
            setPhoneVerified(false);
            setPhoneError("Error verifying Mobile Number");
        } finally {
            setVerifyingPhone(false);
        }
    };

    const handleGetOtp = () => {
        if (isValidPhone && phoneVerified) {
            setOtpRequested(true);
            setNewNumber(value);
            registerData.handleGetOtp(value);
        }
    };

    const handleVerifyOtp = () => {
        if (stateNewNumber.verification_code.length !== 4) {
            toast.error("Please enter a valid 4-digit OTP code");
            return;
        }
        registerData.handleVerifyOtp(stateNewNumber.verification_code, null, false);
    };

    // Watch for OTP verification status and update disableBtn
    useEffect(() => {
        if (registerData.verified && !otpVerified) {
            setOtpVerified(true);
            setDisableBtn(false);
        }
    }, [registerData.verified, otpVerified, setDisableBtn]);

useEffect(() => {
    if (otpVerified || registerData.verified) {
        setOtpVerified(false);
        registerData.setVerified(false);
        setDisableBtn(true);
        setStateNewNumber((st) => ({ ...st, verification_code: "" }));
        setOtpRequested(false); // <-- Reset to show "Get OTP" button
    }
    // eslint-disable-next-line
}, [value]);

    // Handle OTP expiration
    const handleOtpExpired = () => {
        if (registerData?.handleExipre) {
            registerData.handleExipre();
        }
        setOtpVerified(false);
        registerData.setVerified(false);
        setDisableBtn(true);
    };

    // Reset disableBtn when component mounts/unmounts
    useEffect(() => {
        setDisableBtn(true);
        return () => setDisableBtn(true);
    }, [setDisableBtn]);

    return (
        <div className="place-items-center bg-opacity-60 backdrop-blur-sm">
            <div className="relative w-full">
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">
                         New  Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center w-full">
                        <PhoneInput
                            defaultCountry="ET"
                            international
                            flagUrl={`https://flagcdn.com/w40/et.png`}
                            countryCallingCodeEditable={false}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 bg-white outline-none"
                            value={value}
                            onChange={handlePhoneChange}
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
                                placeholder=" Enter OTP for verification"
                                maxLength={6}
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
            </div>
        </div>
    );
};

export default AddNumberComponent;