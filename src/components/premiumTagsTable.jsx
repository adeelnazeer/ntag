/* eslint-disable react/prop-types */
import { Button, Chip, Spinner, Typography } from "@material-tailwind/react";
import { FaHashtag, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ConstentRoutes } from "../utilities/routesConst";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import Pagination from "./pagination";
import { useAppSelector } from "../redux/hooks";
import { toast } from "react-toastify";

const PremiumTagsTable = ({ handleTagDetails, isExchangeFlow = false,
  currentTagData = null }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [premiumTags, setPremiumTags] = useState([]);
  const [filters, setFilters] = useState([]);
  const [reserveData, setReserveData] = useState(null);

  const [Catfilters, setCatFilters] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    tag_digits: 0,
    search: ""
  });
  const [metaData, setMetaData] = useState(null);
  const customerId = useAppSelector(state => state.user.customerId);


  const userData = useAppSelector(state => state.user.userData);
  const corporateDocuments = useAppSelector(state => state.user.corporateDocuments);

  const docStatus = {
    status: (corporateDocuments?.[0]?.doc_status == "1" && corporateDocuments?.[1]?.doc_status == "1") ? 1 : 0,
    corp_document: corporateDocuments
  };

  useEffect(() => {
    APICall("get", {}, EndPoints.customer.getFilter)
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

  useEffect(() => {
    const fetchPremiumTags = async () => {
      try {
        setLoading(true);

        // Build query parameters with proper handling
        const params = { ...pagination };

        // Remove undefined or null values
        Object.keys(params).forEach(key => {
          if (params[key] === undefined || params[key] === null || params[key] === "") {
            delete params[key];
          }
        });

        const res = await APICall("get", params, EndPoints.customer.premiumTag);

        if (res?.response_code === "00" && res?.success) {

          if (res?.data?.premium_tag_list && Array.isArray(res?.data?.premium_tag_list.data) && res?.data?.premium_tag_list.data.length > 0) {
            const premiumData = res.data.premium_tag_list;

            setPremiumTags(premiumData.data || []);

            setMetaData({
              current_page: premiumData.current_page || 1,
              last_page: premiumData.last_page || 1,
              per_page: premiumData.per_page || 15,
              total: premiumData.total || 0
            });
          } else {
            // If response structure is different, handle as array
            setPremiumTags(Array.isArray(res?.data?.premium_tag_list) ? res?.data?.premium_tag_list : []);
          }
        } else {
          setPremiumTags([]);
          toast.error(res?.message || "Failed to load premium tags");
        }
      } catch (error) {
        console.error("Error fetching premium tags:", error);
        setPremiumTags([]);
        toast.error("Error loading premium tags");
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumTags();
    const fetchReserveData = async () => {
      try {
        const baseAccountId = customerId || userData?.customer_account_id;
        const accountId = userData?.parent_id != null && userData?.parent?.customer_account_id 
          ? userData.parent.customer_account_id 
          : baseAccountId;

        if (!accountId) {
          console.error("No customer account ID found");
          return;
        }

        const res = await APICall("get", null, `${EndPoints.customer.getReserve}/${accountId}`);

        if (res?.success) {
          setReserveData(Array.isArray(res?.data) ? res?.data[0] : res?.data);
        } else {
          toast.error(res?.message);
        }
      } catch (error) {
        toast.error(error);
      }
    };

    const accountId = customerId || userData?.customer_account_id;
    if (accountId) {
      fetchReserveData();
    }
  }, [pagination]);

  const isReserveDisabled = reserveData &&
    reserveData.type == "reserve" &&
    reserveData.corp_tag_list;

  const handlePageChange = (selected) => {
    setPagination((prev) => ({ ...prev, page: selected }));
  };

  const preparePremiumTagData = (tag) => {
    return {
      ...tag,
      tag_name: tag?.tag_name || search,
      tag_list_type: "vip_tag_list",
      tag_id: tag.id?.toString(),
      is_premium: true,
      totalPrice: tag.tag_price
    };
  };

  // Format price to always show 2 decimal places
  const formatPrice = (price) => {
    if (!price) return "0.00";
    return Number(price).toFixed(2);
  };

  return (
    <div className="rounded-xl shadow pb-7 bg-white">
      <Typography className="block antialiased  text-[#1F1F2C] p-3 px-6 border-b text-lg font-medium">
        Premium NameTAG List
      </Typography>

      {isExchangeFlow && (
        <div className="bg-blue-50 border border-blue-300 p-3 m-3 rounded-md">
          <Typography className="text-sm text-blue-800">
            You’re currently in <strong>Change TAG</strong> mode.
            Select a new TAG to replace your existing one.
          </Typography>
        </div>
      )}

      <div className="flex flex-col p-2 gap-3">
        {/* Digit Filters */}
        <div className="flex flex-wrap gap-2">
          {filters?.map(single =>
            <Button
              key={single?.id}
              className={`py-1.5 px-3 text-xs border-dashed border-[#47A432] text-[#1F1F2C] font-normal ${pagination?.tag_digits == single?.tag_digits ? "bg-secondary text-white" : ""
                }`}
              variant="outlined"
              onClick={() => setPagination((st) => ({ ...st, tag_digits: single?.tag_digits }))}
            >
              {single?.tag_digits}-Digit
            </Button>
          )}
          <Button
            className={`py-1.5 px-3 text-xs border-dashed border-[#47A432] text-[#1F1F2C] font-normal ${pagination?.tag_digits == 0 ? "bg-secondary text-white" : ""
              }`}
            variant="outlined"
            onClick={() => {
              setPagination((st) => ({ ...st, tag_digits: 0 }));
            }}
          >
            All Digits
          </Button>
        </div>

        {/* Category Filters */}
        {Catfilters && Catfilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Catfilters?.map(single =>
              <Button
                key={single?.id}
                className={`py-1.5 px-3 text-xs border-dashed border-[#47A432] text-[#1F1F2C] font-normal ${pagination?.tag_type === single?.tag_type ? "bg-secondary text-white" : ""
                  }`}
                variant="outlined"
                onClick={() => setPagination((st) => ({ ...st, tag_type: single?.tag_type }))}
              >
                {single?.tag_type}
              </Button>
            )}
            <Button
              className={`py-1.5 px-3 text-xs border-dashed border-[#47A432] text-[#1F1F2C] font-normal ${!pagination?.tag_type ? "bg-secondary text-white" : ""
                }`}
              variant="outlined"
              onClick={() => {
                setPagination((st) => ({ ...st, tag_type: undefined }));
              }}
            >
              All Categories
            </Button>
          </div>
        )}

        <div className="sm:w-full lg:w-[40%] relative">
          <input
            type="text"
            placeholder="Search NameTAG by name or number"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value === "") {
                setPagination((st) => ({ ...st, search: "" }));
              }
            }}
            className="border rounded w-full bg-white outline-none p-2 pr-12 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Tab') {
                setPagination((st) => ({ ...st, search: search, page: 1 }));
              }
            }}
          />
          <button
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-secondary rounded"
            onClick={() => setPagination((st) => ({ ...st, search: search, page: 1 }))}
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
          {/* Display premium tags */}
          {premiumTags?.length > 0 ? (
            premiumTags.map((tag, index) => (
              <div key={tag?.id || index} className="grid grid-cols-2 sm:grid-cols-7 gap-2 sm:gap-4 p-3 border rounded-xl mt-3">
                <div className="md:flex hidden items-center">
                  <FaHashtag className="h-5 w-5 text-secondary" />
                </div>

                <div className="flex justify-center bg-[#EBEBEB] rounded-md px-2 py-1 md:px-0 md:py-0 md:bg-transparent sm:col-span-1 items-center">
                  <FaHashtag className="h-4 w-4 block text-sm md:hidden text-[#8dc63f]" />
                  <Typography className="text-left text-sm">
                    {tag?.tag_name || ""}
                  </Typography>
                </div>

                <div className="col-span-1 sm:col-span-1">
                  <Typography className="bg-[#EBEBEB] text-center text-sm rounded-md px-2 py-1">
                    #{tag?.tag_no}
                  </Typography>
                </div>

                {/* Tag Type Column */}
                <div className="col-span-1 sm:col-span-1">
                  <Typography className="md:bg-[#F5F5F5] text-center text-xs rounded-md px-2 py-1">
                    {tag?.tag_type || "Premium"}
                  </Typography>
                </div>

                <div className="col-span-1 sm:col-span-1">
                  <div className="flex items-center md:block gap-1">
                    <p className="text-[#7A798A] text-sm">Price</p>
                    <p className="text-secondary text-sm font-bold">
                      {formatPrice(tag?.tag_name_price)} ETB
                    </p>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-2 flex justify-end gap-2 mt-2 sm:mt-0">
                  {tag?.status == 1 && (
                    <div className="flex gap-2">
                      <Button className="bg-[#edf6eb] hidden md:block py-1 px-3 text-sm text-secondary">
                        Available
                      </Button>
                      <Button
                        className="bg-secondary py-1 px-3 text-sm text-white"
                        onClick={() => navigate(ConstentRoutes.tagDetail, {
                          state: {
                            ...preparePremiumTagData(tag),
                            isExchangeFlow: isExchangeFlow,
                            currentTagData: currentTagData,
                          }
                        })}
                        disabled={isReserveDisabled && docStatus?.status == 0}

                      >
                        {docStatus?.status == 0 ? "Reserve" : "Select"}
                      </Button>
                    </div>
                  )}
                  {tag?.status == 2 && (
                    <Button className="bg-gray-100 text-red-800 rounded-lg fw-bolder px-3 py-1">
                      SOLD
                    </Button>
                  )}
                  {tag?.status == 3 && (
                    <Chip
                      variant="ghost"
                      color="red"
                      size="sm"
                      value="Reserved"
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="min-h-32 flex justify-center items-center font-medium text-sm">
              No premium NameTAGs found for your search criteria.
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

export default PremiumTagsTable;