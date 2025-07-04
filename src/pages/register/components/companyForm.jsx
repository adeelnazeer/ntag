/* eslint-disable react/prop-types */
import { Input } from "@headlessui/react";
import UploadBtn from "../../../components/uploadBtn";
import { Button, Typography } from "@material-tailwind/react";
import FormSubmission from "../../../modals/form-submission";
import PhoneInput from "react-phone-number-input";
import { validateEthiopianPhone } from "../../../utilities/validateEthiopianPhone";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRegisterHook } from "../../hooks/useRegisterHook";
import { Controller } from "react-hook-form";
import TickIcon from '../../../assets/images/tick.png';

// Apply CSS fix for autofill styling
const autofillStyle = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: #000 !important;
    -webkit-box-shadow: 0 0 0px 1000px white inset;
  }
`;

const GetLabel = ({ name }) => {
  return (
    <label className="md:text-base text-[16px]  text-[#555]">
      {name} <span className=" text-red-500">*</span>
    </label>
  );
};

const AccountForm = ({ register, errors, watch, data, setOpen, open, setData, control, setValue, setActiveStep }) => {
  const watchAll = watch();
  const location = useLocation()
  const registerData = useRegisterHook();
  const [isValidPhone, setIsValidPhone] = useState(false);

  const handleValidation = (value, fieldName) => {
    // Only validate username, email, and phone_number
    if (['comp_reg_no', 'email', 'phone_number', "company_name"].includes(fieldName) && value && value.trim() !== '') {
      const cleanValue = value.replace(/\s/g, "").replace(/^\+/, "");
      registerData.verifyAccount({ [fieldName]: cleanValue }, fieldName);
    }
  };

  const handleKeyPress = (e, value, fieldName) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      handleValidation(value, fieldName);
    }
  };

  // Handle field blur for validation
  const handleBlur = (value, fieldName) => {
    if (value && value.trim() !== '') {
      // For other fields, validate on blur
      handleValidation(value, fieldName);
    }
  };


  // Initialize phone with default value
  useEffect(() => {
    // Set a default phone number if none exists
    if (!data?.contact_no) {
      const defaultPhone = "+2519";
      setData(st => ({ ...st, contact_no: defaultPhone }));
      setValue("contact_no", defaultPhone);
    }
    if (!data?.comp_reg_no && location?.state?.comp_name) {
      setData(st => ({
        ...st,
        company_name: location.state.comp_name, // use consistent key
      }));
      setValue("company_name", location.state.comp_name);
    }
  }, []);

  const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return false;
    const cleanNumber = phoneNumber.replace('+251', '').replace(/\s/g, '');
    return cleanNumber.startsWith('9') && cleanNumber.length === 9;
  };

  return (
    <>
      <style>{autofillStyle}</style>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center py-3 md:gap-0 gap-6">
          <Button className=" bg-secondary text-white">
            Company Information for NameTAG Registration
          </Button>
          <Typography className="text-[#555] md:text-base text-[16px]  font-semibold">
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

          {/* First Name Field */}
          <div className="mb-3">
            <GetLabel name="First Name" />
            <Input
              className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
              placeholder="First Name"
              maxLength={15}
              style={
                errors.contactf_name
                  ? { border: "1px solid red" }
                  : { border: "1px solid #8A8AA033" }
              }
              {...register("contactf_name", {
                required: "First Name is required"
              })}
            />
            {errors.contactf_name && (
              <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.contactf_name.message}</p>
            )}
          </div>

          {/* Father's Name Field (replaced Last Name) */}
          <div className="mb-3">
            <GetLabel name="Father's Name" />
            <Input
              className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
              placeholder="Father's Name"
              maxLength={15}
              style={
                errors.contactl_name
                  ? { border: "1px solid red" }
                  : { border: "1px solid #8A8AA033" }
              }
              {...register("contactl_name", {
                required: "Father's Name is required"
              })}
            />
            {errors.contactl_name && (
              <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.contactl_name.message}</p>
            )}
          </div>

          {/* Contact Number Field */}
          <div className="mb-3">
            <label className="md:text-base text-[16px] text-[#232323]">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <Controller
              name="contact_no"
              control={control}
              defaultValue=""
              rules={{
                required: "Enter a 9-digit mobile number starting with 9.",
                validate: (value) =>
                  validatePhoneNumber(value) || "Enter a 9-digit mobile number starting with 9.",
              }}
              render={({ field }) => {
                useEffect(() => {
                  if (!field.value) {
                    field.onChange("+2519");
                    setData((prev) => ({ ...prev, contact_no: "+2519" }));
                  }
                }, []);

                return (
                  <PhoneInput
                    className="w-full rounded-xl px-4 py-2 border border-[#8A8AA033] bg-white outline-none"
                    defaultCountry="ET"
                    international
                    countryCallingCodeEditable={false}
                    limitMaxLength={true}
                    flagUrl={`https://flagcdn.com/w40/et.png`}
                    disabled={registerData?.expirationTime}
                    countries={["ET"]}
                    value={field.value}
                    onChange={(value) => {
                      // Update form state
                      field.onChange(value);

                      // Update your local state
                      setData((prev) => ({ ...prev, contact_no: value }));

                      // Optional: Reset success state
                      if (registerData?.state?.success?.contact_no) {
                        registerData.resetFieldValidation("contact_no");
                      }

                      // Optional: validate and set validity state
                      const isValid = validatePhoneNumber(value);
                      setIsValidPhone(isValid);
                    }}

                  />
                );
              }}
            />
            {(errors.contact_no || registerData?.state?.error?.contact_no) && (
              <p className="text-left mt-1 text-sm text-[#FF0000]">
                {errors.contact_no?.message || registerData?.state?.error?.contact_no}
              </p>
            )}
            {/* <PhoneInput
              className="w-full rounded-xl px-4 py-2 bg-white outline-none"
              defaultCountry="ET"
              international
              countryCallingCodeEditable={false}
              limitMaxLength={true}
              countries={["ET"]}
              value={data?.contact_no || "+2519"} // Set default if undefined
              style={{
                border: phoneError ? "1px solid red" : "1px solid #8A8AA033",
              }}
              onChange={(phone) => {
                const cleaned = phone?.replace(/\+251|\s/g, "");
                const isValid = cleaned?.length === 9 && validatePhone(phone);

                setData((st) => ({ ...st, contact_no: phone }));
                setValue("contact_no", phone);
                setPhoneError(!isValid);

              }}

            /> */}

          </div>

          <div className="flex flex-col gap-4 max-w-3xl mx-auto mt-8">
            <div>
              <Typography className="text-[#555] md:text-base text-[16px]   font-semibold">
                Company Basic Information
              </Typography>
            </div>

            {/* Company Name Field (read-only) */}
            <div>
              <GetLabel name="Company Name" />
              <Input
                className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
                placeholder="Company Name"
                maxLength={20}
                value={location?.state?.company_name || data?.company_name}
                disabled
                style={
                  errors.company_name
                    ? { border: "1px solid red" }
                    : { border: "1px solid #8A8AA033" }
                }
              />
            </div>

            {/* Industry Field */}
            <div>
              <GetLabel name="Industry" />
              <Input
                className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
                placeholder="Industry"
                maxLength={20}
                style={
                  errors.comp_industry
                    ? { border: "1px solid red" }
                    : { border: "1px solid #8A8AA033" }
                }
                {...register("comp_industry", {
                  required: "Industry is required"
                })}
              />
              {errors.comp_industry && (
                <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.comp_industry.message}</p>
              )}
            </div>

            {/* Region Dropdown (replaced State/Province) */}
            <div>
              <GetLabel name="Region" />
              <select
                className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none border border-[#8A8AA033]"
                style={
                  errors.comp_state
                    ? { border: "1px solid red" }
                    : { border: "1px solid #8A8AA033" }
                }
                {...register("comp_state", {
                  required: "Region is required"
                })}
              >
                <option value="">Select a region</option>
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Afar Region">Afar Region</option>
                <option value="Amhara Region">Amhara Region</option>
                <option value="Benishangul-Gumuz Region">Benishangul-Gumuz Region</option>
                <option value="Central Ethiopia Regional State">Central Ethiopia Regional State</option>
                <option value="Diredawa">Diredawa</option>

                <option value="Gambela Region">Gambela Region</option>
                <option value="Harari Region">Harari Region</option>
                <option value="Oromia Region">Oromia Region</option>
                <option value="Sidama Region">Sidama Region</option>
                <option value="Somali Region">Somali Region</option>
                <option value="South Ethiopia Regional State">South Ethiopia Regional State</option>
                <option value="South West Ethiopia Peoples' Region">South West Ethiopia Peoples' Region</option>
                <option value="Tigray Region">Tigray Region</option>
              </select>
              {errors.comp_state && (
                <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.comp_state.message}</p>
              )}
            </div>

            {/* City Field */}
            <div>
              <GetLabel name="City" />
              <Input
                className="mt-2 w-full rounded-xl text-black px-4 py-2 bg-white outline-none "
                placeholder="City"
                maxLength={20}
                style={
                  errors.comp_city
                    ? { border: "1px solid red" }
                    : { border: "1px solid #8A8AA033" }
                }
                onKeyDown={(e) => {
                  const isNumber = e.key >= '0' && e.key <= '9';
                  if (isNumber) {
                    e.preventDefault();
                  }
                }}
                {...register("comp_city", {
                  required: "City is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/, // Only letters and spaces
                    message: "Only letters are allowed"
                  }
                })}
              />
              {errors.comp_city && (
                <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.comp_city.message}</p>
              )}
            </div>

            {/* Specific Address Field */}
            <div>
              <GetLabel name="Specific Address" />
              <Input
                className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
                placeholder="Address"
                maxLength={100}
                style={
                  errors.comp_addr
                    ? { border: "1px solid red" }
                    : { border: "1px solid #8A8AA033" }
                }
                {...register("comp_addr", {
                  required: "Address is required"
                })}
              />
              {errors.comp_addr && (
                <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.comp_addr.message}</p>
              )}
            </div>

            {/* TIN Number Field with improved validation - Ensure error message shows */}
            <div className="text-base text-[#555]">

              <GetLabel name="Business Registration/TIN Number" />
              <div className=" flex items-center gap-2">
                <div className="w-full">
                  <Input
                    className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
                    placeholder="Business Registration/TIN Number"
                    maxLength={10}
                    style={
                      errors.comp_reg_no
                        ? { border: "1px solid red" }
                        : { border: "1px solid #8A8AA033" }
                    }
                    onBlur={(e) => handleBlur(e.target.value, "comp_reg_no")}
                    onKeyDown={(e) => handleKeyPress(e, e.target.value, "comp_reg_no")}
                    {...register("comp_reg_no", {
                      required: "Business Registration/TIN Number is required",
                      minLength: { value: 10, message: "TIN Number must be at least 10 digits" },
                      maxLength: { value: 10, message: "TIN Number cannot exceed 10 digits" },
                      pattern: {
                        value: /^\d{10,10}$/,
                        message: "TIN Number must contain only digits"
                      }
                    })}
                  />
                </div>
                {registerData?.state?.success?.comp_reg_no && !errors.comp_reg_no &&
                  <div>
                    <img className="w-5" src={TickIcon} alt="" />
                  </div>
                }

              </div>
              {/* Ensure TIN number error appears */}
              {(errors.comp_reg_no || registerData?.state?.error?.comp_reg_no) && (
                <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.comp_reg_no.message || registerData?.state?.error?.comp_reg_no}</p>
              )}
            </div>

            {/* Document Upload Section */}
            <div
              className="col-span-2 relative"
              style={
                errors.document_name1 ? { border: "1px solid red" } : { border: "" }
              }
            >
              <UploadBtn
                setIsOpen={setOpen}
                register={register}
                setData={setData}
                data={data}
                watch={watch}
                setValue={setValue}
              />
            </div>

            {/* Form Submission Modal */}
            <FormSubmission
              isOpen={open}
              setActiveStep={setActiveStep}
              setIsOpen={setOpen}
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