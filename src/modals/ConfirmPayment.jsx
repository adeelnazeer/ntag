/* eslint-disable react/prop-types */
import React from "react";
import { Button, Typography } from "@material-tailwind/react";
import { IoMdCloseCircle } from "react-icons/io";
import { useTranslation } from "react-i18next";

const PaymentConfirmationModal = ({
  isOpen,
  onClose,
  state,
  phoneNumber,
  businessType,
  onConfirm,
  isCustomer = false,
  type,
}) => {
  const { t } = useTranslation(["profile"]);

  if (!isOpen) return null;
  const formatPrice = (price) => {
    if (!price) return "0.00";
    return Number(price).toFixed(2);
  };

  return (
    <div className="fixed p-2 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative max-h-[92%] overflow-auto w-full max-w-md rounded-2xl bg-white p-6">
        <div
          className="absolute right-4 top-4 cursor-pointer text-xl text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <IoMdCloseCircle />
        </div>

        <div className="mt-4 text-center">
          <Typography variant="h5" className="font-bold text-gray-900">
            {t("dashboard.confirm")}{" "}
            {type == "reserve" ? t("buttons.reserve") : t("dashboard.payment")}
          </Typography>
          {type == "reserve" ? (
            <Typography className="mt-2 text-sm text-gray-600">
              {t("dashboard.confirmReserveMsg")}
            </Typography>
          ) : (
            <Typography className="mt-2 text-sm text-gray-600">
              {t("dashboard.confirmPaymentMsg")}
            </Typography>
          )}
        </div>

        <div className="mt-6">
          <div className="rounded-xl bg-gray-50 p-4">
            {/* NameTAG Row */}
            <div className="mb-3">
              <Typography className="text-sm text-gray-500">
                {t("nameTag")}
              </Typography>
              <Typography className="text-base font-medium">
                {state.tag_name}
              </Typography>
            </div>

            {/* Tag Number Row */}
            <div className="mb-3">
              <Typography className="text-sm text-gray-500">
                {t("nameTag")} {t("dashboard.number")}
              </Typography>
              <Typography className="text-base font-medium">
                #{state.tag_no}
              </Typography>
            </div>

            {/* Mobile Number Row */}
            <div className="mb-3">
              <Typography className="text-sm text-gray-500">
                {t("dashboard.mobileNo")}
              </Typography>
              <Typography className="text-base font-medium">
                {phoneNumber}
              </Typography>
            </div>

            {/* Payment Method Row */}
            <div className="mb-3">
              <Typography className="text-sm text-gray-500">
                {t("dashboard.paymentMethod")}
              </Typography>
              <Typography className="text-base font-medium">
                {t("dashboard.telebirr")}
              </Typography>
            </div>

            {/* Payment Option Row */}
            {/* <div className="mb-3">
              <Typography className="text-sm text-gray-500">Payment Option</Typography>
              <Typography className="text-base font-medium">
                 Payment via telebirr
              </Typography>
            </div> */}

            {/* Amount Row */}

            <div className="mt-3">
              <Typography className="text-sm text-gray-500">
                {t("dashboard.servicePlan")}
              </Typography>
              <Typography className="text-base font-medium">
                {state?.service_id}
              </Typography>
            </div>
            <div className="mt-3 ">
              <Typography className="text-sm text-gray-500">
                {t("dashboard.recurringFee")}
              </Typography>
              <Typography className="text-base font-medium">
                {Number(state?.recurring_fee_amount)?.toFixed(2)} {t("dashboard.etb")}
              </Typography>
            </div>
            <div className="mt-3 ">
              <Typography className="text-sm text-gray-500">
                {t("dashboard.subscriptionFee")}
              </Typography>
              <Typography className="text-base font-medium">
                {Number(state?.tag_price)?.toFixed(2)} {t("dashboard.etb")}
              </Typography>
            </div>
            <div>
              <Typography className="text-sm mt-3 text-gray-500 font-bold">
                {t("dashboard.total")}
              </Typography>
              <Typography className="text-base font-bold">
                {formatPrice(state.totalPrice)} {t("dashboard.etb")}
              </Typography>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button
            className="flex-1 py-2.5 bg-gray-300 text-gray-800 shadow-none hover:shadow-none"
            onClick={onClose}
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            className="flex-1 py-2.5 bg-secondary text-white shadow-none hover:shadow-none"
            onClick={onConfirm}
          >
             {t("buttons.confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationModal;
