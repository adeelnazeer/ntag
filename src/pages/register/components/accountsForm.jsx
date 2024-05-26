/* eslint-disable react/prop-types */
import { Input } from "@headlessui/react";
import { Checkbox, Radio, Typography } from "@material-tailwind/react";
import CountdownTimer from "../../../components/counter";
import { useRegisterHook } from "../../hooks/useRegisterHook";

const GetLabel = ({ name }) => {
  return (
   
    <label className="text-base text-[#555]">
      {name} <span className=" text-red-500">*</span>
    </label>
  );
};

const CompanyForm = ({ register, errors, watch }) => {
  const registerData = useRegisterHook();
  const watchAllFields = watch();
 
  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      <div>
        <Typography className="text-[#555] text-base  font-semibold">
          Account Information
        </Typography>
      </div>
      <div className="flex items-center  justify-between rounded-xl mt-3 text-[#555]">
        <div className=" flex items-start">
          <Radio />
          <Typography className="text-xs leading-[40px] ">
            Individual Account
          </Typography>
        </div>
        <div className=" flex items-start">
          <Radio checked />
          <Typography className="text-xs leading-[40px] ">
            Bussiness Account
          </Typography>
        </div>
      </div>
      <div>
        <GetLabel name="Company Name" />
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Company name"
          style={
            errors.company_name
              ? { border: "1px solid red" }
              : { border: "1px solid #8A8AA033" }
          }
          {...register("company_name", { required: true })}
        />
      </div>
      <div>
        <GetLabel name="User Name" />
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="User name"
          style={
            errors.account_id
              ? { border: "1px solid red" }
              : { border: "1px solid #8A8AA033" }
          }
          {...register("account_id", { required: true })}
        />
      </div>
      <div>
        <label className="text-base text-[#555]">Email</label>
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Email"
          style={{ border: "1px solid #8A8AA033" }}
          {...register("email")}
        />
      </div>
      <div>
        <GetLabel name="Passward" />
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Password"
          type="password"
          {...register("password", {
            required: true,
          })}
          style={
            errors.password
              ? { border: "1px solid red" }
              : { border: "1px solid #8A8AA033" }
          }
        />
      </div>
      <div>
        <GetLabel name="Confirm Password" />
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Confirm Password"
          type="password"
          style={
            errors.confirm_password ||
              watchAllFields?.password != watchAllFields?.confirm_password
              ? { border: "1px solid red" }
              : { border: "1px solid #8A8AA033" }
          }
          {...register("confirm_password", {
            required: true,
            validate: (val) => {
              if (watch("confirm_password") != val) {
                return "Your passwords do no match";
              }
            },
          })}
        />
      </div>
      <div>
        <GetLabel name="Phone Number" />
        <div className="relative mt-2  items-center flex w-full">
          <Input
            type="text"
            label="verification code"
            placeholder="Phone number"
            className="w-full rounded-xl px-4 py-2 bg-white outline-none "
            containerProps={{
              className: "min-w-0",
            }}
            {...register("msisdn", { required: true })}
            style={
              errors.msisdn ? { border: "1px solid red" } : { border: "1px solid #8A8AA033" }
            }
          />
          {registerData?.expirationTime ? (
            <CountdownTimer
              expirationTime={registerData?.expirationTime}
              onExpire={registerData?.handleExipre}
            />
          ) : (
            watchAllFields?.msisdn && (
              <p
                size="sm"
                className="!absolute right-3 cursor-pointer text-sm rounded"
                onClick={() =>
                  registerData.handleGetOtp(watchAllFields?.msisdn)
                }
              >
                Get Code
              </p>
            )
          )}
        </div>
      </div>

      <div>
        <GetLabel name="Verification Code" />
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Enter verification code"
          type="number"
          {...register("verification_code", {
            required: true,
          })}
          style={
            errors.verification_code
              ? { border: "1px solid red" }
              : { border: "1px solid #8A8AA033" }
          }
        />
      </div>

      <div className="col-span-2">
        <div className=" py-3 rounded-xl mt-3 text-[#555]">
          <Typography className="font-normal text-[#555] text-base">
            Term of Services
          </Typography>
          <div className=" flex items-start">
            <Checkbox
              {...register("term", {
                required: true,
              })}
              style={
                errors.term
                  ? { border: "1px solid red" }
                  : { border: "1px solid #8A8AA033" }
              }
            />
            <Typography className="text-sm text-[#00000066] leading-[40px] ">
              I hereby confirm that the information above including information
              provided at the time of registration of this telecom cloud
              account, is complete, truthful and accurate, and will promptly
              provide telecom cloud with writen notice of any updates there to.
              I consent to the collection, use storage and disclosure of this
              information for the purposes of risk control and compliance with{" "}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;
