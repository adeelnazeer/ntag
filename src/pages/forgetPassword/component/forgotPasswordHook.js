import { toast } from "react-toastify";
import APICall from "../../../network/APICall";
import EndPoints from "../../../network/EndPoints";
import { useState } from "react";

export const useForgotPassword = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const handleForgotPassword = (data, setStep) => {
        setLoading(true)
        APICall("post", data, EndPoints.customer.forgotPassword)
            .then((res) => {
                if (res?.success) {
                    setData(res?.data)
                    localStorage.setItem("otp", res?.data?.otp_id)
                    toast.success(res?.message || "");
                    setStep(2);
                } else {
                    toast.error(res?.message);
                }
            })
            .catch((err) => {
                toast.error(err?.message)
            }).finally(() => {
                setLoading(false)
            })
    };

    return { handleForgotPassword, data, loading };
};
