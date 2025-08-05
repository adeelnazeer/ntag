/* eslint-disable react/prop-types */
import { Input } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useRegisterHook } from "../../hooks/useRegisterHook";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";

const CompanyInfo = ({ profileData }) => {
  const registerData = useRegisterHook();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { ...profileData, phone_number: `+${profileData?.phone_number}` } });

  // Get corporate documents from Redux state
  const corporateDocuments = useAppSelector(state => state.user.corporateDocuments);

  // State to track if editing is allowed
  const [isEditingAllowed, setIsEditingAllowed] = useState(true);

  // Check if documents are approved (all have status 1)
  useEffect(() => {
    const areDocumentsApproved = corporateDocuments?.length >= 3 &&
      corporateDocuments.every(doc => doc?.doc_status === "1");
    setIsEditingAllowed(!areDocumentsApproved);
  }, [corporateDocuments]);

  const onSubmit = (data) => {
    // Prevent update if editing is not allowed
    if (!isEditingAllowed) {
      return;
    }

    registerData.handleUpdateUserInfo({
      comp_name: data?.comp_name,
      username: data?.username,
      email: data?.email,
      comp_industry: data?.comp_industry,
      comp_state: data?.comp_state,
      comp_city: data?.comp_city,
      comp_addr: data?.comp_addr,
      comp_reg_no: data?.comp_reg_no,
      phone_number: data?.phone_number
    });
  };

  // Input field styling based on editing permissions
  const getInputStyle = (fieldError) => {
    const baseStyle = isEditingAllowed ? "bg-white" : "bg-[#8080801f]";

    return {
      className: `mt-2 w-full rounded-xl px-4 py-2 ${baseStyle} outline-none`,
      style: fieldError ? { border: "1px solid red" } : { border: "1px solid #8A8AA033" },
      readOnly: !isEditingAllowed
    };
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Notification for approved documents */}
      {/* {!isEditingAllowed && (
        <div className="mt-5 max-w-3xl bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            Your documents have been approved. Company information cannot be modified.
          </p>
        </div>
      )} */}

      <div className="mt-10 grid max-w-3xl md:grid-cols-2 grid-cols-1 gap-6">
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            Company Name
          </label>
          <Input
            {...getInputStyle(errors?.comp_name)}
            readOnly={true} // Always read-only
            {...register("comp_name", { required: true })}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            User Name
          </label>
          <Input
            {...getInputStyle(errors.username)}
            readOnly={true} // Always read-only
            {...register("username", { required: true })}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            Email
          </label>
          <Input
            className={`mt-2 w-full rounded-xl px-4 py-2  bg-white outline-none border border-[#8A8AA033]`}
            {...register("email", { required: true })}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            Industry
          </label>
          <Input
            className={`mt-2 w-full rounded-xl px-4 py-2  bg-white outline-none border border-[#8A8AA033]`}
            maxLength={20}
            {...register("comp_industry", { required: true })}
          />
        </div>

        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            Region
          </label>
          <Input
            {...getInputStyle(errors.comp_state)}
            maxLength={20}
            {...register("comp_state", { required: true })}
            readOnly
            disabled
          />
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            City
          </label>
          <Input
            className={`mt-2 w-full rounded-xl px-4 py-2  bg-white outline-none border border-[#8A8AA033]`}

            // {...getInputStyle(errors.comp_city)}
          maxLength={20}
          {...register("comp_city", { required: true })}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            Specific Address
          </label>
          <Input
            className={`mt-2 w-full rounded-xl px-4 py-2  bg-white outline-none border border-[#8A8AA033]`}
            maxLength={100}
            {...register("comp_addr", { required: true })}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            Business Registration/TIN Number
          </label>
          <Input
            maxLength={10}
            {...getInputStyle(errors.comp_reg_no)}
            {...register("comp_reg_no", {
              required: "Business Registration/TIN Number is required",
              minLength: { value: 9, message: "TIN Number must be at least 10 digits" },
              maxLength: { value: 10, message: "TIN Number cannot exceed 11 digits" },
              pattern: {
                value: /^\d{9,10}$/,
                message: "TIN Number must contain only digits and start with digit 9"
              }
            })}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            Registered Mobile  Number
          </label>
          <Input
            {...getInputStyle(errors.phone_number)}
            readOnly={true} // Always read-only
            {...register("phone_number", { required: true })}
          />
        </div>
      </div>
      <div className="mt-10 max-w-3xl text-center">
        <button
          className={` text-white font-medium px-10 py-3 rounded-lg`}
        // disabled={!isEditingAllowed}
        >
          Update Company Information
        </button>
      </div>
    </form>
  );
};

export default CompanyInfo;