/* eslint-disable react/prop-types */
import { Input } from "@headlessui/react";
import { Typography } from "@material-tailwind/react";
import { useRegisterHook } from "../../hooks/useRegisterHook";

const GetLabel = ({ name }) => {
  return (
    <label className="md:text-base text-[16px]  text-[#555]">
      {name} <span className=" text-red-500">*</span>
    </label>
  );
};
const ContactForm = ({ register, errors, watch }) => {


  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      <div>
        <Typography className="text-[#555] md:text-base text-[16px]   font-semibold">
          Contact Information
        </Typography>
      </div>
      <div>
        <label className="md:text-base text-[16px]  text-[#555]">First Name</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="First Name"
          style={
            errors.contactf_name
              ? { border: "1px solid red" }
              : { border: "1px solid #8A8AA033" }
          }
          {...register("contactf_name", { required: true })}
        />
      </div>
      <div>
        <label className="md:text-base text-[16px]  text-[#555]">Last Name</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Last Name"
          style={
            errors.contactl_name
              ? { border: "1px solid red" }
              : { border: "1px solid #8A8AA033" }
          }
          {...register("contactl_name", { required: true })}
        />
      </div>
      <div>
        <label className="md:text-base text-[16px]  text-[#555]">City</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="City"
          style={
            errors.city
              ? { border: "1px solid red" }
              : { border: "1px solid #8A8AA033" }
          }
          {...register("city",)}
        />
      </div>
      <div>
        <label className="md:text-base text-[16px]  text-[#555]">Specific Address</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Specific Address"
          style={
            errors.address
              ? { border: "1px solid red" }
              : { border: "1px solid #8A8AA033" }
          }
          {...register("address",)}
        />
      </div>
    </div>
  );
};

export default ContactForm;
