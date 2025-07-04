/* eslint-disable react/prop-types */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EndPoints from "../../../../network/EndPoints";
import APICall from "../../../../network/APICall";

const CompanyInfo = ({ profileData }) => {
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...profileData,
      phone_number: `+${profileData?.phone_number}`
    }
  });

  const handleUpdateUserInfo = async (data) => {
    try {
      const id = localStorage.getItem("id");
      const payload = { ...data };
      payload.channel = "WEB";

      const response = await APICall("post", payload, EndPoints.customer.updateProfileCustomer);

      if (response?.success) {
        toast.success(response?.message || "Profile updated successfully");

        // Update localStorage with new user data
        localStorage.setItem("user", JSON.stringify(response?.data));

        // // Logout user and redirect to login page
        // setTimeout(() => {
        //   localStorage.removeItem("token");
        //   localStorage.removeItem("id");
        //   localStorage.removeItem("user");
        //   localStorage.clear();

        //   toast.info("Please log in again with your updated information");
        //   navigate(ConstentRoutes.login);
        // }, 1000);
        setUpdating(false);

        return true;
      } else {
        toast.error(response?.message || "Update failed");
        setUpdating(false);

        return false;
      }

    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong. Please try again.");
      setUpdating(false);
      return false;
    }
  };

  const onSubmit = async (data) => {
    setUpdating(true);
    const user = JSON.parse(localStorage.getItem("user"))

    // Create the payload with updatable fields
    const payload = {
      first_name: data?.first_name,
      last_name: data?.last_name,
      email: data?.email,
      cnic: data?.cnic,
      user_id: user?.id,
      // Username is not included as it's not updatable
    };

    // Update user profile
    const success = await handleUpdateUserInfo(payload);

    if (!success) {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-10 grid max-w-3xl mx-auto md:grid-cols-2 grid-cols-1 gap-6">
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            First Name
          </label>
          <input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none"
            style={
              errors?.first_name
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            maxLength={30}
            {...register("first_name", { required: true })}
          />
          {errors.first_name && (
            <p className="text-red-500 text-xs mt-1">First name is required</p>
          )}
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            Father Name
          </label>
          <input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none"
            style={
              errors?.last_name
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            maxLength={30}

            {...register("last_name", { required: true })}
          />
          {errors.last_name && (
            <p className="text-red-500 text-xs mt-1">Father name is required</p>
          )}
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            User Name
          </label>
          <input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-[#8080801f] outline-none"
            readOnly
            maxLength={30}
            style={{ border: "1px solid #8A8AA033" }}
            {...register("username")}
          />
          <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            Email
          </label>
          <input
            className="mt-2 w-full bg-white rounded-xl px-4 py-2 outline-none"
            style={
              errors.email
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            maxLength={50}
            {...register("email", {
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email.message || "Email is required"}
            </p>
          )}
        </div>

        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            Fayda Number
          </label>
          <input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none"
            maxLength={12}
            readOnly
            style={
              errors.cnic
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("cnic", {
              required: "Fayda number is required",
              minLength: { value: 11, message: "Fayda  Number must be at least 11 digits" },
              maxLength: { value: 12, message: "Fayda  Number cannot exceed 12 digits" },
              pattern: {
                value: /^\d{11,12}$/,
                message: "Fayda  Number must contain only digits"
              }
            })}
          />
          {errors.cnic && (
            <p className="text-red-500 text-xs mt-1">
              {errors.cnic.message || "Fayda Number must be 12 digits"}
            </p>
          )}
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            Registered Mobile Number
          </label>
          <input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-[#8080801f] outline-none"
            readOnly
            style={{ border: "1px solid #8A8AA033" }}
            {...register("phone_number")}
          />
          <p className="text-xs text-gray-500 mt-1">Mobile number cannot be changed</p>
        </div>
      </div>
      <div className="mt-10 text-center">
        <button
          className="bg-secondary text-white font-medium px-10 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300 disabled:opacity-70"
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Account Information"}
        </button>
      </div>
    </form>
  );
};

export default CompanyInfo;