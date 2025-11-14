// /* eslint-disable react/prop-types */
// import { Button, Checkbox, Typography, Select, Option } from "@material-tailwind/react";
// import TagName from "../assets/images/Telebirr.png";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ConstentRoutes, getPriceBreakDown } from "../utilities/routesConst";
// import { useForm } from "react-hook-form";
// import { useAppSelector } from "../redux/hooks";
// import { useState, useEffect } from "react";
// import { formatPhoneNumberCustom } from "../utilities/formatMobileNumber";
// import IndividualPaymentConfirmationModal from "../modals/IndividualPaymentConfirmationModal";
// import Paymentsuccessful from "../modals/paymentsuccessful";
// import { useTagList } from "./hooks/useDashboard";

// const TagDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dashboard = useTagList()
//   const stateData = location.state;
//   console.log({ stateData })
//   const isExchangeFlow = stateData?.isExchangeFlow || false;
//   const currentTagData = stateData?.currentTagData || null;
//   const [type, setType] = useState("")
//   const [data, setData] = useState(null)
//   const [paymentType, setPaymentType] = useState(false)
//   const corporateDocuments = useAppSelector(state => state.user.corporateDocuments);
//   const [isOpen, setIsOpen] = useState(false);

//   const docStatus = {
//     status: (corporateDocuments?.[0]?.doc_status == "1" && corporateDocuments?.[1]?.doc_status == "1") && corporateDocuments?.[2]?.doc_status == "1" ? 1 : 0,
//     corp_document: corporateDocuments
//   };
//   let userData = {}
//   userData = JSON.parse(localStorage.getItem("user"));

//   const isReserved = stateData.isReserve === true;

//   const [actionType, setActionType] = useState(
//     isReserved ? "buy" : (docStatus.status != 1 ? "reserve" : null)
//   );

//   const {
//     register,
//     watch,
//     handleSubmit,
//     formState: { errors },
//     setError,
//     clearErrors
//   } = useForm();
//   const watchAllField = watch()

//   const isPremium = stateData?.tag_list_premium_id == 1 || stateData?.tag_type === "VIP" || stateData?.is_premium;

//   const tagData = isPremium && stateData?.corp_premium_tag_list ? stateData?.corp_premium_tag_list : stateData;

//   const getInitialRecurringFeeType = () => {
//     if (stateData?.service_id) {
//       switch (stateData?.service_id) {
//         case "Monthly": return "monthly_fee";
//         case "Weekly": return "weekly_fee";
//         case "Quarterly": return "quarterly_fee";
//         case "Semi-Annually": return "semiannually_fee";
//         case "Annually": return "annually_fee";
//         default: return "";
//       }
//     }
//     return "";
//   };

//   const [selectedRecurringFee, setSelectedRecurringFee] = useState(getInitialRecurringFeeType());
//   const [selectedFeeAmount, setSelectedFeeAmount] = useState(
//     0
//   );
//   const [selectedFeeLabel, setSelectedFeeLabel] = useState(stateData.service_id || "Monthly");

//   const recurringFeeOptions = [
//     { value: "monthly_fee", label: "Monthly", amount: tagData.monthly_fee || 0 },
//     // { value: "weekly_fee", label: "Weekly", amount: tagData.weekly_fee || 0 },
//     { value: "quarterly_fee", label: "Quarterly", amount: tagData.quarterly_fee || 0 },
//     { value: "semiannually_fee", label: "Semi-Annually", amount: tagData.semiannually_fee || 0 },
//     { value: "annually_fee", label: "Annually", amount: tagData.annually_fee || 0 },
//   ];

//   const availableOptions = recurringFeeOptions.filter(
//     option => option.value === selectedRecurringFee || parseFloat(option.amount) > 0
//   );

//   useEffect(() => {
//     const selectedOption = recurringFeeOptions.find(option => option.value === selectedRecurringFee);
//     if (selectedOption) {
//       setSelectedFeeAmount(selectedOption.amount);
//       setSelectedFeeLabel(selectedOption.label);
//     }
//   }, [selectedRecurringFee]);

//   const tagPrice = tagData.tag_name_price !== undefined
//     ? Number(tagData.tag_name_price)
//     : Number(tagData.tag_price || 0);

//   const exciseTax = Number(stateData?.excisetax ?? tagData?.excisetax ?? 0);
//   const vatableTotalAmount = Number(stateData?.vatable_total ?? tagData?.vatable_total ?? (tagPrice + exciseTax));
//   const vatAmount = Number(stateData?.VAT ?? tagData?.VAT ?? 0);
//   const stampDuty = Number(stateData?.stamp_duty ?? tagData?.stamp_duty ?? 0); // Default to 5 if not available
//   const totalAmount = Number(stateData?.total_amount ?? tagData?.total_amount);
//   const onSubmit = (data, action = null) => {
//     const currentAction = action || actionType;

//     const tagListType = isPremium ? "premium_tag_list" : "corp_tag_list";

//     let payLoad = {
//       ...stateData,
//       ...(isPremium && stateData.corp_premium_tag_list ? stateData.corp_premium_tag_list : {}),
//       totalPrice: totalAmount,
//       terms: data.term,
//       service_fee: stateData.service_fee,
//       recurring_fee_type: selectedRecurringFee,
//       isReserved: isReserved,
//       recurring_fee_label: selectedFeeLabel,
//       recurring_fee_amount: selectedFeeAmount,
//       service_id: selectedFeeLabel, // Set service_id for the API
//       tag_list_type: tagListType, // Set the correct tag list type
//       is_premium: isPremium, // Set is_premium flag
//       action_type: currentAction // Add action type (buy or reserve)
//     }

//     navigate(ConstentRoutes.processPayment, { state: payLoad })
//   };
//   const [error, setErrors] = useState(false)
//   const handleBuyClick = () => {
//     if (selectedRecurringFee == "") {
//       return setErrors(true)
//     }
//     if (watchAllField?.term == false) {
//       setError("term", {
//         type: "manual",
//         message: "You must accept the Terms & Conditions to continue",
//       });
//       return; // Prevent form submission
//     }
//     if (isExchangeFlow) {
//       const payloadNew = {
//         "transaction_type": "CHANGE_MY_TAG",
//         "channel": "WEB",
//         "account_id": 54,
//         "type": "buy",
//         "corp_reserve_tag_id": "283",
//         "title": "1111",
//         "customer_tag_no": "1111",
//         "customer_tag_id": "2",
//         "phone_number": "251912345678",
//         "amount": "17.08",
//         "payment_method": "Mobile Wallet",
//         "reserve_type": "existing",
//         "msisdn": "251927864387",
//         "business_type": "BuyGoods",
//         "service_fee": "100",
//         "is_premium": true,
//         "is_exchange_number": true,
//         "recurring_fee_type": "monthly_fee",
//         "recurring_fee_label": "Monthly",
//         "recurring_fee_amount": "8",
//         "service_id": "Monthly",
//         "tag_list": {
//           "tag_no": "1111",
//           "id": "2",
//           "tag_name": "1111",
//           "tag_price": "10",
//           "service_fee": "100",
//           "service_id": "30",
//           "tag_type": "",
//           "tag_digits": 4,
//           "created_date": "2025-04-17 19:00:17",
//           "status": 2,
//           "comments": "",
//           "tax": 0,
//           "vat": 1.58,
//           "exciseTax": 0.5,
//           "stampDuty": 5,
//           "vatableTotal": 10.5,
//           "is_premium": true
//         }

