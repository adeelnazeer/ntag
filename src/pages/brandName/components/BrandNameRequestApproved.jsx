/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Checkbox, Typography } from "@material-tailwind/react";
import { FaCheck } from "react-icons/fa6";
import { HiOutlineCreditCard, HiOutlineDevicePhoneMobile, HiOutlineBuildingLibrary } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import BrandNameStepper from "./BrandNameStepper";
import BrandNameConfirmPayment from "../../../modals/BrandNameConfirmPayment";
import { ConstentRoutes } from "../../../utilities/routesConst";

const formatPrice = (value) => Number(value || 0).toFixed(2);

const PAYMENT_METHODS = [
  { id: "super_app", icon: HiOutlineDevicePhoneMobile, accent: "bg-secondary", businessType: "BuyGoods" },
  { id: "partner_app", icon: HiOutlineBuildingLibrary, accent: "bg-brand-blue", businessType: "TransferToOtherOrg" },
];

export default function BrandNameRequestApproved({ request, onProceed, isProcessing }) {
  const { t } = useTranslation(["brandName", "common"]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termError, setTermError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!request) return null;

  const requestRef = request.request_ref || `#${request.request_id}`;
  const callersCount = request.callers_count ?? 0;
  const registrationFee =
    request.approved_registration_fee ?? request.registration_fee ?? 0;
  const perCallerFee =
    request.approved_monthly_fee_per_caller ?? request.monthly_fee_per_caller ?? 0;
  const monthlyRecurring =
    request.estimated_monthly_recurring ?? callersCount * perCallerFee;
  const totalDueNow = request.payable_registration_fee ?? registrationFee;
  const selectedBusinessType =
    PAYMENT_METHODS.find((method) => method.id === selectedMethod)?.businessType ?? "BuyGoods";

  const handleOpenConfirm = () => {
    if (!selectedMethod) return;
    if (!termsAccepted) {
      setTermError(t("brandName:approved.termError"));
      return;
    }
    setTermError("");
    setShowConfirmModal(true);
  };

  const handleConfirmPayment = () => {
    onProceed?.(selectedMethod);
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="overflow-hidden rounded-xl border border-brand-green/40 bg-brand-green-pale shadow-sm">
        <div className="flex items-start justify-between gap-3 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-white">
              <FaCheck className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h1 className="text-base font-bold text-brand-green-dark sm:text-lg">
                {t("brandName:approved.title")}
              </h1>
              <p className="mt-0.5 text-xs text-brand-green-muted sm:text-sm">
                {t("brandName:approved.approvedInfo", {
                  date: request.status_updated_at,
                  ref: requestRef,
                })}
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white">
            {request.status_label}
          </span>
        </div>
      </section>

      <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6">
        <BrandNameStepper currentStep={4} />
      </section>

      <section className="rounded-xl border border-brand-green/40 bg-white p-5 shadow-sm sm:p-6">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-secondary sm:text-3xl">{request.brandname}</h2>
          <p className="mt-1 text-xs text-[#6B7280] sm:text-sm">
            {t("brandName:approved.brandMeta", {
              count: callersCount,
              tier: request.brand_type,
            })}
          </p>
        </div>

        <div className="mt-4 rounded-lg bg-brand-green-pale px-4 py-4 sm:px-5">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#4B5563]">{t("brandName:approved.registeredMobile")}</span>
              <span className="font-semibold text-[#1F2937]">{request.msisdn}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#4B5563]">{t("brandName:approved.registrationFee")}</span>
              <span className="font-semibold text-[#1F2937]">
                {formatPrice(registrationFee)} {t("brandName:approved.currency")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#4B5563]">{t("brandName:approved.perCallerFee", { serviceId: request.service_id })}</span>
              <span className="font-semibold text-[#1F2937]">
                {formatPrice(perCallerFee)} {t("brandName:approved.currency")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#4B5563]">{t("brandName:approved.numberOfCallers")}</span>
              <span className="font-semibold text-[#1F2937]">{callersCount}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#4B5563]">{t("brandName:approved.monthlyRecurring", { serviceId: request.service_id })}</span>
              <span className="font-semibold text-[#1F2937]">
                {formatPrice(monthlyRecurring)} {t("brandName:approved.currency")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-secondary/20 pt-2">
              <span className="font-bold text-brand-green-dark">
                {t("brandName:approved.totalDueNow")}
              </span>
              <span className="text-base font-bold text-brand-green-dark">
                {formatPrice(totalDueNow)} {t("brandName:approved.currency")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-1 flex items-center gap-2">
          <HiOutlineCreditCard className="h-5 w-5 text-brand-blue" aria-hidden />
          <h2 className="text-sm font-bold text-brand-blue sm:text-base">
            {t("brandName:approved.paymentTitle")}
          </h2>
        </div>
        <p className="mb-4 text-xs text-[#6B7280] sm:text-sm">
          {t("brandName:approved.paymentSubtitle")}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {PAYMENT_METHODS.map((method) => {
            const Icon = method.icon;
            const active = selectedMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-5 text-center transition ${active
                    ? "border-secondary bg-brand-green-pale ring-1 ring-secondary"
                    : "border-[#E5E7EB] bg-white hover:border-secondary"
                  }`}
              >
                <span className={`grid h-12 w-12 place-items-center rounded-lg ${method.accent} text-white`}>
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="text-sm font-bold text-brand-blue">
                  {t(`brandName:approved.methods.${method.id}.title`)}
                </span>
                <span className="text-xs leading-relaxed text-[#6B7280]">
                  {t(`brandName:approved.methods.${method.id}.desc`)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 px-1">
          <div className="flex items-center">
            <span className="text-red-800">*</span>
            <Checkbox
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked);
                if (e.target.checked) setTermError("");
              }}
              style={
                termError
                  ? { border: "1px solid red" }
                  : { border: "1px solid #8A8AA033" }
              }
            />
            <Typography className="cursor-pointer text-sm">
              <span
                className="text-[#008fd5] hover:underline"
                onClick={() => window.open(ConstentRoutes.termofuse, "_blank")}
              >
                {t("common:dashboard.termAndCondition")}
              </span>
            </Typography>
          </div>
          {termError ? (
            <p className="mt-1 text-left text-sm text-[#FF0000]">{termError}</p>
          ) : null}
        </div>

        <Button
          type="button"
          disabled={!selectedMethod || isProcessing}
          onClick={handleOpenConfirm}
          className="mt-4 w-full bg-secondary py-3 text-sm font-semibold normal-case text-white shadow-none hover:bg-brand-green-dark hover:shadow-none disabled:bg-[#D1D5DB] disabled:opacity-100"
        >
          {isProcessing
            ? t("brandName:approved.processing")
            : t("brandName:approved.proceedButton")}
        </Button>
      </section>

      <BrandNameConfirmPayment
        isOpen={showConfirmModal}
        onClose={() => {
          if (!isProcessing) setShowConfirmModal(false);
        }}
        onConfirm={handleConfirmPayment}
        brandname={request.brandname}
        phoneNumber={request.msisdn}
        businessType={selectedBusinessType}
        serviceId={request.service_id}
        registrationFee={registrationFee}
        perCallerFee={perCallerFee}
        callersCount={callersCount}
        monthlyRecurring={monthlyRecurring}
        totalDueNow={totalDueNow}
        request={request}
        isProcessing={isProcessing}
      />
    </div>
  );
}
