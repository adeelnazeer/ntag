import { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import { Input } from "@headlessui/react";
import Img from "../../../assets/images/c.png";
import Img1 from "../../../assets/images/a.png";
import Img2 from "../../../assets/images/b.png";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { useForgotPassword } from "./forgotPasswordHook";
import OtpVerification from "./otpComponent";
import PasswordReset from "./newPassword";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../../../utilities/routesConst";
import { BiArrowBack } from "react-icons/bi";
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

const ForgetPass = () => {
  const { t } = useTranslation(["auth"]);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { handleForgotPassword, data, loading } = useForgotPassword();
  // Read user data only once during component initialization
  const [userData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: {} });

  const onSubmit = (values, e) => {
    e.preventDefault();
    handleForgotPassword(values, setStep);
  };

  const handleLogin = () => {
    navigate(ConstentRoutes.login);
    localStorage.clear();
  };

  // Run this effect only once when the component mounts and userData is available
  useEffect(() => {
    if (userData) {
      reset({
        username: userData?.username,
        phone_number: userData?.phone_number
      });
    }
  }, [reset, userData]); // Only depend on reset and userData which won't change

  // Function to validate Ethiopian phone numbers - ensures they start with 9
  const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return false;
    const cleanNumber = phoneNumber.replace("+251", "").replace(/\s/g, "");
    return cleanNumber.startsWith("9") && cleanNumber.length === 9;
  };

  return (
    <div>
      <style>{autofillStyle}</style>
      <div className="image relative lg:h-[90vh] md:h-[100vh] h-[92vh] flex items-center justify-center md:pb-12 pb-0 lg:pb-0">
        <div>

          <img
            className="absolute left-0 bottom-0 lg:h-[300px] md:h-[150px] h-[100px]"
            src={Img}
            alt="rectangle"
          />
          <img
            className="absolute lg:right-[20%] md:right-[10%] right-[10%] lg:top-[10%] md:top-[10%] top-[7%] lg:h-[100px] md:h-[80px] h-[80px]"
            src={Img1}
            alt="rectangle"
          />
          <img
            className="absolute right-[4%] md:bottom-[10%] bottom-[5%] lg:h-[140px] md:h-[120px] h-[80px]"
            src={Img2}
            alt="rectangle"
          />
        </div>
        <div className="flex items-center justify-center mx-6 md:mx-0">
       
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-xl w-full min-h-[400px]">
               <div className=" pb-4">
            <BiArrowBack className=" text-3xl cursor-pointer text-secondary font-bold"
              onClick={() => {
                navigate(-1)

              }}
            />
          </div>
            {step === 1 ? (
              <>
                <h2 className=" font-semibold md:text-[38px] text-[25px]  mb-4">{userData ? t("forgotPassword.title.update") : t("forgotPassword.title.forgot")}</h2>
                <p className="text-gray-900 mb-6  md:text-base text-[16px] ">
                  {t("forgotPassword.description")}
                </p>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-2">
                    <Input
                      className="mt-2 w-full rounded-xl px-4 py-3 bg-[#F6F7FB] outline-none"
                      placeholder={t("forgotPassword.placeholders.userName")}
                      type="text"
                      style={
                        errors?.username
                          ? { border: "1px solid red" }
                          : { border: "1px solid #8A8AA033" }
                      }
                      {...register("username", { required: true })}
                    />
                  </div>
                  {/* <div className="mb-2">
                    <Input
                      className="w-full rounded-xl px-4 py-3 bg-[#F6F7FB] outline-none"
                      placeholder="Email"
                      type="email"
                      style={
                        errors?.email
                          ? { border: "1px solid red" }
                          : { border: "1px solid #8A8AA033" }
                      }
                      {...register("email", { required: true })}
                    />
                  </div> */}
                  <div className="mb-2">
                    <Controller
                      name="phone_number"
                      control={control}
                      rules={{
                        required: t("forgotPassword.validation.phoneNumberRequired"),
                        validate: (value) => validatePhoneNumber(value)
                      }}
                      render={({ field }) => {
                        // Use useEffect to set initial value
                        useEffect(() => {
                          // Only set if it's empty and no user data is pre-filled
                          if (!field.value && !userData?.phone_number) {
                            field.onChange("+2519");
                          }
                        }, [field]);

                        return (
                          <PhoneInput
                            {...field}
                            className={`mt-2 w-full rounded-xl px-4 py-3 bg-[#F6F7FB] forgot-phone outline-none ${errors.phone_number ? "border border-red-500" : "border border-[#8A8AA033]"
                              }`}
                            defaultCountry="ET"
                            international
                            countryCallingCodeEditable={false}
                            limitMaxLength={true}
                            countries={["ET"]}
                            onChange={(value) => {
                              // Ensure the value starts with "+2519"
                              if (!value) {
                                value = "+2519";
                              } else if (!value.startsWith("+2519")) {
                                // If user tries to change the prefix or remove the 9
                                const cleanValue = value.replace(/^\+251/, '');
                                if (cleanValue === '' || !cleanValue.startsWith('9')) {
                                  value = "+2519";
                                } else {
                                  value = "+251" + cleanValue;
                                }
                              }

                              field.onChange(value);
                            }}
                          />
                        );
                      }}
                    />
                    {errors.phone_number && (
                      <p className="text-left mt-1 text-sm text-[#FF0000]">
                        {errors.phone_number.message}
                      </p>
                    )}
                  </div>
                  <Button
                    className="w-full mt-10 px-4 py-2 justify-center bg-secondary text-white text-[22px] font-semibold"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? t("forgotPassword.buttons.sending") : t("forgotPassword.buttons.sendOtp")}
                  </Button>
                </form>
              </>
            ) : step === 2 ? (
              <OtpVerification otpId={data} setStep={setStep} />
            ) : step === 3 ? (
              <PasswordReset setStep={setStep} data={data} />
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-1">{t("forgotPassword.passwordReset.title")}</h2>
                <p className="text-gray-900 mb-6 text-xs font-medium">
                  {t("forgotPassword.passwordReset.description")}
                </p>
                <Button
                  className="w-full mt-10 px-4 py-2 justify-center bg-secondary text-white text-[22px] font-semibold"
                  onClick={handleLogin}
                >
                  {t("forgotPassword.buttons.login")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPass;