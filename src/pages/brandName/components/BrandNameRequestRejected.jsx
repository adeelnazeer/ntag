/* eslint-disable react/prop-types */
import { Button } from "@material-tailwind/react";
import { FaXmark, FaCircleXmark } from "react-icons/fa6";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { HiOutlineLifebuoy } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

export default function BrandNameRequestRejected({ request, onApplyNew, onContactSupport }) {
  const { t } = useTranslation(["brandName"]);

  if (!request) return null;

  const requestRef = request.request_ref || `#${request.request_id}`;

  const detailRows = [
    { key: "requestedBrand", value: request.brandname },
    { key: "requestId", value: requestRef },
    { key: "submittedOn", value: request.submitted_at },
    { key: "reviewedOn", value: request.status_updated_at },
    { key: "reviewedBy", value: t("brandName:rejected.reviewedByValue") },
    { key: "currentStatus", value: request.status_label, highlight: true },
  ];

  return (
    <div className="flex flex-col gap-4">
      <section className="overflow-hidden rounded-xl border border-red-200 bg-red-50 shadow-sm">
        <div className="flex items-start justify-between gap-3 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-100 text-red-600">
              <FaXmark className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h1 className="text-base font-bold text-red-800 sm:text-lg">
                {t("brandName:rejected.title")}
              </h1>
              <p className="mt-0.5 text-xs text-red-700/90 sm:text-sm">
                {t("brandName:rejected.reviewedInfo", {
                  date: request.status_updated_at,
                  ref: requestRef,
                })}
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-red-200 px-3 py-1 text-xs font-semibold text-red-800">
            {request.status_label}
          </span>
        </div>
      </section>

      {request.rejection_reason ? (
        <section className="rounded-xl border border-red-200 bg-red-50/70 px-4 py-4">
          <div className="mb-1.5 flex items-center gap-2">
            <FaCircleXmark className="h-4 w-4 text-red-600" aria-hidden />
            <h2 className="text-sm font-bold text-red-800">
              {t("brandName:rejected.reasonTitle")}
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-red-700">{request.rejection_reason}</p>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-xl border border-brand-green/25 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-brand-green/15 bg-brand-green-pale px-4 py-3">
          <HiOutlineClipboardDocumentList className="h-4 w-4 text-secondary" aria-hidden />
          <h2 className="text-sm font-bold text-brand-blue sm:text-base">
            {t("brandName:rejected.detailsTitle")}
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
                {t(`brandName:rejected.fields.${row.key}`)}
              </p>
              <p
                className={`text-sm font-semibold sm:text-right ${
                  row.highlight ? "text-red-600" : "text-[#1F2937]"
                }`}
              >
                {row.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-start gap-3 rounded-xl border border-brand-blue-border-soft bg-brand-blue-tint px-4 py-3">
        <HiOutlineLightBulb className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" aria-hidden />
        <p className="text-xs leading-relaxed text-brand-blue-text-muted sm:text-sm">
          <span className="font-semibold text-brand-blue">{t("brandName:rejected.tip")}</span>{" "}
          {t("brandName:rejected.tipText")}
        </p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={onApplyNew}
          className="flex flex-1 items-center justify-center gap-2 bg-secondary py-3 text-sm font-semibold normal-case text-white shadow-none hover:bg-brand-green-dark hover:shadow-none"
        >
          <HiOutlineClipboardDocumentList className="h-4 w-4" aria-hidden />
          {t("brandName:rejected.applyNewButton")}
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={onContactSupport}
          className="flex items-center justify-center gap-2 border-[#D1D5DB] bg-white py-3 text-sm font-semibold normal-case text-brand-blue shadow-none hover:shadow-none"
        >
          <HiOutlineLifebuoy className="h-4 w-4" aria-hidden />
          {t("brandName:rejected.contactSupportButton")}
        </Button>
      </div>
    </div>
  );
}
