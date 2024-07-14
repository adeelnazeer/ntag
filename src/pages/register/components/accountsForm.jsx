/* eslint-disable react/prop-types */
import { Input } from "@headlessui/react";
import { Button, Checkbox, Radio, Typography } from "@material-tailwind/react";
import CountdownTimer from "../../../components/counter";
import { useRegisterHook } from "../../hooks/useRegisterHook";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import TickIcon from '../../../assets/images/tick.png'
import { useState } from "react";
const GetLabel = ({ name }) => {
  return (
    <label className="text-[14px] text-[#555] font-[500]">
      {name} <span className=" text-red-500">*</span>
    </label>
  );
};

const CompanyForm = ({
  register,
  errors,
  watch,
  setValue,
  Controller,
  control,
  setData
}) => {
  const registerData = useRegisterHook();
  const watchAllFields = watch();
  const [phone, setPhone] = useState();
  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center py-3">
        <Button className=" bg-secondary text-white">
          Corporate Account Registration
        </Button>
        <Typography className="text-[#555] text-base  font-semibold">
          Already have an account?{" "}
          <span className="text-secondary">Log in</span>
        </Typography>
      </div>
      <hr></hr>
      <div className="py-3">
        <Typography className="text-[#555] text-base  font-semibold">
          Account Information
        </Typography>
      </div>
      <hr></hr>

      <div>
        <GetLabel name="Company Name" />
        <div className="mt-2  flex items-center gap-2">
          <Input
            className="w-full rounded-xl px-4 py-2 bg-white outline-none "
            placeholder="Company name"
            style={
              errors?.company_name
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("company_name", { required: true })}
            onChange={(e) => {
              if (e.target.value?.length > 2) {
                registerData.verifyAccount({ company_name: e.target.value }, "company_name")
              }
              setValue("company_name", e.target.value, {
                shouldValidate: true,
                shouldDirty: true
              })
              setData(st => ({ ...st, company_name: e.target.value }))
            }}
          />
          {registerData?.state?.success?.company_name && watchAllFields?.company_name != "" &&
            <div>
              <img className="w-5" src={TickIcon} alt="" />
            </div>
          }
        </div>
        <p className=" text-right mt-1 text-[#FF0000]">{registerData?.state?.error?.company_name}</p>
      </div>
      <div >
        <GetLabel name="User Name" />
        <div className="mt-2  flex items-center gap-2">
          <Input
            className=" w-full rounded-xl px-4 py-2 bg-white outline-none "
            placeholder="User name"
            style={
              errors?.account_id
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("account_id", { required: true })}
            onChange={(e) => {
              if (e.target.value?.length > 2) {
                registerData.verifyAccount({ account_id: e.target.value }, "account_id")
              }
              setValue("account_id", e.target.value, {
                shouldValidate: true,
                shouldDirty: true
              })
            }}
          />
          {registerData?.state?.success?.account_id && watchAllFields?.account_id != "" &&
            <div>
              <img className="w-5" src={TickIcon} alt="" />
            </div>
          }
        </div>
        <p className=" text-right mt-1 text-[#FF0000]">{registerData?.state?.error?.account_id}</p>
      </div>
      <div>
        <label className="text-[14px] text-[#555] font-[500]">Email</label>
        <div className="mt-2  flex items-center gap-2">
          <Input
            className="w-full rounded-xl px-4 py-2 bg-white outline-none "
            placeholder="Email"
            style={{ border: "1px solid #8A8AA033" }}
            {...register("email")}
            onChange={(e) => {
              if (e.target.value?.length > 6) {
                registerData.verifyAccount({ email: e.target.value }, "email")
              }
              setValue("email", e.target.value, {
                shouldValidate: true,
                shouldDirty: true
              })
            }}
          />
          {registerData?.state?.success?.email &&
            <div>
              <img className="w-5" src={TickIcon} alt="" />
            </div>
          }
        </div>
        <p className=" text-right mt-1 text-[#FF0000]">{registerData?.state?.error?.email}</p>
      </div>
      <div>
        <GetLabel name="Password" />
        <Input
          className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
          placeholder="Password"
          type="password"
          {...register("password", {
            required: true,
          })}
          style={
            errors?.password
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
            errors?.confirm_password ||
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
      {/* className="w-full rounded-xl px-4 py-2 bg-white outline-none" */}
      <div>
        <GetLabel name="Phone Number" />
        <div className="mt-2  flex items-center gap-2">
          <div className="relative items-center flex w-full">
            <Controller
              name="phone_number"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <PhoneInput
                  className="w-full rounded-xl px-4 py-2 bg-white outline-none"
                  defaultCountry="ET"
                  international
                  countryCallingCodeEditable={false}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    setPhone(value);
                    if (value?.length > 9) {
                      registerData.verifyAccount({ phone_number: value }, "phone_number")
                    }
                  }}
                />
              )}
            />
            {registerData?.expirationTime ? (
              <CountdownTimer
                expirationTime={registerData?.expirationTime}
                onExpire={registerData?.handleExipre}
              />
            ) : (
              // watchAllFields?.msisdn && (
              <p
                size="sm"
                className="!absolute right-3 cursor-pointer text-sm rounded"
                onClick={() => registerData.handleGetOtp(phone)}
              >
                Get Code
              </p>
              // )
            )}
          </div>
          {registerData?.state?.success?.phone_number &&
            <div>
              <img className="w-5" src={TickIcon} alt="" />
            </div>
          }
        </div>
        <p className=" text-right mt-1 text-[#FF0000]">{registerData?.state?.error?.phone_number}</p>
      </div>

      <div>
        <GetLabel name="Verification Code" />
        <div className="relative mt-2  items-center flex w-full">
          <Input
            valueAsNumber
            className=" w-full rounded-xl px-4 py-2 bg-white outline-none "
            placeholder="Enter verification code"
            {...register("verification_code", {
              required: true,
              validate: (val) => {
                if (watch("verification_code") != val) {
                  return "Your OTP does not match";
                }
              },
            })}
            style={
              errors?.verification_code
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
          />
          {/* <p
            size="sm"
            className="!absolute right-3 cursor-pointer text-sm rounded"
            onClick={() => registerData.handleVerifyOtp(watchAllFields?.verification_code)}
          >
            Verify OTP
          </p> */}
        </div>
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
