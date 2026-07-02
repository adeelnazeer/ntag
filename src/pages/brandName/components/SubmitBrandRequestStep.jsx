/* eslint-disable react/prop-types */
import { Button } from "@material-tailwind/react";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

const DEFAULT_REGISTRATION_FEE = 500;
const DEFAULT_PER_CALLER_MONTHLY = 20;

const PLAN_OPTIONS = ["Monthly", "Quarterly", "Semiannually", "Annually"];

const PLAN_PRICE_KEYS = {
  Monthly: "monthly_fee_per_caller",
  Quarterly: "quarterly_fee_per_caller",
  Semiannually: "semiannually_fee_per_caller",
  Annually: "annually_fee_per_caller",
};

const formatPrice = (value) => Number(value).toFixed(2);

export default function SubmitBrandRequestStep({
  callerCount,
  onCallerCountChange,
  servicePlan = "Monthly",
  onServicePlanChange,
  onSubmit,
  isSubmitting,
  pricing,
  brandType,
  isEligible,
  corpTagCount,
}) {
  const { t } = useTranslation(["brandName"]);
  const maxCallers = corpTagCount > 0 ? corpTagCount : 1;
  const approvalPoints = t("brandName:step2.approvalPoints", { returnObjects: true });

  const planLabel = t(`brandName:step2.plans.${servicePlan}`);
  const registrationFee = Number(pricing?.registration_fee ?? DEFAULT_REGISTRATION_FEE);
  const perCallerFee = Number(
    pricing?.[PLAN_PRICE_KEYS[servicePlan]] ?? DEFAULT_PER_CALLER_MONTHLY
  );
  const recurringTotal = callerCount * perCallerFee;

  const handleCallerChange = (value) => {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      onCallerCountChange(1);
      return;
    }
    onCallerCountChange(Math.min(maxCallers, Math.max(1, parsed)));
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
        {corpTagCount > 0 ? (
          <p className="text-xs font-medium text-brand-blue">
            {t("brandName:step2.corpTagCount", { count: corpTagCount })}
          </p>
        ) : null}
        <p className="text-xs text-[#9CA3AF]">
          {t("brandName:step2.callersHint", { max: maxCallers })}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            min={1}
            max={maxCallers}
            value={callerCount}
            onChange={(e) => handleCallerChange(e.target.value)}
            disabled={!corpTagCount}
            className="w-24 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#1F2937] outline-none focus:border-secondary focus:ring-1 focus:ring-secondary disabled:cursor-not-allowed disabled:opacity-60"
          />
          <span className="text-sm text-[#6B7280]">
            {t("brandName:step2.callersSuffix", { max: maxCallers })}
          </span>
        </div>
        <p className="text-xs text-[#9CA3AF]">{t("brandName:step2.callersNote")}</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-brand-blue">
          {t("brandName:step2.planLabel")}
        </label>
        <p className="text-xs text-[#9CA3AF]">{t("brandName:step2.planHint")}</p>
        <div className="flex flex-wrap gap-2">
          {PLAN_OPTIONS.map((plan) => {
            const active = plan === servicePlan;
            return (
              <button
                key={plan}
                type="button"
                onClick={() => onServicePlanChange?.(plan)}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-secondary bg-secondary text-white"
                    : "border-[#D1D5DB] bg-white text-[#4B5563] hover:border-secondary"
                }`}
              >
                {t(`brandName:step2.plans.${plan}`)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg bg-brand-green-pale px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-green-dark">
            {t("brandName:step2.costSummaryTitle")}
          </p>
          {brandType ? (
            <span className="rounded-full bg-secondary/15 px-3 py-0.5 text-xs font-semibold text-brand-green-dark">
              {brandType}
            </span>
          ) : null}
        </div>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#4B5563]">{t("brandName:step2.registrationFee")}</span>
            <span className="font-semibold text-[#1F2937]">
              {formatPrice(registrationFee)} {t("brandName:step2.currency")}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#4B5563]">
              {t("brandName:step2.perCallerFee", { plan: planLabel })}
            </span>
            <span className="font-semibold text-[#1F2937]">
              {formatPrice(perCallerFee)} {t("brandName:step2.currency")}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#4B5563]">{t("brandName:step2.numberOfCallers")}</span>
            <span className="font-semibold text-[#1F2937]">{callerCount}</span>
          </div>
          <div className="border-t border-secondary/20 pt-2 flex items-center justify-between gap-4">
            <span className="font-semibold text-brand-green-dark">
              {t("brandName:step2.recurringTotal", { plan: planLabel })}
            </span>
            <span className="text-base font-bold text-brand-green-dark">
              {formatPrice(recurringTotal)} {t("brandName:step2.currency")}
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
        disabled={isSubmitting || !isEligible || !corpTagCount}
        className="flex items-center justify-center gap-2 bg-secondary text-white normal-case text-sm font-semibold py-3 shadow-none hover:shadow-none disabled:opacity-60"
      >
        <HiOutlineDocumentCheck className="h-5 w-5" />
        {isSubmitting ? t("brandName:step2.submitting") : t("brandName:step2.submitButton")}
      </Button>
    </section>
  );
}
