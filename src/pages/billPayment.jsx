/* eslint-disable react/prop-types */
import { Button, Typography, Select, Option, Spinner, Checkbox } from "@material-tailwind/react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getPriceBreakDown, getTagStatusDashboard, ConstentRoutes } from "../utilities/routesConst";
import { formatPhoneNumberCustom } from "../utilities/formatMobileNumber";
import Paymentsuccessful from "../modals/paymentsuccessful";
import { useTagList } from "./hooks/useDashboard";
import useSchedularHook from "./hooks/schedularHook";
import moment from "moment";
import Header from "../components/header";

const BillPayment = () => {
  const location = useLocation();
  const { t } = useTranslation(["buyTag"]);
  const dashboard = useTagList();

  const {
    data: tagDataList,
    loading: tagLoading,
  } = useSchedularHook("tagname");

  const [selectedTagData, setSelectedTagData] = useState(null);
  const [businessType, setBusinessType] = useState("TransferToOtherOrg");
  const [isOpenPayment, setIsOpenPayment] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const stateData = location.state || {};
  
  let userData = {};
  try {
    userData = JSON.parse(localStorage.getItem("user")) || {};
  } catch (e) {
    console.error("Error parsing user data:", e);
  }

  // Get the tag data from the fetched list - use the first reserved tag or first tag in the list
  useEffect(() => {
    if (Array.isArray(tagDataList) && tagDataList.length > 0) {
      // If there's a specific tag ID in state, find it; otherwise use the first reserved tag or first tag
      const tagId = stateData?.tag_id || stateData?.reserve_tag_id;
      
      if (tagId) {
        const foundTag = tagDataList.find(
          (tag) => tag?.reserve_tag_id === tagId || tag?.id === tagId
        );
        if (foundTag) {
          setSelectedTagData(foundTag);
        }
      } else {
        // Use the first reserved tag if available, otherwise first tag
        const reservedTag = tagDataList.find((tag) => tag?.type === "reserve");
        setSelectedTagData(reservedTag || tagDataList[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagDataList]);

  // Get tag info - handle both premium and regular tags
  const isPremium = selectedTagData?.tag_list_premium_id == 1 || selectedTagData?.is_premium;
  const tagInfo = isPremium && selectedTagData?.corp_premium_tag_list
    ? selectedTagData.corp_premium_tag_list
    : selectedTagData?.corp_tag_list || selectedTagData || {};

  const tagPrice = tagInfo.tag_name_price !== undefined
    ? Number(tagInfo.tag_name_price)
    : Number(tagInfo.tag_price || 0);

  const formatPrice = (price) => {
    if (!price) return "0.00";
    return Number(price).toFixed(2);
  };


  // Get service_id and recurring fee from data (like buytagname.jsx)
  const serviceIdFromData = selectedTagData?.service_id || "Monthly";
  
  const getRecurringFeeFromData = () => {
    if (!selectedTagData) return 0;
    const serviceId = serviceIdFromData;
    if (serviceId === "Monthly") {
      return tagInfo?.monthly_fee || selectedTagData?.service_fee || 0;
    } else if (serviceId === "Quarterly") {
      return tagInfo?.quarterly_fee || selectedTagData?.service_fee || 0;
    } else if (serviceId === "Semi-Annually") {
      return tagInfo?.semiannually_fee || selectedTagData?.service_fee || 0;
    } else if (serviceId === "Annually") {
      return tagInfo?.annually_fee || selectedTagData?.service_fee || 0;
    }
    return selectedTagData?.service_fee || 0;
  };

  const recurringFeeAmount = getRecurringFeeFromData();

  // Get recurring fee type for API
  const getRecurringFeeType = (serviceId) => {
    switch (serviceId) {
      case "Monthly": return "monthly_fee";
      case "Quarterly": return "quarterly_fee";
      case "Semi-Annually": return "semiannually_fee";
      case "Annually": return "annually_fee";
      default: return "monthly_fee";
    }
  };

  const getNextChargeDate = (serviceId, date) => {
    const now = date || new Date();
    let daysToAdd = 30; // Default Monthly
    if (serviceId === "Quarterly") daysToAdd = 90;
    else if (serviceId === "Semi-Annually") daysToAdd = 180;
    else if (serviceId === "Annually") daysToAdd = 365;
    
    return new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  };

  const nextChargeDate = getNextChargeDate(serviceIdFromData, new Date());

  const priceBreakdown = getPriceBreakDown({ 
    tagPrice: 0, 
    packageFee: Number(recurringFeeAmount) 
  });

  const handleProceed = () => {
    const accountId = userData?.parent_id != null && userData?.parent?.customer_account_id 
      ? userData.parent.customer_account_id 
      : userData?.customer_account_id;

    const reserveType = selectedTagData?.reserve_tag_id ? "existing" : "new";
    const tagListType = isPremium ? "premium_tag_list" : "corp_tag_list";
    const recurringFeeType = getRecurringFeeType(serviceIdFromData);

    const values = {
      transaction_type: "CORP_BUYTAG",
      channel: "WEB",
      account_id: accountId,
      customer_tag_id: tagInfo?.id || selectedTagData?.id,
      type: "buy",
      corp_reserve_tag_id: selectedTagData?.reserve_tag_id || null,
      title: `#${tagInfo?.tag_name || selectedTagData?.tag_name}`,
      customer_tag_no: tagInfo?.tag_no || selectedTagData?.tag_no || "",
      phone_number: (userData?.phone_number || "").replace(/^\+/, ""),
      amount: priceBreakdown?.totalPrice?.toString(),
      payment_method: businessType == "BuyGoods" ? "telebirr" : "telebirr_partnerapp",
      reserve_type: reserveType,
      msisdn: (userData?.phone_number || "").replace(/^\+/, ""),
      business_type: businessType,
      payment_type :"CORP_RECURRING",
      service_fee: recurringFeeAmount,
      recurring_fee_type: recurringFeeType,
      recurring_fee_amount: recurringFeeAmount,
      recurring_fee_label: serviceIdFromData,
      service_id: serviceIdFromData,
      is_premium: isPremium,
      tag_list_type: tagListType,
      excisetax: priceBreakdown?.excisetax,
      vatable_total: priceBreakdown?.totalVAT,
      vat: priceBreakdown?.totalVAT,
      stamp_duty: priceBreakdown?.stampDuty,
      total_amount: priceBreakdown?.totalPrice,
      exchange_days_adjust: "0",
      dues: 0,
      next_charge_date: nextChargeDate ? moment(nextChargeDate).format("YYYY-MM-DD") : null,
    };

    if (tagListType === "premium_tag_list") {
      values.tag_list = {
        id: tagInfo?.id || selectedTagData?.id,
        tag_no: tagInfo?.tag_no || selectedTagData?.tag_no || "",
        tag_name: tagInfo?.tag_name || selectedTagData?.tag_name || "",
        tag_price: (tagInfo?.tag_price || tagInfo?.tag_name_price || "0").toString(),
        service_fee: (recurringFeeAmount || "0").toString(),
        service_id: serviceIdFromData,
        tag_type: tagInfo?.tag_type || selectedTagData?.tag_type || "VIP",
        tag_digits: tagInfo?.tag_digits || selectedTagData?.tag_digits || 0,
        created_date: tagInfo?.created_date || selectedTagData?.created_date || "",
        status: tagInfo?.status || selectedTagData?.status || 1,
        comments: tagInfo?.comments || selectedTagData?.comments || "",
        tax: "0",
        is_premium: true,
        excisetax: priceBreakdown?.excisetax,
        vatable_total: priceBreakdown?.totalPrice,
        VAT: priceBreakdown?.totalVAT,
        stamp_duty: priceBreakdown?.stampDuty,
        total_amount: priceBreakdown?.totalPrice,
        exchange_days_adjust: "0",
        next_charge_date: nextChargeDate ? moment(nextChargeDate).format("YYYY-MM-DD") : null,
      };
    } else {
      values.tag_list = {
        id: tagInfo?.id || selectedTagData?.id,
        tag_no: tagInfo?.tag_no || selectedTagData?.tag_no || "",
        tag_name: tagInfo?.tag_name || selectedTagData?.tag_name || "",
        tag_price: (tagInfo?.tag_price || "0").toString(),
        service_id: serviceIdFromData,
        tag_type: tagInfo?.tag_type || selectedTagData?.tag_type || "",
        tag_digits: tagInfo?.tag_digits || selectedTagData?.tag_digits || 0,
        created_date: tagInfo?.created_date || selectedTagData?.created_date || "",
        status: tagInfo?.status || selectedTagData?.status || 1,
        comments: tagInfo?.comments || selectedTagData?.comments || "",
        tax: "0",
        is_premium: false,
        excisetax: priceBreakdown?.excisetax,
        vatable_total: priceBreakdown?.totalPrice,
        VAT: priceBreakdown?.totalVAT,
        stamp_duty: priceBreakdown?.stampDuty,
        total_amount: priceBreakdown?.totalBasePrice,
        exchange_days_adjust: "0",
        next_charge_date: nextChargeDate ? moment(nextChargeDate).format("YYYY-MM-DD") : null,
      };
    }

    dashboard.handleTagDetails(values, setIsOpenPayment, setDisableBtn);
  };

  if (tagLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <Spinner className="h-12 w-12 mx-auto" color="green" />
          <Typography className="text-lg font-bold text-gray-900 mt-4">
            {t("dashboard.loading", { defaultValue: "Loading..." })}
          </Typography>
        </div>
      </div>
    );
  }

  if (!selectedTagData || !tagInfo?.tag_name) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <Typography className="text-lg font-bold text-gray-900 mb-2">
            No Tag Information Available
          </Typography>
          <Typography className="text-sm text-gray-600">
            Please go back and try again.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex justify-center min-h-screen bg-gray-50 py-8 px-4">
        <div className="bg-white max-w-[800px] w-full rounded-xl shadow">
        {/* Page Heading */}
        <div className="p-4 px-6 border-b border-gray-200">
          <Typography className="text-[#1F1F2C] text-lg font-bold">
            {t("dashboard.paymentDetails", { defaultValue: "NameTAG Recurring Payment Details " })}
          </Typography>
        </div>

        <div className="p-4 md:p-6">
          <div className="p-4 rounded-xl shadow-sm border border-gray-100">
          {/* Tag Header */}
          <div className="flex justify-between bg-[#F6F7FB] md:px-3 px-2 py-3 rounded-xl items-center">
            <div className="flex items-center gap-3">
              <Typography className="md:text-[14px] text-[12px] font-bold">
                {tagInfo?.tag_name || t("common.na")}
              </Typography>
            </div>
            <div>
              <Typography className="text-[14px] bg-secondary py-1 px-4 rounded-lg text-white">
                #{tagInfo?.tag_no || t("common.na")}
              </Typography>
            </div>
          </div>

          {/* Premium tag indicator */}
          <div className="flex justify-between border border-blue-200 bg-blue-50 md:px-4 px-3 py-3 rounded-xl mt-3 shadow-sm">
            <Typography className="text-[14px]">
              {t("tagInfo.tagType")}
            </Typography>
            <Typography className="text-[14px] font-bold text-blue-600">
              {isPremium ? t("tagInfo.premium") : t("tagInfo.corporate")}
            </Typography>
          </div>

          {/* NameTAG Category */}
          <div className="flex justify-between text-[#232323] md:px-4 px-3 py-3 rounded-xl mt-1">
            <Typography className="md:text-[14px] text-[12px]">
              {t("tagInfo.nameTagCategory")}
            </Typography>
            <Typography className="md:text-[14px] text-[12px]">
              {tagInfo?.tag_type || t("common.na")}
            </Typography>
          </div>

          {/* Registered Mobile Number */}
          {selectedTagData?.msisdn && (
            <div className="flex justify-between text-[#232323] md:px-4 px-3 py-3 rounded-xl mt-1">
              <Typography className="md:text-[14px] text-[12px]">
                {t("tagInfo.registeredMobileNumber")}
              </Typography>
              <Typography className="md:text-[14px] text-[12px]">
                {formatPhoneNumberCustom(selectedTagData.msisdn) || t("common.na")}
              </Typography>
            </div>
          )}

      

          {/* Service Package - Read Only (like buytagname.jsx) */}
          <div className="flex justify-between gap-1 md:px-4 px-3 py-3 rounded-xl mt-1">
            <Typography className="text-[14px]">
              {t("tagInfo.servicePackage")}
            </Typography>
            <Typography className="md:text-[14px] text-[12px]">
              {serviceIdFromData}
            </Typography>
          </div>

          {/* Recurring Fee - Read Only (like buytagname.jsx) */}
          <div className="flex justify-between md:px-4 px-3 py-3 rounded-xl mt-1">
            <Typography className="text-[14px]">
              {serviceIdFromData || t("tagInfo.monthly")} {t("tagInfo.recurringFee")}
            </Typography>
            <Typography className="md:text-[14px] text-[12px]">
              {formatPrice(recurringFeeAmount)} {t("common.etb")}
            </Typography>
          </div>

          {/* Service Status */}
          <div className="flex justify-between gap-1 md:px-4 px-3 py-3 rounded-xl mt-1">
            <Typography className="text-[14px]">
              {t("tagInfo.serviceStatus")}
            </Typography>
            <Typography className="md:text-[14px] text-[12px]">
            {getTagStatusDashboard(selectedTagData?.status)}
            </Typography>
          </div>

          {/* Payment Option */}
          <div className="border-[#77777733] border bg-[#F6F7FB] px-4 py-3 rounded-xl mt-3 shadow-sm">
            <div className="flex justify-between items-center">
              <Typography className="text-[14px]">
                {t("dashboard.paymentOption", { defaultValue: "Payment Option" })}
              </Typography>
              <div className="w-80">
                <Select
                  value={businessType}
                  onChange={(value) => setBusinessType(value)}
                  className="border border-[#8dc63f] rounded-lg"
                >
                  <Option value="TransferToOtherOrg">
                    {t("dashboard.paymentViaTelebirrPartnerApp", { defaultValue: "Payment via telebirr Partner App" })}
                  </Option>
                  <Option value="BuyGoods">
                    {t("dashboard.paymentViaTelebirrSuperApp", { defaultValue: "Payment via telebirr Super App" })}
                  </Option>
                </Select>
              </div>
            </div>
            {/* Payment Note */}
            {businessType === "BuyGoods" ? (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Typography className="text-[12px] text-blue-800">
                  <strong>Note:</strong> To switch your payment method to the Super App, your registered mobile number must be linked with the telebirr Super App. From the next billing cycle, your recurring fee will be automatically charged via telebirr mandate.
                </Typography>
              </div>
            ) : (
              <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <Typography className="text-[12px] text-gray-700">
                  <strong>Note:</strong> Your NameTAG recurring service fee will be processed through the telebirr Partner App.
                </Typography>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="border border-[#77777733] bg-[#F6F7FB] px-4 py-3 rounded-xl mt-3 shadow-sm">
            <Typography className="text-[16px] font-medium mb-2 border-b pb-2">
              {t("dashboard.priceBreakDown", { defaultValue: "Price Breakdown" })}
            </Typography>

            <div className="flex justify-between">
              <Typography className="text-[14px]">
                {t("dashboard.subTotal", { defaultValue: "Sub Total" })}
              </Typography>
              <Typography className="text-[14px]">
                {priceBreakdown?.totalBasePrice || "0.00"} {t("common.etb")}
              </Typography>
            </div>

            <div className="flex justify-between mt-2">
              <Typography className="text-[14px]">
                {t("dashboard.vat", { defaultValue: "VAT" })} (15%)
              </Typography>
              <Typography className="text-[14px]">
                {priceBreakdown?.totalVAT || "0.00"} {t("common.etb")}
              </Typography>
            </div>

            <div className="flex justify-between mt-2">
              <Typography className="text-[14px]">
                {t("dashboard.exciseTax", { defaultValue: "Excise Tax" })}
              </Typography>
              <Typography className="text-[14px]">
                {priceBreakdown?.excisetax || "0.00"} {t("common.etb")}
              </Typography>
            </div>

            <div className="flex justify-between mt-2">
              <Typography className="text-[14px]">
                {t("dashboard.stampDuty", { defaultValue: "Stamp Duty" })}
              </Typography>
              <Typography className="text-[14px]">
                {priceBreakdown?.stampDuty || "0.00"} {t("common.etb")}
              </Typography>
            </div>

            <div className="flex justify-between mt-3 border-t py-2">
              <Typography className="text-[14px] font-bold">
                {t("dashboard.total", { defaultValue: "Total" })}
              </Typography>
              <Typography className="text-[14px] font-bold">
                {priceBreakdown?.totalPrice || "0.00"} {t("common.etb")}
              </Typography>
            </div>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="mt-6 px-4 py-3 rounded-xl">
            <div className="flex items-center">
              <Checkbox
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="border-gray-300"
                color="green"
              />
              <Typography className="text-sm text-[#555] ml-2">
                <span>
                  I agree to the{" "}
                  <span className="text-[#5B6AB0] hover:underline cursor-pointer"
                    onClick={() => {
                      window.open(ConstentRoutes.termofuse, '_blank');
                    }}
                  >
                    {t("common.termAndCondition", { defaultValue: "Terms & Conditions" })}
                  </span>
                </span>
              </Typography>
            </div>
          </div>

          {/* Proceed Button */}
          <div className="flex justify-center mt-4">
            <Button
              className="bg-secondary text-white text-[14px] px-8 py-3"
              onClick={handleProceed}
              disabled={disableBtn || !termsAccepted}
            >
              {t("buttons.proceed", { defaultValue: "Proceed" })}
            </Button>
          </div>
        </div>
        </div>
      </div>

      {/* Payment Success Modal */}
      {isOpenPayment && (
        <Paymentsuccessful
          isOpen={isOpenPayment}
          setIsOpen={setIsOpenPayment}
          state={{
            ...tagInfo,
            ...selectedTagData,
            tag_price: tagPrice,
            excisetax: priceBreakdown?.excisetax,
            vatable_total: priceBreakdown?.totalPrice,
            VAT: priceBreakdown?.totalVAT,
            stamp_duty: priceBreakdown?.stampDuty,
            base_price: priceBreakdown?.totalBasePrice,
            businessType: businessType,
            total_amount: priceBreakdown?.totalPrice,
            selectedAmount: recurringFeeAmount,
            selectedFeeLabel: serviceIdFromData,
          }}
          type="buy"
          user={formatPhoneNumberCustom(userData?.phone_number || "")}
        />
      )}
      </div>
    </>
  );
};

export default BillPayment;
