import { Button, Input } from "@headlessui/react";
import LoginImg from "../../../assets/images/login.png";
import { useForm } from "react-hook-form";
import { useRegisterHook } from "../../hooks/useRegisterHook";
const LoginForm = () => {
  const registerHook = useRegisterHook();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
  registerHook.handleLogin(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className=" flex-1 overflow-auto">
      <div className="bg-secondary overflow-auto h-full flex justify-between gap-6 py-8 px-16">
        <div className="flex-1">
          <img src={LoginImg} alt="login" className="h-[95%] mx-auto" />
        </div>
        <div className="bg-white flex-[.5] rounded-[15px] p-10">
          <h2 className=" font-semibold text-[38px]">Login</h2>
          <p className="text-base mt-6">
            Please enter user name and password to Login for Name Tag
          </p>
          <Input
            className="mt-6 w-full rounded-xl p-4 bg-[#F6F7FB] outline-none "
            placeholder="User name"
            style={
              errors.username
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("username", { required: true })}
          />
          <Input
            className="mt-6 w-full rounded-xl p-4 bg-[#F6F7FB] outline-none "
            placeholder="Enter Password"
            type="password"
            style={
              errors.password
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("password", { required: true })}
          />
          <Button className="w-full mt-10 px-4 py-2 bg-secondary text-white text-[22px] font-semibold"
          type="submit"
          >
            LOGIN
          </Button>
          <div className="mt-6 flex justify-center gap-4">
            <p className=" text-[#8A8AA066] text-base">Register</p>
            <div className=" w-[2px] bg-[#8A8AA033]" />
            <p className=" text-[#8A8AA066] text-base">Forget Password</p>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
    </form>
  );
};

export default LoginForm;
