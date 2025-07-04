import { Input } from "@headlessui/react";
import LoginImg from "../../../assets/images/login.png";
import { useForm } from "react-hook-form";
import { useRegisterHook } from "../../hooks/useRegisterHook";
import { Button, Checkbox } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const LoginForm = () => {
  const registerHook = useRegisterHook();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const savedData = sessionStorage.getItem("rememberedUser");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setValue("username", parsed.username);
      setValue("password", parsed.password);
      setRememberMe(true);
    }
  }, []);


  const onSubmit = (data) => {
    if (rememberMe) {
      sessionStorage.setItem("rememberedUser", JSON.stringify(data));
    } else {
      sessionStorage.removeItem("rememberedUser");
    }
    registerHook.handleLogin(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
      <div className="flex-1 overflow-auto h-full">
        <div className="bg-secondary login-bg-img items-center overflow-auto md:h-full grid md:grid-cols-3 gap-5 grid-cols-1 justify-between md:gap-6 gap-0  py-4 md:px-16 px-4">
          <div className=" md:col-span-2 h-full">
            <div className=" text-white pt-10">
              <h2 className=" md:text-5ev
              xl text-2xl"> Name<span className=" font-semibold">TAG</span></h2>
              <p className="mt-5 md:text-xl text-lg">Your Identity, Simplified</p>
            </div>
          </div>

          <div className="bg-white flex-[.5] h-fit rounded-[15px] md:p-10 p-5">
            <h2 className="font-semibold md:text-[38px] text-[25px]">Login</h2>
            <p className="md:text-base text-[16px] mt-6">
              Please enter your username and password to log in to your NameTAG account.
            </p>

            <Input
              className="mt-6 w-full rounded-xl p-4 bg-[#F6F7FB] outline-none"
              placeholder="Enter Username"
              style={
                errors.username
                  ? { border: "1px solid red" }
                  : { border: "1px solid #8A8AA033" }
              }
              {...register("username", { required: true })}
            />

            {/* Password Field with Eye Toggle */}
            <div className="relative mt-6">
              <Input
                className="w-full rounded-xl p-4 bg-[#F6F7FB] outline-none pr-12"
                placeholder="Enter Password"
                maxLength={15}
                min={4}
                type={showPassword ? "text" : "password"}
                style={
                  errors.password
                    ? { border: "1px solid red" }
                    : { border: "1px solid #8A8AA033" }
                }
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 5,
                    message: "Password must be at least 5 characters",
                  },
                  maxLength: {
                    value: 15,
                    message: "Password must not exceed 15 characters",
                  },
                })}
                onContextMenu={(e) => e.preventDefault()} // disable right-click
                onCopy={(e) => e.preventDefault()}        // disable copy
                onCut={(e) => e.preventDefault()}         // disable cut
                onPaste={(e) => e.preventDefault()}
              />
              <div
                className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {!showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
              </div>
            </div>
            <div>
              <div className="mt-4 flex items-center gap-2">
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />

                <label htmlFor="rememberMe" className="text-sm">
                  Remember Me
                </label>
              </div>

            </div>

            <Button
              className="w-full mt-10 px-4 py-2 justify-center bg-secondary text-white text-[22px] font-semibold"
              type="submit"
              loading={registerHook.loading}
            >
              LOGIN
            </Button>

            <div className="mt-6 flex justify-center flex-col md:flex-row gap-4">
              <p
                className=" text-center text-base cursor-pointer hover:font-semibold"
                onClick={() => navigate("/register")}
              >
                Register as Corporate
              </p>
              <div className="w-[2px] hidden md:block bg-[#8A8AA033]" />
              <p
                className="  text-center text-base cursor-pointer hover:font-semibold"
                onClick={() => navigate("/register-customer")}
              >
                Register as Customer
              </p>
              <div className="w-[2px] hidden md:block bg-[#8A8AA033]" />
              <p
                className=" text-center text-base cursor-pointer hover:font-semibold"
                onClick={() => navigate("/resetpassword")}
              >
                Forgot Password
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
