/* eslint-disable react/prop-types */
import { Button, Typography } from "@material-tailwind/react";
import { IoMdCloseCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
import { useAppSelector } from "../redux/hooks";

const Paymentsuccessful = ({ isOpen, setIsOpen, state, user, isCustomer = false, type, isExchangeFlow = false }) => {
  const navigate = useNavigate();

  const corporateDocuments = useAppSelector(state => state.user.corporateDocuments);

  const docStatus = {
    status: (corporateDocuments?.[0]?.doc_status == "1" && corporateDocuments?.[1]?.doc_status == "1") ? 1 : 0,
    doc_approval_status: (corporateDocuments?.[0]?.doc_status == "1" && corporateDocuments?.[1]?.doc_status == "1") ? 1 : 0,
    corp_document: corporateDocuments
  };

  // Helper function to safely parse numbers
  const safeParseNumber = (value) => {
    if (value === undefined || value === null) return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const getRecurringFeeLabel = (type) => {
    switch (type) {
      case "service_fee":
        return "Monthly";
      case "monthly_fee":
        return "Monthly";
      case "quarterly_fee":
        return "Quarterly";
      case "semiannually_fee":
        return "Semi-Annually";
      case "annually_fee":
        return "Annually";
      default:
        return "Monthly";
    }
  };

  // First try to get value from recurring_fee_label, then fall back to determining from recurring_fee_type
  const recurringFeeLabel = state?.recurring_fee_label || getRecurringFeeLabel(state?.recurring_fee_type) || "Monthly";

  // Try all possible sources for the recurring fee amount
  const recurringFeeAmount = safeParseNumber(
    state?.recurring_fee_amount !== undefined ? state.recurring_fee_amount :
      state?.service_fee !== undefined ? state.service_fee :
        0
  );

  const tagPrice = safeParseNumber(state?.tag_price || state?.tag_name_price || 0);
  const exciseTax = safeParseNumber(state?.excisetax || 0);
  const vatableTotalAmount = safeParseNumber(state?.vatable_total || 0);
  const vatAmount = safeParseNumber(state?.VAT || 0);
  const stampDuty = safeParseNumber(state?.stamp_duty || 0); // Default to 5 if not available
  const totalAmount = safeParseNumber(
    state?.total_amount || state?.totalPrice || (vatableTotalAmount + vatAmount + stampDuty)
  );

  return (
    <>
      {isOpen && (
        <div className="fixed p-2 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div
            className="relative m-4 w-full md:w-2/5 md:min-w-[40%] md:max-w-[40%] rounded-lg bg-white  text-base font-light leading-relaxed antialiased shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 md:p-4">
              <div className="flex text-secondary justify-end text-2xl font-snormal cursor-pointer"
                onClick={() => {
                  if (isCustomer) {
                    navigate(ConstentRoutes.dashboardCustomer);
                  } else {
                    navigate(ConstentRoutes.dashboard);
                  }
                  setIsOpen(false);
                }}
              >
                <IoMdCloseCircle />
              </div>
              <div className="text-center">
                <Typography variant="h5" className="text-lg md:text-xl">
                  {docStatus?.status == 0 || type == "reserve" ? "Reservation" : "Transaction"} Successful
                </Typography>
                {docStatus?.status == 0 ? (
                  <Typography className="text-xs md:text-[14px] mt-3 md:mt-4">
                    Your NameTAG is successfully Reserved for 24 hours.
                  </Typography>
                ) : (
                  <Typography className="text-xs md:text-[14px] mt-3 md:mt-4">
                    Your NameTAG number has been successfully reserved with <br /> your mobile number.
                  </Typography>
                )}
              </div>
              <div className="p-3 md:p-4 shadow rounded-xl mt-2 border bg-[#80808021] border-[#80808038]">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
                  <h1 className="text-sm md:text-base">Status</h1>
                  {isCustomer ?
                    <p className=" text-primary text-xs md:text-sm">
                      {"Pending for Payment"}
                    </p>
                    :
                    <p className=" text-primary text-xs md:text-sm">
                      {docStatus?.doc_approval_status === 0 ? "Document Approval in Progress" : "Pending for Payment"}
                    </p>
                  }
                </div>

                <div className="flex justify-between mt-3 items-center">
                  <h1 className="text-[#7A798A] text-xs md:text-sm">Registered Mobile Number</h1>
                  <p className="text-xs md:text-sm ">{user}</p>
                </div>
                <div className="flex justify-between mt-3 items-center">
                  <h1 className="text-[#7A798A] text-xs md:text-sm">NameTAG</h1>
                  <p className="text-xs md:text-sm ">{state?.tag_name}</p>
                </div>
                <div className="flex justify-between mt-3 items-center">
                  <h1 className="text-[#7A798A] text-xs md:text-sm">NameTAG Number</h1>
                  <p className="text-xs md:text-sm ">#{state?.tag_no}</p>
                </div>

                {/* {state?.tag_list_type == "vip_tag_list" && ( */}
                  <div className="flex justify-between mt-3 items-center">
                    <h1 className="text-[#7A798A] text-xs md:text-sm">NameTAG Category</h1>
                    <p className="text-xs md:text-sm  text-secondary">{state?.tag_type}</p>
                  </div>
                {/* )} */}

                {/* Detailed Price Breakdown with tax components */}
                <div className="mt-3 border-t pt-3">
                  <h1 className="text-[#000000] text-xs md:text-sm font-medium mb-2">Price Breakdown</h1>

                  <div className="flex justify-between mt-2 items-center">
                    <h1 className="text-[#7A798A] text-xs md:text-sm">Sub Total </h1>
                    <p className="text-xs md:text-sm ">{state?.base_price?.toFixed(2)} ETB</p>
                  </div>

                  <div className="flex justify-between mt-2 items-center">
                    <h1 className="text-[#7A798A] text-xs md:text-sm">VAT (15%)</h1>
                    <p className="text-xs md:text-sm ">{vatAmount.toFixed(2)} ETB</p>
                  </div>
                  <div className="flex justify-between mt-2 items-center">
                    <h1 className="text-[#7A798A] text-xs md:text-sm">Excise Tax</h1>
                    <p className="text-xs md:text-sm ">{exciseTax.toFixed(2)} ETB</p>
                  </div>

                  {/* <div className="flex justify-between mt-2 items-center">
                    <h1 className="text-[#7A798A] text-xs md:text-sm ">Vatable Total</h1>
                    <p className="text-xs md:text-sm ">{vatableTotalAmount.toFixed(2)} ETB</p>
                  </div> */}


                  <div className="flex justify-between mt-2 items-center">
                    <h1 className="text-[#7A798A] text-xs md:text-sm">Stamp Duty</h1>
                    <p className="text-xs md:text-sm ">{stampDuty.toFixed(2)} ETB</p>
                  </div>

                  <div className="flex justify-between mt-2 items-center border-t pt-2">
                    <h1 className="text-[#000000] text-xs md:text-sm font-bold ">Total Subscription Fee</h1>
                    <p className="text-xs md:text-sm  font-bold">{totalAmount.toFixed(2)} ETB</p>
                  </div>
                </div>

                <div className="flex justify-between mt-3 items-center border-t pt-3">
                  <h1 className="text-[#7A798A] text-xs md:text-sm">{recurringFeeLabel} Recurring Fee</h1>
                  <p className="text-xs md:text-sm ">{recurringFeeAmount.toFixed(2)} ETB</p>
                </div>


              </div>
              <div className="flex items-center justify-center mt-4">
                <Button
                  className="bg-secondary py-1 md:py-2 px-4 md:px-6 text-white text-xs md:text-sm"
                  onClick={() => {
                    if (isCustomer) {
                      navigate(ConstentRoutes.dashboardCustomer);
                    } else {
                      navigate(ConstentRoutes.dashboard);
                    }
                    setIsOpen(false);
                  }}
                >
                  {"OK"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Paymentsuccessful;