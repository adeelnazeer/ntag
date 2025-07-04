/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Input } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useRegisterHook } from "../../hooks/useRegisterHook";
import { useAppSelector } from "../../../redux/hooks";
import { toast } from "react-toastify";

const ContactInfo = ({ profileData }) => {
  const registerData = useRegisterHook();
  const [formDisabled, setFormDisabled] = useState(false);

  // Get corporate documents from Redux state to check approval status
  const corporateDocuments = useAppSelector(state => state.user.corporateDocuments);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      ...profileData,
      phone_number: `+${profileData?.phone_number}`,
      contact_no: profileData?.contact_no?.startsWith("2519")
        ? `+${profileData?.contact_no}`
        : "+2519",
    },
  });

  // Determine if editing is allowed based on document status
  const isEditingAllowed = () => {
    if (!corporateDocuments || corporateDocuments.length < 2) return true;

    // Allow editing if any document is pending approval (status 0) or rejected (status 2)
    return corporateDocuments.some(doc => doc?.doc_status === "0" || doc?.doc_status === "2");
  };

  useEffect(() => {
    // Set the form's disabled state based on document approval status
    setFormDisabled(!isEditingAllowed());
  }, [corporateDocuments]);

  const onSubmit = (data) => {
    // Double-check if editing is allowed
    if (!isEditingAllowed()) {
      toast.error("Contact information can't be modified after document approval");
      return;
    }

    // // Check if primary phone number is being changed
    // if (data.phone_number !== profileData.phone_number) {
    //   toast.error("Primary mobile number cannot be changed");
    //   // Reset the field to its original value
    //   setValue("phone_number", profileData.phone_number);
    //   return;
    // }

    registerData.handleUpdateUserInfo({
      contact_fname: data?.contact_fname,
      contact_lname: data?.contact_lname,
      email: data?.email,
      contact_no: data?.contact_no?.startsWith('+') ? data?.contact_no?.slice(1) : data?.contact_no,
    });
  };

  // Check if documents are approved (both have status 1)
  const areDocumentsApproved = corporateDocuments?.length >= 2 &&
    corporateDocuments[0]?.doc_status === "1" &&
    corporateDocuments[1]?.doc_status === "1" &&
    corporateDocuments[2]?.doc_status === "1";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Notification for approved documents */}
      {areDocumentsApproved && (
        <div className="mt-5 max-w-3xl bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            Your documents have been approved. Contact information is now locked.
          </p>
        </div>
      )}

      <div className="mt-10 grid max-w-3xl md:grid-cols-2 grid-cols-1 gap-6">
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            First Name
          </label>
          <Input
            className={`mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none ${formDisabled ? 'bg-gray-100' : ''}`}
            placeholder="First Name"
            maxLength={15}
            style={
              errors?.contact_fname
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("contact_fname", { required: true })}
            disabled={formDisabled}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            Father Name
          </label>
          <Input
            className={`mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none ${formDisabled ? 'bg-gray-100' : ''}`}
            placeholder="Father Name"
            maxLength={15}
            style={
              errors.contact_lname
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("contact_lname", { required: true })}
            disabled={formDisabled}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            Email
          </label>
          <Input
            className={`mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none ${formDisabled ? 'bg-gray-100' : ''}`}
            placeholder="Email"
            maxLength={30}
            style={
              errors.email
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,4}$/,
                message: "Email must end with a domain of 2 to 4 letters (e.g., .com, .info)",
              }
            })}
            disabled={formDisabled}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            Contact Number
          </label>
          <Input
            className={`mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none ${formDisabled ? 'bg-gray-100' : ''
              }`}
            placeholder="Contact No"
            maxLength={12}
            value={watch("contact_no") || "2519"}
            onChange={(e) => {
              let value = e.target.value;

              // Remove all non-digit characters
              value = value.replace(/\D/g, '');

              // Always enforce "2519" at the beginning
              if (!value.startsWith("2519")) {
                value = "2519" + value.replace(/^2519/, "").replace(/^251/, "").replace(/^25/, "").replace(/^2/, "");
              }

              // Trim to 12 characters max
              if (value.length > 12) {
                value = value.slice(0, 12);
              }

              setValue("contact_no", value);
            }}
            style={
              errors.contact_no
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("contact_no", {
              required: "",
              pattern: {
                value: /^2519\d{8}$/, // must be 2519 + 8 digits
                message: "Number must start with 2519 and be 12 digits long",
              },
            })}
            disabled={formDisabled}
          />
          {(errors.contact_no) && (
            <p className="text-left mt-1 text-sm text-[#FF0000]">
              {errors.contact_no?.message}
            </p>
          )}
        </div>
        {/* <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            Registered Mobile  Number
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-gray-100 outline-none"
            placeholder="Phone Number"
            maxLength={15}
            style={{ border: "1px solid #8A8AA033" }}
            {...register("phone_number")}
            disabled={true}
          />
          <p className="text-xs text-secondary mt-1">
            Primary mobile number cannot be changed
          </p>
        </div> */}
      </div>
      <div className="mt-10 max-w-3xl text-center">
        <button
          className={`${!formDisabled ? 'bg-secondary' : 'bg-gray-400 cursor-not-allowed'} text-white font-medium px-10 py-3 rounded-lg`}
          disabled={formDisabled}
        >
          Update Contact Information
        </button>
      </div>
    </form>
  )
}

export default ContactInfo