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
  const [updating, setUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
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

      const response = await APICall("post", payload, EndPoints.customer.updateProfileCustomer);

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
            {...register("email", { required: t("common.form.errors.email") })}
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
          <input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={t("common.form.faydaNumberPlaceholder")}
            maxLength={16}
            style={errors?.cnic ? { border: "1px solid red" } : { border: "1px solid #8A8AA033" }}
            onKeyDown={(e) => {
              const key = e.key;
              const ctrl = e.ctrlKey || e.metaKey;
              const allowed = ["Backspace", "Delete", "Tab", "Enter", "Escape", "ArrowLeft", "ArrowRight", "Home", "End"];
              if (allowed.includes(key) || ctrl) return;
              if (!/^\d$/.test(key)) e.preventDefault(); // digits only
            }}
            onPaste={(e) => {
              e.preventDefault();
              const el = e.currentTarget;
              const pasted = (e.clipboardData || window.clipboardData).getData("text") || "";
              const digits = pasted.replace(/\D/g, "");
              const s = el.selectionStart ?? el.value.length;
              const epos = el.selectionEnd ?? el.value.length;
              const next = (el.value.slice(0, s) + digits + el.value.slice(epos)).slice(0, 16);
              el.value = next;
              el.dispatchEvent(new Event("input", { bubbles: true }));
            }}
            {...register("cnic", {
              // Optional; if filled, must be exactly 16 digits
              validate: (v) => v === "" || v == null || /^\d{16}$/.test(v) || t("common.form.errors.faydaExactDigits"),
              onChange: (e) => {
                const clean = e.target.value.replace(/\D/g, "").slice(0, 16);
                if (clean !== e.target.value) e.target.value = clean;
              },
            })}
          //     value: /^\d{16,16}$/,
          //     message: "Fayda  Number must contain only digits"
          //   }
          // })}
          />
          {errors.cnic && (
            <p className="text-red-500 text-xs mt-1">
              {errors.cnic.message || t("common.form.errors.faydaDigits")}
            </p>
          )}
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t("profile.regMobileNo")}
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
          className="bg-secondary text-white font-medium px-10 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300 disabled:opacity-70"
          disabled={updating}
        >
          {updating ? t("profile.companyInfo.updating") : t("profile.companyInfo.updateAccountInfo")}
        </button>
      </div>
    </form>
  );
};

export default CompanyInfo;