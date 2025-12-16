/* eslint-disable react/prop-types */
import { Input } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import APICall from "../../../network/APICall";
import EndPoints from "../../../network/EndPoints";
import { useRegisterHook } from "../../hooks/useRegisterHook";
import { useTranslation } from "react-i18next";

/* ---------- helpers ---------- */
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

export default function CompanyInfo({ userProfileData }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: {} });
  const { t } = useTranslation(["common"]);
  const { t: t2 } = useTranslation(["profile"]);

  const [industries, setIndustries] = useState([]);
  const [regions, setRegions] = useState([]);
  const registerData = useRegisterHook();

  /* 1) Fetch lists */
  useEffect(() => {
    APICall("get", null, EndPoints.customer.getIndustries)
      .then((res) => setIndustries(res?.success ? res?.data || [] : []))
      .catch(() => setIndustries([]));
    APICall("get", null, EndPoints.customer.getRegions)
      .then((res) => setRegions(res?.success ? res?.data || [] : []))
      .catch(() => setRegions([]));
  }, []);

  /* 2) Reset when profile arrives */
  const profileKey = useMemo(
    () => JSON.stringify(userProfileData || {}),
    [userProfileData]
  );
  useEffect(() => {
    if (!userProfileData) return;
    reset(normalize(userProfileData), { keepDirty: false, keepTouched: false });
  }, [profileKey, reset]);

  /* 3) Reset again when lists are ready, so <select> shows correct option */
  const listsReady = industries.length > 0 && regions.length > 0;
  useEffect(() => {
    if (!userProfileData || !listsReady) return;

    const base = normalize(userProfileData);

    // Re-apply the full payload now that options exist
    reset(base, { keepDirty: false, keepTouched: false });

    // Stamp readable names from lists
    const indName =
      industries.find((x) => toStr(x.id) === base.corp_industry_id)?.industry ||
      "";
    const regName =
      regions.find((x) => toStr(x.id) === base.corp_region_id)?.region || "";

    setValue("comp_industry", indName, { shouldDirty: false });
    setValue("comp_state", regName, { shouldDirty: false });
  }, [listsReady, industries, regions, userProfileData, reset, setValue]);

  const onSubmit = (data) => {
    registerData.handleUpdateUserInfo({
      comp_name: data?.comp_name,
      username: data?.username,
      email: data?.email,
      comp_industry: data?.comp_industry, // readable
      comp_state: data?.comp_state, // readable
      comp_city: data?.comp_city,
      comp_addr: data?.comp_addr,
      comp_reg_no: data?.comp_reg_no,
      phone_number: data?.phone_number,
      corp_industry_id: data?.corp_industry_id, // IDs (strings)
      corp_region_id: data?.corp_region_id,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-10 grid max-w-3xl md:grid-cols-2 grid-cols-1 gap-6">
        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t2("profile.companyName")}
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none border border-[#8A8AA033]"
            readOnly
            {...register("comp_name")}
          />
        </div>

        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t2("profile.userName")}
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none border border-[#8A8AA033]"
            readOnly
            {...register("username")}
          />
        </div>

        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t("common.form.email")}
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none border border-[#8A8AA033]"
            maxLength={50}
            {...register("email")}
          />
        </div>

        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t("common.form.industry")}
          </label>
          <select
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none border border-[#8A8AA033]"
            style={
              errors.corp_industry_id
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("corp_industry_id", {
              required: t("common.form.errors.industry"),
            })}
            onChange={(e) => {
              const opt = industries.find(
                (x) => toStr(x.id) === e.target.value
              );
              setValue("comp_industry", opt?.industry || "", {
                shouldDirty: true,
              });
            }}
          >
            <option value="">{t("common.form.selectIndustry")}</option>
            {industries.map((it) => (
              <option key={it.id} value={toStr(it.id)}>
                {it.industry}
              </option>
            ))}
          </select>
          {errors.corp_industry_id && (
            <p className="text-left mt-1 text-sm text-[#FF0000]">
              {errors.corp_industry_id.message}
            </p>
          )}
        </div>

        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t("common.form.region")}
          </label>
          <select
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none border border-[#8A8AA033]"
            style={
              errors.corp_region_id
                ? { border: "1px solid red" }
                : { border: "1px solid #8A8AA033" }
            }
            {...register("corp_region_id", { required: t("common.form.errors.region") })}
            onChange={(e) => {
              const opt = regions.find((x) => toStr(x.id) === e.target.value);
              setValue("comp_state", opt?.region || "", { shouldDirty: true });
            }}
          >
            <option value=""> {t("common.form.selectRegion")}</option>
            {regions.map((it) => (
              <option key={it.id} value={toStr(it.id)}>
                {it.region}
              </option>
            ))}
          </select>
          {errors.corp_region_id && (
            <p className="text-left mt-1 text-sm text-[#FF0000]">
              {errors.corp_region_id.message}
            </p>
          )}
        </div>

        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t("common.form.city")}
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none border border-[#8A8AA033]"
            maxLength={20}
            {...register("comp_city", { required: true })}
          />
        </div>

        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t("common.form.address")}
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none border border-[#8A8AA033]"
            maxLength={100}
            {...register("comp_addr", { required: true })}
          />
        </div>

        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t("common.form.tinNumber")}
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none border border-[#8A8AA033]"
            maxLength={10}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            onKeyDown={(e) => {
              const key = e.key;
              const ctrl = e.ctrlKey || e.metaKey;
              const allowed = ["Backspace", "Delete", "Tab", "Enter", "Escape", "ArrowLeft", "ArrowRight", "Home", "End"];
              if (allowed.includes(key) || ctrl) return;
              if (!/^\d$/.test(key)) e.preventDefault(); // digits only
            }}
            {...register("comp_reg_no", {
              required: t("common.form.errors.tinNumber"),
              minLength: { value: 9, message: t("common.form.errors.tinMinLength") },
              maxLength: { value: 10, message: t("common.form.errors.tinMaxLength") },
              pattern: { value: /^\d{9,10}$/, message: t("common.form.errors.tinPattern") },
            })}
          />
        </div>

        <div>
          <label className="md:text-base text-[16px] text-[#232323]">
            {t2("profile.regMobileNo")}
          </label>
          <Input
            className="mt-2 w-full rounded-xl px-4 py-2 bg-[#F9FAFB] outline-none border border-[#8A8AA033]"
            readOnly
            {...register("phone_number", { required: true })}
          />
        </div>
      </div>

      <div className="mt-10 max-w-3xl text-center">
        <button
          type="submit"
          className="bg-secondary text-white font-medium px-10 py-3 rounded-lg"
        >
          {t2("profile.updateCompInfoBtn")}
        </button>
      </div>
    </form>
  );
}
