/* eslint-disable react/prop-types */
import React from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";

import { FaRegUser } from "react-icons/fa6";
import { MdContacts } from "react-icons/md";
import CompanyForm from "../../register/components/accountsForm";
import ContactForm from "../../register/components/contactForm";

export function MultiStepFormProfile({ watch, register, errors, setValue, getValues, Controller, control, setData, data }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  return (
    <div className="w-full md:px-24 px-4 py-4 flex-1">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step
          onClick={() => setActiveStep(0)}
          activeClassName=" bg-secondary"
          completedClassName=" bg-secondary"
        >
          <FaRegUser className="h-5 w-5" />
          <div className="absolute -bottom-[2.5rem] w-max text-center">
            <Typography
              className="text-[#555] md:text-base text-[12px]  font-semibold"
              color={activeStep === 0 ? "blue-gray" : "gray"}
            >
              Company Basic information
            </Typography>
          </div>
        </Step>
        <Step
          onClick={() => setActiveStep(1)}
          activeClassName=" bg-secondary"
          completedClassName=" bg-secondary"
        >
          <MdContacts className="h-5 w-5" />
          <div className="absolute -bottom-[2.5rem] md:w-max text-center">
            <Typography
              className="text-[#555] md:text-base text-[12px]  font-semibold"
              color={activeStep === 1 ? "blue-gray" : "gray"}
            >
              Contact Information
            </Typography>
          </div>
        </Step>
      </Stepper>
      <div className="md:mt-32 mt-16">
        {activeStep == 0 ? <CompanyForm register={register} errors={errors} watch={watch} setValue={setValue}
          getValues={getValues} Controller={Controller} control={control}
          setData={setData}

        /> : <ContactForm watch={watch}
          register={register}
          errors={errors}
          data={data}
        />}
      </div>
      <div className="mt-8 flex justify-between">
        <Button
          className=" bg-secondary"
          onClick={handlePrev}
          disabled={isFirstStep}
        >
          Prev
        </Button>
        <Button
          className=" bg-secondary"
          onClick={handleNext}
          disabled={isLastStep}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
