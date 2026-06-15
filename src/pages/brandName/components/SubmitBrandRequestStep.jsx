/* eslint-disable react/prop-types */
import { Button } from "@material-tailwind/react";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

const REGISTRATION_FEE = 500;
const PER_CALLER_MONTHLY = 20;
const MAX_CALLERS = 1000;

const formatPrice = (value) => Number(value).toFixed(2);

export default function SubmitBrandRequestStep({
  callerCount,
  onCallerCountChange,
  onSubmit,
  isSubmitting,
}) {
  const { t } = useTranslation(["brandName"]);
  const approvalPoints = t("brandName:step2.approvalPoints", { returnObjects: true });
  const monthlyTotal = callerCount * PER_CALLER_MONTHLY;

  const handleCallerChange = (value) => {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      onCallerCountChange(1);
      return;
    }
    onCallerCountChange(Math.min(MAX_CALLERS, Math.max(1, parsed)));
  };

  return (
    <section className="mt-8 flex flex-col gap-5 border-t border-[#E5E7EB] pt-8">
      <div className="flex items-start gap-2">
        <HiOutlineUserGroup className="mt-1 h-5 w-5 shrink-0 text-brand-blue" />
        <div>
          <h2 className="text-base sm:text-lg font-bold text-brand-blue">
            {t("brandName:step2.title")}
          </h2>
          <p className="mt-1 text-sm text-[#6B7280] leading-relaxed">
            {t("brandName:step2.description")}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-brand-blue">
          {t("brandName:step2.callersLabel")}
        </label>
        <p className="text-xs text-[#9CA3AF]">{t("brandName:step2.callersHint")}</p>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            min={1}
            max={MAX_CALLERS}
            value={callerCount}
            onChange={(e) => handleCallerChange(e.target.value)}
            className="w-24 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#1F2937] outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
          <span className="text-sm text-[#6B7280]">
            {t("brandName:step2.callersSuffix")}
          </span>
        </div>
        <p className="text-xs text-[#9CA3AF]">{t("brandName:step2.callersNote")}</p>
      </div>

      <div className="rounded-lg bg-brand-green-pale px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-green-dark">
          {t("brandName:step2.costSummaryTitle")}
        </p>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#4B5563]">{t("brandName:step2.registrationFee")}</span>
            <span className="font-semibold text-[#1F2937]">
              {formatPrice(REGISTRATION_FEE)} {t("brandName:step2.currency")}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#4B5563]">{t("brandName:step2.perCallerFee")}</span>
            <span className="font-semibold text-[#1F2937]">
              {formatPrice(PER_CALLER_MONTHLY)} {t("brandName:step2.currency")}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#4B5563]">{t("brandName:step2.numberOfCallers")}</span>
            <span className="font-semibold text-[#1F2937]">{callerCount}</span>
          </div>
          <div className="border-t border-secondary/20 pt-2 flex items-center justify-between gap-4">
            <span className="font-semibold text-brand-green-dark">
              {t("brandName:step2.monthlyTotal")}
            </span>
            <span className="text-base font-bold text-brand-green-dark">
              {formatPrice(monthlyTotal)} {t("brandName:step2.currency")}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2">
          <HiOutlineInformationCircle className="h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm font-semibold text-amber-900">
            {t("brandName:step2.approvalTitle")}
          </p>
        </div>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-amber-900/90">
          {Array.isArray(approvalPoints) &&
            approvalPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
        </ul>
      </div>

      <p className="text-xs leading-relaxed text-[#6B7280]">
        {t("brandName:step2.disclaimer")}
      </p>

      <Button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 bg-secondary text-white normal-case text-sm font-semibold py-3 shadow-none hover:shadow-none disabled:opacity-60"
      >
        <HiOutlineDocumentCheck className="h-5 w-5" />
        {isSubmitting ? t("brandName:step2.submitting") : t("brandName:step2.submitButton")}
      </Button>
    </section>
  );
}
