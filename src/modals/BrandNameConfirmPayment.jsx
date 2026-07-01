/* eslint-disable react/prop-types */
import { Button, Typography } from "@material-tailwind/react";
import { IoMdCloseCircle } from "react-icons/io";
import { useTranslation } from "react-i18next";

const formatPrice = (value) => Number(value || 0).toFixed(2);

export default function BrandNameConfirmPayment({
  isOpen,
  onClose,
  onConfirm,
  brandname,
  phoneNumber,
  businessType,
  serviceId,
  registrationFee,
  perCallerFee,
  callersCount,
  monthlyRecurring,
  totalDueNow,
  request,
  isProcessing,
}) {
  const { t } = useTranslation(["brandName", "common"]);

  if (!isOpen) return null;

  const paymentMethodLabel =
    businessType === "BuyGoods"
      ? t("brandName:approved.methods.super_app.title")
      : t("brandName:approved.methods.partner_app.title");

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 p-2 backdrop-blur-sm">
      <div className="relative max-h-[92%] w-full max-w-md overflow-auto rounded-2xl bg-white p-6">
        <button
          type="button"
          className="absolute right-4 top-4 text-xl text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label={t("common:buttons.cancel")}
        >
          <IoMdCloseCircle />
        </button>

        <div className="mt-4 text-center">
          <Typography variant="h5" className="font-bold text-gray-900">
            {t("brandName:approved.confirmModal.title")}
          </Typography>
          <Typography className="mt-2 text-sm text-gray-600">
            {t("brandName:approved.confirmModal.message")}
          </Typography>
        </div>

        <div className="mt-6">
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="mb-3">
              <Typography className="text-sm text-gray-500">
                {t("brandName:approved.confirmModal.brandName")}
              </Typography>
              <Typography className="text-base font-medium">{brandname}</Typography>
            </div>

            <div className="mb-3">
              <Typography className="text-sm text-gray-500">
                {t("common:dashboard.mobileNo")}
              </Typography>
              <Typography className="text-base font-medium">{phoneNumber}</Typography>
            </div>

            <div className="mb-3">
              <Typography className="text-sm text-gray-500">
                {t("common:dashboard.paymentMethod")}
              </Typography>
              <Typography className="text-base font-medium">{paymentMethodLabel}</Typography>
            </div>

            <div className="mb-3">
              <Typography className="text-sm text-gray-500">
                {t("common:dashboard.servicePlan")}
              </Typography>
              <Typography className="text-base font-medium">{serviceId}</Typography>
            </div>

            <div className="mb-3">
              <Typography className="text-sm text-gray-500">
                {t("brandName:approved.registrationFee")}
              </Typography>
              <Typography className="text-base font-medium">
                {formatPrice(registrationFee)} {t("brandName:approved.currency")}
              </Typography>
            </div>

            <div className="mb-3">
              <Typography className="text-sm text-gray-500">
                {t("brandName:approved.perCallerFee", { serviceId: request.service_id })}
              </Typography>
              <Typography className="text-base font-medium">
                {formatPrice(perCallerFee)} {t("brandName:approved.currency")}
              </Typography>
            </div>

            <div className="mb-3">
              <Typography className="text-sm text-gray-500">
                {t("brandName:approved.numberOfCallers")}
              </Typography>
              <Typography className="text-base font-medium">{callersCount}</Typography>
            </div>

            <div className="mb-3">
              <Typography className="text-sm text-gray-500">
                {t("brandName:approved.monthlyRecurring", { serviceId: request.service_id })}
              </Typography>
              <Typography className="text-base font-medium">
                {formatPrice(monthlyRecurring)} {t("brandName:approved.currency")}
              </Typography>
            </div>

            <div>
              <Typography className="mt-3 text-sm font-bold text-gray-500">
                {t("brandName:approved.totalDueNow")}
              </Typography>
              <Typography className="text-base font-bold">
                {formatPrice(totalDueNow)} {t("brandName:approved.currency")}
              </Typography>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button
            className="flex-1 bg-gray-300 py-2.5 text-gray-800 shadow-none hover:shadow-none"
            onClick={onClose}
            disabled={isProcessing}
          >
            {t("common:buttons.cancel")}
          </Button>
          <Button
            className="flex-1 bg-secondary py-2.5 text-white shadow-none hover:shadow-none disabled:opacity-60"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing
              ? t("brandName:approved.processing")
              : t("common:dashboard.confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}
