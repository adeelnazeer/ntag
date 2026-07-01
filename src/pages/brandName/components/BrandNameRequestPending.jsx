/* eslint-disable react/prop-types */
import { Button } from "@material-tailwind/react";
import { HiOutlineClock } from "react-icons/hi2";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FaXmark } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import BrandNameStepper from "./BrandNameStepper";

const formatPrice = (value) => Number(value || 0).toFixed(2);

export default function BrandNameRequestPending({ request, onCancel, isCancelling }) {
  const { t } = useTranslation(["brandName"]);

  if (!request) return null;

  const registrationFee =
    request.approved_registration_fee ?? request.registration_fee ?? 0;
  const perCallerFee =
    request.approved_monthly_fee_per_caller ?? request.monthly_fee_per_caller ?? 0;
  const callersCount = request.callers_count ?? 0;
  const monthlyRecurring =
    request.estimated_monthly_recurring ?? callersCount * perCallerFee;

  const detailRows = [
    { key: "requestedBrand", value: request.brandname },
    { key: "requestId", value: request.request_ref || `#${request.request_id}` },
    { key: "requestedCallers", value: callersCount },
    { key: "registeredMobile", value: request.msisdn },
    {
      key: "estimatedRegistrationFee",
      value: `${formatPrice(registrationFee)} ${t("brandName:pending.currency")}`,
    },
    {
      key: "estimatedMonthlyFee",
      value: t("brandName:pending.monthlyFeeBreakdown", {
        total: formatPrice(monthlyRecurring),
        count: callersCount,
        fee: formatPrice(perCallerFee),
      }),
    },
    { key: "submittedOn", value: request.submitted_at },
    {
      key: "currentStatus",
      value: request.status_label,
      highlight: true,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <section className="overflow-hidden rounded-xl border border-amber-200 bg-amber-50 shadow-sm">
        <div className="flex items-start justify-between gap-3 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-600">
              <HiOutlineClock className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h1 className="text-base font-bold text-amber-900 sm:text-lg">
                {t("brandName:pending.title")}
              </h1>
              <p className="mt-0.5 text-xs text-amber-800/90 sm:text-sm">
                {t("brandName:pending.submittedInfo", {
                  date: request.submitted_at,
                  ref: request.request_ref || `#${request.request_id}`,
                })}
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-amber-900">
            {request.status_label}
          </span>
        </div>
      </section>

      <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6">
        <BrandNameStepper currentStep={3} />
      </section>

      <section className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <HiOutlineClock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
        <p className="text-xs leading-relaxed text-amber-950 sm:text-sm">
          <span className="font-semibold">{t("brandName:pending.reviewTime")}</span>{" "}
          {t("brandName:pending.reviewTimeDesc")}
        </p>
      </section>

      <section className="overflow-hidden rounded-xl border border-brand-green/25 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-brand-green/15 bg-brand-green-pale px-4 py-3">
          <HiOutlineClipboardDocumentList className="h-4 w-4 text-secondary" aria-hidden />
          <h2 className="text-sm font-bold text-brand-blue sm:text-base">
            {t("brandName:pending.detailsTitle")}
          </h2>
        </div>
        <div className="divide-y divide-[#EEF2E8]">
          {detailRows.map((row, index) => (
            <div
              key={row.key}
              className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
                index % 2 === 0 ? "bg-brand-mint-softer" : "bg-white"
              }`}
            >
              <p className="text-xs font-medium text-[#6B7280] sm:text-sm">
                {t(`brandName:pending.fields.${row.key}`)}
              </p>
              <p
                className={`text-sm font-semibold sm:text-right ${
                  row.highlight ? "text-amber-600" : "text-[#1F2937]"
                }`}
              >
                {row.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-start gap-3 rounded-xl border border-brand-blue-border-soft bg-brand-blue-tint px-4 py-3">
        <HiOutlineInformationCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" aria-hidden />
        <p className="text-xs leading-relaxed text-brand-blue-text-muted sm:text-sm">
          <span className="font-semibold text-brand-blue">{t("brandName:pending.note")}</span>{" "}
          {t("brandName:pending.noteText")}
        </p>
      </section>

      <Button
        type="button"
        onClick={onCancel}
        disabled={isCancelling}
        className="flex w-fit items-center gap-2 border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold normal-case text-red-600 shadow-none hover:bg-red-50 hover:shadow-none disabled:opacity-60"
      >
        <FaXmark className="h-4 w-4" aria-hidden />
        {isCancelling ? t("brandName:pending.cancelling") : t("brandName:pending.cancelButton")}
      </Button>
    </div>
  );
}
