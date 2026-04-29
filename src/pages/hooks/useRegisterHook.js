import { useState } from "react";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../../utilities/routesConst";
import { useRecaptchaToken } from "../../hooks/useRecaptchaToken";

export const useRegisterHook = () => {
  const navigate = useNavigate();
  const { getRecaptchaPayload, isRecaptchaReady } = useRecaptchaToken();
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
      `${EndPoints?.customer?.newSecurityEndPoints.corporate.getProfile}`,
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

  const handleGetOtp = async (phone) => {
    setIsResend(true);
    setVerified(false);
    const cleanedPhone = String(phone || "").replace(/^\+/, "");
    const tokens = await getRecaptchaPayload("generate_otp");
    if (!tokens) {
      setIsResend(false);
      return Promise.resolve();
    }
    const data = {
      msisdn: cleanedPhone,
      otp_type: "IND",
      channel: "WEB",
      transaction_type: "OTP_GENRATION",
      ...tokens,
    };
    return APICall("post", data, EndPoints.customer.generateOtp)
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

  const handleVerifyOtp = async (code, setNewNumber, newNumber) => {
    const tokens = await getRecaptchaPayload("verify_otp");
    if (!tokens) {
      setVerified(false);
      return;
    }
    const data = {
      otp_id: otpId,
      otp_code: code,
      transaction_type: "OTP_GENRATION",
      ...tokens,
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
          err || err.response?.data?.message || "Something went wrong try again!"
        );
        setVerified(false);
      });
  };

  const handleCheckOtpFayda = async (otpCode, msisdn) => {
    setLoading(true);
    const tokens = await getRecaptchaPayload("check_otp_fayda");
    if (!tokens) {
      return null;
    }
    const id = otpId || localStorage.getItem("otp");
    if (!id) {
      toast.error("Please request an OTP first.");
      return null;
    }
    const payload = {
      channel: "WEB",
      otp_id: id,
      msisdn: String(msisdn || "").replace(/^\+/, ""),
      otp_code: String(otpCode || "").trim(),
      transaction_type: "REGISTER",
      ...tokens,
    };
    try {
      const res = await APICall(
        "post",
        payload,
        EndPoints.customer.newSecurityEndPoints.individual.checkOtpFayda
      );
      if (res?.success) {
        toast.success(res?.message || "");
        localStorage.setItem("otp_code_step1", String(otpCode || "").trim());
        setVerified(true);
        setExpirationTime(null);
        return res;
      }
      toast.error(res?.message);
      setVerified(false);
      return res;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong try again!"
      );
      setVerified(false);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data, setActiveStep, reset) => {
    const otp = localStorage.getItem("otp");
    const payload = { ...data };
    payload.channel = "WEB";
    payload.otp_id = otp;
    payload.otp_code = data?.verification_code;
    const tokens = await getRecaptchaPayload("register", { silent: true });
    if (tokens) Object.assign(payload, tokens);

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
      .then(() => { })
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
    const payload = { ...data };
    payload.channel = "WEB";

    return APICall("put", payload, EndPoints.customer.newSecurityEndPoints.corporate.updateProfile)
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message || "");
          localStorage.setItem("user", JSON.stringify(res?.data));
          getProfileDetail();
          return res;
        } else {
          toast.error(res?.message);
          return res;
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast.error(err?.response?.data?.message || err?.message || "Something went wrong");
      });
  };

  const handleLogin = async (data, isDeleteAccount) => {
    const tokens = await getRecaptchaPayload("login");
    if (!tokens) return;

    setLoading(true);
    const payLoad = {
      username: data?.username,
      password: data?.password,
      channel: "WEB",
      ...tokens,
    };

    APICall("post", payLoad, EndPoints.customer.login)
      .then((res) => {
        if (res?.success) {
          if (res?.data?.customer_type == "individual") {
            const token = res?.data?.token;
            if (isDeleteAccount) {
              localStorage.setItem("deleteToken", token);
              navigate(ConstentRoutes.delAccountDetail);

            } else {
              localStorage.setItem("token", token);
              navigate(ConstentRoutes.dashboardCustomer);

            }
            localStorage.setItem("id", res?.data?.customer_account_id);
            localStorage.setItem("number", res?.data?.phone_number);
            localStorage.setItem("user", JSON.stringify(res?.data));
            localStorage.setItem(
              "customer_type",
              JSON.stringify(res?.data.customer_type)
            );
            toast.success(res?.message || "");
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
              if (isDeleteAccount) {
                localStorage.setItem("deleteToken", token);
                navigate(ConstentRoutes.delAccountDetail);
              } else {
                localStorage.setItem("token", token);
                navigate(ConstentRoutes.dashboard);
              }
              localStorage.setItem("id", res?.data?.customer_account_id);
              localStorage.setItem("number", res?.data?.phone_number);
              localStorage.setItem("user", JSON.stringify(res?.data));
              localStorage.setItem(
                "customer_type",
                JSON.stringify(res?.data.customer_type)
              );
              toast.success(res?.message || "");
            }
          }
        } else {
          toast.error(res?.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message || err?.message || err);
      });
  };

  const verifyAccount = async (data, name) => {
    const tokens = await getRecaptchaPayload("verify_account", { silent: true });
    const payload = tokens ? { ...data, ...tokens } : data;
    APICall("post", payload, EndPoints.customer.verifyAccount)
      .then((res) => {
        if (res?.success) {
          setState((st) => {
            // eslint-disable-next-line no-unused-vars
            const { [name]: _omit, ...restError } = st.error; // remove `name` key from `error`
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

  const handleIndividualRegister = async (data, reset, setConfirmModal) => {
    const otp = localStorage.getItem("otp");
    const otpCode = localStorage.getItem("otp_code_step1");
    const payload = { ...data };
    payload.channel = "WEB";
    payload.otp_id = otp;
    payload.otp_code = otpCode || data?.verification_code || data?.otp_code;
    payload.phone_number = localStorage.getItem("phone_number");
    const tokens = await getRecaptchaPayload("register_individual", { silent: true });
    if (tokens) Object.assign(payload, tokens);
    return APICall("post", payload, EndPoints.customer.newSecurityEndPoints.individual.signUp)
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message || "");
          const token = res?.data?.token;
          localStorage.setItem("token", token);
          localStorage.setItem("id", res?.data?.customer_account_id);
          localStorage.setItem("user", JSON.stringify(res?.data));
          localStorage.removeItem("otp_code_step1");
          localStorage.removeItem("otp");
          localStorage.removeItem("phone_number");
          navigate(ConstentRoutes.dashboardCustomer);
          reset();
          setConfirmModal(false);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        toast.error(err || err?.message || err?.response?.data?.message || "Something went wrong try again!");
      });
  };

  return {
    handleGetOtp,
    isRecaptchaReady,
    expirationTime,
    state,
    verified,
    data,
    getProfileDetail,
    loading,
    handleVerifyOtp,
    handleCheckOtpFayda,
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
