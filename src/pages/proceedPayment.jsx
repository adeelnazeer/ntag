/* eslint-disable react/prop-types */
import {
  Button,
  Typography,
  Select,
  Option,
  Checkbox
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { GiVibratingSmartphone } from "react-icons/gi";
import { FaPlusCircle } from "react-icons/fa";
import { useRegisterHook } from "./hooks/useRegisterHook";
import { useTagList } from "../pages/hooks/useDashboard";
import { ConstentRoutes } from "../utilities/routesConst";
import { useAppSelector } from "../redux/hooks";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import TagName from "../assets/images/Telebirr.png";
import Paymentsuccessful from "../modals/paymentsuccessful";
import PaymentConfirmationModal from "../modals/ConfirmPayment";

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";

  const digitsOnly = phoneNumber.replace(/\D/g, '');

  if (digitsOnly.startsWith('251') && digitsOnly.length >= 12) {
    return `+251 ${digitsOnly.substring(3, 4)}${digitsOnly.substring(4)}`;
  } else if (digitsOnly.startsWith('09') && digitsOnly.length >= 10) {
    return `+251 ${digitsOnly.substring(1)}`;
  } else if (digitsOnly.startsWith('9') && digitsOnly.length >= 9) {
    return `+251 ${digitsOnly}`;
  }

  return `+${digitsOnly}`;
};

// Function to strip + from phone number
const stripPlusFromPhone = (phoneNumber) => {
  if (!phoneNumber) return "";
  return phoneNumber.replace(/^\+/, '');
};

