/* eslint-disable react/prop-types */
import { Input } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useRegisterHook } from "../../hooks/useRegisterHook";

const CompanyInfo = ({ profileData }) => {
  const registerData = useRegisterHook();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: profileData });
  const onSubmit = (data) => {
    registerData.handleUpdateUserInfo({
      comp_name: data?.comp_name,
      username: data?.username,
      email: data?.email,
      comp_industry: data?.comp_industry,
      comp_state: data?.comp_state,
      comp_city: data?.comp_city,
      comp_addr: data?.comp_addr,
      comp_reg_no: data?.comp_reg_no,
      phone_number: data?.phone_number
    });

  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-10 grid max-w-3xl mx-auto md:grid-cols-2 grid-cols-1 gap-6">
        <div>
          <label className="md:text-base text-[16px]  text-[#232323]">
            Comapny Name
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-[#8080801f] outline-none "
            style={
              errors?.comp_name
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            readOnly
            {...register("comp_name", { required: true })}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px]  text-[#232323]">
            User Name
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-[#8080801f] outline-none "
            readOnly
            style={
              errors.username
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("username", { required: true })}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px]  text-[#232323]">
            Email
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-[#8080801f] outline-none "
            readOnly
            style={
              errors.email
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("email", { required: true })}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px]  text-[#232323]">
            Industry
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
            maxLength={20}
            style={
              errors.comp_industry
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("comp_industry", { required: true })}
          />
        </div>

        <div>
          <label className="md:text-base text-[16px]  text-[#232323]">
            State/Province
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
            maxLength={20}
            style={
              errors.comp_state
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("comp_state", { required: true })}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px]  text-[#232323]">
            City
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
            maxLength={20}
            style={
              errors.comp_city
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("comp_city", { required: true })}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px]  text-[#232323]">
            Specific Address
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
            maxLength={50}
            style={
              errors.comp_addr
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("comp_addr", { required: true })}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px]  text-[#232323]">
            Business Registration/NTN Number
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
            maxLength={15}
            style={
              errors.comp_reg_no
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("comp_reg_no", { required: true })}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px]  text-[#232323]">
            Phone Number
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-[#8080801f] outline-none "
            readOnly
            style={
              errors.phone_number
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("phone_number", { required: true })}
          />
        </div>
      </div>
      <div className="mt-10 text-center">
        <button className=" bg-secondary text-white font-medium px-10 py-3">
          Update Comapny Information
        </button>
      </div>
    </form>
  );
};

export default CompanyInfo;
