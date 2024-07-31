/* eslint-disable react/prop-types */
import { Input } from "@headlessui/react";
import UploadBtn from "../../../components/uploadBtn";
import { Button, Typography } from "@material-tailwind/react";
import { useRegisterHook } from "../../hooks/useRegisterHook";
import FormSubmission from "../../../modals/form-submission";
import { useState } from "react";

const GetLabel = ({ name }) => {
  return (
    <label className="md:text-base text-[16px]  text-[#555]">
      {name} <span className=" text-red-500">*</span>
    </label>
  );
};
const AccountForm = ({ register, errors, watch, data, setOpen, open, setData }) => {

  return (
    <>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center py-3 md:gap-0 gap-6">
          <Button className=" bg-secondary text-white">
            Company Information
          </Button>
          <Typography className="text-[#555] md:text-base text-[16px]  font-semibold">
            Already have an account?{" "}
            <span className="text-secondary">Step 2 of 2</span>
          </Typography>
        </div>

        <hr></hr>
        <div className=" md:w-5/6 w-full mx-auto">

          <div className="mb-3">
            <Typography className="text-[#555] md:text-base text-[16px]  font-semibold">
              Contact Information
            </Typography>
          </div>
          <div className="mb-3">
            <GetLabel name="First Name" />
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
          <div className="mb-3">
            <GetLabel name="Last Name" />
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
          <div className="mb-3">
            <GetLabel name="Contact Number" />
            <Input
              className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
              placeholder="Contact Number"
              style={
                errors.contact_no
                  ? { border: "1px solid red" }
                  : { border: "1px solid #8A8AA033" }
              }
              {...register("contact_no", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-4 max-w-3xl mx-auto mt-8">
            <div>
              <Typography className="text-[#555] md:text-base text-[16px]   font-semibold">
                Company Basic Information
              </Typography>
            </div>
            <div>
              <GetLabel name="Comapny Name" />
              <Input
                className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
                placeholder="Comapny Name"
                value={data?.company_name}
                disabled
                style={
                  errors.company_name
                    ? { border: "1px solid red" }
                    : { border: "1px solid #8A8AA033" }
                }
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
                errors.document_name1 ? { border: "1px solid red" } : { border: "" }
              }
            >
              <UploadBtn setIsOpen={setOpen} register={register}
                setData={setData}
              />
              {/* <Button
          className="flex items-center bg-secondary hover:bg-secondary rounded-lg text-white text-base px-5 py-3 outline-none w-max cursor-pointer"
          onClick={() => setOpen(true)}
        >
          Upload
        </Button> */}
            </div>

            <FormSubmission isOpen={open} setIsOpen={setOpen}
              data={data}
              watch={watch}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountForm;
