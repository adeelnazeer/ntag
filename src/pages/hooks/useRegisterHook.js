import { useState } from "react";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { toast } from "react-toastify";

export const useRegisterHook = () => {
  const [expirationTime, setExpirationTime] = useState(null);

  const handleExipre = () => {
    setExpirationTime(0);
  };

  const handleGetOtp = (phone) => {
    const data = {
      msisdn: phone,
      otp_type: "IND",
      channel: "SMS",
      transaction_type: "OTP_GENRATION",
    };
    APICall("post", data, EndPoints.customer.generateOtp)
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message || "");
          setExpirationTime(res.data.expiration_time);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleRegister = (data, setActiveStep) => {
    const payload = { ...data };
    (payload.channel = "WEB"),
      APICall("post", payload, EndPoints.customer.register)
        .then((res) => {
          if (res?.success) {
            toast.success(res?.message || "");
            setActiveStep(1);
          } else {
            toast.error(res?.message);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
  };

  return { handleGetOtp, expirationTime, handleExipre, handleRegister };
};
