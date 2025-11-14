/* eslint-disable react/prop-types */
import { Button, Typography } from "@material-tailwind/react";
import { IoMdCloseCircle } from "react-icons/io";
import { Textarea } from '@headlessui/react';
import { useTranslation } from "react-i18next";

const BuyTagConfirmationModal = ({ isOpen, onClose, modalAction, onConfirm, comment, setComment, tagNo = '', isIndividual = false }) => {
  const { t } = useTranslation(["buyTag"]);

  if (!isOpen) return null;

  const getTitle = () => {
    switch (modalAction) {
      case 'unsubscribe':
        return t("modal.titles.unsubscribe");
      case 'resubscribe':
        return t("modal.titles.resubscribe");
      case 'cancel':
        return t("modal.titles.cancel");
      case 'close':
        return t("modal.titles.close");
      default:
        return t("modal.titles.default");
    }
  };

  const getMessage = () => {
    switch (modalAction) {
      case 'unsubscribe':
        return t("modal.messages.unsubscribe", { tagNo });
      case 'resubscribe':
        return t("modal.messages.resubscribe");
      case 'cancel':
        return t("modal.messages.cancel");
      case 'close':
        return t("modal.messages.close");
      default:
        return t("modal.messages.default");
    }
  };

  const getDesc = () => {
    switch (modalAction) {
      case 'unsubscribe':
        if (isIndividual) {
          return t("modal.descriptions.unsubscribeIndividual");
        } else {
          return t("modal.descriptions.unsubscribeCorporate");
        }
      default:
        return null;
    }
  };

  const getWarning = () => {
    switch (modalAction) {
      case 'unsubscribe':
        return t("modal.warnings.unsubscribe");
      case 'cancel':
        return t("modal.warnings.cancel");
      default:
        return null;
    }
  };

  const getActionButtonText = () => {
    switch (modalAction) {
      case 'unsubscribe':
        return t("modal.actionButtons.unsubscribe");
      case 'resubscribe':
        return t("modal.actionButtons.resubscribe");
      case 'cancel':
        return t("modal.actionButtons.cancel");
      default:
        return t("modal.actionButtons.default");
    }
  };

  const getCancelButtonText = () => {
    if (modalAction === 'cancel') {
      return t("modal.cancelButtons.cancel");
    }
    return t("modal.cancelButtons.default");
  };

  const getActionButtonColor = () => {
    if (modalAction === 'unsubscribe' || modalAction === 'cancel') {
      return 'bg-red-500 text-white';
    }
    return 'bg-secondary text-white';
  };

  return (
    <div className="fixed p-2 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6">
        <div
          className="absolute right-4 top-4 cursor-pointer text-xl text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <IoMdCloseCircle />
        </div>

        <div className="mt-4 text-center">
          <Typography variant="h5" className="font-bold text-gray-900">
            {getTitle()}
          </Typography>
        </div>

        <div className="mt-6">
          <div className="rounded-xl bg-gray-50 p-4">
            <Typography className="text-sm text-gray-700">
              {getMessage()}
            </Typography>
            <Typography className="text-sm mt-3 text-gray-700">
              {getDesc()}
            </Typography>
            {(getWarning() && isIndividual == false) && (
              <Typography className="text-sm mt-3 text-red-500">
                {getWarning()}
              </Typography>
            )}

          </div>
        </div>
        {modalAction === 'close' && (
          <div className='mt-3'>
            <Textarea
              className={`mt-2 w-full rounded-xl resize-none px-4 py-2 bg-white outline-none`}
              placeholder={t("modal.placeholders.closeAccountReason")}
              maxLength={50}
              onChange={(e) => setComment(st => ({
                ...st,
                value: e.target.value,
                error: false
              }))}
              rows={3}
              style={
                comment?.error ? { border: "1px solid red" }
                  : { border: "1px solid #8A8AA033" }
              }
            />
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <Button
            className="flex-1 py-2.5 bg-gray-300 text-gray-800 shadow-none hover:shadow-none"
            onClick={onClose}
          >
            {getCancelButtonText()}
          </Button>
          <Button
            className={`flex-1 py-2.5 ${getActionButtonColor()} shadow-none hover:shadow-none`}
            onClick={onConfirm}
          >
            {getActionButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuyTagConfirmationModal;