/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import APICall from "../../../network/APICall";
import EndPoints from "../../../network/EndPoints";
import { toast } from "react-toastify";
import { useRegisterHook } from "../../hooks/useRegisterHook";
import { Button } from "@material-tailwind/react";
import { useAppSelector } from "../../../redux/hooks";
import { FiRefreshCw } from "react-icons/fi"; // Import refresh icon

const OtpVerification = ({ otpId, setStep }) => {
    const { handleSubmit, control, reset, formState: { errors } } = useForm();
    const [timeLeft, setTimeLeft] = useState(120); // Countdown timer in seconds
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const inputRefs = useRef([]);
    const { handleGetOtp } = useRegisterHook();

    const reduxOtpId = useAppSelector(state => state.auth.otpId);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);

            return () => clearTimeout(timerId);
        }
    }, [timeLeft]);

    // Resend OTP function (resets the timer)
    const handleResendOtp = () => {
        if (timeLeft > 0 || resending) return;

        setResending(true);
        reset();

        // Add purpose parameter to help distinguish from registration flow
        handleGetOtp(otpId?.phone_number, "password_reset")
            .then(() => {
                setTimeLeft(59);
                inputRefs.current[0].focus(); // Focus on the first field
            })
            .catch((err) => {
                toast.error(err?.message || "Failed to resend OTP");
            })
            .finally(() => {
                setResending(false);
            });
    };

    const onSubmit = (data) => {
        setLoading(true);
        const otp = Object.values(data).join("");

        // Use OTP ID from Redux if available, otherwise fall back to props or localStorage
        const otpIdValue = reduxOtpId || (otpId?.otp_id || localStorage.getItem("otp"));

        if (!otpIdValue) {
            toast.error("OTP ID not found. Please request a new OTP.");
            setLoading(false);
            return;
        }

        const payload = {
            otp_id: otpIdValue,
            otp_code: otp,
            transaction_type: "OTP_GENRATION",
        };

        APICall("post", payload, EndPoints.customer.verifyOty)
            .then((res) => {
                if (res?.success) {
                    toast.success(res?.message || "");
                    setStep(3);
                } else {
                    toast.error(res?.message);
                }
            })
            .catch((err) => {
                toast.error(
                    err || "Something went wrong try again!"
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="py-6 px-6">
            <h2 className="text-2xl  font-semibold md:text-[38px] text-[25px]  mb-4">OTP Verification</h2>
            <p className="text-gray-900  md:text-base text-[16px] mb-6">

                Please enter the OTP sent to the mobile number +{otpId?.phone_number}
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between mb-6">
                    {[0, 1, 2, 3].map((index) => (
                        <Controller
                            key={index}
                            name={`otp_${index}`}
                            control={control}
                            rules={{
                                required: "This field is required",
                                maxLength: 1,
                                pattern: {
                                    value: /^[0-9]$/,
                                    message: "Must be a number"
                                }
                            }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    onChange={(e) => {
                                        // Only accept digits
                                        if (/^[0-9]$/.test(e.target.value) || e.target.value === '') {
                                            field.onChange(e.target.value);
                                            // Move to the next field if a digit is entered
                                            if (e.target.value && index < 3) {
                                                inputRefs.current[index + 1].focus();
                                            }
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Handle backspace to move to previous field
                                        if (e.key === 'Backspace' && !field.value && index > 0) {
                                            inputRefs.current[index - 1].focus();
                                        }
                                    }}
                                    className={`mt-2 w-[60px] h-[60px] text-center rounded-xl font-semibold text-xl px-3 py-2 bg-[#F6F7FB] outline-none ${errors[`otp_${index}`] ? "border border-red-500" : "border border-[#8A8AA033]"
                                        }`}
                                    maxLength="1"
                                    placeholder="-"
                                />
                            )}
                        />
                    ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                    {/* Timer display */}
                    <div className="text-gray-600 text-sm">
                        {timeLeft > 0 ? (
                            <span>
  Time remaining:{" "}
  <span className="text-secondary font-medium">
    {`${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`}
  </span>
</span>
                        ) : (
                            <span className="text-red-500">OTP expired</span>
                        )}
                    </div>

                    {/* Resend button - larger and with icon */}
                    <Button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={timeLeft > 0 || resending}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft > 0 || resending
                                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                                : "bg-secondary text-white hover:bg-secondary/90"
                            }`}
                        size="sm"
                    >
                        <FiRefreshCw className={`${resending ? "animate-spin" : ""}`} />
                        {resending ? "Sending..." : "Resend OTP"}
                    </Button>
                </div>

                <Button
                    className="w-full mt-6 px-4 py-2 justify-center bg-secondary text-white text-[22px] font-semibold"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </Button>
            </form>
        </div>
    );
};

export default OtpVerification;