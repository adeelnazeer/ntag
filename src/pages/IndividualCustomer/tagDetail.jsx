/* eslint-disable react/prop-types */
import { Button, Checkbox, Typography, Select, Option, Tooltip } from "@material-tailwind/react";
import Img from "../../assets/images/wallet (2).png";
import { useLocation, useNavigate } from "react-router-dom";
import { adjustableDays, ConstentRoutes, getPriceBreakDown } from "../../utilities/routesConst";
import { useForm } from "react-hook-form";
import { useAppSelector } from "../../redux/hooks";
import { useState, useEffect } from "react";
import TagName from "../../assets/images/Telebirr.png";
import { GiVibratingSmartphone } from "react-icons/gi";
import PaymentConfirmationModal from "../../modals/ConfirmPayment";
import { useTagListCustomer } from "../hooks/useDashboardCustomer";
import Paymentsuccessful from "../../modals/paymentsuccessful";
import IndividualPaymentConfirmationModal from "../../modals/IndividualPaymentConfirmationModal";
import moment from "moment";

const TagDetailsCustomer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const stateData = location.state;
    const [type, setType] = useState("")
    const [paymentType, setPaymentType] = useState(false)
    const [data, setData] = useState(null)
    const dashboard = useTagListCustomer();
    const [termsError, setTermsError] = useState(false);

    let userData = {}
    userData = JSON.parse(localStorage.getItem("user"));

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    // Watch the terms checkbox to validate in real-time
    const watchTerms = watch("term", false);

    // Clear error when terms are accepted
    useEffect(() => {
        if (watchTerms) {
            setTermsError(false);
        }
    }, [watchTerms]);

    const isExchangeFlow = stateData?.isExchangeFlow || false;
    const currentTagData = stateData?.currentTagData || null;
    // Determine if this is a premium tag
    const isPremium = stateData.tag_list_premium_id == 1 || stateData.premium_tag_list_id == 1 || stateData.tag_type === "VIP" || stateData.is_premium;

    // If premium tag and corp_premium_tag_list exists, use that data
    const tagData = isPremium && stateData.corp_premium_tag_list ? stateData.corp_premium_tag_list : stateData;

    const [isOpen, setIsOpen] = useState(false);
    const [successData, setSuccessData] = useState(null); // Store data for success modal

    // Get initial recurring fee type based on service_id
    const getInitialRecurringFeeType = () => {
        if (stateData?.service_id) {
            switch (stateData?.service_id) {
                case "Monthly": return "monthly_fee";
                case "Weekly": return "weekly_fee";
                case "Quarterly": return "quarterly_fee";
                case "Semi-Annually": return "semiannually_fee";
                case "Annually": return "annually_fee";
                default: return "monthly_fee";
            }
        }
        return "monthly_fee";
    };

    const [selectedRecurringFee, setSelectedRecurringFee] = useState(getInitialRecurringFeeType());
    const [selectedFeeAmount, setSelectedFeeAmount] = useState(
        stateData.service_fee || tagData.service_fee || 0
    );
    console.log({ stateData })
    const priceBreakdown = getPriceBreakDown({ tagPrice: stateData?.tag_price, packageFee: Number(stateData.monthly_fee) });

    const [selectedFeeLabel, setSelectedFeeLabel] = useState(stateData.service_id || "Monthly");

    // Define recurring fee options
    const recurringFeeOptions = [
        { value: "monthly_fee", label: "Monthly", amount: tagData.monthly_fee || 0 },
        // { value: "weekly_fee", label: "Weekly", amount: tagData.weekly_fee || 0 },
        { value: "quarterly_fee", label: "Quarterly", amount: tagData.quarterly_fee || 0 },
        { value: "semiannually_fee", label: "Semi-Annually", amount: tagData.semiannually_fee || 0 },
        { value: "annually_fee", label: "Annually", amount: tagData.annually_fee || 0 },
    ];

    // Filter to show only available options (those with amount > 0 or currently selected)
    const availableOptions = recurringFeeOptions.filter(
        option => option.value === selectedRecurringFee || parseFloat(option.amount) > 0
    );

    // Update selected fee amount and label when recurring fee type changes
    useEffect(() => {
        const selectedOption = recurringFeeOptions.find(option => option.value === selectedRecurringFee);
        if (selectedOption) {
            setSelectedFeeAmount(selectedOption.amount);
            setSelectedFeeLabel(selectedOption.label);
        }
    }, [selectedRecurringFee]);

    const vat = Number(stateData.VAT || 0);
    const exciseTax = Number(stateData.excisetax || 0);
    const stampDuty = Number(stateData.stamp_duty || 0);
    const vatableTotal = Number(stateData.vatable_total || 0);

    const totalAmount = stateData.total_amount
        ? Number(stateData.total_amount)
        : (Number(stateData.price || 0) + vat + exciseTax + stampDuty);
    const adjustableday = adjustableDays({ dues: stateData?.currentTagData?.[0]?.dues, plan: selectedFeeLabel })


    const onSubmit = (data) => {
        // Create enhanced state data with the correct recurring fee information
        const enhancedStateData = {
            ...stateData,
            recurring_fee_type: selectedRecurringFee,
            recurring_fee_label: selectedFeeLabel,
            recurring_fee_amount: selectedFeeAmount,
            service_fee: selectedFeeAmount, // Update service_fee with selected amount
            service_id: selectedFeeLabel, // Update service_id with selected label
            isExchangeFlow: isExchangeFlow
        };

        // Store enhanced state for success modal
        setSuccessData(enhancedStateData);
        let isReserveCase
        if ((stateData?.isReserve) || isExchangeFlow) {
            isReserveCase = "existing"
        } else {
            isReserveCase = "new"
        }
        const payload = {
            transaction_type: "IND_BUYTAG",
            channel: "WEB",
            account_id: userData?.id,
            customer_tag_id: stateData?.id,
            type: type,
            corp_reserve_tag_id: stateData?.reserve_tag_id || null,
            title: `#${stateData?.tag_name}` || `#${stateData?.tittle}` || "",
            customer_tag_no: stateData?.tag_no || "",
            phone_number: userData?.phone_number?.replace(/^\+/, ''),
            amount: (priceBreakdown?.totalPrice || "0").toString(),
            payment_method: "telebirr",
            reserve_type: isReserveCase,
            msisdn: userData?.phone_number?.replace(/^\+/, ''),
            business_type: userData?.business_type || "BuyGoods",
            service_fee: selectedFeeAmount, // Use selected fee amount
            // Add recurring fee information
            recurring_fee_type: selectedRecurringFee,
            recurring_fee_label: selectedFeeLabel,
            recurring_fee_amount: selectedFeeAmount,
            service_id: selectedFeeLabel,
            exchange_days_adjust: adjustableday,
            next_charge_date: nextChargeDate ? moment(nextChargeDate).format("YYYY-MM-DD") : null,
            dues:stateData?.currentTagData?.[0]?.dues || 0,
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
                recurring_fee_type: selectedRecurringFee,
                recurring_fee_label: selectedFeeLabel,
                recurring_fee_amount: selectedFeeAmount
            }
        };
        setData(payload);
        setPaymentType(true);
    };

    const handleFormSubmit = (formData) => {
        if (!watchTerms) {
            setTermsError(true);
            return;
        }
        onSubmit(formData);
    };

    const handleConfirmPayment = () => {
        if (isExchangeFlow) {
            // Call the change-number API endpoint
            dashboard.handleTagExchange(data, setPaymentType);
        } else {
            // Regular flow - call the buy tag API
            dashboard.handleTagDetails(data, setIsOpen, setPaymentType);
        }
    }

    const formatPrice = (price) => {
        if (!price) return "0.00";
        return price;
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

    const nextChargeDate = getNextChargeDate(selectedRecurringFee, stateData?.currentTagData?.[0]?.current_date || new Date());

    console.log({ stateData })

    return (
        <>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white max-w-[800px]">
                {isExchangeFlow && (
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 mb-4">
                        <Typography className=" font-bold">
                            TAG Exchange Mode
                        </Typography>
                        <Typography className="text-sm mt-1">
                            You are about to change your current TAG #{currentTagData?.[0]?.tag_no + " " || ""}
                            to TAG #{tagData?.tag_no}. This action cannot be undone.
                        </Typography>
                    </div>
                )}
                <div className="p-4 rounded-xl shadow md:mt-6">
                    <Typography className="text-[#1F1F2C] pb-3 px-6 border-b text-lg font-bold ">
                        {isExchangeFlow ? "Change NameTAG" : "Buy NameTAG"}
                    </Typography>

                    <div className="flex justify-between mt-3 border bg-[#F6F7FB] border-[#77777733] px-5 py-3 rounded-xl">
                        <Typography className="text-[14px]">NameTAG</Typography>
                        <Typography className="text-[14px] ">
                            {tagData.tag_name}
                        </Typography>
                    </div>
                    <div className="flex justify-between border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
                        <Typography className="text-[14px]">NameTAG Number</Typography>
                        <Typography className="text-[14px] ">
                            #{tagData.tag_no}
                        </Typography>
                    </div>

                    <div className="flex justify-between border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
                        <Typography className="text-[14px]">NameTAG Category</Typography>
                        <Typography className="text-[14px] ">
                            {tagData.tag_type}
                        </Typography>
                    </div>
                    {userData?.phone_number &&
                        <div className="flex justify-between border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
                            <Typography className="text-[14px]">Registered Mobile Number</Typography>
                            <Typography className="text-[14px] ">
                                +{userData?.phone_number}
                            </Typography>
                        </div>
                    }

                    {/* <div className="border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
                        <div className="flex justify-between">
                            <Typography className="text-[14px]">Sub Total </Typography>
                            <Typography className="text-[14px] ">
                                {formatPrice(stateData?.base_price || stateData.tag_price || stateData.tag_name_price || 0)} ETB
                            </Typography>
                        </div>

                         <div className="flex justify-between mt-3">
                            <Typography className="text-[14px]">VAT (15%)</Typography>
                            <Typography className="text-[14px] ">
                                {formatPrice(vat)} ETB
                            </Typography>
                        </div>

                         <div className="flex justify-between mt-3">
                            <Typography className="text-[14px]">Excise Tax</Typography>
                            <Typography className="text-[14px] ">
                                {formatPrice(exciseTax)} ETB
                            </Typography>
                        </div>

                         <div className="flex justify-between mt-3">
                            <Typography className="text-[14px]">Stamp Duty</Typography>
                            <Typography className="text-[14px] ">
                                {formatPrice(stampDuty)} ETB
                            </Typography>
                        </div>

                         

                        <div className="flex justify-between mt-3 border-t py-2">
                            <Typography className="text-[14px] font-bold">Total Subscription Fee</Typography>
                            <Typography className="text-[14px] font-bold">{formatPrice(totalAmount)} ETB</Typography>
                        </div>
                    </div> */}
                    <div className="flex justify-between border px-5 border-[#77777733] bg-[#F6F7FB] py-3 rounded-xl mt-3">
                        <Typography className="text-[14px]">Subscription Fee</Typography>
                        <Typography className="text-[14px] font-bold ">
                            {Number(stateData?.tag_price)?.toFixed(2) || ""} ETB
                        </Typography>
                    </div>
                    <div className="border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
                        {/* Recurring Fee Package Selection */}
                        <div className="">
                            <div className="flex justify-between">
                                <Typography className="text-[14px]">Service Plan</Typography>
                                <Typography className="text-[14px] ">
                                    Monthly
                                </Typography>
                            </div>

                            <div className="flex justify-between mt-2">
                                <Typography className="text-[14px]">
                                    {selectedFeeLabel} Recurring Fee
                                </Typography>
                                <Typography className="text-[14px] ">
                                    {formatPrice(selectedFeeAmount)} ETB
                                </Typography>
                            </div>
                            {isExchangeFlow &&
                                <div className="flex justify-between mt-2">
                                    <Typography className="text-[14px]">
                                        {stateData?.currentTagData?.[0]?.dues < 0 ? "Outstanding" : "Adjustable"} Recurring Fee (Previous Plan)
                                    </Typography>
                                    <Typography className="text-[14px] ">
                                        {Math.abs(stateData?.currentTagData?.[0]?.dues)?.toFixed(2) || ""} ETB
                                    </Typography>
                                </div>
                            }
                            {(stateData?.currentTagData?.[0]?.dues > 0 && isExchangeFlow) &&
                                <div className="flex justify-between mt-2">
                                    <Typography className="text-[14px]">
                                        Adjustable Days (Previous Plan)
                                    </Typography>
                                    <Typography className="text-[14px] ">
                                        {adjustableday} Day(s)
                                    </Typography>
                                </div>}
                        </div>
                    </div>
                    {/* Detailed Price Breakdown with tax components */}
                    <div className="border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
                        <Typography className="text-[16px] font-medium mb-2 border-b pb-2">
                            Price Breakdown
                        </Typography>

                        <div className="flex justify-between">
                            <Typography className="text-[14px]">Sub Total </Typography>
                            <Typography className="text-[14px] ">
                                {(priceBreakdown?.totalBasePrice || "")} ETB
                            </Typography>
                        </div>
                        <div className="flex justify-between mt-2">
                            <Typography className="text-[14px]">VAT (15%)</Typography>
                            <Typography className="text-[14px] ">
                                {priceBreakdown?.totalVAT || ""} ETB
                            </Typography>
                        </div>
                        <div className="flex justify-between mt-2">
                            <Typography className="text-[14px]">Excise Tax</Typography>
                            <Typography className="text-[14px] ">
                                {priceBreakdown.excisetax || ""} ETB
                            </Typography>
                        </div>

                        {/* <div className="flex justify-between mt-2">
             <Typography className="text-[14px] font-bold">Vatable Total</Typography>
             <Typography className="text-[14px] font-bold">
               {vatableTotalAmount.toFixed(2)} ETB
             </Typography>
           </div> */}



                        <div className="flex justify-between mt-2">
                            <Typography className="text-[14px]">Stamp Duty</Typography>
                            <Typography className="text-[14px] ">
                                {priceBreakdown?.stampDuty || ""} ETB
                            </Typography>
                        </div>

                        <div className="flex justify-between mt-3 border-t py-2 font-medium">
                            <div className="flex items-center gap-2">
                                <Typography className="text-[14px] font-bold">Total Amount </Typography>
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
                                                    Total Amount: This includes both the one-time subscription fee and all applicable recurring fees up to {moment(nextChargeDate).format("DD-MM-YYYY")}.
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
                                {priceBreakdown?.totalPrice || ""} ETB
                            </Typography>
                        </div>
                    </div>
                    {/* <div className="flex items-center justify-between border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
                        <Typography className="text-[14px]">Payment Method</Typography>
                        <div className="flex items-center px-2 py-1 rounded-lg gap-2"><img className=" h-[34px] w-[70px]" src={TagName} alt="" /></div>
                    </div> */}
                    <div className="px-5 rounded-xl mt-3 text-[#555]">
                        <div className="flex items-center">
                            <span className="text-red-800 ">*</span>{" "}
                            <Checkbox
                                {...register("term", {
                                    required: true,
                                })}
                                style={
                                    errors.term || termsError
                                        ? { border: "1px solid red" }
                                        : { border: "1px solid #8A8AA033" }
                                }
                            />
                            <Typography className="text-sm cursor-pointer leading-[40px] ">
                                <span className="text-[#008fd5] hover:underline"
                                    onClick={() => {
                                        window.open(ConstentRoutes.termofuse, "_blank")
                                    }}
                                >Terms and Conditions </span>
                            </Typography>
                        </div>
                        {/* Display error message when terms not accepted */}
                        {(termsError || errors.term) && (
                            <Typography className="text-red-500 text-sm ml-6 mt-1 font-bold">
                                You must accept the Terms & Conditions to continue
                            </Typography>
                        )}
                    </div>
                    <div className="flex justify-center gap-3 mt-2">
                        <Button
                            className="bg-secondary text-white text-[14px] w-auto"
                            type="submit"
                            onClick={() => {
                                setType("buy")
                            }}
                        >
                            {isExchangeFlow ? "Change TAG" : "Buy NameTAG"}
                        </Button>
                        {(!stateData.isReserve && !isExchangeFlow) && (
                            <Button
                                className="bg-secondary text-white text-[14px] w-auto"
                                type="submit"
                                onClick={() => {
                                    setType("reserve")
                                }}
                            >
                                Reserve NameTAG
                            </Button>
                        )}

                    </div>
                </div>
            </form>
            <IndividualPaymentConfirmationModal
                isOpen={paymentType}
                onClose={() => setPaymentType(false)}
                state={{
                    ...successData,
                    excisetax: priceBreakdown?.excisetax,
                    vatable_total: priceBreakdown?.totalPrice,
                    VAT: priceBreakdown?.totalVAT,
                    stamp_duty: priceBreakdown?.stampDuty,
                    base_price: priceBreakdown?.totalBasePrice,
                    total_amount: priceBreakdown?.totalPrice,
                    selectedAmount: selectedFeeAmount
                } || {
                    ...stateData,
                    excisetax: priceBreakdown?.excisetax,
                    vatable_total: priceBreakdown?.totalPrice,
                    VAT: priceBreakdown?.totalVAT,
                    stamp_duty: priceBreakdown?.stampDuty,
                    base_price: priceBreakdown?.totalBasePrice,
                    total_amount: priceBreakdown?.totalPrice,
                    selectedAmount: selectedFeeAmount
                }} // Use enhanced state data
                phoneNumber={`+${userData?.phone_number}`}
                reserve_tag_id={stateData?.reserve_tag_id}
                onConfirm={handleConfirmPayment}
                isCustomer={true}
                isLoading={dashboard?.loadingPayment}
                type={type}
                isExchangeFlow={isExchangeFlow}
            />
            {isOpen && (
                <Paymentsuccessful
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    state={successData || stateData} // Use enhanced state data
                    user={`+${userData?.phone_number}`}
                    isCustomer={true}
                    isExchangeFlow={isExchangeFlow}
                />
            )}
        </>
    );
};

export default TagDetailsCustomer;