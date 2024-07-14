import { Button, Typography } from "@material-tailwind/react";
import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useRegisterHook } from "../pages/hooks/useRegisterHook";
const FormSubmission = ({ isOpen, setIsOpen, data }) => {
  const registerHook = useRegisterHook();

  const handleSubmit = () => {
    registerHook.handleUpdateProfile(data, setIsOpen);

  }
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div
            className="relative m-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white font-sans text-base font-light leading-relaxed  antialiased shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div
                className="flex text-secondary justify-end text-2xl font-snormal cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <IoMdCloseCircle />
              </div>
              <div className="flex justify-center  items-center">
                <div className="shadow rounded-xl p-16">
                  <Typography className="text-center">
                    Are you sure you want to submit the form?
                  </Typography>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex items-center justify-between mt-8 w-[440px]">
                  <Button className="bg-white text-[#757575] border border-secondary  py-2 px-6 "
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-secondary  py-2 px-6 text-white"
                    onClick={() => handleSubmit()}
                  >
                    Submit
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormSubmission;
