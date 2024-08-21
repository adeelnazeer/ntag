/* eslint-disable react/prop-types */
import { Input } from "@headlessui/react";
import { useForm } from "react-hook-form";

const ContactInfo = ({ profileData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: profileData });
  const onSubmit = (data) => {
    console.log({ data });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-10 grid max-w-3xl mx-auto md:grid-cols-2 grid-cols-1 gap-6">
        <div>
          <label className="md:text-base text-[16px]  text-[#232323]">
            First Name
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
            placeholder="First Name"
            style={
              errors?.contact_fname
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("contact_fname", { required: true })}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px]  text-[#232323]">
            Last Name
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
            placeholder="Last Name"
            style={
              errors.contact_lname
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("contact_lname", { required: true })}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px]  text-[#232323]">
            Email
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
            placeholder="Email"
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
            Contact Number
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
            placeholder="Contact No"
            style={
              errors.contact_no
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("contact_no", { required: true })}
          />
        </div>
      </div>
      <div className="mt-10 text-center">
        <button className=" bg-secondary text-white font-medium px-10 py-3">Update Contact Information</button>
      </div>
    </form>
  )
}

export default ContactInfo