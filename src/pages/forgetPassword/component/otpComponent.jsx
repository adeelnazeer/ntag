/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import APICall from "../../../network/APICall";
import EndPoints from "../../../network/EndPoints";
import { toast } from "react-toastify";
import { useRegisterHook } from "../../hooks/useRegisterHook";
import { Button } from "@material-tailwind/react";

const OtpVerification = ({ otpId, setStep }) => {
    const { handleSubmit, control, reset, formState: { errors } } = useForm();
    const [timeLeft, setTimeLeft] = useState(59); // Countdown timer in seconds
    const [loading, setLoading] = useState(false)
    const inputRefs = useRef([]);
    const { handleGetOtp } = useRegisterHook()

    // Countdown Timer
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
        reset()
        handleGetOtp(otpId?.phone_number)
        setTimeLeft(59);
        inputRefs.current[0].focus(); // Focus on the first field
        // Add logic to resend the OTP here
    };


    const onSubmit = (data) => {
        setLoading(true)
        const otp = Object.values(data).join("");
        const otpId = localStorage.getItem("otp")
        const payload = {
            otp_id: otpId ? otpId : otpId?.otp_id,
            otp_code: otp,
            transaction_type: "OTP_GENRATION",
        };
        APICall("post", payload, EndPoints.customer.verifyOty)
            .then((res) => {
                if (res?.success) {
                    toast.success(res?.message || "");
                    setStep(3)

                } else {
                    toast.error(res?.message);
                }
            })
            .catch((err) => {
                toast.error(
                    err.response?.data?.message || "Something went wrong try again!"
                );
            }).finally(() => {
                setLoading(false)
            })
        // Add OTP verification logic here
    };

    return (
        <div className="py-6 px-6">
            <h2 className="text-2xl font-bold mb-4">OTP Verification</h2>
            <p className="text-gray-900 mb-6 text-xs font-medium">
                Please enter the OTP code sent to this number {otpId?.phone_number}
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between mb-2">
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
                                        field.onChange(e.target.value);
                                        // Move to the next field if a digit is entered
                                        if (e.target.value && index < 3) {
                                            inputRefs.current[index + 1].focus();
                                        }
                                    }}
                                    className={`mt-2 w-[60px] text-center rounded-xl px-4 py-3 bg-[#F6F7FB] outline-none ${errors[`otp_${index}`] ? "border border-red-500" : "border border-[#8A8AA033]"
                                        }`}
                                    maxLength="1"
                                    placeholder="-"
                                />
                            )}
                        />
                    ))}
                </div>
                <p className="text-gray-400 text-xs mt-4 text-center">
                    Resend Code:{" "}
                    {timeLeft > 0 ? (
                        <span className="text-secondary">{`00:${String(timeLeft).padStart(2, "0")}`}</span>
                    ) : (
                        <span
                            className="text-secondary cursor-pointer"
                            onClick={handleResendOtp}
                        >
                            Resend OTP
                        </span>
                    )}
                </p>
                <Button
                    className="w-full mt-10 px-4 py-2 justify-center bg-secondary text-white text-[22px] font-semibold"
                    type="submit"
                    loading={loading}
                >
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default OtpVerification;
