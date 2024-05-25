import React from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import CompanyForm from "../../register/components/accountsForm";
import ContactForm from "../../register/components/contactForm";
import { FaRegUser } from "react-icons/fa6";
import { MdContacts } from "react-icons/md";

export function MultiStepFormProfile() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  return (
    <div className="w-full px-24 py-4 flex-1">
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
              className="text-[#555] text-base  font-semibold"
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
          <div className="absolute -bottom-[2.5rem] w-max text-center">
            <Typography
              className="text-[#555] text-base  font-semibold"
              color={activeStep === 1 ? "blue-gray" : "gray"}
            >
              Contact Information
            </Typography>
          </div>
        </Step>
      </Stepper>
      <div className="mt-32">
        {activeStep == 0 ? <CompanyForm /> : <ContactForm />}
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
