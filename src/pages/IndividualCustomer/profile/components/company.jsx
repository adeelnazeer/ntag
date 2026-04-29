/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import EndPoints from "../../../../network/EndPoints";
import APICall from "../../../../network/APICall";
import { useTranslation } from "react-i18next";

const formatPhone = (v) => {
  if (v == null) return "";
  const s = String(v).trim();
  return s.startsWith("+") ? s : `+${s}`;
};
const normalize = (p = {}) => ({
  ...p,
  phone_number: formatPhone(p.phone_number),
});
const CompanyInfo = ({ profileData, userProfileData }) => {
  const { t } = useTranslation(["common", "profile"]);
  const { t: t2 } = useTranslation(["profile"]);

  const [updating, setUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      ...profileData,
      phone_number: `+${profileData?.phone_number}`
    }
  });

  useEffect(() => {
    if (!userProfileData) return;

    const base = normalize(userProfileData);

    // Re-apply the full payload now that options exist
    reset(base, { keepDirty: false, keepTouched: false });

  }, [userProfileData, reset, setValue]);

  const handleUpdateUserInfo = async (data) => {
    try {
      const payload = { ...data };
      payload.channel = "WEB";

      const response = await APICall("post", payload, EndPoints.customer.newSecurityEndPoints.individual.updateProfile);

      if (response?.success) {
        toast.success(response?.message || t("profile.companyInfo.toastMessages.profileUpdatedSuccessfully"));

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
        toast.error(response?.message || t("profile.companyInfo.toastMessages.updateFailed"));
        setUpdating(false);

        return false;
      }

    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(t("profile.companyInfo.toastMessages.somethingWentWrong"));
      setUpdating(false);
      return false;
    }
  };

  const onSubmit = async (data) => {
    setUpdating(true);
    const payload = {
      first_name: data?.first_name,
      last_name: data?.last_name,
      email: data?.email,
    };

    const success = await handleUpdateUserInfo(payload);

    if (success) {
      reset(data, { keepDirty: false, keepTouched: false });
    }
    setUpdating(false);
  };

  console.log({ userProfileData })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-10 grid max-w-3xl mx-auto md:grid-cols-2 grid-cols-1 gap-6">
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t("common.form.firstName")}
          </label>
          <input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none"
            style={
              errors?.first_name
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            maxLength={30}
            disabled={userProfileData?.fayda_verification?.is_registered === true}
            {...register("first_name", { required: t("common.form.errors.firstName") })}
          />
          {errors.first_name && (
            <p className="text-red-500 text-xs mt-1">{errors.first_name.message || t("common.form.errors.firstName")}</p>
          )}
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t("common.form.fatherName")}
          </label>
          <input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none"
            style={
              errors?.last_name
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            maxLength={30}
            disabled={userProfileData?.fayda_verification?.is_registered === true}

            {...register("last_name", { required: t("common.form.errors.fatherName") })}
          />
          {errors.last_name && (
            <p className="text-red-500 text-xs mt-1">{errors.last_name.message || t("common.form.errors.fatherName")}</p>
          )}
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t("common.form.userName")}
          </label>
          <input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-[#8080801f] outline-none"
            readOnly
            maxLength={30}
            style={{ border: "1px solid #8A8AA033" }}
            {...register("username")}
          />
          <p className="text-xs text-gray-500 mt-1">{t("common.form.usernameCannotBeChanged")}</p>
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t("common.form.email")}
          </label>
          <input
            className="mt-2 w-full bg-white rounded-xl px-4 py-2 outline-none"
            style={
              errors.email
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            maxLength={50}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email.message || t("common.form.errors.email")}
            </p>
          )}
        </div>

        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t("common.form.faydaNumber")}
          </label>
          <div
            className="mt-2 w-full rounded-xl px-4 py-3 bg-white outline-none flex items-center justify-between"
            style={{ border: "1px solid #8A8AA033" }}
          >
            <span className="text-sm text-[#232323] font-medium">
              {t("common.form.faydaVerificationStatus", { defaultValue: "Verification status" })}
            </span>
            {userProfileData?.fayda_verification?.is_registered === true ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
                <span className="h-2 w-2 rounded-full bg-green-600" />
                {t("common.verified", { defaultValue: "Verified" })}
              </span>
            ) : userProfileData?.fayda_verification?.is_registered === false || userProfileData?.fayda_verification === null ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                {t("common.notVerified", { defaultValue: "Not verified" })}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full  px-3 py-1 text-xs font-semibold">
              </span>
            )}
          </div>
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t2("profile.regMobileNo")}
          </label>
          <input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-[#8080801f] outline-none"
            readOnly
            style={{ border: "1px solid #8A8AA033" }}
            {...register("phone_number")}
          />
          <p className="text-xs text-gray-500 mt-1">{t("common.form.mobileNumberCannotBeChanged")}</p>
        </div>
      </div>
      <div className="mt-10 text-center">
        <button
          type="submit"
          className="bg-secondary text-white font-medium px-10 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={updating || !isDirty}
        >
          {updating ? t2("profile.companyInfo.updating") : t2("profile.companyInfo.updateAccountInfo")}
        </button>
      </div>
    </form>
  );
};

export default CompanyInfo;