/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import EndPoints from "../../../network/EndPoints";
import APICall from "../../../network/APICall";
import { toast } from "react-toastify";
import { useState } from "react";
import { Button } from "@material-tailwind/react";

const PasswordReset = ({ setStep, data }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false)
    const onSubmit = (values) => {
        setLoading(true)
        const payload = {
            password: values?.newPassword,
            password_confirmation: values?.confirmPassword,
            customer_account_id: data?.customer_account_id
        }
        // Add logic for saving the new password here
        APICall("post", payload, EndPoints.customer.newPassword)
            .then((res) => {
                if (res?.success) {
                    toast.success(res?.message || "");
                    setStep(4);
                } else {
                    toast.error(res?.message);
                }
            })
            .catch((err) => {
                toast.error(err?.message)
            });
    };

    // Watch the new password field to validate confirm password
    const newPassword = watch("newPassword");

    return (
        <>
            <h2 className="text-2xl font-bold mb-1">Set a New Password</h2>
            <p className="text-gray-900 mb-6 text-xs font-medium">
                Create a new password. Ensure it differs from previous ones for security.
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2">
                    <input
                        {...register("newPassword", {
                            required: "New Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters",
                            },
                        })}
                        className={`mt-2 w-full rounded-xl px-4 py-3 bg-[#F6F7FB] outline-none ${errors.newPassword ? "border border-red-500" : "border border-[#8A8AA033]"
                            }`}
                        placeholder="New Password"
                        type="password"
                    />
                    {errors.newPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
                    )}
                </div>
                <div className="mb-2">
                    <input
                        {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                                value === newPassword || "Passwords do not match",
                        })}
                        className={`mt-2 w-full rounded-xl px-4 py-3 bg-[#F6F7FB] outline-none ${errors.confirmPassword ? "border border-red-500" : "border border-[#8A8AA033]"
                            }`}
                        placeholder="Confirm New Password"
                        type="password"
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                    )}
                </div>
                <Button
                    className="w-full mt-10 px-4 py-2 justify-center bg-secondary text-white text-[22px] font-semibold"
                    type="submit"
                    loading={loading}
                >
                    Save
                </Button>
            </form>
        </>
    );
};

export default PasswordReset;
