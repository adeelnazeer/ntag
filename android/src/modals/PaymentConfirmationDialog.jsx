import React, { useEffect, useState } from 'react';
import { Button, Typography } from "@material-tailwind/react";
import { IoMdCloseCircle } from "react-icons/io";
import { FaReceipt, FaDownload } from "react-icons/fa";
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from '../utilities/routesConst';

const PaymentConfirmationDialog = ({ onClose, paymentData: externalPaymentData, callbackSuccess, onGeneratePDF }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
        const params = new URLSearchParams(window.location.search);

  const navigate = useNavigate()
  useEffect(() => {
    // if (externalPaymentData) {
    //   setPaymentDetails({
    //     status: externalPaymentData.trade_status,
    //     amount: externalPaymentData.total_amount,
    //     currency: externalPaymentData.trans_currency,
    //     orderId: externalPaymentData.merch_order_id,
    //     transactionId: externalPaymentData.payment_order_id,
    //     transEndTime: externalPaymentData.trans_end_time
    //   });
    // } else {
      setPaymentDetails({
        status: params.get('trade_status'),
        amount: params.get('total_amount'),
        currency: params.get('trans_currency'),
        orderId: params.get('merch_order_id'),
        transactionId: params.get('payment_order_id'),
        transEndTime: params.get('trans_end_time')
      });
    // }
  }, []);

  const handleClose = () => {
    let user = JSON.parse(localStorage.getItem('user'))
    let customerType= user?.customer_type
    if(customerType=="individual")
    window.location.replace(ConstentRoutes.dashboardCustomer);
  else{
    window.location.replace(ConstentRoutes.dashboard);
  }
  };

  const handleDownloadReceipt = () => {
    if (typeof onGeneratePDF === 'function') {
      onGeneratePDF();
    }
  };

  if (!isOpen || !paymentDetails) return null;

  const isSuccess = paymentDetails.status === 'PAY_SUCCESS';

  console.log({paymentDetails})

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6">
        <div 
          className="absolute right-4 top-4 cursor-pointer text-xl text-gray-400 hover:text-gray-600" 
          onClick={handleClose}
        >
          <IoMdCloseCircle />
        </div>

        <div className="mt-4 text-center">
          <Typography variant="h5" className="font-bold text-gray-900">
            {isSuccess ? 'Payment Successfully Completed!' : 'Payment Failed'}
          </Typography>
          
          {isSuccess && (
            <Typography className="mt-2 text-sm text-gray-600">
             Your NameTAG number has been successfully subscribed to your mobile number.
            </Typography>
          )}

          {!isSuccess && (
            <Typography className="mt-2 text-sm text-gray-600">
              Your payment could not be completed. Please try again.
            </Typography>
          )}
        </div>

        {isSuccess && (
          <div className="mt-6">
            <div className="rounded-xl bg-gray-50 p-4">
              {/* Amount Row */}
              <div className="mb-3">
                <Typography className="text-sm text-gray-500">Amount</Typography>
                <Typography className="text-base font-medium">
                  {paymentDetails.amount} {paymentDetails.currency}
                </Typography>
              </div>

              {/* Order ID Row */}
              <div className="mb-3">
                <Typography className="text-sm text-gray-500">Order ID</Typography>
                <Typography className="text-base font-medium break-words">
                  #{paymentDetails.orderId}
                </Typography>
              </div>

              {/* Transaction ID Row */}
              <div className="mb-3">
                <Typography className="text-sm text-gray-500">Transaction ID</Typography>
                <Typography className="text-base font-medium break-all">
                  {paymentDetails.transactionId}
                </Typography>
              </div>

              {/* Time Row */}
              <div>
                <Typography className="text-sm text-gray-500">Time</Typography>
                <Typography className="text-base font-medium">
                  {paymentDetails.transEndTime ? moment(paymentDetails.transEndTime).format("hh:mm A D MMM YYYY") : "N/A"}
                </Typography>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          {isSuccess ? (
            <div className="flex flex-col space-y-3">
              {callbackSuccess && (
                <Button
                  fullWidth
                  className="py-2.5 bg-[#8dc63f] text-white shadow-none hover:shadow-none flex items-center justify-center"
                  onClick={handleDownloadReceipt}
                >
                  <FaDownload className="mr-2" /> Download Receipt
                </Button>
              )}
              
              <Button
                fullWidth
                className="py-2.5 bg-gray-200 text-gray-800 shadow-none hover:shadow-none"
                onClick={handleClose}
              >
                Back to Dashboard
              </Button>
            </div>
          ) : (
            <Button
              fullWidth
              className="py-2.5 bg-red-500 text-white shadow-none hover:shadow-none"
              onClick={handleClose}
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationDialog;