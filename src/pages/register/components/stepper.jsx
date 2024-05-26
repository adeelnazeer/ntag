import React from "react";
import { Button } from "@material-tailwind/react";
import CompanyForm from "./accountsForm";
import ContactForm from "./contactForm";
import AccountForm from "./companyForm";
import { useForm } from "react-hook-form";
import { useRegisterHook } from "../../hooks/useRegisterHook";

export function MultiStepForm() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
  const registerHook = useRegisterHook();
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setActiveStep(1);
  // };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (activeStep == 0) {
      registerHook.handleRegister(data, setActiveStep,reset);
    }
    if (activeStep == 1) {
      setActiveStep(2)

    }if(activeStep == 2 ){
      registerHook.handleUpdateProfile(data);
    }

  };
  return (
    <form
      className="w-full  max-w-7xl mx-auto px-4 py-4 flex-1"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* {activeStep != 0 && (
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
                Account Information
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
          <Step
            onClick={() => setActiveStep(2)}
            activeClassName=" bg-secondary"
            completedClassName=" bg-secondary"
          >
            <MdManageAccounts className="h-5 w-5" />
            <div className="absolute -bottom-[2.5rem] w-max text-center">
              <Typography
                className="text-[#555] text-base  font-semibold"
                color={activeStep === 2 ? "blue-gray" : "gray"}
              >
                Company Information
              </Typography>
            </div>
          </Step>
        </Stepper>
      )} */}
      <div className={"mt-6"}>
        {activeStep == 0 ? (
          <CompanyForm register={register} errors={errors} watch={watch} />
        ) : activeStep == 1 ? (
          <AccountForm register={register} errors={errors} watch={watch}/>
        ) : (
          <ContactForm register={register} errors={errors} watch={watch}/>
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
            {activeStep == 2 ? "Finish" : "Next"}
          </Button>
        </div>
      )}
    </form>
  );
}
