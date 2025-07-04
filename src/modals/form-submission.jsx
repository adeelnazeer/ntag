/* eslint-disable react/prop-types */
import { Button, Typography } from "@material-tailwind/react";
import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useRegisterHook } from "../pages/hooks/useRegisterHook";
import DocumentChoiceDialog from "../pages/register/components/documentChoiceDialog";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import { ConstentRoutes } from "../utilities/routesConst";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { setUserData } from "../redux/userSlice";

const FormSubmission = ({ isOpen, setIsOpen, data, setActiveStep }) => {
  const registerHook = useRegisterHook();
  const [showDocumentChoice, setShowDocumentChoice] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  console.log({data})
  
  const handleSubmit = async () => {
    setIsOpen(false);
    const id = localStorage.getItem("id");
    
    // Create FormData for document upload
    const formData = new FormData();
    
    // Check if we have registration license document
    if (data?.registration_license_url) {
      formData.append("registration_license_url", data.registration_license_url);
      formData.append("registration_license_name", data.registration_license_name);
      formData.append("registration_license_type", data.registration_license_type || "Registration");
    } 
    // Fall back to old field names if new ones aren't present
    else if (data?.doc_url_0) {
      formData.append("registration_license_url", data.doc_url_0);
      formData.append("registration_license_name", data.docFileName_0);
      formData.append("registration_license_type", data.docType_0 || "Registration");
    }
    
    // Check if we have application letter document
    if (data?.application_letter_url) {
      formData.append("application_letter_url", data.application_letter_url);
      formData.append("application_letter_name", data.application_letter_name);
      formData.append("application_letter_type", data.application_letter_type || "Application");
    }
    // Fall back to old field names if new ones aren't present
    else if (data?.doc_url_1) {
      formData.append("application_letter_url", data.doc_url_1);
      formData.append("application_letter_name", data.docFileName_1);
      formData.append("application_letter_type", data.docType_1 || "Application");
    }
    
    // Check if we have trade license document
    if (data?.trade_license_url) {
      formData.append("trade_license_url", data.trade_license_url);
      formData.append("trade_license_name", data.trade_license_name);
      formData.append("trade_license_type", data.trade_license_type || "Trade");
    }

    try {
      const res = await APICall(
        "post",
        formData,
        `${EndPoints?.customer?.uploadDocument}/${id}`,
        null,
        true
      );

      if (res?.success) {
        const profilePayload = { ...data.data };
        profilePayload.channel = "WEB";
        profilePayload.ntn = profilePayload.comp_reg_no;
        
        APICall("put", profilePayload, EndPoints.customer.updateProfile(id))
          .then((res) => {
            if (res?.success) {
              console.log({res})
              toast.success(res?.message || "");
              
              dispatch(setUserData(res?.data));
              
              localStorage.removeItem("otp");
              
              navigate(ConstentRoutes.dashboard);
            } else {
              toast.error(res?.message);
            }
          })
          .catch((err) => {
            console.error("Profile update error:", err);
            toast.error("Failed to update profile");
          });
      } else {
        setShowDocumentChoice(true);
      }
    } catch (err) {
      console.error("Document upload error:", err);
      setShowDocumentChoice(true);
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
        onProceed={() => {
          setShowDocumentChoice(false);
          const id = localStorage.getItem("id");
          const profilePayload = { ...data.data };
          profilePayload.channel = "WEB";
          profilePayload.ntn = profilePayload.comp_reg_no;
          
          APICall("put", profilePayload, EndPoints.customer.updateProfile(id))
            .then((res) => {
              if (res?.success) {
                toast.success(res?.message || "");
                
                dispatch(setUserData(res?.data));
                
                localStorage.removeItem("otp");
                
                navigate(ConstentRoutes.dashboard);
              }
            })
            .catch((err) => {
              toast.error("Failed to update profile");
            });
        }}
      />
    </>
  );
};

export default FormSubmission;