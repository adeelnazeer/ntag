import { useMemo, useState } from "react";
import { Button } from "@material-tailwind/react";
import {
  FaCircleExclamation,
  FaCircleXmark,
  FaUsers,
} from "react-icons/fa6";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

const MOCK_CALLERS = [
  { id: 1, msisdn: "+251 911 123 456", linkedDate: "22-05-2026", status: "active" },
  { id: 2, msisdn: "+251 912 234 567", linkedDate: "22-05-2026", status: "active" },
  { id: 3, msisdn: "+251 913 345 678", linkedDate: "23-05-2026", status: "active" },
];

const SUBSCRIPTION_DETAILS = [
  { key: "brandName", value: "MIDROC" },
  { key: "subscriptionStatus", value: "Active", highlight: true },
  { key: "registeredMobile", value: "+251 918 773 157" },
  { key: "registrationFee", value: "500.00 ETB" },
  { key: "recurringFeePerCaller", value: "20.00 ETB" },
  { key: "subscriptionPlan", value: "Monthly" },
  { key: "nextBillingDate", value: "22-06-2026" },
  { key: "paymentMethod", value: "telebirr partner App", link: true },
  { key: "brandType", value: "Gold" },
  { key: "activationDate", value: "22-05-2026" },
];

export default function BrandNameRecurringFeePage() {
  const { t } = useTranslation(["brandName"]);
  const [callers, setCallers] = useState(MOCK_CALLERS);

  const brandName = t("brandName:recurringFee.brandName");
  const perCallerFee = 20;
  const linkedCount = callers.length;
  const monthlyFee = linkedCount * perCallerFee;

  const subscriptionRows = useMemo(
    () =>
      SUBSCRIPTION_DETAILS.map((row) => ({
        ...row,
        label: t(`brandName:recurringFee.subscription.${row.key}`),
        displayValue:
          row.key === "brandName"
            ? brandName
            : row.key === "subscriptionStatus"
              ? t("brandName:recurringFee.statusActive")
              : row.value,
      })),
    [t, brandName]
  );

  const handleRemoveCaller = (id) => {
    setCallers((prev) => prev.filter((caller) => caller.id !== id));
  };

  const canUnsubscribe = linkedCount === 0;

  return (
    <div className="flex flex-col gap-4">
      <section className="overflow-hidden rounded-xl bg-gradient-to-r from-brand-green via-secondary to-brand-green-dark px-5 py-5 text-white shadow-sm sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{brandName}</h1>
            <p className="mt-1 text-sm text-white/90 sm:text-[15px]">
              {t("brandName:recurringFee.serviceSubtitle", {
                date: t("brandName:recurringFee.registeredDate"),
              })}
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-green-dark shadow-sm sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-secondary" aria-hidden />
            {t("brandName:recurringFee.statusActive")}
          </span>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-brand-green/30 bg-white px-4 py-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#6B7280] sm:text-xs">
            {t("brandName:recurringFee.stats.totalCalls")}
          </p>
          <p className="mt-2 text-2xl font-extrabold text-secondary sm:text-3xl">
            {t("brandName:recurringFee.stats.totalCallsValue")}
          </p>
          <p className="mt-1 text-xs text-[#9CA3AF]">{t("brandName:recurringFee.stats.sinceActivation")}</p>
        </div>
        <div className="rounded-xl border border-brand-green/30 bg-white px-4 py-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#6B7280] sm:text-xs">
            {t("brandName:recurringFee.stats.linkedCallers")}
          </p>
          <p className="mt-2 text-2xl font-extrabold text-secondary sm:text-3xl">{linkedCount}</p>
          <p className="mt-1 text-xs text-[#9CA3AF]">{t("brandName:recurringFee.stats.maxCallers")}</p>
        </div>
        <div className="rounded-xl border border-brand-green/30 bg-white px-4 py-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#6B7280] sm:text-xs">
            {t("brandName:recurringFee.stats.monthlyFee")}
          </p>
          <p className="mt-2 text-2xl font-extrabold text-secondary sm:text-3xl">
            {monthlyFee} {t("brandName:recurringFee.currency")}
          </p>
          <p className="mt-1 text-xs text-[#9CA3AF]">
            {t("brandName:recurringFee.stats.monthlyFeeBreakdown", {
              count: linkedCount,
              fee: perCallerFee.toFixed(2),
            })}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-brand-green/25 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-brand-green/15 bg-brand-green-pale px-4 py-3">
          <HiOutlineClipboardDocumentList className="h-4 w-4 text-secondary" aria-hidden />
          <h2 className="text-sm font-bold text-brand-blue sm:text-base">
            {t("brandName:recurringFee.subscription.title")}
          </h2>
        </div>
        <div className="divide-y divide-[#EEF2E8]">
          {subscriptionRows.map((row, index) => (
            <div
              key={row.key}
              className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
                index % 2 === 0 ? "bg-brand-mint-softer" : "bg-white"
              }`}
            >
              <p className="text-xs font-medium text-[#6B7280] sm:text-sm">{row.label}</p>
              {row.link ? (
                <button
                  type="button"
                  className="text-left text-sm font-semibold text-brand-blue hover:underline sm:text-right"
                >
                  {row.displayValue}
                </button>
              ) : (
                <p
                  className={`text-sm font-semibold sm:text-right ${
                    row.highlight ? "text-secondary" : "text-[#1F2937]"
                  }`}
                >
                  {row.displayValue}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-brand-green/25 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-brand-green/15 bg-brand-green-pale px-4 py-3">
          <FaUsers className="h-4 w-4 text-secondary" aria-hidden />
          <h2 className="text-sm font-bold text-brand-blue sm:text-base">
            {t("brandName:recurringFee.callers.title")}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E5E7EB] bg-[#FAFAFA] text-xs uppercase tracking-wide text-[#6B7280]">
              <tr>
                <th className="px-4 py-3 font-semibold">{t("brandName:recurringFee.callers.columns.index")}</th>
                <th className="px-4 py-3 font-semibold">{t("brandName:recurringFee.callers.columns.msisdn")}</th>
                <th className="px-4 py-3 font-semibold">{t("brandName:recurringFee.callers.columns.linkedDate")}</th>
                <th className="px-4 py-3 font-semibold">{t("brandName:recurringFee.callers.columns.status")}</th>
                <th className="px-4 py-3 font-semibold text-center">
                  {t("brandName:recurringFee.callers.columns.action")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF2E8]">
              {callers.length > 0 ? (
                callers.map((caller, index) => (
                  <tr key={caller.id} className={index % 2 === 0 ? "bg-brand-mint-softer" : "bg-white"}>
                    <td className="px-4 py-3 text-[#4B5563]">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-[#1F2937]">{caller.msisdn}</td>
                    <td className="px-4 py-3 text-[#4B5563]">{caller.linkedDate}</td>
                    <td className="px-4 py-3 font-semibold text-secondary">
                      {t("brandName:recurringFee.statusActive")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveCaller(caller.id)}
                        className="rounded-md border border-red-300 bg-white px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 sm:text-sm"
                      >
                        {t("brandName:recurringFee.callers.remove")}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-[#6B7280]">
                    {t("brandName:recurringFee.callers.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-red-200 bg-red-50/40 shadow-sm">
        <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-4 py-3">
          <FaCircleXmark className="h-4 w-4 text-red-600" aria-hidden />
          <h2 className="text-sm font-bold text-red-800 sm:text-base">
            {t("brandName:recurringFee.unsubscribe.title")}
          </h2>
        </div>

        <div className="space-y-4 p-4">
          {!canUnsubscribe ? (
            <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
              <FaCircleExclamation className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
              <p className="text-sm leading-relaxed text-amber-950">
                {t("brandName:recurringFee.unsubscribe.blockedWarning", { count: linkedCount })}
              </p>
            </div>
          ) : null}

          <p className="text-sm leading-relaxed text-[#4B5563]">
            {t("brandName:recurringFee.unsubscribe.description")}
          </p>

          <Button
            type="button"
            disabled={!canUnsubscribe}
            className="w-full bg-[#9CA3AF] py-3 text-sm font-semibold normal-case text-white shadow-none hover:shadow-none enabled:bg-red-600 enabled:hover:bg-red-700 disabled:opacity-100"
          >
            {t("brandName:recurringFee.unsubscribe.button")}
          </Button>
        </div>
      </section>
    </div>
  );
}
