import { useState } from "react";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useRegisterHook = () => {
  const navigate = useNavigate();
  const [expirationTime, setExpirationTime] = useState(null);
  const [verifyOtp, setVerifyOtp] = useState({
    id: "",
    code: "",
  });

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
        console.log(res, "response");
        if (res?.success) {
          toast.success(res?.message || "");
          setExpirationTime(res.data.expiration_time);
          setVerifyOtp((st) => ({
            ...st,
            id: res.data?.otp_id,
            code: res?.data?.msisdn,
          }));
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const handleVerifyOtp = (watch) => {
    const data = {
      otp_id: verifyOtp.id,
      otp_code: watch.verification_code,
      transaction_type: "OTP_GENRATION",
    };
    APICall("post", data, EndPoints.customer.verifyOtp)
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message || "");
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
            const token = res?.data?.token;
            localStorage.setItem("token", token);
          } else {
            toast.error(res?.message);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
  };
  const handleUpdateProfile = (data, setActiveStep) => {
    const payload = { ...data };
    (payload.channel = "WEB"),
      APICall("put", payload, EndPoints.customer.updateProfile)
        .then((res) => {
          if (res?.success) {
            toast.success(res?.message || "");
            const token = res?.data?.token;
            localStorage.setItem("token", token);
          } else {
            toast.error(res?.message);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
  };

  const handleLogin = (data) => {
    const payLoad = {
      username: data?.username,
      password: data?.password,
      channel: "channel",
    };

    APICall("post", payLoad, EndPoints.customer.login)
      .then((res) => {
        console.log(res, "res");
        if (res?.success) {
          toast.success(res?.message || "");
          const token = res?.data?.token;
          localStorage.setItem("token", token);
          navigate("/dashboard");
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast.error(err?.message);
      });
  };

  return {
    handleGetOtp,
    expirationTime,
    handleExipre,
    handleRegister,
    handleLogin,
    handleUpdateProfile,
    verifyOtp,
    handleVerifyOtp,
  };
};
