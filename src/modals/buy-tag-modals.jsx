/* eslint-disable react/prop-types */
import React from 'react';
import { Button, Typography } from "@material-tailwind/react";
import { IoMdCloseCircle } from "react-icons/io";
import { Input, Textarea } from '@headlessui/react';

const BuyTagConfirmationModal = ({ isOpen, onClose, modalAction, onConfirm, comment, setComment, tagNo = '', isIndividual = false }) => {
  if (!isOpen) return null;

  const getTitle = () => {
    switch (modalAction) {
      case 'unsubscribe':
        return 'Confirm Unsubscribe';
      case 'resubscribe':
        return 'Confirm Resubscribe';
      case 'cancel':
        return 'Confirm Cancellation';
      case 'close':
        return 'Confirm Close Account';
      default:
        return 'Confirm Action';
    }
  };

  const getMessage = () => {
    switch (modalAction) {
      case 'unsubscribe':
        return `Unsubscribe from NameTAG #${tagNo}?`;
      case 'resubscribe':
        return 'Are you sure you want to resubscribe to this NameTAG service?';
      case 'cancel':
        return 'Are you sure you want to cancel your NameTAG reservation?';
      case 'close':
        return 'Are you sure you want to approve the NameTAG account closure request?';
      default:
        return 'Are you sure you want to proceed with this action?';
    }
  };

  const getWarning = () => {
    switch (modalAction) {
      case 'unsubscribe':
        return 'Note: You can resubscribe anytime within the next 7 days. After that this NameTAG will be available for others to buy.';
      case 'cancel':
        return 'If you proceed, your reservation will be cancelled, and this NameTAG will be released for others to buy.';
      default:
        return null;
    }
  };

  const getActionButtonText = () => {
    switch (modalAction) {
      case 'unsubscribe':
        return 'Unsubscribe';
      case 'resubscribe':
        return 'Resubscribe';
      case 'cancel':
        return 'Yes, Cancel Reservation';
      default:
        return 'Confirm';
    }
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
              placeholder="Enter reason for closing your account"
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
            {modalAction == 'cancel' ? 'No, Keep Reservation' : 'Cancel'}

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