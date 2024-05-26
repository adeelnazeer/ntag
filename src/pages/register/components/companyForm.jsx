import { Input } from "@headlessui/react";
import UploadBtn from "../../../components/uploadBtn";
import { Typography } from "@material-tailwind/react";
import { useRegisterHook } from "../../hooks/useRegisterHook";

const GetLabel = ({ name }) => {
  return (
    <label className="text-base text-[#555]">
      {name} <span className=" text-red-500">*</span>
    </label>
  );
};
const AccountForm = ({ register, errors,watch }) => {
  const watchAllFields = watch();
  const updateProfile=useRegisterHook()



  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      <div>
        <Typography className="text-[#555] text-base  font-semibold">
          Company Information
        </Typography>
      </div>
      <div>
        <GetLabel name="Company Name" />
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Company Name"
          value={watchAllFields.company_name}
          style={
            errors.company_name
              ? { border: "1px solid red" }
              : { border: "1px solid #8A8AA033" }
          }
          // {...register("company_name", { required: true })}
        />
      </div>
      <div>
        <GetLabel name="Industry" />
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Industry"
          style={
            errors.comp_industry
              ? { border: "1px solid red" }
              : { border: "1px solid #8A8AA033" }
          }
          {...register("comp_industry", { required: true })}
        />
      </div>
      <div>
        <GetLabel name="State/Province" />
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="State/Province"
          style={
            errors.comp_state
              ? { border: "1px solid red" }
              : { border: "1px solid #8A8AA033" }
          }
          {...register("comp_state", { required: true })}
        />
      </div>
      <div>
        <GetLabel name="City" />

        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="City"
          style={
            errors.comp_city
              ? { border: "1px solid red" }
              : { border: "1px solid #8A8AA033" }
          }
          {...register("comp_city", { required: true })}
        />
      </div>
      <div>
        <GetLabel name="Specific Address" />
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Address"
          style={
            errors.comp_addr
              ? { border: "1px solid red" }
              : { border: "1px solid #8A8AA033" }
          }
          {...register("comp_addr", { required: true })}
        />
      </div>
      <div className="text-base text-[#555]">
        <GetLabel name="Business Registration/TIN Number" />

        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Business Registration/TIN Number"
          style={
            errors.comp_reg_no
              ? { border: "1px solid red" }
              : { border: "1px solid #8A8AA033" }
          }
          {...register("comp_reg_no", { required: true })}
        />
      </div>
      <div
        className="col-span-2 mt-4"
        style={
          errors.document_name1
            ? { border: "1px solid red" }
            : { border: "" }
        }
      >
        <UploadBtn register={register} />
      </div>
    </div>
    // <div className="grid grid-cols-2 gap-4">
    //   <div>
    //     <label className="text-base text-[#555]">Company Name</label>
    //     <Input
    //       className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
    //       placeholder="Company Name"
    //       style={{ border: "1px solid #8A8AA033" }}
    //     />
    //   </div>
    //   <div>
    //     <label className="text-base text-[#555]">Industry</label>
    //     <Input
    //       className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
    //       placeholder="User name"
    //       style={{ border: "1px solid #8A8AA033" }}
    //     />
    //   </div>
    //   <div>
    //     <label className="text-base text-[#555]">State/Province</label>
    //     <Input
    //       className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
    //       placeholder="User name"
    //       style={{ border: "1px solid #8A8AA033" }}
    //     />
    //   </div>
    //   <div>
    //     <label className="text-base text-[#555]">City</label>
    //     <Input
    //       className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
    //       placeholder="User name"
    //       style={{ border: "1px solid #8A8AA033" }}
    //     />
    //   </div>
    //   <div>
    //     <label className="text-base text-[#555]">Specific Address</label>
    //     <Input
    //       className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
    //       placeholder="User name"
    //       style={{ border: "1px solid #8A8AA033" }}
    //     />
    //   </div>
    //   <div className="text-base text-[#555]">
    //     <label>Business Registration/TIN Number</label>
    //     <Input
    //       className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
    //       placeholder="User name"
    //       style={{ border: "1px solid #8A8AA033" }}
    //     />
    //   </div>
    //   <div className="col-span-2 mt-4">
    //     <UploadBtn />
    //   </div>

    // </div>
  );
};

export default AccountForm;
