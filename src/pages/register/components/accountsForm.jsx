/* eslint-disable react/prop-types */
import { Input } from "@headlessui/react";
import { Button, Checkbox, Typography } from "@material-tailwind/react";
import CountdownTimer from "../../../components/counter";
import { useRegisterHook } from "../../hooks/useRegisterHook";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import TickIcon from '../../../assets/images/tick.png'
import { useState } from "react";
import { ConstentRoutes } from "../../../utilities/routesConst";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate()
  const [phone, setPhone] = useState();
  const handleKeyPress = (e, value, fieldName) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      registerData.verifyAccount({ [fieldName]: value }, fieldName);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between flex-col md:flex-row items-center py-3 md:gap-0 gap-6">
        <Button className=" bg-secondary text-white">
          Corporate Account Registration
        </Button>
        <Typography className="text-[#555] md:text-base text-[16px]  font-semibold">
          Already have an account?{" "}
          <span className="text-secondary cursor-pointer"
            onClick={() => navigate(ConstentRoutes.login)}
          >Log in</span>
        </Typography>
      </div>
      <hr></hr>
      <div className=" md:w-5/6 w-full mx-auto">
        <div className="py-3">
          <Typography className="text-[#555] md:text-base text-[16px]  font-semibold">
            Account Information
          </Typography>
        </div>
        <hr className="mt-3 mb-5"></hr>

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
                setValue("company_name", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true
                })
                setData(st => ({ ...st, company_name: e.target.value }))
              }}
              maxLength={50}
              onKeyDown={(e) => handleKeyPress(e, e.target.value, "company_name")}

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
              maxLength={50}
              style={
                errors?.account_id
                  ? { border: "1px solid red" }
                  : { border: "1px solid #8A8AA033" }
              }
              {...register("account_id", { required: true })}
              onChange={(e) => {

                setValue("account_id", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true
                })
              }}
              onKeyDown={(e) => handleKeyPress(e, e.target.value, "account_id")}

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
              maxLength={50}
              style={{ border: "1px solid #8A8AA033" }}
              {...register("email")}
              onChange={(e) => {
                setValue("email", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true
                })
              }}
              onKeyDown={(e) => handleKeyPress(e, e.target.value, "email")}

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
            maxLength={50}
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
            maxLength={50}
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
                    className="w-full rounded-xl px-4 py-2 border border-[#8A8AA033] bg-white outline-none"
                    defaultCountry="ET"
                    international
                    countryCallingCodeEditable={false}
                    value={field.value}
                    limitMaxLength={10}
                    countries={["ET"]}
                    onChange={(value) => {
                      field.onChange(value);
                      setPhone(value);
                    }}
                    onKeyDown={(e) => handleKeyPress(e, e.target.value, "phone_number")}

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
                  className="!absolute right-3  bg-[#f5f5f5] p-2 shadow-sm border border-[#8A8AA033] cursor-pointer text-xs font-medium rounded"
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
              maxLength={50}
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
            <div className=" flex items-center">
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
              <Typography className="text-sm cursor-pointer  leading-[40px] ">
                <span className="text-[#5B6AB0] hover:underline"
                  onClick={() => {
                    navigate(ConstentRoutes.termofuse)
                  }}
                >Term of Use </span> & <span className="text-[#5B6AB0] hover:underline"
                  onClick={() => {
                    navigate(ConstentRoutes.privacyPolicy)
                  }}
                > Privacy Policy</span>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;
