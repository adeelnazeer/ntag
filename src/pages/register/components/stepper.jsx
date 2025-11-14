import React, { useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import CompanyForm from "./accountsForm";
import ContactForm from "./contactForm";
import AccountForm from "./companyForm";
import { useForm, Controller } from "react-hook-form";
import { useRegisterHook } from "../../hooks/useRegisterHook";
import { useAppSelector } from "../../../redux/hooks";
import APICall from "../../../network/APICall";
import EndPoints from "../../../network/EndPoints";
import { ConstentRoutes } from "../../../utilities/routesConst";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export function MultiStepForm() {
  const location = useLocation()
  const [activeStep, setActiveStep] = React.useState(location?.state?.step || 0);
  const registerHook = useRegisterHook();
  const [showDocumentChoice, setShowDocumentChoice] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const navigate = useNavigate()
  const { t } = useTranslation()

  // Get customerId from Redux
  const customerId = useAppSelector(state => state.user.customerId);

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

  const onSubmit = (values) => {
    if (activeStep == 0) {
      registerHook.handleRegister(values, setActiveStep, reset);
    }
    if (activeStep == 1) {
      setData(st => ({ ...st, data: values }));
      if (!data?.trade_license_url || !data?.application_letter_url || !data?.registration_license_url) {
        toast.error("Please upload all required documents to complete your registration.")
        return
      }
      setOpen(true);
    }
    if (activeStep == 2) {
      registerHook.handleUpdateProfile(values);
    }
  };

  const handleProfileSubmit = async (formData) => {
    // Get ID from Redux instead of localStorage
    const id = customerId || localStorage.getItem("id");

    if (!id) {
      console.error("Customer ID not found");
      return;
    }

    const uploadDocumentPayload = {
      doc_type1: formData?.docType_0,
      doc_url1: formData?.doc_url_0,
      doc_url2: formData?.doc_url_1,
      doc_name1: formData?.docFileName_0,
      doc_name2: formData?.docFileName_1,
      doc_type2: formData?.docType_1,
    };

    // Document validation
    const hasAnyDocument = Object.values(uploadDocumentPayload).some(value =>
      value !== null && value !== undefined && value !== '');

    const hasAllRequiredFields = (prefix) => {
      const required = [
        `doc_type${prefix}`,
        `doc_url${prefix}`,
        `doc_name${prefix}`
      ];
      return required.every(field =>
        uploadDocumentPayload[field] !== null &&
        uploadDocumentPayload[field] !== undefined &&
        uploadDocumentPayload[field] !== ''
      );
    };

    if (hasAnyDocument && (!hasAllRequiredFields('1') || !hasAllRequiredFields('2'))) {
      setShowDocumentChoice(true);
      return;
    }

    try {
      const res = await APICall(
        "post",
        uploadDocumentPayload,
        `${EndPoints?.customer?.uploadDocument}/${id}`,
        null,
        true
      );

      if (res?.success) {
        registerHook.handleProfileUpdate(formData?.data, id);
      } else {
        setShowDocumentChoice(true);
      }
    } catch (err) {
      console.error("Document upload error:", err);
      setShowDocumentChoice(true);
    }
  };

  const handleUploadDocumentChoice = () => {
    setShowDocumentChoice(false);
    setActiveStep(1);
  };

  const handleProceedChoice = () => {
    setShowDocumentChoice(false);

    // Get ID from Redux instead of localStorage
    const id = customerId || localStorage.getItem("id");

    if (!id) {
      console.error("Customer ID not found");
      return;
    }

    registerHook.handleProfileUpdate(data?.data, id);
  };

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
            ) : activeStep == 1 ? (
              <AccountForm
                register={register}
                errors={errors}
                watch={watch}
                data={data}
                open={open}
                setOpen={setOpen}
                setData={setData}
                setValue={setValue}
                setActiveStep={setActiveStep}
                control={control}
              />
            ) : (
              <ContactForm register={register} errors={errors} watch={watch} />
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
              {activeStep == 2 && (
                <Button
                  className=" bg-secondary"
                  onClick={() => setActiveStep(1)}
                >
                  {t("common.form.previousBtn")}
                </Button>
              )}
              <Button
                className=" bg-secondary"
                type="submit"
              >
                {activeStep == 2 ? t("common.form.finish") : t("common.form.submit")}
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
    </>
  );
}