import { useState } from "react";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../../utilities/routesConst";

export const useRegisterHook = () => {
  const navigate = useNavigate();
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

  const handleRegister = (data, setActiveStep, reset) => {
    const payload = { ...data };
    payload.channel = "WEB"
    APICall("post", payload, EndPoints.customer.register)
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message || "");
          setActiveStep(1);
          const token = res?.data?.token;
          localStorage.setItem("token", token);
          reset()
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        console.log("err", err);

      });
  };
  const handleUpdateProfile = (data) => {
    const id = localStorage.getItem("id")
    const payload = { ...data };
    payload.channel = "WEB",
      APICall("put", payload, EndPoints.customer.updateProfile(id))
        .then((res) => {
          if (res?.success) {
            toast.success(res?.message || "");
            navigate(ConstentRoutes.dashboard)
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
        if (res?.success) {
          toast.success(res?.message || "");
          const token = res?.data?.token;
          localStorage.setItem("token", token);
          localStorage.setItem("id", res?.data?.customer_account_id);
          localStorage.setItem("number", res?.data?.phone_number);
          navigate('/dashboard')
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
    handleUpdateProfile
  };
};
