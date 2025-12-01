/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import EndPoints from "../../../network/EndPoints";
import APICall from "../../../network/APICall";
import { toast } from "react-toastify";
import { useState } from "react";
import { Button } from "@material-tailwind/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Input } from "@headlessui/react";

const PasswordReset = ({ setStep, data }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState({
        password1: false,
        password2: false,
    })
    const [loading, setLoading] = useState(false)
    const onSubmit = (values) => {
        setLoading(true)
        const payload = {
            password: values?.newPassword,
            password_confirmation: values?.confirmPassword,
            customer_account_id: data?.customer_account_id?.toString() || data?.id?.toString()
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
    const watchAllFields = watch()

    return (
        <>
            <h2 className="text-2xl font-bold mb-1">Set a New Password</h2>
            <p className="text-gray-900 mb-6 text-xs font-medium">
                Create a new password. Ensure it differs from previous ones for security.
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2">
                    <div className=" relative">
                        <Input
                            className="w-full rounded-xl p-4 bg-[#F6F7FB] outline-none pr-12"
                            placeholder="New password"
                            maxLength={15}
                            min={4}
                            type={showPassword?.password1 ? "text" : "password"}
                            style={
                                errors.newPassword
                                    ? { border: "1px solid red" }
                                    : { border: "1px solid #8A8AA033" }
                            }
                            {...register("newPassword", {
                                required: "Password is required",
                                minLength: {
                                    value: 5,
                                    message: "Password must be at least 5 characters",
                                },
                                maxLength: {
                                    value: 15,
                                    message: "Password must not exceed 15 characters",
                                },
                            })}
                            onContextMenu={(e) => e.preventDefault()} // disable right-click
                            onCopy={(e) => e.preventDefault()}        // disable copy
                            onCut={(e) => e.preventDefault()}         // disable cut
                            onPaste={(e) => e.preventDefault()}
                        />
                        <div
                            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword(st => ({
                                ...st,
                                password1: !st.password1
                            }))}
                        >
                            {showPassword?.password1 ? <AiOutlineEye size={22} /> : <AiOutlineEyeInvisible size={22} />}
                        </div>
                    </div>

                </div>
                <div className="mb-2">
                    <div className=" relative">
                        <Input
                            className="w-full rounded-xl p-4 bg-[#F6F7FB] outline-none pr-12"
                            placeholder="Confirm new passwprd"
                            maxLength={15}
                            min={4}
                            type={showPassword?.password2 ? "text" : "password"}
                            style={
                                errors?.confirmPassword ||
                                    watchAllFields?.newPassword != watchAllFields?.confirmPassword
                                    ? { border: "1px solid red" }
                                    : { border: "1px solid #8A8AA033" }
                            }
                            {...register("confirmPassword", {
                                required: "Password is required",
                                minLength: {
                                    value: 5,
                                    message: "Password must be at least 5 characters",
                                },
                                maxLength: {
                                    value: 15,
                                    message: "Password must not exceed 15 characters",
                                },
                                validate: (val) => {
                                    if (watch("newPassword") != val) {
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
                            onClick={() => setShowPassword(st => ({
                                ...st,
                                password2: !st.password2
                            }))}
                        >
                            {showPassword?.password2 ? <AiOutlineEye size={22} /> : <AiOutlineEyeInvisible size={22} />}
                        </div>
                    </div>

                </div>
                <Button
                    className="w-full mt-10 px-4 py-2 justify-center bg-secondary text-white text-[22px] font-semibold"
                    type="submit"
                    loading={loading}
                >
                    Change Password
                </Button>
            </form>
        </>
    );
};

export default PasswordReset;
