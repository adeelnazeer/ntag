import { useEffect, useState } from "react";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../../utilities/routesConst";

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
                console.log({ res })
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
                console.log("err", err);
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

    const handleTagDetails = (tagData, setOpenModal, setPaymentType) => {

        setLoadingPayment(true);

        const ensureRequiredFields = (data) => {
            return {
                ...data,
                transaction_type: data.transaction_type || "IND_BUYTAG",
                channel: data.channel || "WEB",
                payment_method: data.payment_method || "telebirr",
                reserve_type: data.reserve_type || "new",
                business_type: data.business_type || "BuyGoods",
                tax: 0,
            };
        };

        const payload = ensureRequiredFields(tagData);
        APICall("post", payload, EndPoints.customer.buytagsCustomer)
            .then((res) => {
                if (res?.success) {
                    if (tagData?.type == "buy") {
                        setPaymentType(false)
                        localStorage.setItem('merchId', payload?.corp_reserve_tag_id || null);
                        window.location.replace(res?.data);
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
                toast.error(err?.message || "Your request to buy NameTAG failed please try again later!");
                setLoadingPayment(false);
            }).finally(() => {
                setPaymentType(false)
            })
    };
    const handleTagExchange = (data, setPaymentType) => {
        setLoadingPayment(true);

        APICall("post", data, EndPoints.customer.individualchangeNumberSaving)
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
                toast.error(err?.message || "An error occurred");
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