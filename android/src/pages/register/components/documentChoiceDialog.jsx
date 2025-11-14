/* eslint-disable react/prop-types */
import React from 'react';
import { Button, Typography } from "@material-tailwind/react";
import { IoMdCloseCircle } from "react-icons/io";

const DocumentChoiceDialog = ({ 
    isOpen, 
    onClose, 
    onUploadDocument, 
    onProceed 
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
        <div className="relative m-4 w-full max-w-sm rounded-lg bg-white  text-base font-light leading-relaxed antialiased shadow-2xl">
          <div className="p-6">
            <div className="flex justify-end">
              <IoMdCloseCircle 
                className="text-2xl text-secondary cursor-pointer" 
                onClick={onClose}
              />
            </div>
            
            <div className="mt-4 mb-6">
              <Typography className="text-center mb-4">
                Document upload was not successful. Would you like to try uploading documents again or proceed to dashboard?
              </Typography>
            </div>
  
            <div className="flex justify-center gap-4">
              <Button
                className="bg-white text-[#757575] border border-secondary px-6 py-2"
                onClick={onUploadDocument}
              >
                Upload Documents
              </Button>
              <Button
                className="bg-secondary text-white px-6 py-2"
                onClick={onProceed}
              >
                Proceed to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default DocumentChoiceDialog;