const ProceedPayment = () => {
  const { handleSubmit } = useForm();
  const dashboard = useTagList();
  const navigate = useNavigate();
  const registerData = useRegisterHook();
  const location = useLocation();
  const state = location?.state || {};
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [availablePhoneNumbers, setAvailablePhoneNumbers] = useState([]);
  const [loadingPhoneNumbers, setLoadingPhoneNumbers] = useState(false);
  const [selectedPhoneNumberId, setSelectedPhoneNumberId] = useState('');
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
  const [disableBtn, setDisableBtn] = useState(false)

  let userData = useAppSelector(state => state?.user?.userData);
  if (!userData) {
    const userDataFromStorage = localStorage.getItem("user");
    userData = userDataFromStorage ? JSON.parse(userDataFromStorage) : {};
  }

  const corporateDocuments = useAppSelector(state => state?.user?.corporateDocuments);

  const docStatus = {
    status: (corporateDocuments?.[0]?.doc_status === "1" && corporateDocuments?.[1]?.doc_status === "1") ? 1 : 0,
    corp_document: corporateDocuments
  };

  const hasMsisdn = !!state?.msisdn;

  const isPremium = state?.tag_list_type === "premium_tag_list" || state?.tag_type === "VIP" || state?.is_premium;

  const isReserved = state?.isReserve === true;
  const actionType = isReserved ? "buy" : (state?.action_type || (docStatus?.status === 0 ? "reserve" : "buy"));

  const [phoneNumber, setPhoneNumber] = useState({
    selectedFromList: !hasMsisdn
  });
  const [businessType, setBusinessType] = useState("BuyGoods");

  // Get tax values from state
  const tagPrice = state?.tag_price || state?.tag_name_price || 0;
  const exciseTax = state?.excisetax || 0;
  const vatableTotalAmount = state?.vatable_total || (Number(tagPrice) + Number(exciseTax));
  const vatAmount = Number(state?.VAT); // Remove commas
  const stampDuty = Number(state?.stamp_duty ?? 0); // Default to 5 if not available
  const totalAmount = state?.total_amount || state?.totalPrice ||
    (Number(vatableTotalAmount) + Number(vatAmount) + Number(stampDuty));
  console.log({ state })

  useEffect(() => {
    if (!hasMsisdn) {
      fetchAvailablePhoneNumbers();
    } else {
      // If we have an MSISDN from state, use it
      setSelectedPhoneNumber(state.msisdn);
    }
  }, [hasMsisdn]);

  const fetchAvailablePhoneNumbers = async () => {
    if (!userData?.id) return;

    try {
      setLoadingPhoneNumbers(true);
      const response = await APICall("get", null, EndPoints.customer.GetAllNumbers(userData.id));

      if (response?.success && response?.data) {
        const phoneNumbers = Array.isArray(response.data)
          ? response.data
          : [response.data];

        setAvailablePhoneNumbers(phoneNumbers);

        // Don't auto-select the first number
        setPhoneNumber({
          selectedFromList: true
        });
        // Set selectedPhoneNumberId to empty string instead of auto-selecting
        setSelectedPhoneNumberId('');
      }
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
      toast.error("Error fetching phone numbers");
    } finally {
      setLoadingPhoneNumbers(false);
    }
  };

  const onSubmit = () => {
    // Check if a phone number is selected when needed
    if (!hasMsisdn && !selectedPhoneNumberId) {
      toast.error("Please select a mobile number");
      return;
    }

    if (docStatus?.status !== 0 && actionType === "buy") {
      setShowConfirmModal(true);
    } else {
      handleConfirmPayment();
    }
  };

  const getServiceId = (feeType) => {
    switch (feeType) {
      case "monthly_fee": return "Monthly";
      case "weekly_fee": return "Weekly";
      case "quarterly_fee": return "Quarterly";
      case "semiannually_fee": return "Semi-Annually";
      case "annually_fee": return "Annually";
      default: return "Monthly";
    }
  };

  const getCurrentPhoneNumber = () => {
    if (hasMsisdn) {
      return state.msisdn;
    } else if (selectedPhoneNumber) {
      return selectedPhoneNumber;
    } else if (selectedPhoneNumberId) {
      const selectedPhone = availablePhoneNumbers.find(p => p.id === selectedPhoneNumberId);
      return selectedPhone ? selectedPhone.msisdn : "";
    } else {
      return userData?.phone_number || "";
    }
  };

  const handlePhoneNumberChange = (e) => {
    const phoneId = e.target.value;
    setSelectedPhoneNumberId(phoneId);
    if (phoneId) {
      const selectedPhone = availablePhoneNumbers.find(p => p.id == phoneId);
      if (selectedPhone) {
        setSelectedPhoneNumber(selectedPhone.msisdn);
      }
    } else {
      setSelectedPhoneNumber('');
    }
  };

  const handleConfirmPayment = () => {
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
    if (actionType === "buy") {
      if (isReserved) {
        reserveType = 'existing';
      } else {
        reserveType = 'new';
      }
    } else {
      reserveType = "new";
    }

    const accountId = userData?.parent_id != null && userData?.parent?.customer_account_id 
      ? userData.parent.customer_account_id 
      : userData?.customer_account_id;
    const values = {
      transaction_type: "CORP_BUYTAG",
      channel: "WEB",
      account_id: accountId,
      customer_tag_id: state?.id,
      type: actionType,
      corp_reserve_tag_id: state?.reserve_tag_id || null,
      title: `#${state?.tag_name}` || `#${state?.tittle}` || "",
      customer_tag_no: state?.tag_no || "",
      // Use the selected phone number for both fields
      phone_number: stripPlusFromPhone(userData.phone_number),
      amount: totalAmount.toString(),
      payment_method: "telebirr",
      reserve_type: reserveType,
      msisdn: formattedMsisdn,
      business_type: businessType,
      service_fee: state?.service_fee,
      recurring_fee_type: state?.recurring_fee_type,
      recurring_fee_amount: state?.recurring_fee_amount,
      is_premium: isPremium,
      // Add tax related values
      excisetax: exciseTax,
      vatable_total: vatableTotalAmount,
      vat: vatAmount,
      stamp_duty: stampDuty,
      total_amount: totalAmount
    };

    if (state?.tag_list_type) {
      values.tag_list_type = state.tag_list_type;

      const serviceId = state?.recurring_fee_label || getServiceId(state?.recurring_fee_type);

      if (state?.tag_list_type === "premium_tag_list") {
        values.tag_list = {
          id: state?.id,
          tag_no: state?.tag_no || "",
          tag_name: state?.tag_name || "",
          tag_price: (state?.tag_price || state?.tag_name_price || "0").toString(),
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
          excisetax: exciseTax,
          vatable_total: vatableTotalAmount,
          VAT: vatAmount,
          stamp_duty: stampDuty,
          total_amount: totalAmount
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
          excisetax: exciseTax,
          vatable_total: vatableTotalAmount,
          VAT: vatAmount,
          stamp_duty: stampDuty,
          total_amount: totalAmount
        };
      } else {
        values.tag_id = state?.tag_id !== undefined ? state?.tag_id : null;

        values.tag_list = {
          id: state?.id,
          tag_no: state?.tag_no || "",
          tag_name: state?.tag_name || "",
          tag_price: (state?.tag_price || "0").toString(),
          service_fee: (state?.recurring_fee_amount || state?.service_fee || "0").toString(),
          service_id: serviceId,
          tag_type: state?.tag_type || "",
          tag_digits: state?.tag_digits || 0,
          created_date: state?.created_date || "",
          status: state?.status || 1,
          comments: state?.comments || "",
          tax: (state?.tax || "0").toString(),
          is_premium: state?.tag_list_type === 'vip_tag_list' ? true : false,
          // Add tax related values
          excisetax: exciseTax,
          vatable_total: vatableTotalAmount,
          VAT: vatAmount,
          stamp_duty: stampDuty,
          total_amount: totalAmount
        };
      }
    }

    // For debugging
    if (state.mode == "resubscribe") {

      const payload = {
        corp_subscriber_id: state?.reserve_tag_id
      };

      APICall("post", payload, "customer/re-subscribe")
        .then(res => {
          if (res?.success) {
            setDisableBtn(true)
            setTimeout(() => {
              setDisableBtn(false);
            }, 5 * 60 * 1000);
            if (!res?.data?.corp_reserved_tag_id) {
              localStorage.setItem('merchId', payload?.corp_reserve_tag_id || null);
              window.location.replace(res?.data);
            } else {
              toast.success(res?.message || "");
              setIsOpen(true);
            }
          } else {
            toast.error(res?.message || "Failed to process request");
          }
        })
        .catch(err => {
          toast.error(err?.message || "An error occurred");
        });
    } else {
      dashboard.handleTagDetails(values, setIsOpen, setDisableBtn);
    }
  };

  // Navigate to phone management tab in profile page
  const goToNumberManagement = () => {
    navigate(ConstentRoutes.profilePage, { state: { activeTab: "number" } });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white max-w-[800px]">
        <div className="p-4 rounded-xl shadow pb-6 md:mt-6">
          <Typography className="text-[#1F1F2C] pb-3 px-6 border-b text-lg font-bold">
            {actionType === "buy" ? "Payment Details" : "NameTAG Reservation Confirmation"} {isPremium ? "- Premium NameTAG" : ""}
          </Typography>
          <div className="flex justify-between border-[#77777733] mt-4 border bg-[#F6F7FB] px-5 py-3 rounded-xl">
            <Typography className="text-[14px]">NameTAG</Typography>
            <Typography className="text-[14px]">{state?.tag_name || ""}</Typography>
          </div>

          <div className="flex justify-between border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
            <Typography className="text-[14px]">NameTAG Number</Typography>
            <Typography className="text-[14px]">
              #{state?.tag_no || ""}
            </Typography>
          </div>
          <div className="flex justify-between border-[#77777733] mt-4 border bg-[#F6F7FB] px-5 py-3 rounded-xl">
            <Typography className="text-[14px]">NameTAG Category</Typography>
            <Typography className="text-[14px]">{state?.tag_type || ""}</Typography>
          </div>
          {(isReserved && state?.mode != "resubscribe") && (
            <div className="flex justify-between border border-blue-300 bg-blue-50 px-5 py-3 rounded-xl mt-3">
              <Typography className="text-[14px]">Reservation Status</Typography>
              <Typography className="text-[14px] font-bold text-blue-600">
                Reserved
              </Typography>
            </div>
          )}

          <div className="flex justify-between border bg-[#008fd547] px-5 py-3 rounded-xl mt-3">
            <Typography className="text-[14px]">TAG Type</Typography>
            <Typography className="text-[14px] font-bold ">
              {isPremium ? "Premium" : "Corporate"}
            </Typography>
          </div>

          {/* Detailed Price Breakdown with tax components */}
          <div className="border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
            <Typography className="text-[16px] font-medium mb-2 border-b pb-2">
              Price Breakdown
            </Typography>

            <div className="flex justify-between mt-2">
              <Typography className="text-[14px]">Sub Total </Typography>
              <Typography className="text-[14px]">
                {Number(state?.base_price).toFixed(2)} ETB
              </Typography>
            </div>
            <div className="flex justify-between mt-2">
              <Typography className="text-[14px]">VAT (15%)</Typography>
              <Typography className="text-[14px]">
                {Number(vatAmount).toFixed(2)} ETB
              </Typography>
            </div>
            <div className="flex justify-between mt-2">
              <Typography className="text-[14px]">Excise Tax</Typography>
              <Typography className="text-[14px]">
                {Number(exciseTax).toFixed(2)} ETB
              </Typography>
            </div>

            {/* <div className="flex justify-between mt-2">
              <Typography className="text-[14px] font-bold">Vatable Total</Typography>
              <Typography className="text-[14px] font-bold">
                {Number(vatableTotalAmount).toFixed(2)} ETB
              </Typography>
            </div> */}



            <div className="flex justify-between mt-2">
              <Typography className="text-[14px]">Stamp Duty</Typography>
              <Typography className="text-[14px]">
                {Number(stampDuty).toFixed(2)} ETB
              </Typography>
            </div>

            <div className="flex justify-between mt-3 border-t py-2 font-medium">
              <Typography className="text-[14px] font-bold">Total Subscription Fee</Typography>
              <Typography className="text-[14px] font-bold">
                {Number(totalAmount)?.toFixed(2)} ETB
              </Typography>
            </div>
          </div>

          <div className="flex justify-between border-[#77777733] border bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
            <Typography className="text-[14px]">
              Selected  Service Plan
            </Typography>
            <Typography className="text-[14px]">
              {getServiceId(state?.recurring_fee_type) || "Monthly"}
            </Typography>
          </div>


          <div className="flex justify-between border-[#77777733] border bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
            <Typography className="text-[14px]">
              {state?.recurring_fee_label || "Monthly"} Recurring Fee
            </Typography>
            <Typography className="text-[14px]">
              {Number(state?.recurring_fee_amount)?.toFixed(2) || "0"} ETB
            </Typography>
          </div>

          {!hasMsisdn && (
            <div className="px-5 py-4 mt-3">
              <Typography className="text-[#1F1F2C] text-sm font-medium bg-[#F8F9FA] p-3 rounded-lg border border-[#E9ECEF]">
                Please select Mobile Number from the dropdown below to map with selected TAG Number or to add a new Mobile Number <button
                  onClick={goToNumberManagement}
                  className="text-secondary hover:underline font-medium"
                  type="button"
                >Click Here</button>
              </Typography>
            </div>
          )}

          {hasMsisdn ? (
            <div className="border-[#77777733] border bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <Typography className="text-[14px]">
                    Registered Mobile Number
                  </Typography>
                </div>

                <div className="flex items-center gap-2">
                  <Typography className="text-[14px] md:min-w-[200px] border border-[#8dc63f] p-2 rounded-lg text-[#0000008F]">
                    {formatPhoneNumber(state.msisdn)}
                  </Typography>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-[#77777733] border bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
              <div className="flex justify-between flex-wrap">
                <div className="flex gap-2 items-center">
                  <Typography className="text-[14px]">
                    Mobile Number
                  </Typography>
                </div>

                <div className="flex items-center gap-2">
                  {loadingPhoneNumbers ? (
                    <Typography className="text-sm text-gray-500">Loading...</Typography>
                  ) : availablePhoneNumbers && availablePhoneNumbers.length > 0 ? (
                    <div className="flex gap-2 items-center">
                      <select
                        value={selectedPhoneNumberId}
                        onChange={handlePhoneNumberChange}
                        className="min-w-[200px] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-sm bg-white"
                      >
                        {/* Default option */}
                        <option disabled value="">Select Mobile Number</option>

                        {availablePhoneNumbers
                          .filter(number => number.tag_status !== 1)
                          .map(number => (
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
                      <Typography className="text-sm text-gray-500">No Numbers to Buy </Typography>
                      <Button
                        size="sm"
                        className="bg-secondary flex items-center gap-1"
                        onClick={goToNumberManagement}
                        type="button"
                      >
                        <FaPlusCircle className="h-3 w-3" /> Add
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-[#77777733] border bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
            <Typography className="text-[14px]">Payment Method</Typography>
            <div className="flex items-center px-2 py-1 rounded-lg gap-2">
              <img className=" h-[34px] w-[70px]" src={TagName} alt="" />
            </div>
          </div>
          {/* {actionType === "buy" && docStatus?.status !== 0 && (
            <div className="border-[#77777733] border bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
              <div className="flex justify-between items-center">
                <Typography className="text-[14px]">Payment Option</Typography>
                <div className="w-80">
                  <Select
                    value={businessType}
                    onChange={(value) => setBusinessType(value)}
                    className="border border-[#8dc63f] rounded-lg"
                  >
                    <Option value="TransferToOtherOrg">Payment via telebirr partner App</Option>
                    <Option value="BuyGoods">Payment Via telebirr Super App</Option>
                  </Select>
                </div>
              </div>
            </div>
          )} */}

          <div className="flex justify-center mt-4">
            <Button
              className={`${(!hasMsisdn && !selectedPhoneNumberId)
                ? 'bg-gray-400'
                : 'bg-secondary'} text-white text-[14px] w-[280px]`}
              type="submit"
              loading={dashboard?.loadingPayment}
              disabled={!hasMsisdn && !selectedPhoneNumberId || disableBtn}
            >
              {actionType === "buy" ? "Proceed to Payment" : "Proceed to Reservation"}
            </Button>
          </div>

          <div className="mt-4">
            <Typography className="text-[14px] flex align-middle mb-0">
              <span className="text-red-500 me-3 align-top m-0 font-bold text-3xl">*</span>
              The recurring fee will be charged to your telebirr account according to the selected plan
            </Typography>
          </div>
          {actionType === "buy" && docStatus?.status !== 0 && (
            <PaymentConfirmationModal
              isOpen={showConfirmModal}
              onClose={() => setShowConfirmModal(false)}
              state={{
                ...state,
                excisetax: exciseTax,
                vatable_total: vatableTotalAmount,
                VAT: vatAmount,
                stamp_duty: stampDuty,
                total_amount: totalAmount
              }}
              phoneNumber={formatPhoneNumber(getCurrentPhoneNumber())}
              businessType={businessType}
              reserve_tag_id={state?.reserve_tag_id}
              onConfirm={handleConfirmPayment}
              type={actionType}
            />
          )}

          {isOpen && (
            <Paymentsuccessful
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              state={{
                ...state,
                excisetax: exciseTax,
                vatable_total: vatableTotalAmount,
                VAT: vatAmount,
                stamp_duty: stampDuty,
                total_amount: totalAmount
              }}
              type={actionType}

              user={formatPhoneNumber(getCurrentPhoneNumber())}
            />
          )}
        </div>
      </form>
    </>
  );
};

export default ProceedPayment;