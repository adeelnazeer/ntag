/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Input } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useRegisterHook } from "../../hooks/useRegisterHook";
import { useAppSelector } from "../../../redux/hooks";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Spinner } from "@material-tailwind/react";

const toStr = (v) => (v === 0 || v ? String(v) : "");

const formatPhone = (v) => {
  if (v == null) return "";
  const s = String(v).trim();
  return s.startsWith("+") ? s : `+${s}`;
};
const normalize = (p = {}) => ({
  ...p,
  phone_number: formatPhone(p.phone_number),
  corp_industry_id: toStr(p.corp_industry_id),
  corp_region_id: toStr(p.corp_region_id),
});
const ContactInfo = ({ profileData, userProfileData }) => {
  const registerData = useRegisterHook();
  const [formDisabled, setFormDisabled] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { t } = useTranslation(["common"]);
  const { t: t2 } = useTranslation(["profile"]);

  // Get corporate documents from Redux state to check approval status
  const corporateDocuments = useAppSelector(
    (state) => state.user.corporateDocuments
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      ...profileData,
      phone_number: `+${profileData?.phone_number}`,
      contact_no: profileData?.contact_no?.startsWith("2519")
        ? `${profileData?.contact_no}`
        : "2519",
    },
  });

  // Determine if editing is allowed based on document status
  const isEditingAllowed = () => {
    if (!corporateDocuments || corporateDocuments.length < 2) return true;

    // Allow editing if any document is pending approval (status 0) or rejected (status 2)
    return corporateDocuments.some(
      (doc) => doc?.doc_status === "0" || doc?.doc_status === "2"
    );
  };

  useEffect(() => {
    if (!userProfileData) return;

    const base = normalize(userProfileData);

    // Re-apply the full payload now that options exist
    reset(base, { keepDirty: false, keepTouched: false });
  }, [userProfileData, reset, setValue]);

  useEffect(() => {
    // Set the form's disabled state based on document approval status
    setFormDisabled(!isEditingAllowed());
  }, [corporateDocuments]);

  const onSubmit = async (data) => {
    if (submitLoading) return;

    setSubmitLoading(true);
    try {
      await registerData.handleUpdateUserInfo({
        contact_fname: data?.contact_fname,
        contact_lname: data?.contact_lname,
        email: data?.email,
        contact_no: data?.contact_no?.startsWith("+")
          ? data?.contact_no?.slice(1)
          : data?.contact_no,
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Check if documents are approved (both have status 1)
  const areDocumentsApproved =
    corporateDocuments?.length >= 2 &&
    corporateDocuments[0]?.doc_status === "1" &&
    corporateDocuments[1]?.doc_status === "1" &&
    corporateDocuments[2]?.doc_status === "1";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Notification for approved documents */}
      {/* {areDocumentsApproved && (
        <div className="mt-5 max-w-3xl bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            Your documents have been approved. Contact information is now locked.
          </p>
        </div>
      )} */}

      <div className="mt-10 grid max-w-3xl md:grid-cols-2 grid-cols-1 gap-6">
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t("common.form.firstName")}
          </label>
          <Input
            className={`mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none `}
            placeholder={t("common.form.firstName")}
            maxLength={15}
            style={
              errors?.contact_fname
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("contact_fname", { required: true })}
            // disabled={formDisabled}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t("common.form.fatherName")}
          </label>
          <Input
            className={`mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none `}
            placeholder={t("common.form.fatherName")}
            maxLength={15}
            style={
              errors.contact_lname
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("contact_lname", { required: true })}
            // disabled={formDisabled}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t("common.form.email")}
          </label>
          <Input
            className={`mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none `}
            placeholder={t("common.form.email")}
            maxLength={30}
            style={
              errors.email
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("email")}
            // disabled={formDisabled}
          />
        </div>
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
             {t("common.form.contactNo")}
          </label>
          <Input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            className={`mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none ${
              formDisabled ? "bg-gray-100" : ""
            }`}
            placeholder= {t("common.form.contactNo")}
            maxLength={12}
            value={watch("contact_no") || "2519"}
            onKeyDown={(e) => {
              const key = e.key;
              const caret = e.currentTarget.selectionStart ?? 0;

              // Allow navigation/control keys
              const ctrl = e.ctrlKey || e.metaKey;
              const allowedKeys = [
                "Backspace",
                "Delete",
                "Tab",
                "Escape",
                "Enter",
                "ArrowLeft",
                "ArrowRight",
                "Home",
                "End",
              ];
              if (allowedKeys.includes(key) || ctrl) {
                // Protect the fixed 2519 prefix from deletion
                if (
                  (key === "Backspace" && caret <= 4) ||
                  (key === "Delete" && caret < 4)
                ) {
                  e.preventDefault();
                }
                return;
              }

              // Block editing inside the 2519 prefix
              if (caret < 4) {
                e.preventDefault();
                return;
              }

              // Only allow digits
              if (!/^\d$/.test(key)) {
                e.preventDefault();
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const pasted =
                (e.clipboardData || window.clipboardData).getData("text") || "";
              let digits = pasted.replace(/\D/g, "");

              // Drop any leading attempt to retype 2519
              digits = digits.replace(/^2?5?1?9?/, "");

              const current = (watch("contact_no") || "2519").replace(
                /\D/g,
                ""
              );
              const rest = current.slice(4); // existing tail after 2519
              const newTail = (rest + digits).slice(0, 8); // max 8 after prefix

              setValue("contact_no", "2519" + newTail, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            onChange={(e) => {
              let raw = e.target.value.replace(/\D/g, "");

              // Ensure the required prefix stays
              if (!raw.startsWith("2519")) {
                // Remove any partial leading overlap with 2519 then re-add
                raw = raw.replace(/^2?5?1?9?/, "");
                raw = "2519" + raw;
              }

              // Cap total length at 12
              if (raw.length > 12) raw = raw.slice(0, 12);

              setValue("contact_no", raw, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            onFocus={(e) => {
              // If somehow shorter than prefix, snap back
              const v = (watch("contact_no") || "").replace(/\D/g, "");
              if (!v || v.length < 4) {
                setValue("contact_no", "2519", { shouldValidate: true });
                // Move caret to end
                requestAnimationFrame(() => {
                  const el = e.currentTarget;
                  const len = el.value.length;
                  el.setSelectionRange(len, len);
                });
              }
            }}
            style={
              errors.contact_no
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("contact_no", {
              required: "Contact number is required",
              pattern: {
                value: /^2519\d{8}$/,
                message: "Number must start with 2519 and be 12 digits long",
              },
            })}
          />

          {errors.contact_no && (
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
          type="submit"
          disabled={submitLoading}
          className="bg-secondary text-white font-medium px-10 py-3 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
        >
          {submitLoading && (
            <Spinner className="h-4 w-4" color="white" />
          )}
          {submitLoading ? t2("profile.companyInfo.updating") : t2("profile.updateContactInfoBtn")}
        </button>
      </div>
    </form>
  );
};

export default ContactInfo;
