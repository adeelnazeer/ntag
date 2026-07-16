/* eslint-disable react/prop-types */
import { Button, Typography } from "@material-tailwind/react";
import { IoMdCloseCircle } from "react-icons/io";
import { useTranslation } from "react-i18next";

export default function BrandNameCancelRequestModal({
  isOpen,
  onClose,
  onConfirm,
  isCancelling,
}) {
  const { t } = useTranslation(["brandName", "common"]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 p-2 backdrop-blur-sm">
      <div className="relative max-h-[92%] w-full max-w-md overflow-auto rounded-2xl bg-white p-6">
        <button
          type="button"
          className="absolute right-4 top-4 !text-xl text-gray-400 hover:text-gray-600"
          onClick={onClose}
          disabled={isCancelling}
          aria-label={t("brandName:cancelModal.keepButton")}
        >
          <IoMdCloseCircle />
        </button>

        <div className="mt-4 text-center">
          <Typography variant="h5" className="font-bold text-gray-900">
            {t("brandName:cancelModal.confirmTitle")}
          </Typography>
          <Typography className="mt-2 text-sm text-gray-600">
            {t("brandName:cancelModal.confirmMessage")}
          </Typography>
        </div>

        <div className="mt-6 flex gap-4">
          <Button
            className="flex-1 bg-gray-300 py-2.5 text-gray-800 shadow-none hover:shadow-none"
            onClick={onClose}
            disabled={isCancelling}
          >
            {t("brandName:cancelModal.keepButton")}
          </Button>
          <Button
            className="flex-1 bg-red-600 py-2.5 text-white shadow-none hover:bg-red-700 hover:shadow-none disabled:opacity-60"
            onClick={onConfirm}
            disabled={isCancelling}
          >
            {isCancelling
              ? t("brandName:cancelModal.cancelling")
              : t("brandName:cancelModal.confirmButton")}
          </Button>
        </div>
      </div>
    </div>
  );
}
