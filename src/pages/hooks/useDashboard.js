import { useEffect, useState } from "react";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { toast } from "react-toastify";
import { useAppSelector } from "../../redux/hooks";

export const useTagList = () => {
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
        console.log("err", err);
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

  const handleTagDetails = (tagData, setOpenModal, setDisableBtn) => {
    setLoadingPayment(true);
    const ensureRequiredFields = (data) => {
      return {
        channel: data.channel || "WEB",
        payment_method: data.payment_method || "telebirr",
        reserve_type: data.reserve_type,

        
        business_type: data.business_type || "BuyGoods",

        msisdn: data?.msisdn,
        tag_id: data?.customer_tag_id,
        type: data?.type,
        is_premium:data?.is_premium,
        service_id:data?.tag_list?.service_id,

      };
    };

    const payload = ensureRequiredFields(tagData);
    // Replace account_id with parent?.customer_account_id if parent_id != null
    if (userData?.parent_id != null && userData?.parent?.customer_account_id) {
      payload.account_id = userData.parent.customer_account_id;
    }

    APICall("post", payload, EndPoints.customer.newSecurityEndPoints.corporate.buyTag)
      .then((res) => {
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
            setOpenModal(true);
          }
        } else {
          toast.error(res?.message || "Failed to process request");
        }
        setLoadingPayment(false);
      })
      .catch((err) => {
        toast.error(err?.message || "An error occurred");
        setLoadingPayment(false);
      });
  };

  const handleTagExchangeCorporate = (data, setPaymentType) => {
    setLoadingPayment(true);

    const payload = { ...data };

    // Replace account_id with parent?.customer_account_id if parent_id != null
    if (userData?.parent_id != null && userData?.parent?.customer_account_id) {
      payload.account_id = userData.parent.customer_account_id;
    }

    APICall("post", payload, EndPoints.customer.corporatechangeNumberSaving)
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
    Catfilters,
    searchMessage,
    subscriberTags,
    vipTags,
    suggestedNumbers, handleTagExchangeCorporate
  };
};