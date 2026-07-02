/* eslint-disable react/prop-types */
import { Button } from "@material-tailwind/react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { TbCircleCheck } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import RestrictedKeywordsSection from "./RestrictedKeywordsSection";

const BRAND_NAME_PATTERN = /^[a-zA-Z0-9]{3,16}$/;

export { BRAND_NAME_PATTERN };

export default function CheckAvailabilityStep({
  brandName,
  onBrandNameChange,
  onCheckAvailability,
  isChecking,
  isAvailable,
  errorMessage,
  hasSubscriber,
  isRecurringAccepted,
  isLoadingEligibility,
}) {
  const { t } = useTranslation(["brandName"]);
  const showNotEligible = !isLoadingEligibility && hasSubscriber === false;
  const showRecurringNotEligible =
    !isLoadingEligibility && hasSubscriber === true && isRecurringAccepted === false;
  const isBlocked = showNotEligible || showRecurringNotEligible || isLoadingEligibility;

  return (
    <section className="flex flex-col gap-4">
      {showNotEligible ? (
        <div>
          <p className="text-sm font-bold text-red-500">{t("brandName:step1.notEligibleTitle")}</p>
          <p className="mt-1 text-sm text-red-500">{t("brandName:step1.notEligible")}</p>
        </div>
      ) : null}
      {showRecurringNotEligible ? (
        <div>
          <p className="text-sm font-bold text-red-500">
            {t("brandName:step1.notEligibleRecurringTitle")}
          </p>
          <p className="mt-1 text-sm text-red-500">{t("brandName:step1.notEligibleRecurring")}</p>
        </div>
      ) : null}
      <div className="flex items-start gap-2">
        <HiOutlineMagnifyingGlass className="mt-1 h-5 w-5 shrink-0 text-brand-blue" />
        <div>
          <h2 className="text-base sm:text-lg font-bold text-brand-blue">
            {t("brandName:step1.title")}
          </h2>
          <p className="mt-1 text-sm text-[#6B7280] leading-relaxed">
            {t("brandName:step1.description")}
          </p>
        </div>
      </div>
   
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-brand-blue">
          {t("brandName:step1.label")}
        </label>

        <p className="text-xs text-[#9CA3AF]">{t("brandName:step1.hint")}</p>


        <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
          <div className="flex-1">
            <input
              type="text"
              value={brandName}
              onChange={(e) => onBrandNameChange(e.target.value)}
              placeholder={t("brandName:step1.placeholder")}
              maxLength={18}
              className="w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-2.5 text-sm text-[#1F2937] outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
            />
            <p className="mt-1.5 text-xs text-[#9CA3AF]">
              {t("brandName:step1.charCount", { count: brandName.length })}
            </p>
          </div>
          <Button
            type="button"
            onClick={onCheckAvailability}
            disabled={isChecking || !brandName.trim()}
            className="shrink-0 bg-secondary text-white normal-case text-sm font-semibold px-6 py-2.5 shadow-none hover:shadow-none disabled:opacity-60"
          >
            {isChecking ? t("brandName:step1.checking") : t("brandName:step1.checkButton")}
          </Button>
        </div>

        {errorMessage && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}

        {isAvailable && (
          <div className="flex items-start gap-2 rounded-lg border border-secondary/30 bg-brand-green-pale px-4 py-3">
            <TbCircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
            <p className="text-sm text-brand-green-muted">
              {t("brandName:step1.available", { name: brandName.trim() })}
            </p>
          </div>
        )}

        <RestrictedKeywordsSection defaultExpanded={false} />

      </div>
    </section>
  );
}
