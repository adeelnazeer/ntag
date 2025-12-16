/* eslint-disable react/prop-types */
import { Button, Chip, Spinner, Typography } from "@material-tailwind/react";
import { FaHashtag, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
import { useEffect, useMemo, useState } from "react";
import Pagination from "./pagination";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import { toast } from "react-toastify";
import { useAppSelector } from "../redux/hooks";
import { useTranslation } from "react-i18next";

const Dashboardtable = (props) => {
  const {
    data,
    pagination,
    setPagination,
    filters,
    metaData,
    loading,
    searchMessage = "",
    subscriberTags = [],
    vipTags = [],
    suggestedNumbers = [],
    Catfilters,
    isCustomer = false,
    isExchangeFlow = false,
    currentTagData = null,
  } = props;


  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [reserveData, setReserveData] = useState(null);
  const [hasReservedOrBought, setHasReservedOrBought] = useState(false);
  const { t } = useTranslation()

  const reduxUserData = useAppSelector(state => state.user.userData);
  const userData = useMemo(() => {
    if (reduxUserData) return reduxUserData;
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : {};
  }, [reduxUserData]);
  const customerId = useAppSelector(state => state.user.customerId);
  const corporateDocuments = useAppSelector(state => state.user.corporateDocuments);

  const docStatus = {
    status: (corporateDocuments?.[0]?.doc_status == "1" && corporateDocuments?.[1]?.doc_status == "1") ? 1 : 0,
    corp_document: corporateDocuments
  };

  // Format price to always show 2 decimal places
  const formatPrice = (price) => {
    if (!price) return "0.00";
    return Number(price).toFixed(2);
  };

  const handlePageChange = (selected) => {
    setPagination((st) => ({ ...st, page: selected }));
  };

  const formatSearchInput = (input) => {
    if (!input) return "";
    return input.replace(/^#/, '');
  };

  // Handler for digit filters - ensures only one digit filter is active at a time
  const handleDigitFilter = (digitValue) => {
    // If already selected, don't change anything
    if (pagination?.tag_digits === digitValue) {
      return;
    }

    // Otherwise set this digit filter
    setPagination((st) => ({
      ...st,
      tag_digits: digitValue,
      page: 1 // Reset to page 1 when changing filters
    }));
  };

  // Handler for customer tag type filters - ensures only one is active at a time
  const handleTagTypeFilter = (typeValue) => {
    if (pagination?.tag_type === typeValue) {
      // If already selected, deselect it
      setPagination((st) => ({
        ...st,
        tag_type: undefined,
        page: 1
      }));
    } else {
      // Select this tag type
      setPagination((st) => ({
        ...st,
        tag_type: typeValue,
        page: 1
      }));
    }
  };

  // Handler for resetting all filters
  const handleResetFilters = () => {
    setSearch("");
    setPagination({
      tag_digits: 0,
      tag_type: undefined,
      search: "",
      page: 1
    });
  };

  useEffect(() => {
    const fetchReserveData = async () => {
      try {
        const accountId = customerId || userData?.customer_account_id;

        if (!accountId) {
          console.error("No customer account ID found");
          return;
        }

        const actualAccountId = userData?.parent_id != null && userData?.parent?.customer_account_id 
            ? userData.parent.customer_account_id 
            : accountId;

        const res = await APICall("get", null, `${EndPoints.customer.getReserve}/${actualAccountId}`);

        if (res?.success) {
          const newReserveData = Array.isArray(res?.data) ? res?.data[0] : res?.data;

          // Store the reserve data in localStorage
          if (newReserveData) {
            localStorage.setItem('userReserveData', JSON.stringify(newReserveData));
          }

          setReserveData(newReserveData);
        } else {
          toast.error(res?.message);
        }
      } catch (error) {
        toast.error(error);
      }
    };

    // Try to get reserve data from localStorage first
    const storedReserveData = localStorage.getItem('userReserveData');
    if (storedReserveData) {
      setReserveData(JSON.parse(storedReserveData));
    }

    const accountId = customerId || userData?.customer_account_id;
    if (accountId) {
      fetchReserveData();
    }
  }, [customerId, userData]);

  // Check if the user already has a reserved or bought tag
  useEffect(() => {
    if (isCustomer) {
      // Check for reserved tags in API data
      // if (reserveData) {
      //   setHasReservedOrBought(true);
      // } else {
      // Fetch reserved tags from API
      const fetchUserTags = async () => {
        try {
          const accountId = customerId || userData?.customer_account_id || userData?.id;

          // if (!accountId) return;

          const res = await APICall("get", null, `${EndPoints.customer.getReserveTagsCustomer}/${accountId}`);
          if (res?.success && res?.data && res?.data.length > 0) {
            // User has tags - store in localStorage and update state
            localStorage.setItem('userTagsData', JSON.stringify(res.data));
            setHasReservedOrBought(true);
          }
          else {
            setHasReservedOrBought(false);

          }
        } catch (error) {
          console.error("Error fetching user tags:", error);
        }
      };

      // Check localStorage first before making API call
      // const storedTagsData = localStorage.getItem('userTagsData');
      // if (storedTagsData) {
      //   const parsedData = JSON.parse(storedTagsData);
      //   if (parsedData && parsedData.length > 0) {
      //     setHasReservedOrBought(true);
      //   } else {
      //     fetchUserTags();
      //   }
      // } else {
      fetchUserTags();
      // }
      // }
    }
  }, [isCustomer, reserveData, customerId, userData]);

  const isReserveDisabled = reserveData &&
    reserveData.type == "reserve" &&
    reserveData.corp_tag_list;

  const hasAvailableTags = data.length > 0 && data.some(tag => tag.status == 1);
  const shouldShowNoAvailableTagsMessage = data.length > 0 && !hasAvailableTags &&
    (subscriberTags.length > 0 || vipTags.length > 0 || suggestedNumbers.length > 0);

  const prepareCorporateTagData = (tag) => {
    return {
      ...tag,
      tag_list_type: "corp_tag_list",
      is_premium: false,
      totalPrice: tag.tag_price,
      base_price: tag?.base_price,
      isCustomer: isCustomer,
    };
  };
  const shouldDisableSelectButton = (isCustomer && hasReservedOrBought && !isExchangeFlow) ||
    (isReserveDisabled && docStatus?.status == 0);
  const prepareSubscriberTagData = (tag) => {
    return {
      ...tag,
      tag_name: tag?.tag_name || search,
      tag_list_type: "subscriber_tag_list",
      tag_id: tag.id.toString(),
      base_price: tag?.base_price,
      is_premium: false,
      totalPrice: tag.tag_price,
      isCustomer: isCustomer,
    };
  };

  const prepareVIPTagData = (tag) => {
    return {
      ...tag,
      tag_name: tag?.tag_name || search,
      is_premium: true,
      base_price: tag?.base_price,
      tag_list_type: "vip_tag_list",
      tag_id: tag.id.toString(),
      totalPrice: tag.tag_price,
      isCustomer: isCustomer,
    };
  };

  const prepareSuggestedNumberData = (tag) => {
    return {
      ...tag,
      tag_name: tag?.tag_name || search,
      base_price: tag?.base_price,
      is_premium: false,
      tag_list_type: "suggested_number",
      tag_id: null,
      totalPrice: tag.tag_price,
      isCustomer: isCustomer,
    };
  };

  return (
    <div className="rounded-xl shadow pb-7 bg-white">
      <Typography className="block antialiased  text-[#1F1F2C] p-3 px-6 border-b text-lg font-medium">
        {isCustomer ? t("dashboard.nameTagList") : t("dashboard.corpNameTagList")}
      </Typography>

      {isCustomer && hasReservedOrBought && !isExchangeFlow && (
        <div className="bg-blue-50 border border-blue-200 p-3 m-3 rounded-md">
          <Typography className="text-sm text-blue-800">
            {t("dashboard.reservedNotice")}
          </Typography>
        </div>
      )}
      {isExchangeFlow && (
        <div className="bg-blue-50 border border-blue-300 p-3 m-3 rounded-md">
          <Typography className="text-sm text-blue-800">
            {t("dashboard.changeTagModePrefix")}{" "}
            <strong>{t("dashboard.changeTagModeHighlight")}</strong>{" "}
            {t("dashboard.changeTagModeSuffix")}
          </Typography>
        </div>
      )}
      <div className="flex flex-col p-2 gap-3">
        {/* Digit Filters */}
        {isCustomer ? (
          <div className="flex flex-wrap gap-2">
            {filters?.data?.map(single => (
              <Button
                key={single?.id}
                className={`py-1.5 px-3 text-xs border-dashed border-[#47A432] hover:!border-[#6EC1E4] text-[#1F1F2C] font-normal ${pagination?.tag_digits == single?.tag_digits ? "bg-secondary text-white" : ""
                  }`}
                variant="outlined"
                onClick={() => handleDigitFilter(single?.tag_digits)}
              >
                {single?.tag_digits}-{t("dashboard.digit")}
              </Button>
            ))}
            <Button
              className={`py-1.5 px-3 text-xs border-dashed border-[#47A432] hover:!border-[#6EC1E4] text-[#1F1F2C] font-normal ${pagination?.tag_digits == 0 ? "bg-secondary text-white" : ""
                }`}
              variant="outlined"
              onClick={handleResetFilters}
            >
              {t("dashboard.all")}
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filters?.map(single => (
              <Button
                key={single?.id}
                className={`py-1.5 px-3 text-xs border-dashed border-[#47A432] hover:!border-[#6EC1E4] text-[#1F1F2C] font-normal ${pagination?.tag_digits == single?.tag_digits ? "bg-secondary text-white" : ""
                  }`}
                variant="outlined"
                onClick={() => handleDigitFilter(single?.tag_digits)}
              >
                {single?.tag_digits}-{t("dashboard.digit")}
              </Button>
            ))}
            <Button
              className={`py-1.5 px-3 text-xs border-dashed border-[#47A432] hover:!border-[#6EC1E4] text-[#1F1F2C] font-normal ${pagination?.tag_digits == 0 ? "bg-secondary text-white" : ""
                }`}
              variant="outlined"
              onClick={handleResetFilters}
            >
              {t("dashboard.all")}
            </Button>
          </div>
        )}

        {/* Tag Type Filters for customer */}
        {isCustomer && filters?.tag_type && (
          <div className="flex flex-wrap gap-2">
            {filters?.tag_type?.map(single => (
              <Button
                key={single?.id}
                className={`py-1.5 px-3 text-xs border-dashed border-[#47A432] hover:!border-[#6EC1E4] text-[#1F1F2C] font-normal ${pagination?.tag_type == single?.tag_type ? "bg-secondary text-white" : ""
                  }`}
                variant="outlined"
                onClick={() => handleTagTypeFilter(single?.tag_type)}
              >
                {single?.tag_type}
              </Button>
            ))}
            <Button
              className={`py-1.5 px-3 text-xs border-dashed border-[#47A432] hover:!border-[#6EC1E4] text-[#1F1F2C] font-normal ${!pagination?.tag_type ? "bg-secondary text-white" : ""
                }`}
              variant="outlined"
              onClick={() => setPagination(st => ({ ...st, tag_type: undefined, page: 1 }))}
            >
              {t("dashboard.all")}
            </Button>
          </div>
        )}

        {/* Category Filters */}
        {Catfilters && Catfilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Catfilters?.map(single => (
              <Button
                key={single?.id}
                className={`py-1.5 px-3 text-xs border-dashed border-[#47A432] hover:!border-[#6EC1E4] text-[#1F1F2C] font-normal ${pagination?.tag_type === single?.tag_type ? "bg-secondary text-white" : ""
                  }`}
                variant="outlined"
                onClick={() => {
                  // Check if this filter is already active
                  if (pagination?.tag_type === single?.tag_type) {
                    // If it's already active, deselect it
                    setPagination((st) => ({ ...st, tag_type: undefined, page: 1 }));
                  } else {
                    // If it's not active, select it and deselect others
                    setPagination((st) => ({ ...st, tag_type: single?.tag_type, page: 1 }));
                  }
                }}
              >
                {single?.tag_type}
              </Button>
            ))}
            <Button
              className={`py-1.5 px-3 text-xs border-dashed border-[#47A432] hover:!border-[#6EC1E4] text-[#1F1F2C] font-normal ${!pagination?.tag_type ? "bg-secondary text-white" : ""
                }`}
              variant="outlined"
              onClick={() => {
                setPagination((st) => ({ ...st, tag_type: undefined, page: 1 }));
              }}
            >
              {t("dashboard.allCategories")}
            </Button>
          </div>
        )}

        {/* Search Input */}
        <div className="sm:w-full lg:w-[40%] relative">
          <input
            type="text"
            placeholder={t("dashboard.searchTag")}
            value={search}
            maxLength={search?.startsWith("#") ? 9 : 8}
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value == "") {
                setPagination({ ...pagination, search: "" });
              }
            }}
            className="border rounded w-full bg-white outline-none p-2 pr-12 text-sm"
            onKeyDown={(e) => {
              if (e.key == 'Enter' || e.key == 'Tab') {
                const formattedSearch = formatSearchInput(search);
                if (formattedSearch?.length > 1) {
                  setPagination((st) => ({ ...st, search: formattedSearch, page: 1 }));
                }
              }
            }}
          />
          <button
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-secondary rounded"
            onClick={() => {
              const formattedSearch = formatSearchInput(search);
              setPagination((st) => ({ ...st, search: formattedSearch, page: 1 }));
            }}
          >
            <FaSearch className="text-white text-sm" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-44 flex justify-center items-center">
          <Spinner className="h-12 w-12" color="green" />
        </div>
      ) : (
        <div className="px-2 sm:px-4">
          {/* Display search message if exists */}
          {searchMessage && (
            <div className="mt-4 mb-2 text-sm">
              <p>{searchMessage}</p>
            </div>
          )}

          {/* Display search results */}
          {data?.length > 0 ? (
            data.map((single) => (
              <div key={single?.id} className="grid grid-cols-2 sm:grid-cols-7 gap-2 sm:gap-4 p-3 border rounded-xl mt-3">
                <div className="md:flex hidden items-center">
                  <FaHashtag className="h-5 w-5 text-[#8dc63f]" />
                </div>

                <div className="flex justify-center bg-[#EBEBEB] rounded-md px-2 py-1 md:px-0 md:py-0 md:bg-transparent sm:col-span-1 items-center">
                  <span className=" block md:hidden text-[14px] ">#</span>
                  <Typography className="text-left text-[14px] self-center">
                    {single?.tag_name || ""}
                  </Typography>
                </div>

                <div className="col-span-1 sm:col-span-1">
                  <Typography className="bg-[#EBEBEB] text-center text-[14px] rounded-md px-2 py-1">
                    #{single?.tag_no}
                  </Typography>
                </div>

                {/* Added Tag Type */}
                <div className="col-span-1 sm:col-span-1">
                  <Typography className="md:bg-[#F5F5F5] text-center  text-[14px]  rounded-md px-2 py-1">
                    {single?.tag_type || t("dashboard.tagTypes.standard")}
                  </Typography>
                </div>

                <div className=" sm:col-span-1 flex ">
                  <div className="flex items-center md:block gap-1">
                    <p className="text-[#7A798A] text-[14px]">{t("dashboard.price")}</p>
                    <p className="text-secondary text-sm font-bold">
                      {formatPrice(single?.tag_price)} {t("dashboard.etb")}
                    </p>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-2 flex justify-end gap-2 mt-2 sm:mt-0">
                  {single?.status == 1 && (
                    <div className="flex gap-2">
                      <Button className="bg-[#edf6eb] hidden md:block min-w-[100px] py-1 px-3 text-[14px] text-secondary">
                        {t("buttons.available")}
                      </Button>
                      <Button
                        className="bg-secondary py-1 min-w-[100px] px-3 text-[14px] text-white"
                        onClick={() => {
                          if (isCustomer) {
                            navigate(ConstentRoutes.tagDetailCustomer, {
                              state:
                              {
                                ...prepareCorporateTagData(single),
                                isExchangeFlow: isExchangeFlow,
                                currentTagData: currentTagData,
                              }
                            })
                          } else {
                            navigate(ConstentRoutes.tagDetail, {
                              state: {
                                ...prepareCorporateTagData(single),
                                isExchangeFlow: isExchangeFlow,
                                currentTagData: currentTagData,

                              }
                            })
                          }
                        }}
                        disabled={shouldDisableSelectButton}
                      >
                        {(isCustomer || docStatus?.status == 1) ? t("buttons.select") : t("buttons.reserve")}
                      </Button>
                    </div>
                  )}
                  {single?.status == 2 && (
                    <div className="flex gap-2">
                      <Button className="bg-gray-100 min-w-[100px] text-red-800 rounded-lg fw-bolder px-3 py-1">
                        {t("buttons.sold")}
                      </Button>
                      <div className="min-w-[100px]" />
                    </div>
                  )}
                  {single?.status == 3 && (
                    <div className="flex gap-2">
                      <Chip
                        variant="ghost"
                        color="red"
                        size="sm"
                        value={t("buttons.reserved")}
                        className="min-w-[100px] text-center"
                      />
                      <div className="min-w-[100px]" />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <></>
          )}

          {shouldShowNoAvailableTagsMessage && (
            <div className="mt-4 mb-2 text-center text-sm">
              <p>{t("dashboard.noAvailableTags")}</p>
            </div>
          )}

          {subscriberTags.length > 0 && (
            <div className="mt-4">
              <Typography className="font-medium text-sm mb-2">
                {t("dashboard.sections.subscriber")}
              </Typography>
              {subscriberTags.map((tag, index) => (
                <div key={index} className="grid grid-cols-2 sm:grid-cols-7 gap-2 sm:gap-4 p-3 border rounded-xl mt-3">
                  <div className="md:flex hidden items-center">
                    <FaHashtag className="h-5 w-5 text-[#8dc63f]" />
                  </div>

                  <div className="text-sm">
                    <span className=" block md:hidden text-[14px] ">#</span>
                    <Typography className="text-left">
                      {tag?.tag_name || search || ""}
                    </Typography>
                  </div>

                  <div className="col-span-1 sm:col-span-1">
                    <Typography className="bg-[#EBEBEB] text-center text-xs rounded-md px-2 py-1">
                      #{tag?.tag_no}
                    </Typography>
                  </div>

                  {/* Added Tag Type */}
                  <div className="col-span-1 sm:col-span-1">
                    <Typography className="md:bg-[#F5F5F5] text-center text-xs rounded-md px-2 py-1">
                      {tag?.tag_type || t("dashboard.tagTypes.standard")}
                    </Typography>
                  </div>

                  <div className=" sm:col-span-1 flex ">
                    <div className="flex items-center md:block gap-1">
                      <p className="text-[#7A798A] text-[14px]">{t("dashboard.price")}</p>
                      <p className="text-secondary text-sm font-bold">
                        {formatPrice(tag?.tag_price)} {t("dashboard.etb")}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-2 flex justify-end gap-2 mt-2 sm:mt-0">
                    {tag.status == 1 && <Button
                      className="bg-secondary py-1 px-3 text-xs text-white"

                      onClick={() => {
                        if (isCustomer) {
                          navigate(ConstentRoutes.tagDetailCustomer, {
                            state:
                            {
                              ...prepareSubscriberTagData(tag),
                              isExchangeFlow: isExchangeFlow,
                              currentTagData: currentTagData,
                            }
                          })
                        } else {
                          navigate(ConstentRoutes.tagDetail, {
                            state: {
                              ...prepareSubscriberTagData(tag),
                              isExchangeFlow: isExchangeFlow,
                              currentTagData: currentTagData,
                            }

                          })
                        }
                      }
                      }
                      disabled={(tag.status == '1' || tag.status == '6' || tag.status !== 7) ||
                        (isReserveDisabled && docStatus?.status == 0) ||
                        (isCustomer && hasReservedOrBought)}
                    >
                      {(isCustomer || docStatus?.status == 1) ? t("buttons.select") : t("buttons.reserve")}
                    </Button>}

                    {tag?.status == 2 && (
                      <Button className="bg-gray-100 text-red-800 rounded-lg fw-bolder px-3 py-1">
                        {t("buttons.sold")}
                      </Button>
                    )}
                    {tag?.status == 3 && (
                      <Chip
                        variant="ghost"
                        color="red"
                        size="sm"
                        value={t("buttons.reserved")}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {vipTags.length > 0 && (
            <div className="mt-4">
              <Typography className="font-medium text-sm mb-2">
                {t("dashboard.sections.premium")}
              </Typography>
              {vipTags.map((tag, index) => (
                <div key={index} className="grid grid-cols-2 items-center sm:grid-cols-7 gap-2 sm:gap-4 p-3 border rounded-xl mt-3">
                  <div className="md:flex hidden items-center">
                    <FaHashtag className="h-5 w-5 text-[#8dc63f]" />
                  </div>

                  <div className="flex justify-center bg-[#EBEBEB] rounded-md px-2 py-1 md:px-0 md:py-0 md:bg-transparent sm:col-span-1 items-center">
                    <span className=" block md:hidden text-[14px] ">#</span>
                    <Typography className="text-left text-[14px] ">
                      {tag?.tag_name || search || ""}
                    </Typography>
                  </div>

                  <div className="col-span-1 sm:col-span-1">
                    <Typography className="bg-[#EBEBEB] text-center text-[14px] rounded-md px-2 py-1">
                      #{tag?.tag_no}
                    </Typography>
                  </div>

                  {/* Added Tag Type */}
                  <div className="col-span-1 sm:col-span-1">
                    <Typography className="md:bg-[#F5F5F5] text-center text-[14px] rounded-md px-2 py-1">
                      {tag?.tag_type || t("dashboard.tagTypes.premium")}
                    </Typography>
                  </div>

                  <div className="col-span-1 sm:col-span-1">
                    <div className="flex items-center md:block gap-1">
                      <p className="text-[#7A798A] text-[14px]">{t("dashboard.price")}</p>
                      <p className="text-secondary text-sm font-bold">
                        {formatPrice(tag?.tag_price)} {t("dashboard.etb")}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-2 flex justify-end gap-2 mt-2 sm:mt-0">
                    {tag.status == 1 && (<div className="flex gap-2">
                      <Button className="bg-[#edf6eb] py-1 px-3 text-[14px] text-secondary">
                        {t("buttons.available")}
                      </Button>
                      <Button
                        className="bg-secondary py-1 px-3 text-[14px] text-white"
                        onClick={() => {
                          if (isCustomer) {
                            navigate(ConstentRoutes.tagDetailCustomer, {
                              state: {
                                ...prepareVIPTagData(tag),
                                isExchangeFlow: isExchangeFlow,
                                currentTagData: currentTagData,
                              }

                            })
                          } else {
                            navigate(ConstentRoutes.tagDetail, {
                              state: {
                                ...prepareVIPTagData(tag),
                                isExchangeFlow: isExchangeFlow,
                                currentTagData: currentTagData,
                              }
                            })
                          }
                        }}
                        disabled={(isReserveDisabled && docStatus?.status == 0) ||
                          (isCustomer && hasReservedOrBought && isExchangeFlow == false)}
                      >
                        {(docStatus?.status == 1 || isExchangeFlow || isCustomer) ? t("buttons.select") : t("buttons.reserve")}
                      </Button>
                    </div>)}

                    {tag?.status == 2 && (
                      <Button className="bg-gray-100 text-red-800 rounded-lg fw-bolder px-3 py-1">
                        {t("buttons.sold")}
                      </Button>
                    )}
                    {tag?.status == 3 && (
                      <Chip
                        variant="ghost"
                        color="red"
                        size="sm"
                        value={t("buttons.reserved")}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Display suggested numbers section */}
          {suggestedNumbers.length > 0 && (
            <div className="mt-4">
              <Typography className="font-medium text-sm mb-2">
                {t("dashboard.sections.suggested")}
              </Typography>
              {suggestedNumbers.map((tag, index) => (
                <div key={index} className="grid grid-cols-2 sm:grid-cols-7 gap-2 sm:gap-4 p-3 border rounded-xl mt-3">
                  <div className="md:flex hidden items-center">
                    <FaHashtag className="h-5 w-5 text-[#8dc63f]" />
                  </div>

                  <div className="flex justify-center bg-[#EBEBEB] rounded-md px-2 py-1 md:px-0 md:py-0 md:bg-transparent sm:col-span-1 items-center">
                    <span className=" block md:hidden text-[14px] ">#</span>
                    <Typography className="text-left text-[14px] self-center">
                      {tag?.tag_name || search || ""}
                    </Typography>
                  </div>

                  <div className="col-span-1 sm:col-span-1">
                    <Typography className="bg-[#EBEBEB] text-center text-xs rounded-md px-2 py-1">
                      #{tag?.tag_no}
                    </Typography>
                  </div>

                  {/* Added Tag Type */}
                  <div className="col-span-1 sm:col-span-1">
                    <Typography className="md:bg-[#F5F5F5] text-center text-xs rounded-md px-2 py-1">
                      {tag?.tag_type || t("dashboard.tagTypes.suggested")}
                    </Typography>
                  </div>

                  <div className=" sm:col-span-1 flex ">
                    <div className="flex items-center md:block gap-1">
                      <p className="text-[#7A798A] text-[14px]">{t("dashboard.price")}</p>
                      <p className="text-secondary text-sm font-bold">
                        {formatPrice(tag?.tag_price)} {t("dashboard.etb")}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-2 flex justify-end gap-2 mt-2 sm:mt-0">
                    <div className="flex gap-2">
                      <Button className="bg-[#edf6eb] py-1 px-3 text-xs text-secondary">
                        {t("buttons.available")}
                      </Button>
                      <Button
                        className="bg-secondary py-1 px-3 text-xs text-white"
                        onClick={() => {
                          if (isCustomer) {
                            navigate(ConstentRoutes.tagDetailCustomer, {
                              state: {
                                ...prepareSuggestedNumberData(tag),
                                isExchangeFlow: isExchangeFlow,
                                currentTagData: currentTagData,
                              }
                            })
                          } else {
                            navigate(ConstentRoutes.tagDetail, {
                              state: prepareSuggestedNumberData(tag),
                              isExchangeFlow: isExchangeFlow,
                              currentTagData: currentTagData,
                            })
                          }
                        }}
                        disabled={(isReserveDisabled && docStatus?.status == 0) ||
                          (isCustomer && hasReservedOrBought)}
                      >
                        {(isCustomer || docStatus?.status == 1) ? t("buttons.select") : t("buttons.reserve")}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results message */}
          {!loading && data?.length == 0 && subscriberTags.length == 0 &&
            vipTags.length == 0 && suggestedNumbers.length == 0 && (
              <p className="min-h-32 flex justify-center items-center font-medium text-sm">
                {t("dashboard.noSearchResults")}
              </p>
            )}
        </div>
      )}

      {/* Only show pagination when needed */}
      {metaData && metaData.last_page > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={metaData?.current_page || pagination?.page}
            totalPages={metaData?.last_page || 0}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboardtable;