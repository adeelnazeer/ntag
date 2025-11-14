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
import APICall from "../../../network/APICall";
import EndPoints from "../../../network/EndPoints";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation()
  const registerData = useRegisterHook();
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [industries, setIndustries] = useState([])
  const [regions, setRegions] = useState([])

  const handleValidation = (value, fieldName) => {
    // Only validate username, email, and phone_number
    if (['comp_reg_no', 'email', 'phone_number', "company_name"].includes(fieldName) && value && value.trim() !== '') {
      const cleanValue = value.replace(/\s/g, "").replace(/^\+/, "");
      registerData.verifyAccount({ [fieldName]: cleanValue }, fieldName);
    }
  };
  const getIndustries = () => {
    APICall("get", null, EndPoints.customer.getIndustries)
      .then(res => {
        if (res?.success) {
          setIndustries(res?.data)
        } else {
          setIndustries([])
        }
      })
      .catch(err => console.log("err", err));
  }
  const getRegions = () => {
    APICall("get", null, EndPoints.customer.getRegions)
      .then(res => {
        if (res?.success) {
          setRegions(res?.data)
        }
        else {
          setRegions([])
        }
      })
      .catch(err => console.log("err", err));
  }

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
    getIndustries()
    getRegions()
  }, []);

  const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return false;
    const cleanNumber = phoneNumber.replace('+251', '').replace(/\s/g, '');
    return cleanNumber.startsWith('9') && cleanNumber.length === 9;
  };

  console.log({ watchAll })

  return (
    <>
      <style>{autofillStyle}</style>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center py-3 md:gap-0 gap-6">
          <Button className=" bg-secondary text-white">
            {t("compInfo")}
          </Button>
          <Typography className="text-[#555] md:text-base text-[16px]  font-semibold">
            <span className="text-secondary">Step 2 of 2</span>
          </Typography>
        </div>

        <hr></hr>
        <div className=" md:w-5/6 w-full mx-auto">

          <div className="mb-3">
            <Typography className="text-[#555] md:text-base text-[16px]  font-semibold">
              {t("contactInfo")}
            </Typography>
          </div>

          {/* First Name Field */}
          <div className="mb-3">
            <GetLabel name={t("common.form.firstName")} />
            <Input
              className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
              placeholder={t("common.form.firstName")}
              maxLength={15}
              style={
                errors.contactf_name
                  ? { border: "1px solid red" }
                  : { border: "1px solid #8A8AA033" }
              }
              {...register("contactf_name", {
                required: t("common.form.errors.firstName")
              })}
            />
            {errors.contactf_name && (
              <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.contactf_name.message}</p>
            )}
          </div>

          {/* Father's Name Field (replaced Last Name) */}
          <div className="mb-3">
            <GetLabel name={t("common.form.fatherName")} />
            <Input
              className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
              placeholder={t("common.form.fatherName")}
              maxLength={15}
              style={
                errors.contactl_name
                  ? { border: "1px solid red" }
                  : { border: "1px solid #8A8AA033" }
              }
              {...register("contactl_name", {
                required: t("common.form.errors.fatherName")
              })}
            />
            {errors.contactl_name && (
              <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.contactl_name.message}</p>
            )}
          </div>

          {/* Contact Number Field */}
          <div className="mb-3">
            <label className="md:text-base text-[16px] text-[#232323]">
              {t("common.form.contactNo")} <span className="text-red-500">*</span>
            </label>
            <Controller
              name="contact_no"
              control={control}
              defaultValue=""
              rules={{
                required: t("common.form.mobileError"),
                validate: (value) =>
                  validatePhoneNumber(value) || t("common.form.mobileError"),
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
                {t("common.compBasicInfo")}
              </Typography>
            </div>

            {/* Company Name Field (read-only) */}
            <div>
              <GetLabel name={t("common.form.companyName")} />
              <Input
                className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
                placeholder={t("common.form.companyName")}
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
              <GetLabel name={t("common.form.industry")} />
              <select
                className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none border border-[#8A8AA033]"
                style={
                  errors.corp_industry_id
                    ? { border: "1px solid red" }
                    : { border: "1px solid #8A8AA033" }
                }
                {...register("corp_industry_id", {
                  required: "Industry is required"
                })}
                onChange={(e) => {
                  const filterInd = industries?.find(x => x?.id == e.target.value)
                  setValue("comp_industry", filterInd?.industry);
                }}
              >
                <option value="">{t("common.form.selectIndustry")}</option>
                {industries?.map(single =>
                  <option key={single?.id} value={single?.id}>{single?.industry || ""}</option>
                )}
              </select>
              {errors.corp_industry_id && (
                <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.corp_industry_id.message}</p>
              )}
            </div>

            {/* Region Dropdown (replaced State/Province) */}
            <div>
              <GetLabel name={t("common.form.region")} />
              <select
                className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none border border-[#8A8AA033]"
                style={
                  errors.corp_region_id
                    ? { border: "1px solid red" }
                    : { border: "1px solid #8A8AA033" }
                }
                {...register("corp_region_id", {
                  required: t("common.form.errors.region")
                })}
                onChange={(e) => {
                  const filterReg = regions?.find(x => x?.id == e.target.value)
                  setValue("comp_state", filterReg?.region);
                }}
              >
                <option value="">{t("common.form.selectRegion")}</option>
                {regions?.map(single =>
                  <option key={single?.id} value={single?.id}>{single?.region || ""}</option>
                )}
              </select>
              {errors.corp_region_id && (
                <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.corp_region_id.message}</p>
              )}
            </div>

            {/* City Field */}
            <div>
              <GetLabel name={t("common.form.city")} />
              <Input
                className="mt-2 w-full rounded-xl text-black px-4 py-2 bg-white outline-none "
                placeholder={t("common.form.city")}
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
                  required: t("common.form.errors.city"),
                  pattern: {
                    value: /^[A-Za-z\s]+$/, // Only letters and spaces
                    message: t("common.form.errors.numberOnly")
                  }
                })}
              />
              {errors.comp_city && (
                <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.comp_city.message}</p>
              )}
            </div>

            {/* Specific Address Field */}
            <div>
              <GetLabel name={t("common.form.address")} />
              <Input
                className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none "
                placeholder={t("common.form.address")}
                maxLength={100}
                style={
                  errors.comp_addr
                    ? { border: "1px solid red" }
                    : { border: "1px solid #8A8AA033" }
                }
                {...register("comp_addr", {
                  required: t("common.form.errors.address")
                })}
              />
              {errors.comp_addr && (
                <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.comp_addr.message}</p>
              )}
            </div>

            {/* TIN Number Field with improved validation - Ensure error message shows */}
            <div className="text-base text-[#555]">

              <GetLabel name={t("common.form.tinNumber")} />
              <div className=" flex items-center gap-2">
                <div className="w-full">
                  <Input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none"
                    placeholder={t("common.form.tinNumber")}
                    maxLength={10}
                    style={
                      errors.comp_reg_no
                        ? { border: "1px solid red" }
                        : { border: "1px solid #8A8AA033" }
                    }
                    onKeyDown={(e) => {
                      const key = e.key;
                      const ctrl = e.ctrlKey || e.metaKey;
                      const allowed = [
                        "Backspace", "Delete", "Tab", "Enter", "Escape",
                        "ArrowLeft", "ArrowRight", "Home", "End"
                      ];
                      if (allowed.includes(key) || ctrl) return; // allow nav/shortcuts
                      if (!/^\d$/.test(key)) e.preventDefault(); // only digits
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const el = e.currentTarget;
                      const pasted = (e.clipboardData || window.clipboardData).getData("text") || "";
                      const digits = pasted.replace(/\D/g, "");
                      const start = el.selectionStart ?? el.value.length;
                      const end = el.selectionEnd ?? el.value.length;
                      const next = (el.value.slice(0, start) + digits + el.value.slice(end)).slice(0, 10);
                      el.value = next;
                      // Notify RHF about the programmatic change
                      el.dispatchEvent(new Event("input", { bubbles: true }));
                    }}
                    {...register("comp_reg_no", {
                      required: "Business Registration/TIN Number is required",
                      minLength: { value: 10, message: "TIN Number must be at least 10 digits" },
                      maxLength: { value: 10, message: "TIN Number cannot exceed 10 digits" },
                      pattern: {
                        value: /^\d{10}$/,
                        message: "TIN Number must contain only digits"
                      },
                      onBlur: (e) => handleBlur(e.target.value, "comp_reg_no"),
                      onChange: (e) => {
                        // sanitize any non-digit and enforce length on every change
                        const clean = e.target.value.replace(/\D/g, "").slice(0, 10);
                        if (clean !== e.target.value) e.target.value = clean;
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