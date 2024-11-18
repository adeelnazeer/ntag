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

const ForgetPass = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate()
  const { handleForgotPassword, data, loading } = useForgotPassword()
  const user = JSON.parse(localStorage.getItem('user'))
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: {} });

  const onSubmit = (values, e) => {
    e.preventDefault()
    handleForgotPassword(values, setStep)
  };

  const handleLogin = () => {
    navigate(ConstentRoutes.login)
    localStorage.clear()
  };

  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
        email: user?.email,
        phone_number: user?.phone_number
      })
    }
  }, [reset])

  return (
    <div>
      <div className="image relative lg:h-[90vh] md:h-[100vh] h-[92vh] flex items-center justify-center md:pb-12 pb-0 lg:pb-0">
        <div>
          <p className=" text-center font-medium text-[18px] text-[#757575] absolute lg:left-[40%] md:left-[30%] left-[12%] md:bottom-0 bottom-32">
            ©2022 Layyyers. All rights reserved.
          </p>
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
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full min-h-[400px]">
            {step === 1 ? (
              <>
                <h2 className="text-2xl font-bold mb-4">{user ? "Update" : "Forgot"} Password</h2>
                <p className="text-gray-900 mb-6 text-xs font-medium">
                  Please enter your email or phone number to reset the password
                </p>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-2">
                    <Input
                      className="mt-2 w-full rounded-xl px-4 py-3 bg-[#F6F7FB] outline-none"
                      placeholder="User Name"
                      type="text"
                      style={
                        errors?.username
                          ? { border: "1px solid red" }
                          : { border: "1px solid #8A8AA033" }
                      }

                      {...register("username", { required: true })}
                    />
                  </div>
                  <div className="mb-2">
                    <Input
                      className=" w-full rounded-xl px-4 py-3 bg-[#F6F7FB] outline-none"
                      placeholder="Email"
                      type="email"
                      style={
                        errors?.email
                          ? { border: "1px solid red" }
                          : { border: "1px solid #8A8AA033" }
                      }

                      {...register("email", { required: true })}
                    />
                  </div>
                  <div className="mb-2">
                    <Controller
                      name="phone_number"
                      control={control}
                      rules={{ required: "Phone number is required" }}
                      render={({ field }) => (
                        <PhoneInput
                          {...field}
                          className={`mt-2 w-full rounded-xl px-4 py-3 bg-[#F6F7FB] forgot-phone outline-none ${errors.phone_number ? "border border-red-500" : "border border-[#8A8AA033]"
                            }`}
                          defaultCountry="ET"
                          international
                          countryCallingCodeEditable={false}
                          limitMaxLength={10}
                          countries={["ET"]}
                          onChange={(value) => field.onChange(value)} // Updates react-hook-form value
                        />
                      )}
                    />
                  </div>
                  <Button
                    className="w-full mt-10 px-4 py-2 justify-center bg-secondary text-white text-[22px] font-semibold"
                    type="submit"
                    loading={loading}
                  >
                    SEND OTP
                  </Button>
                </form>
              </>
            ) : step === 2 ? (
              <OtpVerification otpId={data} setStep={setStep} />
            ) : step === 3 ? (
              <PasswordReset setStep={setStep} data={data} />
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPass;
