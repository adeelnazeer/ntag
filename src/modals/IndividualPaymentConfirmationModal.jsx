/* eslint-disable react/prop-types */
import React from 'react';
import { Button, Typography } from "@material-tailwind/react";
import { IoMdCloseCircle } from "react-icons/io";

const IndividualPaymentConfirmationModal = ({ isOpen, onClose, state, phoneNumber, businessType, isLoading, onConfirm, isChangeNumber = false, type, isExchangeFlow = false }) => {
  if (!isOpen) return null;

  const formatPrice = (price) => {
    if (!price) return "0.00";
    return Number(price).toFixed(2);
  };

  // Get the recurring fee amount and label
  const recurringFeeAmount = state?.service_fee || state?.recurring_fee_amount || 0;
  const recurringFeeLabel = state?.service_id || state?.recurring_fee_label || "Monthly";

  console.log({ state })

  return (
    <div className="fixed p-2 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-md max-h-[92%] overflow-auto rounded-2xl bg-white p-6">
        <div
          className="absolute right-4 top-4 cursor-pointer text-xl text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <IoMdCloseCircle />
        </div>

        <div className="mt-4 text-center">
          <Typography variant="h5" className="font-bold text-gray-900">
            Confirm {type === "reserve" ? "Reservation" : "Payment"}
          </Typography>

          <Typography className="mt-2 text-sm text-gray-600">
            Confirm your NameTAG {type === "reserve" ? "reservation" : "payment"} details to continue
          </Typography>
          {isExchangeFlow &&
            <Typography className="text-lg font-medium mt-2">
              You are about to change your NameTAG
            </Typography>}
          {isExchangeFlow &&
            <p className='className="flex justify-between border border-blue-200 bg-blue-50 px-4 text-sm text-blue-800 py-3 rounded-lg mt-3'>
              Waring : Once you change your NameTAG, any payments made for the previous NameTAG will not be carried forward.
            </p>
          }
        </div>

        <div className="mt-6">
          <div className="rounded-xl bg-gray-50 p-4">
            {/* NameTAG Row */}
            {!isExchangeFlow &&
              <div className="mb-3">
                <Typography className="text-sm text-gray-500">NameTAG</Typography>
                <Typography className="text-base font-medium">
                  {state.tag_name}
                </Typography>
              </div>
            }

            {/* Tag Number Row */}
            {!isExchangeFlow &&
              <div className="mb-3">
                <Typography className="text-sm text-gray-500">NameTAG Number</Typography>
                <Typography className="text-base font-medium">
                  #{state.tag_no}
                </Typography>
              </div>
            }
            {isExchangeFlow &&
              <>
                <div className="mb-3">
                  <Typography className="text-sm text-gray-500">NameTAG Number</Typography>
                  <Typography className="text-base font-medium">
                    #{state?.currentTagData?.length ? state?.currentTagData?.[0]?.tag_no : state?.currentTagData?.tag_no}
                  </Typography>
                </div>
                <div className="mb-3">
                  <Typography className="text-sm text-gray-500">New NameTAG</Typography>
                  <Typography className="text-base font-medium">
                    {state.tag_name}
                  </Typography>
                </div>
                <div className="mb-3">
                  <Typography className="text-sm text-gray-500">New NameTAG Number</Typography>
                  <Typography className="text-base font-medium">
                    #{state.tag_no}
                  </Typography>
                </div>
              </>
            }
            {/* Mobile Number Row */}
            <div className="mb-3">
              <Typography className="text-sm text-gray-500">Mobile Number</Typography>
              <Typography className="text-base font-medium">
                {phoneNumber}
              </Typography>
            </div>
            {isChangeNumber &&
              <div className="mb-3">
                <Typography className="text-sm text-gray-500">New Mobile Number</Typography>
                <Typography className="text-base font-medium">
                  +{state?.newNumber}
                </Typography>
              </div>
            }
            {/* Payment Method Row */}
            <div className="mb-3">
              <Typography className="text-sm text-gray-500">Payment Method</Typography>
              <Typography className="text-base font-medium">
                telebirr
              </Typography>
            </div>
            <div className="mb-3">
              <Typography className="text-sm text-gray-500">{state?.selectedFeeLabel ?? recurringFeeLabel} Recurring Fee</Typography>
              <Typography className="text-base font-medium">
                {formatPrice(state?.selectedAmount || state?.monthly_fee || state?.service_fee)} ETB
              </Typography>
            </div>
            {!isChangeNumber &&
              <div className="mb-3">
                <Typography className="text-sm text-gray-500">Subscription Fee</Typography>
                <Typography className="text-base font-medium">
                  {Number(state?.tag_price).toFixed(2)} ETB
                </Typography>
              </div>
            }
            {isExchangeFlow && state?.state?.outstanding_dues < 0 &&
              <div className="mb-3">
                <Typography className="text-sm text-gray-500">Outstanding Recurring Fee  (Previous Plan)</Typography>
                <Typography className="text-base font-medium">
                  {Math.abs(state?.outstanding_dues).toFixed(2)} ETB
                </Typography>
              </div>
            }

            <div className='mb-3'>
              <Typography className="text-sm text-gray-500 font-bold">Total Amount</Typography>
              <Typography className="text-base font-bold">
                {formatPrice(state.total_amount)} ETB
              </Typography>
            </div>






            {/* Monthly Recurring Fee Row - Display only for reservation */}
            {/* {type === "reserve" && ( */}

            {/* )} */}

            {/* Amount Row */}

          </div>
          {isExchangeFlow &&
            <Typography className="text-sm mt-3 text-gray-600">
              This action will replace your current NameTAG. Do you want to proceed?
            </Typography>
          }
        </div>

        <div className="mt-6 flex gap-4">
          <Button
            className="flex-1 py-2.5 bg-gray-300 text-gray-800 shadow-none hover:shadow-none"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 py-2.5 bg-secondary text-white shadow-none hover:shadow-none"
            onClick={onConfirm}
            loading={isLoading}
            disabled={isLoading}
          >
            {isExchangeFlow ? "Confirm To Buy" : (type === "reserve" ? "Confirm" : "Confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IndividualPaymentConfirmationModal;