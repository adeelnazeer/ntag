import React, { useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import CompanyForm from "./accountsForm";
import AccountForm from "./companyForm";
import FormSubmission from "../../../modals/form-submission";
import { useForm, Controller } from "react-hook-form";
import { useRegisterHook } from "../../hooks/useRegisterHook";
import { ConstentRoutes } from "../../../utilities/routesConst";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export function MultiStepForm() {
  const location = useLocation()
  const [activeStep, setActiveStep] = React.useState(location?.state?.step || 0);
  const registerHook = useRegisterHook();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null); // Stores documents from UploadBtn
  const [formSubmissionData, setFormSubmissionData] = useState(null); // Stores combined data for form submission
  const [step0Data, setStep0Data] = useState(null); // Store step 0 (registration) data
  const navigate = useNavigate()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({ msisdn: "", mode: "onChange" });

  // Handle going back to step 0 and restore form values
  const handlePreviousStep = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (activeStep === 1) {
      // Restore step 0 form values when going back if step0Data exists
      if (step0Data) {
        Object.keys(step0Data).forEach((key) => {
          // Don't restore passwords for security - user needs to re-enter them
          if (key !== 'password' && key !== 'confirm_password') {
            setValue(key, step0Data[key]);
          }
        });
      }
      // Always clear passwords when going back for security
      setValue('password', '');
      setValue('confirm_password', '');
      setActiveStep(0);
    }
  };

  const onSubmit = (values) => {
    if (activeStep == 0) {
      // Step 0: Check if OTP is verified before proceeding
      if (!registerHook.verified) {
        toast.error( "Please verify the OTP code first");
        return;
      }

      // OTP verified, proceed to save data
      // Use getValues() to explicitly get password values to ensure they're captured
      const currentPassword = getValues('password') || values.password;
      const currentConfirmPassword = getValues('confirm_password') || values.confirm_password;
      
      // Save all form data including passwords - explicitly set password fields
      const step0DataToSave = {
        ...values,
        password: currentPassword,
        confirm_password: currentConfirmPassword
      };
      
      // Verify password is not empty before saving
      if (!currentPassword || currentPassword.trim() === '') {
        console.error('Password is empty when saving step0Data');
      }
      
      setStep0Data(step0DataToSave);
      setActiveStep(1);
      // Clear password fields from form for security, but keep them in step0Data
      reset();
      setValue('password', '');
      setValue('confirm_password', '');
    }
    if (activeStep == 1) {
      // Step 1: Combine form values with document data and open modal
      // Validate that all three documents are uploaded
      const combinedData = {
        ...values, // Company form values (contact info, company details, etc.)
        ...(data || {}), // Document data from UploadBtn component (preserved separately)
      };

      // Check if all three required documents are uploaded (check from data state where documents are stored)
      const hasRegistrationLicense = data?.registration_license_url || data?.doc_url_0;
      const hasApplicationLetter = data?.application_letter_url || data?.doc_url_1;
      const hasTradeLicense = data?.trade_license_url;

      if (!hasRegistrationLicense || !hasApplicationLetter || !hasTradeLicense) {
        toast.error(t("register.uploadDocumentsRequired") || "Please upload all three required documents: Registration License, Application Letter, and Trade License");
        return;
      }
      
      const allFormData = {
        step0Data, // Registration data (phone, verification_code, etc.)
        step1Data: combinedData, // Company data with documents
      };
      // Store combined data separately, don't overwrite data (which contains documents)
      setFormSubmissionData(allFormData);
      setOpen(true);
    }
  };

  // handleProfileSubmit and other handlers are now removed as they're handled in form-submission modal

  return (
    <>
      <form
        className="w-full max-w-7xl mx-auto px-4 py-4 flex-1"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="max-w-3xl mx-auto mt-6 p-4 pb-8 bg-[#fff] rounded-[24px] shadow-sm">
          <div className={""}>
            {activeStep == 0 ? (
              <CompanyForm
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                getValues={getValues}
                Controller={Controller}
                control={control}
                setData={setData}
                registerData={registerHook}
              />
            ) : (
              <AccountForm
                register={register}
                errors={errors}
                watch={watch}
                data={data}
                setOpen={setOpen}
                setData={setData}
                setValue={setValue}
                control={control}
              />
            )}
          </div>
          {activeStep == 0 ? (
            <div className="mt-10 flex justify-center">
              <Button
                className=" bg-secondary"
                type="submit"
                disabled={Object.entries(registerHook?.state?.error)?.length > 0}
              >
                {t("common.form.registerBtn")}
              </Button>
            </div>
          ) : (
            <div className="mt-10 gap-6 flex justify-center">
              <Button
                className=" bg-secondary"
                onClick={handlePreviousStep}
                type="button"
              >
                {t("common.form.previousBtn")}
              </Button>
              <Button
                className=" bg-secondary"
                type="submit"
              >
                {t("common.form.submit")}
              </Button>
            </div>
          )}
          {activeStep == 0 &&
            <div className="mt-3">
              <Typography className="text-[#555] text-center md:text-base text-[16px] font-semibold">
                <span> {t("common.form.alreadyAccount")}</span>

                {" "}
                <span
                  className="text-secondary cursor-pointer"
                  onClick={() => navigate(ConstentRoutes.login)}
                >
                  {t("login.login")}
                </span>
              </Typography>
            </div>
          }
        </div>
      </form>
      {/* Form Submission Modal - shown when step 1 submits */}
      {open && (
        <FormSubmission
          isOpen={open}
          setIsOpen={setOpen}
          data={formSubmissionData}
          setActiveStep={setActiveStep}
        />
      )}
    </>
  );
}