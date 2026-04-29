import { toast } from "react-toastify";
import APICall from "../../../network/APICall";
import EndPoints from "../../../network/EndPoints";
import { useState } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { setOtpId } from "../../../redux/authSlice";
import { useRecaptchaToken } from "../../../hooks/useRecaptchaToken";

export const useForgotPassword = () => {
    const dispatch = useAppDispatch();
    const { getRecaptchaPayload } = useRecaptchaToken();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (formData, setStep) => {
        const tokens = await getRecaptchaPayload("forget_password_verify_otp");
        if (!tokens) return;

        setLoading(true);
        const payload = {
            username: formData?.username,
            phone_number: formData?.phone_number?.replace(/^\+/, ""),
            ...tokens,
        };
        const endpoint = EndPoints.customer.newSecurityEndPoints.forgotPassword;

        try {
            const res = await APICall("post", payload, endpoint);
            if (res?.success) {
                setData(res?.data);
                dispatch(setOtpId(res?.data?.otp_id));
                toast.success(res?.message || "OTP sent successfully");
                setStep(2);
            } else {
                toast.error(res?.message || "Failed to send OTP");
            }
        } catch (err) {
            toast.error(err?.message || err || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return { handleForgotPassword, data, loading };
};