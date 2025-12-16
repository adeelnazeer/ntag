/* eslint-disable react/prop-types */
import { Button, Checkbox, Typography } from "@material-tailwind/react";
import { useLocation } from "react-router-dom";
import { ConstentRoutes, getPriceBreakDown } from "../utilities/routesConst";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Paymentsuccessful from "../modals/paymentsuccessful";
import IndividualPaymentConfirmationModal from "../modals/IndividualPaymentConfirmationModal";
import { useTagList } from "./hooks/useDashboard";
import AddNumberComponent from "../components/add-number-component";
import axios from "axios";
import { toast } from "react-toastify";
import EndPoints from "../network/EndPoints";
import APICall from "../network/APICall";

const ChangeNumberDetailPage = () => {
    const location = useLocation();
    const stateData = location.state;
    const [type, setType] = useState("")
    const [paymentType, setPaymentType] = useState(false)
    const [data, setData] = useState(null)
    const [newNumber, setNewNumber] = useState("")
    const [disableBtn, setDisableBtn] = useState(true);
    const dashboard = useTagList();
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
    const [isPaymentDisable, setIsPaymentDisable] = useState(false);


    const [selectedFeeAmount, setSelectedFeeAmount] = useState(
        stateData.service_fee || tagData.service_fee || 0
    );
    const priceBreakdown = getPriceBreakDown({ tagPrice: Math.abs(stateData?.dues), packageFee: Number(stateData?.service_fee) });

    const [selectedFeeLabel, setSelectedFeeLabel] = useState(stateData.service_id || "Monthly");



    const onSubmit = (data) => {
        // Create enhanced state data with the correct recurring fee information
        const enhancedStateData = {
            ...stateData,
            recurring_fee_label: selectedFeeLabel,
            recurring_fee_amount: selectedFeeAmount,
            service_fee: selectedFeeAmount, // Update service_fee with selected amount
            service_id: selectedFeeLabel, // Update service_id with selected label
            isExchangeFlow: isExchangeFlow
        };

        // Store enhanced state for success modal
        setSuccessData(enhancedStateData);

        const accountId = userData?.parent_id != null && userData?.parent?.customer_account_id 
            ? userData.parent.customer_account_id 
            : userData?.customer_account_id;
        const payload = {
            payment_type: "CHANGE_MSISDN",
            recurring_fee: stateData?.service_fee || 0,
            outstanding_recurring_fee: Math.abs(stateData?.dues) || 0,
            total_amount: priceBreakdown?.totalPrice || 0,
            tax: priceBreakdown?.totalVAT || 0,
            vat: priceBreakdown?.totalVAT || 0,
            channel: "WEB",
            msisdn: stateData?.msisdn || "",
            new_msisdn: newNumber?.replace(/^\+/, ""),
            account_id: accountId?.toString() || "",
            customer_type: "corporate"
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
        APICall("post", data, EndPoints.customer.ChangeNumberOutstandingFee)
            .then((res) => {

                if (res?.success) {
                    window.location.replace(res?.data);
                    setIsPaymentDisable(true)
                    toast.success(res?.message || "Failed to change number");
                    // setIsOpen(true);
                    setPaymentType(false);
                    // Optionally, you can reset the form or redirect the user
                } else {
                    toast.error(res?.message || "Failed to change number");
                }
            })
            .catch((error) => {
                toast.error(error || "Something went wrong");
            });
    }

    return (
        <>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white max-w-[800px]">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 mb-4">
                    <Typography className=" font-bold">
                        Change  Mobile Number Mode
                    </Typography>
                    <Typography className="text-sm mt-1">
                        You are about to change your current mobile number +{stateData?.msisdn || ""} in NameTAG service.
                    </Typography>
                </div>

                <div className="p-4 rounded-xl shadow md:mt-6">
                    <Typography className="text-[#1F1F2C] pb-3 px-6 border-b text-lg font-bold ">
                        NameTAG Details
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
                        <Typography className="text-[14px]">Registered Mobile Number</Typography>
                        <Typography className="text-[14px] ">
                            +{stateData?.msisdn}
                        </Typography>
                    </div>
                    <div className="border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
                        <AddNumberComponent setNewNumber={setNewNumber} setDisableBtn={setDisableBtn} />
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
                                    {stateData?.service_id || ""} Recurring Fee
                                </Typography>
                                <Typography className="text-[14px] ">
                                    {Number(stateData?.service_fee)?.toFixed(2) || ""} ETB
                                </Typography>
                            </div>
                            <div className="flex justify-between mt-2">
                                <Typography className="text-[14px]">
                                    {stateData?.dues < 0 ? "Outstanding" : "Adjustable"} Recurring Fee (Previous Plan)
                                </Typography>
                                <Typography className="text-[14px] ">
                                    {Math.abs(stateData?.dues)?.toFixed(2) || ""} ETB
                                </Typography>
                            </div>
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

                        <div className="flex justify-between mt-2">
                            <Typography className="text-[14px]">Stamp Duty</Typography>
                            <Typography className="text-[14px] ">
                                {priceBreakdown?.stampDuty || ""} ETB
                            </Typography>
                        </div>

                        <div className="flex justify-between mt-3 border-t py-2 font-medium">
                            <div className="flex items-center gap-2">
                                <Typography className="text-[14px] font-bold">Total Amount </Typography>
                            </div>
                            <Typography className="text-[14px] font-bold">
                                {priceBreakdown?.totalPrice || ""} ETB
                            </Typography>
                        </div>
                    </div>
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
                            disabled={disableBtn || isPaymentDisable}
                            onClick={() => {
                                setType("buy")
                            }}
                        >
                            {"Change Mobile Number"}
                        </Button>
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
                    dues: stateData?.dues || 0,
                    VAT: priceBreakdown?.totalVAT,
                    stamp_duty: priceBreakdown?.stampDuty,
                    newNumber: newNumber?.replace(/^\+/, ""),
                    base_price: priceBreakdown?.totalBasePrice,
                    total_amount: priceBreakdown?.totalPrice,
                    selectedAmount: stateData?.service_fee || 0,
                    monthly_fee: stateData?.service_fee || 0,
                } || {
                    ...stateData,
                    excisetax: priceBreakdown?.excisetax,
                    vatable_total: priceBreakdown?.totalPrice,
                    VAT: priceBreakdown?.totalVAT,
                    dues: stateData?.dues || 0,
                    newNumber: newNumber?.replace(/^\+/, ""),
                    stamp_duty: priceBreakdown?.stampDuty,
                    base_price: priceBreakdown?.totalBasePrice,
                    total_amount: priceBreakdown?.totalPrice,
                    selectedAmount: stateData?.service_fee || 0,
                    monthly_fee: stateData?.service_fee || 0,
                }} // Use enhanced state data
                phoneNumber={`+${userData?.phone_number}`}
                reserve_tag_id={stateData?.reserve_tag_id}
                onConfirm={handleConfirmPayment}
                isCustomer={true}
                isLoading={dashboard?.loadingPayment}
                type={type}
                isChangeNumber={true}
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

export default ChangeNumberDetailPage;