//       }
//       const payload = {
//         transaction_type: "CHANGE_MY_TAG",
//         channel: "WEB",
//         account_id: userData?.id,
//         customer_tag_id: stateData?.id,
//         type: "buy",
//         corp_reserve_tag_id: stateData?.reserve_tag_id || null,
//         title: `#${stateData?.tag_name}` || `#${stateData?.tittle}` || "",
//         customer_tag_no: stateData?.tag_no || "",
//         phone_number: stateData?.currentTagData?.msisdn?.replace(/^\+/, ''),
//         amount: (stateData?.total_amount || stateData?.price || "0").toString(),
//         payment_method: "telebir",
//         reserve_type: "existing",
//         msisdn: stateData?.currentTagData?.msisdn?.replace(/^\+/, ''),
//         business_type: userData?.business_type || "BuyGoods",
//         service_fee: selectedFeeAmount, // Use selected fee amount
//         // Add recurring fee information
//         recurring_fee_type: selectedRecurringFee,
//         recurring_fee_label: selectedFeeLabel,
//         recurring_fee_amount: selectedFeeAmount,
//         service_id: selectedFeeLabel,
//         // Include is_premium flag if it exists
//         is_premium: isPremium,
//         is_exchange_number: isExchangeFlow,
//         tag_list: {
//           id: stateData?.id,
//           tag_no: stateData?.tag_no || "",
//           tax: 0,
//           tag_name: stateData?.tag_name || "",
//           tag_price: (stateData?.tag_price || "0").toString(),
//           service_fee: (selectedFeeAmount || "0").toString(),
//           service_id: selectedFeeLabel || "Monthly",
//           tag_type: stateData?.tag_type || "",
//           tag_digits: stateData?.tag_digits || 0,
//           created_date: stateData?.created_date || "",
//           status: stateData?.status || 1,
//           comments: stateData?.comments || "",
//           vat: stateData?.VAT || 0,
//           excisetax: stateData?.excisetax || 0,
//           stamp_duty: stateData?.stamp_duty || 0,
//           vatable_total: stateData?.vatable_total || 0,
//           is_premium: isPremium,
//         }
//       };
//       setData(payload);
//       setPaymentType(true)
//       return
//     }
//     setActionType('buy');
//     handleSubmit((data) => onSubmit(data, 'buy'))();
//   };

//   const handleReserveClick = () => {
//     if (selectedRecurringFee == "") {
//       return setErrors(true)
//     }
//     setActionType('reserve');
//     handleSubmit((data) => onSubmit(data, 'reserve'))();
//   };

//   const renderActionButtons = () => {
//     if (isReserved) {
//       return (
//         <div className="flex justify-center gap-4 mb-4 mt-4">
//           <Button
//             className="py-5 px-4 bg-secondary text-white"
//             onClick={handleBuyClick}
//           >
//             Buy NameTAG
//           </Button>
//         </div>
//       );
//     }

//     if (docStatus.status !== 1) {
//       return (
//         <div className="flex justify-center gap-4 mb-4 mt-4">
//           <Button
//             className="py-4 px-4 bg-secondary text-white"
//             onClick={handleReserveClick}
//           >
//             Reserve NameTAG
//           </Button>
//         </div>
//       );
//     }

//     return (
//       <div className="flex justify-center gap-4 mb-4 mt-4">
//         <Button
//           className="py-4 px-4 bg-secondary text-white"
//           onClick={handleBuyClick}
//         >
//           {isExchangeFlow ? "Change TAG" : "Buy NameTAG"}
//         </Button>
//         {!isExchangeFlow &&
//           <Button
//             className="py-4 px-4 bg-secondary text-white"
//             onClick={handleReserveClick}
//           >
//             Reserve NameTAG
//           </Button>
//         }
//       </div>
//     );
//   };

//   const handleConfirmPayment = () => {
//     if (isExchangeFlow) {
//       // Call the change-number API endpoint
//       dashboard.handleTagExchangeCorporate(data, setPaymentType);
//     } else {
//       // Regular flow - call the buy tag API
//     }
//   }

//   const priceBreakdown = getPriceBreakDown({ tagPrice: stateData?.tag_price, packageFee: Number(selectedFeeAmount) });

//   console.log({ location, selectedFeeAmount, priceBreakdown })

//   return (
//     <>
//       <form className="bg-white max-w-[800px]">
//         {isExchangeFlow && (
//           <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 mb-4">
//             <Typography className=" font-bold">
//               TAG Exchange Mode
//             </Typography>
//             <Typography className="text-sm mt-1">
//               You are about to change your current TAG #{currentTagData?.tag_no + " " || ""}
//               to TAG #{tagData?.tag_no}. This action cannot be undone.
//             </Typography>
//           </div>
//         )}
//         <div className="p-4 rounded-xl shadow md:mt-6">
//           {stateData?.mode == "resubscribe" ?
//             <Typography className="text-[#1F1F2C] pb-3 px-6 border-b text-lg font-semibold">
//               {isReserved ? "Resubscribe NameTAG" :
//                 (docStatus.status !== 1 ? "Reserve NameTAG" :
//                   (actionType ? (actionType === 'buy' ? "Buy NameTAG" : "Reserve NameTAG") : "NameTAG Details"))} {isPremium ? "- Premium" : ""}
//             </Typography>
//             :
//             <Typography className="text-[#1F1F2C] pb-3 px-6 border-b text-lg font-semibold">
//               {isReserved ? "Buy NameTAG" :
//                 (docStatus.status !== 1 ? "Reserve NameTAG" :
//                   (actionType ? (actionType === 'buy' ? "Buy NameTAG" : "Reserve NameTAG") : "NameTAG Details"))} {isPremium ? "- Premium" : ""}
//             </Typography>
//           }

//           <div className="flex justify-between mt-3 border bg-[#F6F7FB] border-[#77777733] px-5 py-3 rounded-xl">
//             <Typography className="text-[14px]">NameTAG</Typography>
//             <Typography className="text-[14px] ">
//               {tagData.tag_name}
//             </Typography>
//           </div>

//           <div className="flex justify-between border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
//             <Typography className="text-[14px]">NameTAG Number</Typography>
//             <Typography className="text-[14px] ">
//               #{tagData.tag_no}
//             </Typography>
//           </div>

//           <div className="flex justify-between mt-3 border bg-[#F6F7FB] border-[#77777733] px-5 py-3 rounded-xl">
//             <Typography className="text-[14px]">NameTAG Category</Typography>
//             <Typography className="text-[14px] ">
//               {tagData.tag_type}
//             </Typography>
//           </div>
//           {stateData.msisdn &&
//             <div className="flex justify-between border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
//               <Typography className="text-[14px]">Registered Mobile Number</Typography>
//               <Typography className="text-[14px] ">
//                 {formatPhoneNumberCustom(stateData.msisdn)}
//               </Typography>
//             </div>
//           }

//           {/* Reserved tag indicator if applicable */}
//           {(isReserved && stateData?.mode != "resubscribe") && (
//             <div className="flex justify-between border border-blue-300 bg-blue-50 px-5 py-3 rounded-xl mt-3">
//               <Typography className="text-[14px]">Service Status</Typography>
//               <Typography className="text-[14px] font-bold text-blue-600">
//                 Reserved
//               </Typography>
//             </div>
//           )}

