/* eslint-disable react/prop-types */
import { Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import DocumentChoiceDialog from "../pages/register/components/documentChoiceDialog";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import { ConstentRoutes } from "../utilities/routesConst";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { setUserData } from "../redux/userSlice";

const FormSubmission = ({ isOpen, setIsOpen, data, setActiveStep }) => {
  const [showDocumentChoice, setShowDocumentChoice] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsOpen(false);
    
    try {
      // Validate that all three documents are uploaded before proceeding
      const step1Data = data?.step1Data || {};
      // Check for documents (File objects or URLs)
      const hasRegistrationLicense = (step1Data?.registration_license_url && (step1Data.registration_license_url instanceof File || typeof step1Data.registration_license_url === 'string')) || step1Data?.doc_url_0;
      const hasApplicationLetter = (step1Data?.application_letter_url && (step1Data.application_letter_url instanceof File || typeof step1Data.application_letter_url === 'string')) || step1Data?.doc_url_1;
      const hasTradeLicense = step1Data?.trade_license_url && (step1Data.trade_license_url instanceof File || typeof step1Data.trade_license_url === 'string');

      if (!hasRegistrationLicense || !hasApplicationLetter || !hasTradeLicense) {
        toast.error("Please upload all three required documents: Registration License, Application Letter, and Trade License");
        setShowDocumentChoice(true);
        return;
      }

      // Step 1: Call register API with ALL data (step0Data + step1Data profile fields, excluding documents)
      const step0Data = data?.step0Data;
      if (!step0Data) {
        toast.error("Registration data is missing");
        return;
      }

      if (!step1Data || Object.keys(step1Data).length === 0) {
        toast.error("Company information is missing");
        return;
      }

      const otp = localStorage.getItem("otp");
      
      // Combine step0Data and step1Data for register API (exclude document files)
      const registerPayload = {
        ...step0Data, // Registration data (phone, verification_code, etc.)
        ...Object.keys(step1Data).reduce((acc, key) => {
          // Include all step1Data fields except document files
          if (!key.includes("_url") || !(step1Data[key] instanceof File)) {
            acc[key] = step1Data[key];
          }
          return acc;
        }, {}),
      };
      
      registerPayload.channel = "WEB";
      registerPayload.otp_id = otp;
      registerPayload.otp_code = step0Data?.verification_code;
      registerPayload.ntn = step1Data?.comp_reg_no;

      const registerRes = await APICall("post", registerPayload, EndPoints.customer.register);
      
      if (!registerRes?.success) {
        toast.error(registerRes?.message || "Registration failed");
        return;
      }

      // Store token and ID from registration response
      const id = registerRes?.data?.customer_account_id;
      const token = registerRes?.data?.token;
      localStorage.setItem("token", token);
      localStorage.setItem("id", id);
      localStorage.setItem("user", JSON.stringify(registerRes.data));

      // Step 2: Upload documents with profile update data included
      const documentFormData = new FormData();
      
      // Add documents (File objects)
      if (step1Data?.registration_license_url && step1Data.registration_license_url instanceof File) {
        documentFormData.append("registration_license_url", step1Data.registration_license_url);
        if (step1Data.registration_license_name) {
          documentFormData.append("registration_license_name", step1Data.registration_license_name);
        }
        if (step1Data.registration_license_type) {
          documentFormData.append("registration_license_type", step1Data.registration_license_type);
        }
      } 
      // Fall back to old field names if new ones aren't present
      else if (step1Data?.doc_url_0) {
        documentFormData.append("registration_license_url", step1Data.doc_url_0);
        if (step1Data.docFileName_0) {
          documentFormData.append("registration_license_name", step1Data.docFileName_0);
        }
        if (step1Data.docType_0) {
          documentFormData.append("registration_license_type", step1Data.docType_0);
        }
      }
      
      if (step1Data?.application_letter_url && step1Data.application_letter_url instanceof File) {
        documentFormData.append("application_letter_url", step1Data.application_letter_url);
        if (step1Data.application_letter_name) {
          documentFormData.append("application_letter_name", step1Data.application_letter_name);
        }
        if (step1Data.application_letter_type) {
          documentFormData.append("application_letter_type", step1Data.application_letter_type);
        }
      }
      // Fall back to old field names if new ones aren't present
      else if (step1Data?.doc_url_1) {
        documentFormData.append("application_letter_url", step1Data.doc_url_1);
        if (step1Data.docFileName_1) {
          documentFormData.append("application_letter_name", step1Data.docFileName_1);
        }
        if (step1Data.docType_1) {
          documentFormData.append("application_letter_type", step1Data.docType_1);
        }
      }
      
      if (step1Data?.trade_license_url && step1Data.trade_license_url instanceof File) {
        documentFormData.append("trade_license_url", step1Data.trade_license_url);
        if (step1Data.trade_license_name) {
          documentFormData.append("trade_license_name", step1Data.trade_license_name);
        }
        if (step1Data.trade_license_type) {
          documentFormData.append("trade_license_type", step1Data.trade_license_type);
        }
      }

      // Add all profile update fields to FormData (exclude document files and URLs)
      Object.keys(step1Data).forEach((key) => {
        // Skip document file objects and URLs
        if (!key.includes("_url") || !(step1Data[key] instanceof File)) {
          const value = step1Data[key];
          // Only append if value is not null, undefined, empty string, or a File object
          if (value !== null && value !== undefined && value !== "" && !(value instanceof File)) {
            documentFormData.append(key, value);
          }
        }
      });

      // Upload documents with profile data
      const uploadRes = await APICall(
        "post",
        documentFormData,
        `${EndPoints?.customer?.uploadDocument}/${id}`,
        null,
        true
      );
      
      if (uploadRes?.success) {
        toast.success(uploadRes?.message || "Registration completed successfully");
        dispatch(setUserData(uploadRes?.data || registerRes?.data));
        if (uploadRes?.data) {
          localStorage.setItem("user", JSON.stringify(uploadRes.data));
        }
        localStorage.removeItem("otp");
        navigate(ConstentRoutes.dashboard);
      } else {
        toast.error(uploadRes?.message || "Document upload failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err?.message || "Registration failed. Please try again.");
    }
  };
  
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div
            className="relative m-4 w-full max-w-sm rounded-lg bg-white  text-base font-light leading-relaxed antialiased shadow-2xl sm:w-4/5 md:w-3/5 lg:w-2/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-4 sm:px-6 md:px-8 lg:px-12">
              <div
                className="flex text-secondary justify-end text-2xl font-snormal cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <IoMdCloseCircle />
              </div>
              <div className="flex justify-center items-center mt-2">
                <div className="shadow rounded-xl p-4 sm:p-6 md:p-8 lg:p-12 w-full">
                  <Typography className="text-center">
                  Are you sure you want to submit the company information to complete the registration process?
                  </Typography>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex items-center justify-around mt-8 w-full">
                  <Button 
                    className="bg-white text-[#757575] border border-secondary py-2 px-6 sm:px-6"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-secondary py-2 px-6 text-white sm:px-6"
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
      
      <DocumentChoiceDialog
        isOpen={showDocumentChoice}
        onClose={() => setShowDocumentChoice(false)}
        onUploadDocument={() => {
          setShowDocumentChoice(false);
          setIsOpen(false);  
          setActiveStep(1);
        }}
        onProceed={async () => {
          setShowDocumentChoice(false);
          
          try {
            // Call register API with ALL data (step0Data + step1Data profile fields)
            const step0Data = data?.step0Data;
            if (!step0Data) {
              toast.error("Registration data is missing");
              return;
            }

            const step1Data = data?.step1Data || {};
            if (!step1Data || Object.keys(step1Data).length === 0) {
              toast.error("Company information is missing");
              return;
            }

            const otp = localStorage.getItem("otp");
            
            // Combine step0Data and step1Data for register API (exclude document files)
            const registerPayload = {
              ...step0Data, // Registration data (phone, verification_code, etc.)
              ...Object.keys(step1Data).reduce((acc, key) => {
                // Include all step1Data fields except document files
                if (!key.includes("_url") || !(step1Data[key] instanceof File)) {
                  acc[key] = step1Data[key];
                }
                return acc;
              }, {}),
            };
            
            registerPayload.channel = "WEB";
            registerPayload.otp_id = otp;
            registerPayload.otp_code = step0Data?.verification_code;
            registerPayload.ntn = step1Data?.comp_reg_no;

            const registerRes = await APICall("post", registerPayload, EndPoints.customer.register);
            
            if (!registerRes?.success) {
              toast.error(registerRes?.message || "Registration failed");
              return;
            }

            const id = registerRes?.data?.customer_account_id;
            const token = registerRes?.data?.token;
            localStorage.setItem("token", token);
            localStorage.setItem("id", id);
            localStorage.setItem("user", JSON.stringify(registerRes.data));
            localStorage.removeItem("otp");
            navigate(ConstentRoutes.dashboard);
          } catch (err) {
            console.error("Registration error:", err);
            toast.error(err?.message || "Registration failed. Please try again.");
          }
        }}
      />
    </>
  );
};

export default FormSubmission;