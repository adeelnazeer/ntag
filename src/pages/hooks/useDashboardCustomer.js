import { useEffect, useState } from "react";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../../utilities/routesConst";
import {
  extractRawRequestFromBuyTagResponse,
  isTelebirrCallbackPaymentSuccess,
  normalizeTelebirrCallbackParams,
  redirectToTelebirrPayment,
  startTelebirrMiniAppPay,
} from "../../utilities/telebirrMiniAppPay";
import {
  getTelebirrAppTypeChannel,
  isTelebirrMiniAppEntry,
} from "../../utilities/telebirrMiniAppChannel";

const isPaymentStatusSuccess = (status) =>
    status === "PAY_SUCCESS" || status === "Completed";

const isApiPaymentSuccess = (apiRes) => {
    const bizContent = apiRes?.data?.service_response?.biz_content;
    const serviceResponse = apiRes?.data?.service_response;
    const orderStatus = bizContent?.order_status ?? serviceResponse?.order_status;
    const tradeStatus = bizContent?.trade_status ?? serviceResponse?.trade_status;

    return (
        isPaymentStatusSuccess(orderStatus) || isPaymentStatusSuccess(tradeStatus)
    );
};

export const useTagListCustomer = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({ page: 1, tag_digits: 0 });
    const [metaData, setMetaData] = useState(null);
    const [filters, setFilters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [searchMessage, setSearchMessage] = useState(""); // Add state for search message

    // Separate states for different types of tags
    const [subscriberTags, setSubscriberTags] = useState([]);
    const [vipTags, setVipTags] = useState([]);
    const [suggestedNumbers, setSuggestedNumbers] = useState([]);

    useEffect(() => {
        setLoading(true);
        APICall("get", pagination, EndPoints.customer.tagListCustomer)
            .then((res) => {
                if (res?.response_code === "00" && res?.success) {
                    // Handle corp_tag_list data
                    if (res?.data?.corp_tag_list && typeof res?.data?.corp_tag_list === 'object' && res?.data?.corp_tag_list.data) {
                        setData(res?.data || []);

                        // Set pagination metadata directly from the corp_tag_list
                        setMetaData({
                            total: res?.data?.corp_tag_list.total || 0,
                            current_page: res?.data?.corp_tag_list.current_page || 1,
                            per_page: res?.data?.corp_tag_list.per_page || 15,
                            last_page: res?.data?.corp_tag_list.last_page || 1
                        });
                    } else {
                        setData(res?.data || []);
                    }

                    // Store message if any
                    setSearchMessage(res?.data?.message || "");

                    // Save subscriber tags if any
                    if (Array.isArray(res?.data?.subscriber_tag_list)) {
                        setSubscriberTags(res?.data?.subscriber_tag_list);
                    } else {
                        setSubscriberTags([]);
                    }
                    // Save VIP tags if any
                    if (Array.isArray(res?.data?.premium_tag_list?.data)) {
                        setVipTags(res?.data?.premium_tag_list?.data);
                        // Set pagination metadata directly from the corp_tag_list
                        setMetaData({
                            total: res?.data?.premium_tag_list.total || 0,
                            current_page: res?.data?.premium_tag_list.current_page || 1,
                            per_page: res?.data?.premium_tag_list.per_page || 15,
                            last_page: res?.data?.premium_tag_list.last_page || 1
                        });
                    } else {
                        setVipTags([]);
                    }

                    // Save suggested numbers if any
                    if (Array.isArray(res?.data?.suggested_numbers)) {
                        setSuggestedNumbers(res?.data?.suggested_numbers);
                    } else {
                        setSuggestedNumbers([]);
                    }
                } else {
                    setData(res?.data || []);
                    setMetaData(res?.meta);
                    setSubscriberTags([]);
                    setVipTags([]);
                    setSuggestedNumbers([]);
                    setSearchMessage("");
                }
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setSubscriberTags([]);
                setVipTags([]);
                setSuggestedNumbers([]);
                setSearchMessage("");
            });
    }, [pagination]);

    useEffect(() => {
        APICall("get", pagination, EndPoints.customer.getFilterCustomer)
            .then((res) => {
                setFilters(res);
            })
            .catch((err) => {
                setFilters([]);
            });
    }, []);

    const handleTelebirrCallback = (callbackResult) => {
        const paramsObject = normalizeTelebirrCallbackParams(callbackResult);
        const paymentUrlString = localStorage.getItem("merchId");
        let merchOrderId = paramsObject.merch_order_id ?? null;

        if (!merchOrderId && paymentUrlString) {
            try {
                const paymentUrl = new URL(paymentUrlString);
                const urlParams = new URLSearchParams(paymentUrl.search);
                merchOrderId = urlParams.get("merch_order_id") || urlParams.get("merch_code");
            } catch {
                merchOrderId = paymentUrlString;
            }
        }

        paramsObject.merch_order_id = merchOrderId;
        const isPaymentSuccessful = isTelebirrCallbackPaymentSuccess(paramsObject);

        APICall("post", paramsObject, "/individual/call-back", {
            "Content-Type": "application/json",
        })
            .then((apiRes) => {
                if (apiRes?.success) {
                    console.log("apiRes", apiRes);
                    if (isApiPaymentSuccess(apiRes)) {
                        toast.success(apiRes?.data?.message || "NameTAG payment completed successfully!");
                        if (apiRes.data?.payment_order_id) {
                            localStorage.setItem(
                                "lastTransactionId",
                                apiRes.data.payment_order_id
                            );
                        }
                        navigate(ConstentRoutes.dashboardCustomer);

                    } else {
                        toast.error(apiRes?.data?.message || "Payment was unsuccessful");
                    }
                } else {
                    toast.error(
                        apiRes?.message ||
                            "Something went wrong with the payment verification"
                    );
                }
            })
            .catch((err) => {
                console.error("API Error:", err);
                toast.error(err || "An error occurred during payment processing");
            });
    };

    const handleTagDetails = (tagData, setOpenModal, setPaymentType) => {
        setLoadingPayment(true);
        const ensureRequiredFields = (data) => {
            return {
                channel: getTelebirrAppTypeChannel(),
                // channel: data.channel || "WEB",
                payment_method: data.payment_method || "telebirr",
                reserve_type: data.reserve_type,
                tag_no:data?.tag_list?.tag_no,
                msisdn:data?.msisdn,
                business_type: data.business_type || "BuyGoods",
                tag_id: data?.customer_tag_id,
                type: data?.type,
                is_premium:data?.is_premium,
                service_id:data?.tag_list?.service_id,
            };
        };

        const payload = ensureRequiredFields(tagData);
        APICall("post", payload, EndPoints.customer.newSecurityEndPoints.individual.buyTag)
            .then((res) => {
                if (res?.success) {
                    if (tagData?.type == "buy") {
                        setPaymentType(false);
                        localStorage.setItem('merchId', payload?.corp_reserve_tag_id || null);
                        if (isTelebirrMiniAppEntry()) {
                            const rawRequest = extractRawRequestFromBuyTagResponse(res);
                            const started = startTelebirrMiniAppPay(rawRequest, {
                                onComplete: (result) => {
                                    toast.success("Payment completed successfully");
                                    navigate(ConstentRoutes.dashboardCustomer);
                                },
                                onError: (result, meta) => {
                                    handleTelebirrCallback(result);
                                    // if (meta?.invalidRawRequest) {
                                    //     toast.error(
                                    //         "Invalid payment data from server. rawRequest must start with appid= and include prepay_id."
                                    //     );
                                    //     return;
                                    // }
                                    // toast.error(
                                    //     meta?.premature
                                    //         ? "Payment could not start. Check rawRequest signature in the Super App."
                                    //         : "Payment was not completed."
                                    // );
                                },
                            });
                            if (!started) {
                                toast.error(
                                    "Please open payment in the telebirr Super App"
                                );
                            }
                        } else {
                            if (!redirectToTelebirrPayment(res?.data)) {
                                toast.error(res?.message || "Payment redirect failed");
                            }
                        }
                    } else {
                        toast.success(res?.message || "");
                        // navigate(ConstentRoutes.dashboardCustomer);
                        setOpenModal(true);
                    }
                } else {
                    toast.error(res?.message);
                }
                setLoadingPayment(false);
            })
            .catch((err) => {
                toast.error(err ||err?.message || "Your request to buy NameTAG failed please try again later!");
                setLoadingPayment(false);
            }).finally(() => {
                setPaymentType(false)
            })
    };
    const handleTagExchange = (data, setPaymentType) => {
        setLoadingPayment(true);
        const payloadNew = {
            type: data?.type,
            reserve_type: "existing",
            msisdn: data?.msisdn,
            tag_id: data?.tag_list?.id,
            tag_no: data?.tag_list?.tag_no,
            is_premium: data?.is_premium,
            service_id: data?.service_id,
            channel: "WEB",
            payment_method: data?.payment_method,
            tag_name: data?.tag_list?.tag_name,
            payment_type: "CHANGE_TAG",
            business_type: data?.business_type || "BuyGoods"
          }

        APICall("post", payloadNew, EndPoints.customer.newSecurityEndPoints.individual.changeTag)
            .then((res) => {
                setLoadingPayment(false);
                if (res?.success) {
                    window.location.replace(res?.data);
                    toast.success(res?.message || "TAG changed successfully");
                    setPaymentType(false)
                    //   setIsOpen(true);
                } else {
                    toast.error(res?.message || "Failed to change TAG");
                }
            })
            .catch((err) => {
                setLoadingPayment(false);
                toast.error(err || err?.message || "An error occurred");
            });
    };
    return {
        data,
        setPagination,
        filters,
        loadingPayment,
        pagination,
        metaData,
        handleTagDetails,
        loading,
        searchMessage,
        subscriberTags,
        vipTags,
        suggestedNumbers,
        handleTagExchange
    };
};