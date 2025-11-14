/* eslint-disable react/prop-types */
import { Button, Typography } from "@material-tailwind/react";
import { IoMdCloseCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
import { useAppSelector } from "../redux/hooks";
import { useTranslation } from "react-i18next";

const Paymentsuccessful = ({
  isOpen,
  setIsOpen,
  state,
  user,
  isCustomer = false,
  type,
  isExchangeFlow = false,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation(["common"]);
  const corporateDocuments = useAppSelector(
    (state) => state.user.corporateDocuments
  );

  const docStatus = {
    status:
      corporateDocuments?.[0]?.doc_status == "1" &&
      corporateDocuments?.[1]?.doc_status == "1"
        ? 1
        : 0,
    doc_approval_status:
      corporateDocuments?.[0]?.doc_status == "1" &&
      corporateDocuments?.[1]?.doc_status == "1"
        ? 1
        : 0,
    corp_document: corporateDocuments,
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
        return t("common.monthly");
      case "monthly_fee":
        return t("common.monthly");
      case "quarterly_fee":
        return t("common.quartely");
      case "semiannually_fee":
        return t("common.semi");
      case "annually_fee":
        return t("common.annual");
      default:
        return t("common.monthly");
    }
  };

  // First try to get value from recurring_fee_label, then fall back to determining from recurring_fee_type
  const recurringFeeLabel =
    state?.recurring_fee_label ||
    getRecurringFeeLabel(state?.recurring_fee_type) ||
    "Monthly";

  // Try all possible sources for the recurring fee amount
  const recurringFeeAmount = safeParseNumber(
    state?.recurring_fee_amount !== undefined
      ? state.recurring_fee_amount
      : state?.service_fee !== undefined
      ? state.service_fee
      : 0
  );

  const tagPrice = safeParseNumber(
    state?.tag_price || state?.tag_name_price || 0
  );
  const exciseTax = safeParseNumber(state?.excisetax || 0);
  const vatableTotalAmount = safeParseNumber(state?.vatable_total || 0);
  const vatAmount = safeParseNumber(state?.VAT || 0);
  const stampDuty = safeParseNumber(state?.stamp_duty || 0); // Default to 5 if not available
  const totalAmount = safeParseNumber(
    state?.total_amount ||
      state?.totalPrice ||
      vatableTotalAmount + vatAmount + stampDuty
  );

  console.log("payment success", { state });

  return (
    <>
      {isOpen && (
        <div className="fixed p-2 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div
            className="relative m-4 w-full md:w-2/5 md:min-w-[40%] md:max-w-[40%] rounded-lg bg-white  text-base font-light leading-relaxed antialiased shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 md:p-4">
              <div
                className="flex text-secondary justify-end text-2xl font-snormal cursor-pointer"
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
                  {docStatus?.status == 0 || type == "reserve"
                    ? t("dashboard.reservation")
                    : t("dashboard.transaction")}{" "}
                  {t("dashboard.successful")}
                </Typography>
                {docStatus?.status == 0 ? (
                  <Typography className="text-xs md:text-[14px] mt-3 md:mt-4">
                    {t("dashboard.reserveMsg24")}
                  </Typography>
                ) : (
                  <Typography className="text-xs md:text-[14px] mt-3 md:mt-4">
                    {t("dashboard.successReserveMsg1")} <br />{" "}
                    {t("dashboard.successReserveMsg2")}
                  </Typography>
                )}
              </div>
              <div className="p-3 md:p-4 shadow rounded-xl mt-2 border bg-[#80808021] border-[#80808038]">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
                  <h1 className="text-sm md:text-base">
                    {t("dashboard.status")}
                  </h1>
                  {isCustomer ? (
                    <p className=" text-primary text-xs md:text-sm">
                      {t("dashboard.pendingForPayment")}
                    </p>
                  ) : (
                    <p className=" text-primary text-xs md:text-sm">
                      {docStatus?.doc_approval_status === 0
                        ? t("dashboard.documentApprovalProcess")
                        : t("dashboard.pendingForPayment")}
                    </p>
                  )}
                </div>

                <div className="flex justify-between mt-3 items-center">
                  <h1 className="text-[#7A798A] text-xs md:text-sm">
                    {t("dashboard.regMobileNumber")}
                  </h1>
                  <p className="text-xs md:text-sm ">{user}</p>
                </div>
                <div className="flex justify-between mt-3 items-center">
                  <h1 className="text-[#7A798A] text-xs md:text-sm">
                    {t("nameTag")}
                  </h1>
                  <p className="text-xs md:text-sm ">{state?.tag_name}</p>
                </div>
                <div className="flex justify-between mt-3 items-center">
                  <h1 className="text-[#7A798A] text-xs md:text-sm">
                    {t("nameTag")} {t("dashboard.number")}
                  </h1>
                  <p className="text-xs md:text-sm ">#{state?.tag_no}</p>
                </div>

                {/* {state?.tag_list_type == "vip_tag_list" && ( */}
                <div className="flex justify-between mt-3 items-center">
                  <h1 className="text-[#7A798A] text-xs md:text-sm">
                    {t("nameTag")} {t("dashboard.category")}
                  </h1>
                  <p className="text-xs md:text-sm  text-secondary">
                    {state?.tag_type}
                  </p>
                </div>
                {/* )} */}

                <div className="flex justify-between mt-3 items-center border-t">
                  <h1 className="text-[#7A798A] text-xs md:text-sm">
                    {t("dashboard.subscriptionFee")}
                  </h1>
                  <p className="text-xs md:text-sm ">
                    {" "}
                    {Number(state?.tag_price)?.toFixed(2) || ""}{" "}
                    {t("dashboard.etb")}
                  </p>
                </div>
                <div className="flex justify-between mt-3 items-center border-t">
                  <h1 className="text-[#7A798A] text-xs md:text-sm">
                    {recurringFeeLabel} {t("dashboard.recurringFee")}
                  </h1>
                  <p className="text-xs md:text-sm ">
                    {recurringFeeAmount.toFixed(2)} {t("dashboard.etb")}
                  </p>
                </div>
                {/* Detailed Price Breakdown with tax components */}
                <div className=" rounded-xl mt-4">
                  <Typography className="text-[16px] font-medium mb-2 border-b">
                    {t("dashboard.priceBreakDown")}
                  </Typography>

                  <div className="flex justify-between">
                    <Typography className="text-[14px]">
                      {t("dashboard.subTotal")}{" "}
                    </Typography>
                    <Typography className="text-[14px] ">
                      {state?.base_price || ""} {t("dashboard.etb")}
                    </Typography>
                  </div>
                  <div className="flex justify-between mt-2">
                    <Typography className="text-[14px]">
                      {t("dashboard.vat")} (15%)
                    </Typography>
                    <Typography className="text-[14px] ">
                      {state?.VAT || ""} {t("dashboard.etb")}
                    </Typography>
                  </div>
                  <div className="flex justify-between mt-2">
                    <Typography className="text-[14px]">
                      {t("dashboard.exciseTax")}
                    </Typography>
                    <Typography className="text-[14px] ">
                      {state.excisetax || ""} {t("dashboard.etb")}
                    </Typography>
                  </div>

                  {/* <div className="flex justify-between mt-2">
             <Typography className="text-[14px] font-bold">Vatable Total</Typography>
             <Typography className="text-[14px] font-bold">
               {vatableTotalAmount.toFixed(2)} ETB
             </Typography>
           </div> */}

                  <div className="flex justify-between mt-2">
                    <Typography className="text-[14px]">
                      {t("dashboard.stampDuty")}
                    </Typography>
                    <Typography className="text-[14px] ">
                      {state?.stamp_duty || ""} {t("dashboard.etb")}
                    </Typography>
                  </div>

                  <div className="flex justify-between mt-3 border-t py-2 font-medium">
                    <div className="flex items-center gap-2">
                      <Typography className="text-[14px] font-bold">
                        {t("dashboard.total")}{" "}
                      </Typography>
                    </div>
                    <Typography className="text-[14px] font-bold">
                      {state?.total_amount || ""} {t("dashboard.etb")}
                    </Typography>
                  </div>
                </div>

                {/* <div className="mt-3 border-t pt-3">
                  <h1 className="text-[#000000] text-xs md:text-sm font-medium mb-2">Price Breakdown</h1>

                  <div className="flex justify-between mt-2 items-center">
                    <h1 className="text-[#7A798A] text-xs md:text-sm">Sub Total </h1>
                    <p className="text-xs md:text-sm ">{state?.base_price} ETB</p>
                  </div>

                  <div className="flex justify-between mt-2 items-center">
                    <h1 className="text-[#7A798A] text-xs md:text-sm">VAT (15%)</h1>
                    <p className="text-xs md:text-sm ">{vatAmount.toFixed(2)} ETB</p>
                  </div>
                  <div className="flex justify-between mt-2 items-center">
                    <h1 className="text-[#7A798A] text-xs md:text-sm">Excise Tax</h1>
                    <p className="text-xs md:text-sm ">{exciseTax.toFixed(2)} ETB</p>
                  </div>

              


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
                </div> */}
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
                  {t("buttons.ok")}
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