//           {/* Display Premium Tag notice if applicable */}
//           {/* {isPremium && ( */}
//           <div className="flex justify-between border bg-[#008fd547] px-5 py-3 rounded-xl mt-3">
//             <Typography className="text-[14px]">TAG Type</Typography>
//             <Typography className="text-[14px] font-bold ">
//               {isPremium ? "Premium" : "Corporate"}
//             </Typography>
//           </div>
//           {/* )} */}

//           <div className="flex justify-between border px-5 border-[#77777733] bg-[#F6F7FB] py-3 rounded-xl mt-3">
//             <Typography className="text-[14px]">Subscription Fee</Typography>
//             <Typography className="text-[14px] font-bold ">
//               {Number(stateData?.tag_price)?.toFixed(2) || ""} ETB
//             </Typography>
//           </div>

//           <div className="border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
//             {/* Recurring Fee Package Selection */}
//             <div className="mt-3">
//               <div className="flex justify-between flex-wrap select-payment-option gap-2 ">
//                 <Typography className="text-[14px]">Select Service Plan</Typography>
//                 <div className="w-64">
//                   <Select
//                     value={selectedRecurringFee || ""}
//                     onChange={(value) => {
//                       setSelectedRecurringFee(value)
//                       setErrors(false)
//                     }}
//                     label="Select Plan"
//                     className=""
//                     style={error ? { border: "1px solid red" } : {}}
//                   >
//                     {availableOptions.map((option) => (
//                       <Option key={option.value} value={option.value}>
//                         {option.label} ({option.amount} ETB)
//                       </Option>
//                     ))}
//                   </Select>
//                 </div>
//               </div>

//               <div className="flex justify-between mt-2">
//                 <Typography className="text-[14px]">
//                   {selectedFeeLabel} Recurring Fee
//                 </Typography>
//                 <Typography className="text-[14px] ">
//                   {selectedFeeAmount} ETB
//                 </Typography>
//               </div>
//             </div>
//           </div>

//           {/* Detailed Price Breakdown with tax components */}
//           <div className="border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
//             <Typography className="text-[16px] font-medium mb-2 border-b pb-2">
//               Price Breakdown
//             </Typography>

//             <div className="flex justify-between">
//               <Typography className="text-[14px]">Sub Total </Typography>
//               <Typography className="text-[14px] ">
//                 {(priceBreakdown?.totalBasePrice || "")} ETB
//               </Typography>
//             </div>
//             <div className="flex justify-between mt-2">
//               <Typography className="text-[14px]">VAT (15%)</Typography>
//               <Typography className="text-[14px] ">
//                 {priceBreakdown?.totalVAT || ""} ETB
//               </Typography>
//             </div>
//             <div className="flex justify-between mt-2">
//               <Typography className="text-[14px]">Excise Tax</Typography>
//               <Typography className="text-[14px] ">
//                 {priceBreakdown.excisetax || ""} ETB
//               </Typography>
//             </div>

//             {/* <div className="flex justify-between mt-2">
//             <Typography className="text-[14px] font-bold">Vatable Total</Typography>
//             <Typography className="text-[14px] font-bold">
//               {vatableTotalAmount.toFixed(2)} ETB
//             </Typography>
//           </div> */}

//             <div className="flex justify-between mt-2">
//               <Typography className="text-[14px]">Stamp Duty</Typography>
//               <Typography className="text-[14px] ">
//                 {priceBreakdown?.stampDuty || ""} ETB
//               </Typography>
//             </div>

//             <div className="flex justify-between mt-3 border-t py-2 font-medium">
//               <Typography className="text-[14px] font-bold">Total Subscription Fee</Typography>
//               <Typography className="text-[14px] font-bold">
//                 {priceBreakdown?.totalPrice || ""} ETB
//               </Typography>
//             </div>
//           </div>

//           {isReserved && (
//             <div className="flex items-center justify-between border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
//               <Typography className="text-[14px]">Payment Method</Typography>
//               <div className="flex items-center px-2 py-1 rounded-lg gap-2">
//                 <img className=" h-[34px] w-[70px]" src={TagName} alt="" />
//               </div>
//             </div>
//           )}

//           <div className="px-5 rounded-xl mt-3 text-[#555]">
//             <div className="flex items-center">
//               <span className="text-red-800 ">*</span>{" "}
//               <Checkbox
//                 {...register("term", {
//                   required: "You must accept the Terms & Conditions to continue",
//                 })}
//                 style={
//                   errors.term
//                     ? { border: "1px solid red" }
//                     : { border: "1px solid #8A8AA033" }
//                 }
//                 onClick={() => clearErrors()}
//               />
//               <Typography className="text-sm cursor-pointer leading-[40px] ">
//                 <span className="text-[#008fd5] hover:underline"
//                   onClick={() => {
//                     window.open(ConstentRoutes.termofuse, "_blank")
//                   }}
//                 >Terms and Conditions </span>

//               </Typography>
//             </div>
//             {errors.term && (
//               <p className="text-left mt-1 text-sm text-[#FF0000]">{errors.term.message}</p>
//             )}
//           </div>
//           {renderActionButtons()}
//         </div>
//       </form>
//       <IndividualPaymentConfirmationModal
//         isOpen={paymentType}
//         onClose={() => setPaymentType(false)}
//         state={stateData} // Use enhanced state data
//         phoneNumber={`+${stateData?.currentTagData?.msisdn}`}
//         reserve_tag_id={stateData?.reserve_tag_id}
//         isLoading={dashboard?.loadingPayment}
//         onConfirm={handleConfirmPayment}
//         isCustomer={true}
//         type={"buy"}
//         isExchangeFlow={isExchangeFlow}
//       />
//       {isOpen && (
//         <Paymentsuccessful
//           isOpen={isOpen}
//           setIsOpen={setIsOpen}
//           state={stateData} // Use enhanced state data
//           user={`+${stateData?.currentTagData?.msisdn}`}
//           isCustomer={true}
//           isExchangeFlow={isExchangeFlow}
//         />
//       )}
//     </>
//   );
// };

// export default TagDetails;

/* eslint-disable react/prop-types */
import {
  Button,
  Checkbox,
  Typography,
  Select,
  Option,
  Tooltip,
} from "@material-tailwind/react";
import TagName from "../assets/images/Telebirr.png";
import { useLocation, useNavigate } from "react-router-dom";
import {
  adjustableDays,
  ConstentRoutes,
  getPriceBreakDown,
} from "../utilities/routesConst";
import { useForm } from "react-hook-form";
import { useAppSelector } from "../redux/hooks";
import { useState, useEffect } from "react";
import { formatPhoneNumberCustom } from "../utilities/formatMobileNumber";
import IndividualPaymentConfirmationModal from "../modals/IndividualPaymentConfirmationModal";
import Paymentsuccessful from "../modals/paymentsuccessful";
import { useTagList } from "./hooks/useDashboard";
import { FaPlusCircle } from "react-icons/fa";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import { toast } from "react-toastify";
import PaymentConfirmationModal from "../modals/ConfirmPayment";
import { IoMdInformation } from "react-icons/io";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";

const TagDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dashboard = useTagList();
  const stateData = location.state;
  console.log({ stateData });
  const { t } = useTranslation(["common"]);

  const isExchangeFlow = stateData?.isExchangeFlow || false;
  const currentTagData = stateData?.currentTagData || null;
  const [type, setType] = useState("");
  const [data, setData] = useState(null);
  const [paymentType, setPaymentType] = useState(false);
  const corporateDocuments = useAppSelector(
    (state) => state.user.corporateDocuments
  );
  const [isOpen, setIsOpen] = useState(false);

  const [availablePhoneNumbers, setAvailablePhoneNumbers] = useState([]);
  const [loadingPhoneNumbers, setLoadingPhoneNumbers] = useState(false);
  const [selectedPhoneNumberId, setSelectedPhoneNumberId] = useState("");
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
  const hasMsisdn = !!stateData?.msisdn;
  const [isOpenPayment, setIsOpenPayment] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState({
    selectedFromList: !hasMsisdn,
  });
  const docStatus = {
    status:
      corporateDocuments?.[0]?.doc_status == "1" &&
      corporateDocuments?.[1]?.doc_status == "1" &&
      corporateDocuments?.[2]?.doc_status == "1"
        ? 1
        : 0,
    corp_document: corporateDocuments,
  };
  let userData = {};
  userData = JSON.parse(localStorage.getItem("user"));

  const isReserved = stateData.isReserve === true;

  const [actionType, setActionType] = useState(
    isReserved ? "buy" : docStatus.status != 1 ? "reserve" : null
  );

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();
  const watchAllField = watch();

  const fetchAvailablePhoneNumbers = async () => {
    if (!userData?.id) return;

    try {
      setLoadingPhoneNumbers(true);
      const response = await APICall(
        "get",
        null,
        EndPoints.customer.GetAllNumbers(userData.id)
      );

      if (response?.success && response?.data) {
        const phoneNumbers = Array.isArray(response.data)
          ? response.data
          : [response.data];

        setAvailablePhoneNumbers(phoneNumbers);

        // Don't auto-select the first number
        setPhoneNumber({
          selectedFromList: true,
        });
        // Set selectedPhoneNumberId to empty string instead of auto-selecting
        setSelectedPhoneNumberId("");
      }
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
      toast.error("Error fetching phone numbers");
    } finally {
      setLoadingPhoneNumbers(false);
    }
  };

  useEffect(() => {
    if (!hasMsisdn) {
      fetchAvailablePhoneNumbers();
    } else {
      // If we have an MSISDN from state, use it
      setSelectedPhoneNumber(stateData.msisdn);
    }
  }, [hasMsisdn]);

  const stripPlusFromPhone = (phoneNumber) => {
    if (!phoneNumber) return "";
    return phoneNumber.replace(/^\+/, "");
  };

  const isPremium =
    stateData?.tag_list_premium_id == 1 ||
    stateData?.tag_type === "VIP" ||
    stateData?.is_premium;

  const tagData =
    isPremium && stateData?.corp_premium_tag_list
      ? stateData?.corp_premium_tag_list
      : stateData;

  const getInitialRecurringFeeType = () => {
    if (stateData?.service_id) {
      switch (stateData?.service_id) {
        case "Monthly":
          return "monthly_fee";
        case "Weekly":
          return "weekly_fee";
        case "Quarterly":
          return "quarterly_fee";
        case "Semi-Annually":
          return "semiannually_fee";
        case "Annually":
          return "annually_fee";
        default:
          return "";
      }
    }
    return "";
  };

  const [selectedRecurringFee, setSelectedRecurringFee] = useState(
    getInitialRecurringFeeType()
  );
  const [selectedFeeAmount, setSelectedFeeAmount] = useState(0);
  const [selectedFeeLabel, setSelectedFeeLabel] = useState(
    stateData.service_id || ""
  );

  const recurringFeeOptions = [
    {
      value: "monthly_fee",
      label: "Monthly",
      amount: tagData.monthly_fee || 0,
    },
    // { value: "weekly_fee", label: "Weekly", amount: tagData.weekly_fee || 0 },
    {
      value: "quarterly_fee",
      label: "Quarterly",
      amount: tagData.quarterly_fee || 0,
    },
    {
      value: "semiannually_fee",
      label: "Semi-Annually",
      amount: tagData.semiannually_fee || 0,
    },
    {
      value: "annually_fee",
      label: "Annually",
      amount: tagData.annually_fee || 0,
    },
  ];

  const availableOptions = recurringFeeOptions.filter(
    (option) =>
      option.value === selectedRecurringFee || parseFloat(option.amount) > 0
  );

  useEffect(() => {
    const selectedOption = recurringFeeOptions.find(
      (option) => option.value === selectedRecurringFee
    );
    if (selectedOption) {
      setSelectedFeeAmount(selectedOption.amount);
      setSelectedFeeLabel(selectedOption.label);
    }
  }, [selectedRecurringFee]);

  const tagPrice =
    tagData.tag_name_price !== undefined
      ? Number(tagData.tag_name_price)
      : Number(tagData.tag_price || 0);

  const exciseTax = Number(stateData?.excisetax ?? tagData?.excisetax ?? 0);
  const vatAmount = Number(stateData?.VAT ?? tagData?.VAT ?? 0);
  const stampDuty = Number(stateData?.stamp_duty ?? tagData?.stamp_duty ?? 0); // Default to 5 if not available
  const totalAmount = Number(stateData?.total_amount ?? tagData?.total_amount);
  const vatableTotalAmount =
    stateData?.vatable_total || Number(tagPrice) + Number(exciseTax);

  const [stateValue, setStateValue] = useState(null);
  const priceBreakdown = getPriceBreakDown({
    tagPrice: stateData?.tag_price,
    packageFee: Number(selectedFeeAmount),
    dues:
      stateData?.currentTagData?.dues < 0
        ? Math.abs(stateData?.currentTagData?.dues || 0)
        : 0,
  });

  const getServiceId = (feeType) => {
    switch (feeType) {
      case "monthly_fee":
        return "Monthly";
      case "weekly_fee":
        return "Weekly";
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

  const onSubmitPayment = (state) => {
    // Check if a phone number is selected when needed
    if (!hasMsisdn && !selectedPhoneNumberId) {
      toast.error("Please select a mobile number");
      return;
    }

    if (docStatus?.status !== 0 && state?.action_type === "buy") {
      setShowConfirmModal(true);
    } else {
      handleConfirmPaymentLastPage(state);
    }
  };

  const getNextChargeDate = (selectedRecurringFee, date) => {
    const now = new Date(date) || new Date();
    const daysToAdd =
      selectedRecurringFee === "monthly_fee"
        ? 30
        : selectedRecurringFee === "quarterly_fee"
        ? 90
        : selectedRecurringFee === "semiannually_fee"
        ? 180
        : selectedRecurringFee === "annually_fee"
        ? 365
        : null;

    if (daysToAdd === null) return null;

    return new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  };

  const nextChargeDate = getNextChargeDate(
    selectedRecurringFee,
    stateData?.currentTagData?.current_date || new Date()
  );
  const adjustableday = adjustableDays({
    dues: stateData?.currentTagData?.dues,
    plan: selectedFeeLabel,
  });
  const handleConfirmPaymentLastPage = (state) => {
    setShowConfirmModal(false);

    // Get the selected phone number's MSISDN
    let selectedMsisdn = "";

    if (hasMsisdn) {
      selectedMsisdn = state.msisdn;
    } else if (selectedPhoneNumber) {
      selectedMsisdn = selectedPhoneNumber;
    } else if (userData?.phone_number) {
      // Fallback to user's phone number if available
      selectedMsisdn = userData.phone_number;
    }

    // If no phone is selected, show error and return
    if (!selectedMsisdn) {
      toast.error("Please select a mobile number");
      return;
    }

    // Remove + from the beginning if present
    const formattedMsisdn = stripPlusFromPhone(selectedMsisdn);

    let reserveType;
    if (state?.action_type === "buy") {
      if (isReserved) {
        reserveType = "existing";
      } else {
        reserveType = "new";
      }
    } else {
      reserveType = "new";
    }

    const values = {
      transaction_type: "CORP_BUYTAG",
      channel: "WEB",
      account_id: userData?.customer_account_id,
      customer_tag_id: state?.id,
      type: state?.action_type,
      corp_reserve_tag_id: state?.reserve_tag_id || null,
      title: `#${state?.tag_name}` || `#${state?.tittle}` || "",
      customer_tag_no: state?.tag_no || "",
      // Use the selected phone number for both fields
      phone_number: stripPlusFromPhone(userData.phone_number),
      amount: priceBreakdown?.totalPrice?.toString(),
      payment_method: "telebirr",
      reserve_type: reserveType,
      msisdn: formattedMsisdn,
      business_type: "BuyGoods",
      service_fee: state?.service_fee,
      recurring_fee_type: state?.recurring_fee_type,
      recurring_fee_amount: state?.recurring_fee_amount,
      is_premium: isPremium,
      // Add tax related values
      excisetax: priceBreakdown?.excisetax,
      vatable_total: priceBreakdown?.totalVAT,
      vat: priceBreakdown?.totalVAT,
      stamp_duty: priceBreakdown?.stampDuty,
      total_amount: priceBreakdown?.totalPrice,
      // exchange_days_adjust: adjustableday, this will be used in future
      exchange_days_adjust: "0",
      dues: stateData?.currentTagData?.dues || 0,
      next_charge_date: nextChargeDate
        ? moment(nextChargeDate).format("YYYY-MM-DD")
        : null,
    };

    if (state?.tag_list_type) {
      values.tag_list_type = state.tag_list_type;

      const serviceId =
        state?.recurring_fee_label || getServiceId(state?.recurring_fee_type);

      if (state?.tag_list_type === "premium_tag_list") {
        values.tag_list = {
          id: state?.id,
          tag_no: state?.tag_no || "",
          tag_name: state?.tag_name || "",
          tag_price: (
            state?.tag_price ||
            state?.tag_name_price ||
            "0"
          ).toString(),
          service_fee: (state?.service_fee || "0").toString(),
          service_id: serviceId,
          tag_type: state?.tag_type || "VIP",
          tag_digits: state?.tag_digits || 0,
          created_date: state?.created_date || "",
          status: state?.status || 1,
          comments: state?.comments || "",
          tax: (state?.tax || "0").toString(),
          is_premium: true,
          // Add tax related values
          excisetax: priceBreakdown?.excisetax,
          vatable_total: priceBreakdown?.totalPrice,
          VAT: priceBreakdown?.totalVAT,
          stamp_duty: priceBreakdown?.stampDuty,
          total_amount: priceBreakdown?.totalPrice,
          exchange_days_adjust: "0",
          next_charge_date: nextChargeDate
            ? moment(nextChargeDate).format("YYYY-MM-DD")
            : null,
        };
      } else if (state?.tag_list_type === "corp_tag_list") {
        // Handle corporate tags
        values.customer_tag_id = state?.id;
        values.tag_list = {
          id: state?.id,
          tag_no: state?.tag_no || "",
          tag_name: state?.tag_name || "",
          tag_price: (state?.tag_price || "0").toString(),
          service_id: serviceId,
          tag_type: state?.tag_type || "",
          tag_digits: state?.tag_digits || 0,
          created_date: state?.created_date || "",
          status: state?.status || 1,
          comments: state?.comments || "",
          tax: (state?.tax || "0").toString(),
          is_premium: false,
          // Add tax related values
          excisetax: priceBreakdown?.excisetax,
          vatable_total: priceBreakdown?.totalPrice,
          VAT: priceBreakdown?.totalVAT,
          stamp_duty: priceBreakdown?.stampDuty,
          total_amount: priceBreakdown?.totalBasePrice,
          exchange_days_adjust: "0",
          next_charge_date: nextChargeDate
            ? moment(nextChargeDate).format("YYYY-MM-DD")
            : null,
        };
      } else {
        values.tag_id = state?.tag_id !== undefined ? state?.tag_id : null;

        values.tag_list = {
          id: state?.id,
          tag_no: state?.tag_no || "",
          tag_name: state?.tag_name || "",
          tag_price: (state?.tag_price || "0").toString(),
          service_fee: (
            state?.recurring_fee_amount ||
            state?.service_fee ||
            "0"
          ).toString(),
          service_id: serviceId,
          tag_type: state?.tag_type || "",
          tag_digits: state?.tag_digits || 0,
          created_date: state?.created_date || "",
          status: state?.status || 1,
          comments: state?.comments || "",
          tax: (state?.tax || "0").toString(),
          is_premium: state?.tag_list_type === "vip_tag_list" ? true : false,
          // Add tax related values
          excisetax: priceBreakdown?.excisetax,
          vatable_total: priceBreakdown?.totalPrice,
          VAT: priceBreakdown?.totalVAT,
          stamp_duty: priceBreakdown?.stampDuty,
          total_amount: priceBreakdown?.totalPrice,
          exchange_days_adjust: "0",
          next_charge_date: nextChargeDate
            ? moment(nextChargeDate).format("YYYY-MM-DD")
            : null,
        };
      }
    }

    // For debugging
    if (state.mode == "resubscribe") {
      const payload = {
        corp_subscriber_id: state?.reserve_tag_id,
      };

      APICall("post", payload, "customer/re-subscribe")
        .then((res) => {
          if (res?.success) {
            setDisableBtn(true);
            setTimeout(() => {
              setDisableBtn(false);
            }, 5 * 60 * 1000);
            if (!res?.data?.corp_reserved_tag_id) {
              localStorage.setItem(
                "merchId",
                payload?.corp_reserve_tag_id || null
              );
              window.location.replace(res?.data);
            } else {
              toast.success(res?.message || "");
              setIsOpen(true);
            }
          } else {
            toast.error(res?.message || "Failed to process request");
          }
        })
        .catch((err) => {
          toast.error(err?.message || "An error occurred");
        });
    } else {
      dashboard.handleTagDetails(values, setIsOpenPayment, setDisableBtn);
    }
  };
  const onSubmit = (data, action = null) => {
    const currentAction = action || actionType;

    const tagListType = isPremium ? "premium_tag_list" : "corp_tag_list";

    let payLoad = {
      ...stateData,
      ...(isPremium && stateData.corp_premium_tag_list
        ? stateData.corp_premium_tag_list
        : {}),
      totalPrice: priceBreakdown?.totalPrice,
      terms: data.term,
      service_fee: stateData.service_fee,
      recurring_fee_type: selectedRecurringFee,
      isReserved: isReserved,
      recurring_fee_label: selectedFeeLabel,
      recurring_fee_amount: selectedFeeAmount,
      dues: stateData?.currentTagData?.dues || 0,
      service_id: selectedFeeLabel, // Set service_id for the API
      tag_list_type: tagListType, // Set the correct tag list type
      is_premium: isPremium, // Set is_premium flag
      action_type: currentAction, // Add action type (buy or reserve)
      exchange_days_adjust: "0",
      next_charge_date: nextChargeDate
        ? moment(nextChargeDate).format("YYYY-MM-DD")
        : null,
    };
    setStateValue(payLoad);
    onSubmitPayment(payLoad);
    // navigate(ConstentRoutes.processPayment, { state: payLoad })
  };
  const [error, setErrors] = useState(false);
  const handleBuyClick = () => {
    if (selectedRecurringFee == "") {
      return setErrors(true);
    }
    if (watchAllField?.term == false) {
      setError("term", {
        type: "manual",
        message: "You must accept the Terms & Conditions to continue",
      });
      return; // Prevent form submission
    }
    if (isExchangeFlow) {
      const payload = {
        transaction_type: "CHANGE_MY_TAG",
        channel: "WEB",
        account_id: userData?.id,
        customer_tag_id: stateData?.id,
        type: "buy",
        corp_reserve_tag_id: stateData?.reserve_tag_id || null,
        title: `#${stateData?.tag_name}` || `#${stateData?.tittle}` || "",
        customer_tag_no: stateData?.tag_no || "",
        phone_number: stateData?.currentTagData?.msisdn?.replace(/^\+/, ""),
        amount: (
          priceBreakdown?.totalPrice ||
          stateData?.price ||
          "0"
        ).toString(),
        payment_method: "telebir",
        reserve_type: "existing",
        msisdn: stateData?.currentTagData?.msisdn?.replace(/^\+/, ""),
        business_type: userData?.business_type || "BuyGoods",
        service_fee: selectedFeeAmount, // Use selected fee amount
        // Add recurring fee information
        recurring_fee_type: selectedRecurringFee,
        recurring_fee_label: selectedFeeLabel,
        recurring_fee_amount: selectedFeeAmount,
        service_id: selectedFeeLabel,
        exchange_days_adjust: "0",
        dues: stateData?.currentTagData?.dues || 0,
        next_charge_date: nextChargeDate
          ? moment(nextChargeDate).format("YYYY-MM-DD")
          : null,
        // Include is_premium flag if it exists
        is_premium: isPremium,
        is_exchange_number: isExchangeFlow,
        tag_list: {
          id: stateData?.id,
          tag_no: stateData?.tag_no || "",
          tax: 0,
          tag_name: stateData?.tag_name || "",
          tag_price: (stateData?.tag_price || "0").toString(),
          service_fee: (selectedFeeAmount || "0").toString(),
          service_id: selectedFeeLabel || "Monthly",
          tag_type: stateData?.tag_type || "",
          tag_digits: stateData?.tag_digits || 0,
          created_date: stateData?.created_date || "",
          status: stateData?.status || 1,
          comments: stateData?.comments || "",
          vat: priceBreakdown?.totalVAT || 0,
          excisetax: priceBreakdown?.excisetax || 0,
          stamp_duty: priceBreakdown?.stampDuty || 0,
          vatable_total: priceBreakdown?.totalPrice || 0,
          is_premium: isPremium,
        },
      };
      setData(payload);
      setPaymentType(true);
      return;
    }
    setActionType("buy");
    handleSubmit((data) => onSubmit(data, "buy"))();
  };

  const handleReserveClick = () => {
    if (selectedRecurringFee == "") {
      return setErrors(true);
    }
    setActionType("reserve");
    handleSubmit((data) => onSubmit(data, "reserve"))();
  };

  const renderActionButtons = () => {
    if (isReserved) {
      return (
        <div className="flex justify-center gap-4 mb-4 mt-4">
          <Button
            className="py-5 px-4 bg-secondary text-white"
            onClick={handleBuyClick}
            disabled={
              (!hasMsisdn && !selectedPhoneNumberId && !isExchangeFlow) ||
              disableBtn
            }
          >
            {t("buttons.buyTag")}
          </Button>
        </div>
      );
    }

    if (docStatus.status !== 1) {
      return (
        <div className="flex justify-center gap-4 mb-4 mt-4">
          <Button
            className="py-4 px-4 bg-secondary text-white"
            onClick={handleReserveClick}
            disabled={!hasMsisdn && !selectedPhoneNumberId}
          >
            {t("buttons.reserveNameTag")}
          </Button>
        </div>
      );
    }

    return (
      <div className="flex justify-center gap-4 mb-4 mt-4">
        <Button
          className="py-4 px-4 bg-secondary text-white"
          onClick={handleBuyClick}
          disabled={
            !isExchangeFlow &&
            ((!hasMsisdn && !selectedPhoneNumberId) || disableBtn)
          }
        >
          {isExchangeFlow ? t("buttons.changeNameTag") : t("buttons.buyTag")}
        </Button>

        {!isExchangeFlow && (
          <Button
            className="py-4 px-4 bg-secondary text-white"
            onClick={handleReserveClick}
            disabled={(!hasMsisdn && !selectedPhoneNumberId) || disableBtn}
          >
            {t("buttons.reserveNameTag")}
          </Button>
        )}
      </div>
    );
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";

    const digitsOnly = phoneNumber.replace(/\D/g, "");

    if (digitsOnly.startsWith("251") && digitsOnly.length >= 12) {
      return `+251 ${digitsOnly.substring(3, 4)}${digitsOnly.substring(4)}`;
    } else if (digitsOnly.startsWith("09") && digitsOnly.length >= 10) {
      return `+251 ${digitsOnly.substring(1)}`;
    } else if (digitsOnly.startsWith("9") && digitsOnly.length >= 9) {
      return `+251 ${digitsOnly}`;
    }

    return `+${digitsOnly}`;
  };

  const handleConfirmPayment = () => {
    if (isExchangeFlow) {
      // Call the change-number API endpoint
      dashboard.handleTagExchangeCorporate(data, setPaymentType);
    } else {
      // Regular flow - call the buy tag API
    }
  };

  const getCurrentPhoneNumber = () => {
    if (hasMsisdn) {
      return stateData?.msisdn;
    } else if (selectedPhoneNumber) {
      return selectedPhoneNumber;
    } else if (selectedPhoneNumberId) {
      const selectedPhone = availablePhoneNumbers.find(
        (p) => p.id === selectedPhoneNumberId
      );
      return selectedPhone ? selectedPhone.msisdn : "";
    } else {
      return userData?.phone_number || "";
    }
  };

  // Navigate to phone management tab in profile page
  const goToNumberManagement = () => {
    navigate(ConstentRoutes.profilePage, { state: { activeTab: "number" } });
  };

  const handlePhoneNumberChange = (e) => {
    const phoneId = e.target.value;
    setSelectedPhoneNumberId(phoneId);
    if (phoneId) {
      const selectedPhone = availablePhoneNumbers.find((p) => p.id == phoneId);
      if (selectedPhone) {
        setSelectedPhoneNumber(selectedPhone.msisdn);
      }
    } else {
      setSelectedPhoneNumber("");
    }
  };

  console.log(stateData);

  return (
    <>
      <form className="bg-white max-w-[800px]">
        {isExchangeFlow && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 mb-4">
            <Typography className=" font-bold">
              NameTAG Exchange Mode
            </Typography>
            <Typography className="text-sm mt-1">
              You are about to change your current NameTAG #
              {currentTagData?.tag_no + " " || ""}
              to NameTAG #{tagData?.tag_no}. This action cannot be undone.
            </Typography>
          </div>
        )}
        <div className="p-4 rounded-xl shadow md:mt-6">
          {stateData?.mode == "resubscribe" ? (
            <Typography className="text-[#1F1F2C] pb-3 px-6 border-b text-lg font-semibold">
              {isReserved
                ? t("dashboard.resubTag")
                : docStatus.status !== 1
                ? t("dashboard.reserveTag")
                : actionType
                ? actionType === "buy"
                  ? t("dashboard.buyTag")
                  : t("dashboard.reserveTag")
                : t("dashboard.tagDetail")}{" "}
              {isPremium ? t("dashboard.premium") : ""}
            </Typography>
          ) : (
            <Typography className="text-[#1F1F2C] pb-3 px-6 border-b text-lg font-semibold">
              {isReserved
                ? t("dashboard.buyTag")
                : docStatus.status !== 1
                ? t("dashboard.reserveTag")
                : actionType
                ? actionType === "buy"
                  ? t("dashboard.buyTag")
                  : t("dashboard.reserveTag")
                : t("dashboard.tagDetail")}{" "}
              {isPremium ? t("dashboard.premium") : ""}
            </Typography>
          )}

          <div className="flex justify-between mt-3 border bg-[#F6F7FB] border-[#77777733] px-5 py-3 rounded-xl">
            <Typography className="text-[14px]">{t("nameTag")}</Typography>
            <Typography className="text-[14px] ">{tagData.tag_name}</Typography>
          </div>

          <div className="flex justify-between border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
            <Typography className="text-[14px]">
              {t("nameTag")} {t("dashboard.number")}
            </Typography>
            <Typography className="text-[14px] ">#{tagData.tag_no}</Typography>
          </div>

          <div className="flex justify-between mt-3 border bg-[#F6F7FB] border-[#77777733] px-5 py-3 rounded-xl">
            <Typography className="text-[14px]">
              {t("nameTag")} {t("dashboard.category")}
            </Typography>
            <Typography className="text-[14px] ">{tagData.tag_type}</Typography>
          </div>
          {stateData.msisdn && (
            <div className="flex justify-between border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
              <Typography className="text-[14px]">
                {t("dashboard.regMobileNumber")}
              </Typography>
              <Typography className="text-[14px] ">
                {formatPhoneNumberCustom(stateData.msisdn)}
              </Typography>
            </div>
          )}

          {/* Reserved tag indicator if applicable */}
          {isReserved && stateData?.mode != "resubscribe" && (
            <div className="flex justify-between border border-blue-300 bg-blue-50 px-5 py-3 rounded-xl mt-3">
              <Typography className="text-[14px]">
                {t("dashboard.serviceStatus")}
              </Typography>
              <Typography className="text-[14px] font-bold text-blue-600">
                {t("dashboard.reserved")}
              </Typography>
            </div>
          )}

          {/* Display Premium Tag notice if applicable */}
          {/* {isPremium && ( */}
          <div className="flex justify-between border bg-[#008fd547] px-5 py-3 rounded-xl mt-3">
            <Typography className="text-[14px]">
              {t("nameTag")} {t("dashboard.type")}
            </Typography>
            <Typography className="text-[14px] font-bold ">
              {isPremium ? t("premium") : t("dashboard.Corporate")}
            </Typography>
          </div>
          {/* )} */}

          {!hasMsisdn && !isExchangeFlow && (
            <div className="px-5 py-4 mt-3">
              <Typography className="text-[#1F1F2C] text-sm font-medium bg-[#F8F9FA] p-3 rounded-lg border border-[#E9ECEF]">
                {t("dashboard.pleaseSelectNumberInfo")}{" "}
                <button
                  onClick={goToNumberManagement}
                  className="text-secondary hover:underline font-medium"
                  type="button"
                >
                  {t("dashboard.clickHere")}
                </button>
              </Typography>
            </div>
          )}

          {hasMsisdn || isExchangeFlow ? (
            <div className="border-[#77777733] border bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <Typography className="text-[14px]">
                    {t("dashboard.regMobileNumber")}
                  </Typography>
                </div>

                <div className="flex items-center gap-2">
                  <Typography className="text-[14px] md:min-w-[200px] border border-[#8dc63f] p-2 rounded-lg text-[#0000008F]">
                    {isExchangeFlow
                      ? formatPhoneNumber(stateData?.currentTagData?.msisdn)
                      : formatPhoneNumber(stateData.msisdn)}
                  </Typography>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-[#77777733] border bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
              <div className="flex justify-between flex-wrap">
                <div className="flex gap-2 items-center">
                  <Typography className="text-[14px]">
                    {t("dashboard.mobileNo")}
                  </Typography>
                </div>

                <div className="flex items-center gap-2">
                  {loadingPhoneNumbers ? (
                    <Typography className="text-sm text-gray-500">
                      {t("dashboard.loading")}
                    </Typography>
                  ) : availablePhoneNumbers &&
                    availablePhoneNumbers.length > 0 ? (
                    <div className="flex gap-2 items-center">
                      <select
                        value={selectedPhoneNumberId}
                        onChange={handlePhoneNumberChange}
                        className="min-w-[200px] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-sm bg-white"
                      >
                        {/* Default option */}
                        <option disabled value="">
                          {t("dashboard.selectMobileNo")}
                        </option>

                        {availablePhoneNumbers
                          .filter((number) => number.tag_status !== 1)
                          .map((number) => (
                            <option key={number.id} value={number.id}>
                              {formatPhoneNumber(number.msisdn)}
                            </option>
                          ))}
                      </select>
                      <Button
                        size="sm"
                        className="bg-secondary p-2 flex items-center justify-center"
                        onClick={goToNumberManagement}
                        type="button"
                      >
                        <FaPlusCircle />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <Typography className="text-sm text-gray-500">
                        {t("dashboard.noNumberMsg")}{" "}
                      </Typography>
                      <Button
                        size="sm"
                        className="bg-secondary flex items-center gap-1"
                        onClick={goToNumberManagement}
                        type="button"
                      >
                        <FaPlusCircle className="h-3 w-3" />{" "}
                        {t("dashboard.add")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between border px-5 border-[#77777733] bg-[#F6F7FB] py-3 rounded-xl mt-3">
            <Typography className="text-[14px]">
              {t("dashboard.subscriptionFee")}
            </Typography>
            <Typography className="text-[14px] font-bold ">
              {Number(stateData?.tag_price)?.toFixed(2) || ""}{" "}
              {t("dashboard.etb")}
            </Typography>
          </div>
          <div className="border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
            {/* Recurring Fee Package Selection */}
            <div className="mt-3">
              <div className="flex justify-between flex-wrap select-payment-option gap-2 ">
                <Typography className="text-[14px]">
                  {stateData?.mode == "resubscribe"
                    ? t("dashboard.servicePlan")
                    : t("dashboard.selectServicePlan")}{" "}
                </Typography>
                <div className="w-64">
                  <Select
                    value={selectedRecurringFee || ""}
                    onChange={(value) => {
                      setSelectedRecurringFee(value);
                      setErrors(false);
                    }}
                    disabled={stateData?.mode == "resubscribe"}
                    label="Select Plan"
                    className=""
                    style={error ? { border: "1px solid red" } : {}}
                  >
                    {availableOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label} ({option.amount} {t("dashboard.etb")})
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="flex justify-between mt-2">
                <Typography className="text-[14px]">
                  {selectedFeeLabel} {t("dashboard.recurringFee")}
                </Typography>
                <Typography className="text-[14px] ">
                  {Number(selectedFeeAmount)?.toFixed(2)} {t("dashboard.etb")}
                </Typography>
              </div>
              {isExchangeFlow && stateData?.currentTagData?.dues < 0 && (
                <div className="flex justify-between mt-2">
                  <Typography className="text-[14px]">
                    {t("dashboard.outstanding")} {t("dashboard.recurringFee")}{" "}
                    {t("dashboard.previousPlan")}
                  </Typography>
                  <Typography className="text-[14px] ">
                    {Math.abs(stateData?.currentTagData?.dues)?.toFixed(2) ||
                      ""}{" "}
                    {t("dashboard.etb")}
                  </Typography>
                </div>
              )}
              {/* {(stateData?.currentTagData?.dues > 0 && isExchangeFlow) &&
                <div className="flex justify-between mt-2">
                  <Typography className="text-[14px]">
                    Adjustable Days (Previous Plan)
                  </Typography>
                  <Typography className="text-[14px] ">
                    {adjustableday} Day(s)
                  </Typography>
                </div>} */}
            </div>
          </div>

          {/* {isReserved && (
            <div className="flex items-center justify-between border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
              <Typography className="text-[14px]">Payment Method</Typography>
              <div className="flex items-center px-2 py-1 rounded-lg gap-2">
                <img className=" h-[34px] w-[70px]" src={TagName} alt="" />
              </div>
            </div>
          )} */}

          {/* Detailed Price Breakdown with tax components */}
          <div className="border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
            <Typography className="text-[16px] font-medium mb-2 border-b pb-2">
              {t("dashboard.priceBreakDown")}
            </Typography>

            <div className="flex justify-between">
              <Typography className="text-[14px]">
                {t("dashboard.subTotal")}{" "}
              </Typography>
              <Typography className="text-[14px] ">
                {priceBreakdown?.totalBasePrice || ""} {t("dashboard.etb")}
              </Typography>
            </div>
            <div className="flex justify-between mt-2">
              <Typography className="text-[14px]">
                {t("dashboard.vat")} (15%)
              </Typography>
              <Typography className="text-[14px] ">
                {priceBreakdown?.totalVAT || ""} {t("dashboard.etb")}
              </Typography>
            </div>
            <div className="flex justify-between mt-2">
              <Typography className="text-[14px]">
                {t("dashboard.exciseTax")}
              </Typography>
              <Typography className="text-[14px] ">
                {priceBreakdown.excisetax || ""} {t("dashboard.etb")}
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
                {priceBreakdown?.stampDuty || ""} {t("dashboard.etb")}
              </Typography>
            </div>

            <div className="flex justify-between mt-3 border-t py-2 font-medium">
              <div className="flex items-center gap-2">
                <Typography className="text-[14px] font-bold">
                  {t("dashboard.total")}{" "}
                </Typography>
                {selectedRecurringFee && (
                  <Tooltip
                    className="cursor-pointer bg-[#f6f7fb] shadow-xl border border-[#77777733]"
                    content={
                      <div className="w-80">
                        <Typography
                          variant="small"
                          color="white"
                          className="font-normal opacity-80 text-primary"
                        >
                          {t("dashboard.totalInfo")}{" "}
                          {moment(nextChargeDate).format("DD-MM-YYYY")}.
                        </Typography>
                      </div>
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="h-4 w-4 cursor-pointer text-primary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                      />
                    </svg>
                  </Tooltip>
                )}
              </div>
              <Typography className="text-[14px] font-bold">
                {priceBreakdown?.totalPrice || ""} {t("dashboard.etb")}
              </Typography>
            </div>
          </div>

          <div className="px-5 rounded-xl mt-3 text-[#555]">
            <div className="flex items-center">
              <span className="text-red-800 ">*</span>{" "}
              <Checkbox
                {...register("term", {
                  required: t("dashboard.termError"),
                })}
                style={
                  errors.term
                    ? { border: "1px solid red" }
                    : { border: "1px solid #8A8AA033" }
                }
                onClick={() => clearErrors()}
              />
              <Typography className="text-sm cursor-pointer leading-[40px] ">
                <span
                  className="text-[#008fd5] hover:underline"
                  onClick={() => {
                    window.open(ConstentRoutes.termofuse, "_blank");
                  }}
                >
                  {t("dashboard.termAndCondition")}{" "}
                </span>
              </Typography>
            </div>
            {errors.term && (
              <p className="text-left mt-1 text-sm text-[#FF0000]">
                {errors.term.message}
              </p>
            )}
          </div>
          {renderActionButtons()}
        </div>
      </form>
      <IndividualPaymentConfirmationModal
        isOpen={paymentType}
        onClose={() => setPaymentType(false)}
        state={{
          ...stateData,
          excisetax: priceBreakdown?.excisetax,
          vatable_total: priceBreakdown?.totalPrice,
          VAT: priceBreakdown?.totalVAT,
          stamp_duty: priceBreakdown?.stampDuty,
          base_price: priceBreakdown?.totalBasePrice,
          total_amount: priceBreakdown?.totalPrice,
          selectedAmount: selectedFeeAmount,
          selectedFeeLabel: selectedFeeLabel,
        }} // Use enhanced state data
        phoneNumber={`+${stateData?.currentTagData?.msisdn}`}
        reserve_tag_id={stateData?.reserve_tag_id}
        isLoading={dashboard?.loadingPayment}
        onConfirm={handleConfirmPayment}
        isCustomer={true}
        type={"buy"}
        isExchangeFlow={isExchangeFlow}
      />
      {isOpen && (
        <Paymentsuccessful
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          state={{
            ...stateData,
            excisetax: priceBreakdown?.excisetax,
            vatable_total: priceBreakdown?.totalPrice,
            VAT: priceBreakdown?.totalVAT,
            stamp_duty: priceBreakdown?.stampDuty,
            base_price: priceBreakdown?.totalBasePrice,
            total_amount: priceBreakdown?.totalPrice,
            selectedAmount: selectedFeeAmount,
            selectedFeeLabel: selectedFeeLabel,
          }}
          user={`+${stateData?.currentTagData?.msisdn}`}
          isCustomer={true}
          isExchangeFlow={isExchangeFlow}
        />
      )}

      {/* for corporate user */}
      {actionType === "buy" && docStatus?.status !== 0 && (
        <PaymentConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          state={{
            ...stateValue,
            excisetax: priceBreakdown?.excisetax,
            vatable_total: priceBreakdown?.totalPrice,
            VAT: priceBreakdown?.totalVAT,
            stamp_duty: priceBreakdown?.stampDuty,
            base_price: priceBreakdown?.totalBasePrice,
            total_amount: priceBreakdown?.totalPrice,
          }}
          phoneNumber={formatPhoneNumber(getCurrentPhoneNumber())}
          businessType={"BuyGoods"}
          reserve_tag_id={stateValue?.reserve_tag_id}
          onConfirm={() => handleConfirmPaymentLastPage(stateValue)}
          type={actionType}
        />
      )}

      {isOpenPayment && (
        <Paymentsuccessful
          isOpen={isOpenPayment}
          setIsOpen={setIsOpen}
          state={{
            ...stateValue,
            excisetax: priceBreakdown?.excisetax,
            vatable_total: priceBreakdown?.totalPrice,
            VAT: priceBreakdown?.totalVAT,
            stamp_duty: priceBreakdown?.stampDuty,
            base_price: priceBreakdown?.totalBasePrice,
            total_amount: priceBreakdown?.totalPrice,
          }}
          type={actionType}
          user={formatPhoneNumber(getCurrentPhoneNumber())}
        />
      )}
    </>
  );
};

export default TagDetails;
