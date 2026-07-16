import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { toast } from "react-toastify";
import { useAppSelector } from "../../redux/hooks";
import { ConstentRoutes } from "../../utilities/routesConst";
import {
  extractRawRequestFromBuyTagResponse,
  getTelebirrPaymentErrorMessage,
  isBuyTagApiSuccess,
  normalizeBuyTagApiResponse,
  normalizeTelebirrCallbackParams,
  redirectToTelebirrPayment,
  startTelebirrMiniAppPay,
} from "../../utilities/telebirrMiniAppPay";
import {
  canUseTelebirrMiniAppPay,
  getTelebirrAppTypeChannel,
} from "../../utilities/telebirrMiniAppChannel";

export const useTagList = () => {
  const navigate = useNavigate();
  // Get userData to check for parent_id
  let userData = useAppSelector(state => state.user.userData);
  if (!userData) {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      userData = JSON.parse(localUser);
    }
  }
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, tag_digits: 0 });
  const [metaData, setMetaData] = useState(null);
  const [filters, setFilters] = useState([]);
  const [Catfilters, setCatFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");

  // Separate states for different types of tags
  const [subscriberTags, setSubscriberTags] = useState([]);
  const [vipTags, setVipTags] = useState([]);
  const [suggestedNumbers, setSuggestedNumbers] = useState([]);

  useEffect(() => {
    setLoading(true);

    // Build the query parameters
    const queryParams = { ...pagination };

    // Remove undefined or null values to avoid sending them in the API request
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === undefined || queryParams[key] === null) {
        delete queryParams[key];
      }
    });

    APICall("get", queryParams, EndPoints.customer.corp)
      .then((res) => {
        if (res?.response_code === "00" && res?.success) {
          // Handle corp_tag_list data
          if (res?.data?.corp_tag_list && typeof res?.data?.corp_tag_list === 'object' && res?.data?.corp_tag_list.data) {
            setData(res?.data?.corp_tag_list.data || []);

            // Set pagination metadata directly from the corp_tag_list
            setMetaData({
              total: res?.data?.corp_tag_list.total || 0,
              current_page: res?.data?.corp_tag_list.current_page || 1,
              per_page: res?.data?.corp_tag_list.per_page || 15,
              last_page: res?.data?.corp_tag_list.last_page || 1
            });
          } else {
            setData(res?.data?.corp_tag_list || []);
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
          if (Array.isArray(res?.data?.premium_tag_list)) {
            setVipTags(res?.data?.premium_tag_list);
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
    APICall("get", pagination, EndPoints.customer.getFilter)
      .then((res) => {
        setFilters(res?.data || []);

        // Handle tag_type filters
        if (res?.tag_type && Array.isArray(res.tag_type)) {
          // Sort the categories alphabetically
          const sortedCategories = [...res.tag_type].sort((a, b) =>
            a.tag_type.localeCompare(b.tag_type)
          );
          setCatFilters(sortedCategories);
        } else {
          setCatFilters([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching filters:", err);
        setFilters([]);
        setCatFilters([]);
      });
  }, []);


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

  const handleTelebirrCallback = (callbackResult, successRoute = ConstentRoutes.dashboard) => {
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

    APICall("post", paramsObject, "/customer/callBack", {
      "Content-Type": "application/json",
    })
      .then((apiRes) => {
        if (apiRes?.success) {
          if (isApiPaymentSuccess(apiRes)) {
            toast.success(apiRes?.data?.message || "NameTAG payment completed successfully!");
            navigate(successRoute);
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
        toast.error(err || "An error occurred during payment processing");
      });
  };

  const startTelebirrPaymentFromResponse = (res, { successRoute = ConstentRoutes.dashboard } = {}) => {
    const paymentRes = normalizeBuyTagApiResponse(res);
    const rawRequest = extractRawRequestFromBuyTagResponse(paymentRes);

    if (canUseTelebirrMiniAppPay() && rawRequest) {
      let callbackHandled = false;

      const verifyPayment = (result) => {
        if (callbackHandled) return;
        callbackHandled = true;
        handleTelebirrCallback(result, successRoute);
      };

      const started = startTelebirrMiniAppPay(rawRequest, {
        onComplete: verifyPayment,
        onError: (result) => {
          verifyPayment(result);
        },
      });
      if (!started) {
        toast.error("Please open payment in the telebirr Super App");
      }
    } else if (!redirectToTelebirrPayment(paymentRes?.data)) {
      toast.error(paymentRes?.message || "Payment redirect failed");
    }
  };


  const handleTagDetails = (tagData, setOpenModal, setDisableBtn, setReserveLoading) => {
    setLoadingPayment(true);
    const ensureRequiredFields = (data) => {
      const base = {
        channel: getTelebirrAppTypeChannel(),
        // channel: data.channel || "WEB",
        payment_method: data.payment_method || "telebirr",
        reserve_type: data.reserve_type,

        business_type: getTelebirrAppTypeChannel() === "MINI_SUPERAPP" ? "BuyGoods" : data.business_type || "BuyGoods",
        msisdn: data?.msisdn,
        tag_id: data?.customer_tag_id,
        type: data?.type,
        is_premium: data?.is_premium || 0,
        service_id: data?.tag_list?.service_id,
      };
      if (data?.customer_tag_id == null && data?.tag_list?.tag_no != null) {
        base.tag_no = data.tag_list.tag_no;
      }
      return base;
    };

    const payload = ensureRequiredFields(tagData);
    // Replace account_id with parent?.customer_account_id if parent_id != null
    if (userData?.parent_id != null && userData?.parent?.customer_account_id) {
      payload.account_id = userData.parent.customer_account_id;
    }

    APICall("post", payload, EndPoints.customer.newSecurityEndPoints.corporate.buyTag)
      .then((rawRes) => {
        const res = normalizeBuyTagApiResponse(rawRes);
        console.log("new response from the api call", { rawRes, res });
        if (isBuyTagApiSuccess(res)) {
          setDisableBtn(true);
          setTimeout(() => {
            setDisableBtn(false);
          }, 5 * 60 * 1000);

          if (typeof res?.data === "object" && res?.data?.corp_reserved_tag_id) {
            toast.success(res?.message || "");
            setOpenModal?.(true);
          } else {
            startTelebirrPaymentFromResponse(res, {
              successRoute: ConstentRoutes.dashboard,
            });
          }
        } else {
          toast.error(res?.message || "Failed to process request");
        }
        setLoadingPayment(false);
        setReserveLoading?.(false);
      })
      .catch((err) => {
        toast.error(err || err?.message || "An error occurred");
        setLoadingPayment(false);
        setReserveLoading?.(false);
      });
  };

  const handleTagExchangeCorporate = (data, setPaymentType) => {
    setLoadingPayment(true);

    const payload = { ...data };
    const payloadNew = {
      type: data?.type,
      reserve_type: "existing",
      msisdn: data?.msisdn,
      tag_id: data?.tag_list?.id,          // or omit and use "customer_tag_id": 123
      tag_no: data?.tag_list?.tag_no,      // required if tag_id/customer_tag_id is not sent
      is_premium: data?.is_premium,
      service_id: data?.service_id,
      channel: getTelebirrAppTypeChannel(),
      payment_method: data?.payment_method,
      tag_name: data?.tag_list?.tag_name,
      payment_type: "CHANGE_TAG",
      business_type: getTelebirrAppTypeChannel() === "MINI_SUPERAPP" ? "BuyGoods" : data?.business_type || "BuyGoods"
    }


    // Replace account_id with parent?.customer_account_id if parent_id != null
    if (userData?.parent_id != null && userData?.parent?.customer_account_id) {
      payload.account_id = userData.parent.customer_account_id;
    }

    APICall("post", payloadNew, EndPoints.customer.newSecurityEndPoints.corporate.changeTag)
      .then((res) => {
        setLoadingPayment(false);
        if (res?.success == true || res?.data?.success == true) {
          startTelebirrPaymentFromResponse(res);
          setPaymentType(false);
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
    Catfilters,
    searchMessage,
    subscriberTags,
    vipTags,
    suggestedNumbers, handleTagExchangeCorporate,
    startTelebirrPaymentFromResponse
  };
};