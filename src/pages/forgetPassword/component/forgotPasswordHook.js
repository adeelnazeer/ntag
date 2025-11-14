import { toast } from "react-toastify";
import APICall from "../../../network/APICall";
import EndPoints from "../../../network/EndPoints";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { setOtpId } from "../../../redux/authSlice";

export const useForgotPassword = () => {
    const dispatch = useAppDispatch();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userData] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    });
  
    const handleForgotPassword = (data, setStep) => {
        setLoading(true);
        const payload={
            username: data?.username,
            phone_number: data?.phone_number?.replace(/^\+/, '')
        }        
        let endpoint = userData?.customer_type === 'individual' 
            ? EndPoints.customer.IndividualforgotPassword 
            : EndPoints.customer.forgotPassword;
      
        APICall("post", payload, endpoint)
            .then((res) => {
                if (res?.success) {
                    setData(res?.data);
                    
                    dispatch(setOtpId(res?.data?.otp_id));
                    
                    toast.success(res?.message || "OTP sent successfully");
                    setStep(2);
                } else {
                    toast.error(res?.message || "Failed to send OTP");
                }
            })
            .catch((err) => {
                toast.error(err?.message || "An error occurred");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return { handleForgotPassword, data, loading };
};