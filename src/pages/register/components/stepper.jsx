import React, { useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import CompanyForm from "./accountsForm";
import ContactForm from "./contactForm";
import AccountForm from "./companyForm";
import { useForm, Controller } from "react-hook-form";
import { useRegisterHook } from "../../hooks/useRegisterHook";

export function MultiStepForm() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
  const registerHook = useRegisterHook();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null)
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setActiveStep(1);
  // };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({ msisdn: "" });

  const onSubmit = (data) => {
console.log(data,"data")
    if (activeStep == 0) {
      registerHook.handleRegister(data, setActiveStep, reset);
    }
    if (activeStep == 1) {
      setData(st => ({ ...st, data: data }))
      setOpen(true)
    }
    if (activeStep == 2) {
      registerHook.handleUpdateProfile(data);
    }

  };
  return (
    <form
      className="w-full  max-w-7xl mx-auto px-4 py-4 flex-1"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className=" max-w-3xl mx-auto mt-6 p-4 pb-8 bg-[#fff] rounded-[24px] shadow-sm">
        <div className={""}>
          {activeStep == 0 ? (
            <CompanyForm register={register} errors={errors} watch={watch} setValue={setValue}
              getValues={getValues} Controller={Controller} control={control}
              setData={setData}
         
            />
          ) : activeStep == 1 ? (
            <AccountForm register={register} errors={errors} watch={watch}
              data={data}
              open={open}
              setOpen={setOpen}
              setData={setData}
              setValue={setValue}
            
            />
          ) : (
            <ContactForm register={register} errors={errors} watch={watch} />
          )}
        </div>
        {activeStep == 0 ? (
          <div className="mt-10 flex  justify-center">
            <Button
              className=" w-[30%] bg-secondary"
              // onClick={() => setActiveStep(1)}
              type="submit"
            >
              Register
            </Button>
          </div>
        ) : (
          <div className="mt-10 gap-6 flex  justify-center">
            {activeStep == 2 && (
              <Button
                className=" w-[30%] bg-secondary"
                onClick={() => setActiveStep(1)}
              >
                Previous
              </Button>
            )}
            <Button
              className=" w-[30%] bg-secondary"
              // onClick={() => setActiveStep(2)}
              type="submit"
            >
              {activeStep == 2 ? "Finish" : "Submit"}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
