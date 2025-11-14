/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "@material-tailwind/react";
import { Input } from "@headlessui/react";
import { useForm } from "react-hook-form";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useTranslation } from "react-i18next";

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

const ChangePassword = ({ isCustomer = false }) => {
    const { t } = useTranslation(["auth"]);
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState({
        password1: false,
        password2: false,
        password3: false
    })    // Read user data only once during component initialization

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        watch,
        formState: { errors },
    } = useForm({ defaultValues: {} });

    const watchAllFields = watch()

    const onSubmit = (values, e) => {
        e.preventDefault();
        setLoading(true)
        const user = JSON.parse(localStorage.getItem('user'))
        const endPoint = isCustomer ? EndPoints.customer.changePasswordCustomer : EndPoints.customer.changePassword
        const payload = {
            ...values,
            customer_account_id: user?.customer_account_id
        }
        const payloadCustomer = {
            ...values,
            user_id: user?.id?.toString()
        }
        APICall("post", isCustomer ? payloadCustomer : payload, endPoint)
            .then((res) => {
                if (res?.success) {
                    reset()
                    toast.success(res?.message || t("changePassword.toastMessages.passwordUpdateSuccessfully"));
                } else {
                    toast.error(res?.message || t("changePassword.toastMessages.failedToUpdatePassword"));
                }
            })
            .catch((err) => {
                toast.error(err?.message || t("changePassword.toastMessages.anErrorOccurred"));
            })
            .finally(() => {
                setLoading(false)
            });
    };


    return (
        <div>
            <style>{autofillStyle}</style>
            <div className=" relative flex mt-10 items-center justify-center md:pb-12 pb-0 lg:pb-0">
                <div className="flex items-center justify-center mx-6 md:mx-0">
                    <div className="bg-white p-10 rounded-2xl shadow-md max-w-xl w-full min-h-[400px]">
                        <>
                            <h2 className=" font-semibold text-center md:text-[38px] text-[25px]  mb-4">{t("changePassword.title")}</h2>
                            <p className="text-gray-900 mb-6  md:text-base text-[16px] ">
                                {t("changePassword.description")}
                            </p>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-4">
                                    <label className="md:text-base text-[16px] text-[#232323]">
                                        {t("changePassword.labels.currentPassword")}
                                    </label>
                                    <div className="relative">
                                        <Input
                                            className="w-full rounded-xl p-4 bg-[#F6F7FB] outline-none pr-12"
                                            placeholder={t("changePassword.placeholders.currentPassword")}
                                            maxLength={15}
                                            min={4}
                                            type={showPassword?.password1 ? "text" : "password"}
                                            style={
                                                errors.old_password
                                                    ? { border: "1px solid red" }
                                                    : { border: "1px solid #8A8AA033" }
                                            }
                                            {...register("old_password", {
                                                required: t("changePassword.validation.passwordRequired"),
                                                minLength: {
                                                    value: 5,
                                                    message: t("changePassword.validation.passwordMinLength"),
                                                },
                                                maxLength: {
                                                    value: 15,
                                                    message: t("changePassword.validation.passwordMaxLength"),
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

                                <div className="mb-4">
                                    <label className="md:text-base text-[16px] text-[#232323]">
                                        {t("changePassword.labels.newPassword")}
                                    </label>
                                    <div className=" relative">
                                        <Input
                                            className="w-full rounded-xl p-4 bg-[#F6F7FB] outline-none pr-12"
                                            placeholder={t("changePassword.placeholders.newPassword")}
                                            maxLength={15}
                                            min={4}
                                            type={showPassword?.password2 ? "text" : "password"}
                                            style={
                                                errors.password
                                                    ? { border: "1px solid red" }
                                                    : { border: "1px solid #8A8AA033" }
                                            }
                                            {...register("password", {
                                                required: t("changePassword.validation.passwordRequired"),
                                                minLength: {
                                                    value: 5,
                                                    message: t("changePassword.validation.passwordMinLength"),
                                                },
                                                maxLength: {
                                                    value: 15,
                                                    message: t("changePassword.validation.passwordMaxLength"),
                                                },
                                                validate: (value) => {
                                                    const oldPassword = getValues("old_password");
                                                    if (value === oldPassword) {
                                                        return t("changePassword.validation.newPasswordSameAsCurrent");
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
                                <div className="mb-4">
                                    <label className="md:text-base text-[16px] text-[#232323]">
                                        {t("changePassword.labels.confirmNewPassword")}
                                    </label>
                                    <div className=" relative">
                                        <Input
                                            className="w-full rounded-xl p-4 bg-[#F6F7FB] outline-none pr-12"
                                            placeholder={t("changePassword.placeholders.confirmNewPassword")}
                                            maxLength={15}
                                            min={4}
                                            type={showPassword?.password3 ? "text" : "password"}
                                            style={
                                                errors?.password_confirmation ||
                                                    watchAllFields?.password != watchAllFields?.password_confirmation
                                                    ? { border: "1px solid red" }
                                                    : { border: "1px solid #8A8AA033" }
                                            }
                                            {...register("password_confirmation", {
                                                required: t("changePassword.validation.passwordRequired"),
                                                minLength: {
                                                    value: 5,
                                                    message: t("changePassword.validation.passwordMinLength"),
                                                },
                                                maxLength: {
                                                    value: 15,
                                                    message: t("changePassword.validation.passwordMaxLength"),
                                                },
                                                validate: (val) => {
                                                    if (watch("password") != val) {
                                                        return t("changePassword.validation.passwordsDoNotMatch");
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
                                                password3: !st.password3
                                            }))}
                                        >
                                            {showPassword?.password3 ? <AiOutlineEye size={22} /> : <AiOutlineEyeInvisible size={22} />}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 flex justify-center">
                                    <Button
                                        className=" px-4 min-w-52 py-4 justify-center bg-secondary text-white text-[22px] font-semibold"
                                        type="submit"
                                        disabled={loading}
                                        loading={loading}
                                    >
                                        {t("changePassword.buttons.submit")}
                                    </Button>
                                </div>
                            </form>
                        </>

                        {/* <>
                            <h2 className="text-2xl font-bold mb-1">Password Reset</h2>
                            <p className="text-gray-900 mb-6 text-xs font-medium">
                                Your password has been successfully reset. Click below to
                                login.
                            </p>
                            <Button
                                className="w-full mt-10 px-4 py-2 justify-center bg-secondary text-white text-[22px] font-semibold"
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                        </> */}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;