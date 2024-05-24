import React from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import CompanyForm from "./companyForm";
import ContactForm from "./contactForm";
import AccountForm from "./accountForm";
// import {
//   CogIcon,
//   UserIcon,
//   BuildingLibraryIcon,
// } from "@heroicons/react/24/outline";

export function StepperWithContent() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  return (
    <div className="w-full px-24 py-4">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step onClick={() => setActiveStep(0)}>
          {/* <UserIcon className="h-5 w-5" /> */}
          <div className="absolute -bottom-[2.5rem] w-max text-center">
            <Typography
              className="text-[#555] text-base  font-semibold"
              color={activeStep === 0 ? "blue-gray" : "gray"}
            >
              Company Basic information
            </Typography>
          </div>
        </Step>
        <Step onClick={() => setActiveStep(1)}>
          {/* <CogIcon className="h-5 w-5" /> */}
          <div className="absolute -bottom-[2.5rem] w-max text-center">
            <Typography
              className="text-[#555] text-base  font-semibold"
              color={activeStep === 1 ? "blue-gray" : "gray"}
            >
              Contact Information
            </Typography>
          </div>
        </Step>
        <Step onClick={() => setActiveStep(2)} activeClassName="adeel">
          {/* <BuildingLibraryIcon className="h-5 w-5" /> */}
          <div className="absolute -bottom-[2.5rem] w-max text-center">
            <Typography
              className="text-[#555] text-base  font-semibold"
              color={activeStep === 2 ? "blue-gray" : "gray"}
            >
              Account Information
            </Typography>
          </div>
        </Step>
      </Stepper>
      <div className="mt-32">
        {activeStep == 0 ? (
          <CompanyForm />
        ) : activeStep == 1 ? (
          <ContactForm />
        ) : (
          <AccountForm />
        )}
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
