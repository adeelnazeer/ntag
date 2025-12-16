import { useEffect, useState } from "react";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../../utilities/routesConst";
import { get } from "react-hook-form";

export const useRegisterHook = () => {
  const navigate = useNavigate();
  const [expirationTime, setExpirationTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [otpId, setOtpId] = useState("");
  const [state, setState] = useState({
    success: {},
    error: {},
  });
  const [data, setData] = useState(null);
  const [isResend, setIsResend] = useState(false);

  const getProfileDetail = () => {
    const reduxUserData = JSON.parse(localStorage.getItem("user"));
    if (!reduxUserData) return;
    APICall(
      "get",
      null,
      `${EndPoints?.customer?.getProfileDetail}/${reduxUserData?.customer_account_id}`,
      null,
      true
    )
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleExipre = () => {
    setExpirationTime(null);
  };

  // New function to reset field validation
  const resetFieldValidation = (fieldName) => {
    setState((prevState) => ({
      ...prevState,
      success: {
        ...prevState.success,
        [fieldName]: false,
      },
      error: {
        ...prevState.error,
        [fieldName]: "",
      },
    }));
  };

  const handleGetOtp = (phone) => {
    setIsResend(true);
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
          setOtpId(res?.data?.otp_id);
          localStorage.setItem("otp", res?.data?.otp_id);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // ...existing code...
  const handleVerifyOtp = (code, setNewNumber, newNumber) => {
    const data = {
      otp_id: otpId,
      otp_code: code,
      transaction_type: "OTP_GENRATION",
    };
    APICall("post", data, EndPoints.customer.verifyOty)
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message || "");
          setVerified(true);
          setExpirationTime(null); // <-- Stop the timer after OTP is verified
          if (newNumber) {
            setNewNumber(false);
          }
        } else {
          toast.error(res?.message);
          setVerified(false);
        }
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Something went wrong try again!"
        );
        setVerified(false);
      });
  };
  // ...existing code...

  const handleRegister = (data, setActiveStep, reset) => {
    const otp = localStorage.getItem("otp");
    const payload = { ...data };
    payload.channel = "WEB";

    (payload.otp_id = otp), (payload.otp_code = data?.verification_code);
    console.log(payload, "pay post");

    APICall("post", payload, EndPoints.customer.register)
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message || "");
          setActiveStep(1);
          const token = res?.data?.token;
          localStorage.setItem("token", token);
          localStorage.setItem("id", res?.data?.customer_account_id);
          localStorage.setItem("user", JSON.stringify(res?.data));
          reset();
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleUpdateProfile = (data) => {
    const id = localStorage.getItem("id");
    const payload = { ...data.data };
    payload.channel = "WEB";
    payload.ntn = payload.comp_reg_no;

    const formData = new FormData();

    if (data?.registration_license_url) {
      formData.append(
        "registration_license_url",
        data.registration_license_url
      );
      formData.append(
        "registration_license_name",
        data.registration_license_name
      );
      formData.append(
        "registration_license_type",
        data.registration_license_type || "Registration"
      );
    }

    if (data?.application_letter_url) {
      formData.append("application_letter_url", data.application_letter_url);
      formData.append("application_letter_name", data.application_letter_name);
      formData.append(
        "application_letter_type",
        data.application_letter_type || "Application"
      );
    }

    // Add trade license document
    if (data?.trade_license_url) {
      formData.append("trade_license_url", data.trade_license_url);
      formData.append("trade_license_name", data.trade_license_name);
      formData.append("trade_license_type", data.trade_license_type || "Trade");
    }

    APICall(
      "post",
      formData,
      `${EndPoints?.customer?.uploadDocument}/${id}`,
      null,
      true
    )
      .then(() => {})
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => {
        APICall("put", payload, EndPoints.customer.updateProfile(id))
          .then((res) => {
            if (res?.success) {
              toast.success(res?.message || "");
              localStorage.setItem("user", JSON.stringify(res?.data));
              localStorage.removeItem("otp");
              window.location.replace(ConstentRoutes.dashboard);
            } else {
              toast.error(res?.message);
            }
          })
          .catch((err) => {
            console.log("err", err);
          });
      });
  };

  const handleUpdateUserInfo = (data) => {
    const id = localStorage.getItem("id");
    const payload = { ...data };
    payload.channel = "WEB";

    APICall("put", payload, EndPoints.customer.updateProfile(id))
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message || "");
          localStorage.setItem("user", JSON.stringify(res?.data));
          getProfileDetail();
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleLogin = (data) => {
    setLoading(true);
    const payLoad = {
      username: data?.username,
      password: data?.password,
      channel: "channel",
    };

    APICall("post", payLoad, EndPoints.customer.login)
      .then((res) => {
        if (res?.success) {
          if (res?.data?.customer_type == "individual") {
            const token = res?.data?.token;
            localStorage.setItem("token", token);
            localStorage.setItem("id", res?.data?.customer_account_id);
            localStorage.setItem("number", res?.data?.phone_number);
            localStorage.setItem("user", JSON.stringify(res?.data));
            localStorage.setItem(
              "customer_type",
              JSON.stringify(res?.data.customer_type)
            );
            toast.success(res?.message || "");
            navigate(ConstentRoutes.dashboardCustomer);
          } else {
            if (res?.data?.comp_reg_no == null) {
              toast.info("Please complete you registration process");
              navigate(ConstentRoutes.register, {
                state: {
                  ...res?.data,
                  step: 1,
                },
              });
            } else {
              const token = res?.data?.token;
              localStorage.setItem("token", token);
              localStorage.setItem("id", res?.data?.customer_account_id);
              localStorage.setItem("number", res?.data?.phone_number);
              localStorage.setItem("user", JSON.stringify(res?.data));
              localStorage.setItem(
                "customer_type",
                JSON.stringify(res?.data.customer_type)
              );
              toast.success(res?.message || "");
              navigate(ConstentRoutes.dashboard);
            }
          }
        } else {
          toast.error(res?.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err);
      });
  };

  const verifyAccount = (data, name) => {
    APICall("post", data, EndPoints.customer.verifyAccount)
      .then((res) => {
        if (res?.success) {
          setState((st) => {
            const { [name]: _, ...restError } = st.error; // remove `name` key from `error`
            return {
              ...st,
              success: {
                ...st.success,
                [name]: true,
              },
              error: restError, // assign the rest without `name`
            };
          });
        } else {
          setState((st) => ({
            ...st,
            error: {
              ...st.error,
              [name]: res?.message,
            },
            success: {
              ...st.success,
              [name]: false,
            },
          }));
        }
      })
      .catch((err) => {
        toast.error(err || "Something went wrong try again!");
      });
  };

  const handleIndividualRegister = (data, reset, setConfirmModal) => {
    const otp = localStorage.getItem("otp");
    const payload = { ...data };
    payload.channel = "WEB";
    payload.otp_id = otp;
    payload.otp_code = data?.verification_code;
    payload.phone_number = data?.phone_number?.replace(/^\+/, "");
    APICall("post", payload, EndPoints.customer.individualRegister)
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message || "");
          const token = res?.data?.token;
          localStorage.setItem("token", token);
          localStorage.setItem("id", res?.data?.customer_account_id);
          localStorage.setItem("user", JSON.stringify(res?.data));
          navigate(ConstentRoutes.dashboardCustomer);
          reset();
          setConfirmModal(false);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return {
    handleGetOtp,
    expirationTime,
    state,
    verified,
    data,
    getProfileDetail,
    loading,
    handleVerifyOtp,
    handleExipre,
    handleRegister,
    handleLogin,
    handleUpdateProfile,
    handleUpdateUserInfo,
    setVerified,
    verifyAccount,
    setExpirationTime,
    resetFieldValidation,
    handleIndividualRegister,
    isResend,
  };
};
