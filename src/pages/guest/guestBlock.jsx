/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Spinner, Button, Typography } from "@material-tailwind/react";
import { BiArrowBack, BiPlusCircle } from "react-icons/bi";
import { IoMdCloseCircle } from "react-icons/io";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { formatPhoneNumberCustom } from "../../utilities/formatMobileNumber";
import { useTranslation } from "react-i18next";
import Header from "../../components/header";
import { ConstentRoutes } from "../../utilities/routesConst";

const GuestBlock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(["common", "complaint"]);

  const [loading, setLoading] = useState(true);
  const [numbers, setNumbers] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [tagNumber, setTagNumber] = useState("");
  const [tagError, setTagError] = useState("");
  const [isValidTag, setIsValidTag] = useState(false);
  const [blockReason, setBlockReason] = useState("SPAM_CALL");
  const [addingNumber, setAddingNumber] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [deletingNumber, setDeletingNumber] = useState(false);

  const fetchBlockedNumbers = useCallback(async () => {
    try {
      setLoading(true);

      // Verify guest token exists before making the request
      const guestToken = localStorage.getItem("cToken");
      if (!guestToken) {
        toast.error(
          t("complaint.block.noToken", {
            defaultValue:
              "Guest token not found. Please verify your phone number again.",
          })
        );
        navigate("/");
        return;
      }

      const response = await APICall(
        "get",
        null,
        `${EndPoints.customer.guestBlockNumbers}?msisdn=${phoneNumber.replace(
          /^\+/,
          ""
        )}`
      );

      // Handle response - API returns { data: [...] } or { success: true, data: [...] }
      if (response?.data) {
        const blockedNumbers = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setNumbers(blockedNumbers);
      } else if (response?.success === false) {
        toast.error(
          response?.message ||
            t("complaint.block.fetchFailed", {
              defaultValue: "Failed to fetch blocked numbers",
            })
        );
        setNumbers([]);
      } else {
        // If response doesn't have data field, treat as empty
        setNumbers([]);
      }
    } catch (error) {
      console.error("Error fetching blocked numbers:", error);
      console.error("Error details:", {
        message: error.message,
        status: error?.response?.status,
        data: error?.response?.data,
        guestToken: localStorage.getItem("cToken") ? "exists" : "missing",
      });

      if (error?.response?.status === 401) {
        toast.error(
          t("complaint.block.unauthorized", {
            defaultValue:
              "Unauthorized. Please verify your phone number again.",
          })
        );
      } else {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            t("complaint.block.fetchError", {
              defaultValue: "Error loading blocked numbers",
            })
        );
      }
      setNumbers([]);
    } finally {
      setLoading(false);
    }
  }, [t, navigate, phoneNumber]);

  const validateTagNumber = (tag) => {
    if (!tag || tag.trim() === "") {
      setTagError(
        t("complaint.block.addModal.tagRequired", {
          defaultValue: "Tag number is required",
        })
      );
      setIsValidTag(false);
      return false;
    }

    // Check if only numbers
    if (!/^\d+$/.test(tag)) {
      setTagError(
        t("complaint.block.addModal.tagNumbersOnly", {
          defaultValue: "Tag number must contain only numbers",
        })
      );
      setIsValidTag(false);
      return false;
    }

    // Check length between 3 and 8 digits
    if (tag.length < 3) {
      setTagError(
        t("complaint.block.addModal.tagMinLength", {
          defaultValue: "Tag number must be at least 3 digits",
        })
      );
      setIsValidTag(false);
      return false;
    }

    if (tag.length > 8) {
      setTagError(
        t("complaint.block.addModal.tagMaxLength", {
          defaultValue: "Tag number must be at most 8 digits",
        })
      );
      setIsValidTag(false);
      return false;
    }

    setTagError("");
    setIsValidTag(true);
    return true;
  };

  const handleAddBlockNumber = async () => {
    if (!validateTagNumber(tagNumber)) {
      return;
    }

    const guestToken = localStorage.getItem("cToken");
    if (!guestToken) {
      toast.error(
        t("complaint.block.noToken", {
          defaultValue:
            "Guest token not found. Please verify your phone number again.",
        })
      );
      return;
    }

    if (!phoneNumber) {
      toast.error(
        t("complaint.block.noPhoneNumber", {
          defaultValue: "Phone number not found.",
        })
      );
      return;
    }

    setAddingNumber(true);

    try {
      const payload = {
        msisdn: phoneNumber.replace(/^\+/, ""),
        blocked_tag: tagNumber,
        channel: "WEB",
        reason: blockReason,
        guest_token: guestToken,
        request_source: "EXTERNAL",
      };

      const response = await APICall(
        "post",
        payload,
        EndPoints.customer.guestBlockNumbers
      );

      if (
        response?.response_status === "success" ||
        response?.success ||
        response?.data
      ) {
        toast.success(
          response?.message ||
            t("complaint.block.addModal.success", {
              defaultValue: "Number blocked successfully",
            })
        );
        setShowAddModal(false);
        setTagNumber("");
        setTagError("");
        setIsValidTag(false);
        // Refresh the list
        fetchBlockedNumbers();
      } else {
        toast.error(
          response?.message ||
            t("complaint.block.addModal.failed", {
              defaultValue: "Failed to block number",
            })
        );
      }
    } catch (error) {
      console.error("Error blocking number:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("complaint.block.addModal.error", {
            defaultValue: "Error blocking number",
          })
      );
    } finally {
      setAddingNumber(false);
    }
  };

  const handleDelete = (number) => {
    setSelectedNumber(number);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedNumber?.id) {
      toast.error(
        t("complaint.block.deleteModal.noId", {
          defaultValue: "Cannot delete: Missing number ID",
        })
      );
      return;
    }

    const guestToken = localStorage.getItem("cToken");
    if (!guestToken) {
      toast.error(
        t("complaint.block.noToken", {
          defaultValue:
            "Guest token not found. Please verify your phone number again.",
        })
      );
      setShowDeleteModal(false);
      return;
    }

    setDeletingNumber(true);

    try {
      const response = await APICall(
        "delete",
        null,
        EndPoints.customer.guestDeleteBlockNumber(selectedNumber.id)
      );

      if (
        response?.response_status === "success" ||
        response?.success ||
        response?.response_code === "00"
      ) {
        toast.success(
          response?.message ||
            t("complaint.block.deleteModal.success", {
              defaultValue: "Number deleted successfully",
            })
        );
        setShowDeleteModal(false);
        setSelectedNumber(null);
        // Refresh the list
        fetchBlockedNumbers();
      } else {
        toast.error(
          response?.message ||
            t("complaint.block.deleteModal.failed", {
              defaultValue: "Failed to delete number",
            })
        );
      }
    } catch (error) {
      console.error("Error deleting number:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("complaint.block.deleteModal.error", {
            defaultValue: "Error deleting number",
          })
      );
    } finally {
      setDeletingNumber(false);
    }
  };

  useEffect(() => {
    // Get phone number from route state or localStorage
    const state = location?.state;
    const phone = state?.phoneNumber || localStorage.getItem("guestPhone");

    if (phone) {
      setPhoneNumber(phone);
      fetchBlockedNumbers();
    } else {
      // If no phone number, redirect to home or show error
      toast.error(
        t("complaint.block.noVerificationData", {
          defaultValue: "No phone number found. Please start over.",
        })
      );
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [location, navigate, t, fetchBlockedNumbers]);

  const options = {
    option1: t("complaint.block.addModal.reason.spamCall", {
      defaultValue: "Spam Call",
    }),
    option2: t("complaint.block.addModal.reason.fraudOrScam", {
      defaultValue: "Fraud or Scam",
    }),
    option3: t("complaint.block.addModal.reason.harassmentAndAbuse", {
      defaultValue: "Harassment and Abuse",
    }),
    option4: t("complaint.block.addModal.reason.unwantedMarketingCall", {
      defaultValue: "Unwanted Marketing Call",
    }),
    option5: "Repeated Calls",
    option6: t("complaint.block.addModal.reason.personalReasons", {
      defaultValue: "Personal Reasons",
    }),
    option7: t("complaint.block.addModal.reason.offensiveOrThreateningCall", {
      defaultValue: "Offensive or Threatening Call",
    }),
    option8: t("complaint.block.addModal.reason.unknownCaller", {
      defaultValue: "Unknown Caller",
    }),
    option9: t("complaint.block.addModal.reason.other", {
      defaultValue: "Other",
    }),
  };

  return (
    <>
      <Header isGuest={true} />
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className=" pb-4">
            <BiArrowBack
              className=" text-3xl cursor-pointer text-secondary font-bold"
              onClick={() => {
                navigate(ConstentRoutes.home);
              }}
            />
          </div>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {t("complaint.block.title", {
                      defaultValue: "Blocked Numbers",
                    })}
                  </h1>
                  <p className="text-sm text-gray-600 mt-2">
                    {t("complaint.block.subtitle", {
                      defaultValue: "View your blocked numbers list",
                    })}
                  </p>
                  {phoneNumber && (
                    <p className="text-sm text-gray-600 mt-1">
                      {t("complaint.block.phoneNumber", {
                        defaultValue: "Mobile Number",
                      })}
                      :{" "}
                      <span className="font-medium">
                        {formatPhoneNumberCustom(phoneNumber)}
                      </span>
                    </p>
                  )}
                    {numbers.length > 99 && (
                    <p className="text-xs mt-2 text-red-500 font-normal">
                      {t("complaint.block.maxLimitReached", {
                        defaultValue:
                          "Maximum limit of 99 blocked numbers reached. Please unblock a number to add a new one.",
                      })}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                
                  <Button
                    onClick={() => setShowAddModal(true)}
                    size="sm"
                    className="bg-secondary flex items-center gap-1 py-2 px-4 text-sm"
                    disabled={numbers.length > 99}
                  >
                    <BiPlusCircle className="w-4 h-4" />
                    {t("complaint.block.addButton", {
                      defaultValue: "Add Block Number",
                    })}
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <Spinner className="h-8 w-8 text-secondary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-[#F6F7FB]">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-[#7A798A]">
                          {t("complaint.block.table.sr", {
                            defaultValue: "Sr#",
                          })}
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-[#7A798A]">
                          {t("complaint.block.table.blocked", {
                            defaultValue: "Blocked Number/TAG",
                          })}
                        </th>
                        {/* <th className="py-3 px-4 text-left text-sm font-medium text-[#7A798A]">
                          {t("complaint.block.table.type", { defaultValue: "Block Type" })}
                        </th> */}
                        <th className="py-3 px-4 text-left text-sm font-medium text-[#7A798A]">
                          {t("complaint.block.table.registered", {
                            defaultValue: "Registered Mobile Number",
                          })}
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-[#7A798A]">
                          Blocked Date
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-[#7A798A]">
                          Reason
                        </th>
                        <th className="py-3 px-4 text-center text-sm font-medium text-[#7A798A]">
                          {t("complaint.block.table.action", {
                            defaultValue: "Action",
                          })}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {numbers.length > 0 ? (
                        numbers.map((number, index) => (
                          <tr key={number.id || index}>
                            <td className="py-4 px-4 text-xs text-gray-700">
                              {index + 1}
                            </td>
                            <td className="py-4 px-4 text-xs text-gray-700">
                              {number.blocked_tag
                                ? `#${number.blocked_tag}`
                                : ""}
                            </td>

                            <td className="py-4 px-4 text-xs text-gray-700">
                              {formatPhoneNumberCustom(number.blocked_no)}
                            </td>
                            <td className="py-4 px-4 text-xs text-gray-700">
                              {number.created_at}
                            </td>
                            <td className="py-4 px-4 text-xs text-gray-700">
                              {number?.reason}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex justify-center">
                                <Button
                                  size="xs"
                                  onClick={() => handleDelete(number)}
                                  className="bg-red-500 py-2 px-3 font-normal hover:bg-red-600 text-white"
                                >
                                  {t("complaint.block.table.delete", {
                                    defaultValue: "Delete",
                                  })}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="py-6 px-4 text-center text-sm text-[#7A798A]"
                          >
                            {t("complaint.block.table.empty", {
                              defaultValue: "No blocked numbers found",
                            })}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Block Number Modal */}
      {showAddModal && (
        <div className="fixed p-2 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6">
            <div
              className="absolute right-4 top-4 cursor-pointer text-xl text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowAddModal(false);
                setTagNumber("");
                setTagError("");
                setIsValidTag(false);
                setBlockReason("SPAM_CALL");
              }}
            >
              <IoMdCloseCircle />
            </div>

            <div className="mt-4">
              <Typography variant="h5" className="font-bold text-gray-900">
                {t("complaint.block.addModal.title", {
                  defaultValue: "Block Number",
                })}
              </Typography>
              <Typography className="mt-2 text-sm text-gray-600">
                {t("complaint.block.addModal.subtitle", {
                  defaultValue: "Enter the tag number you want to block",
                })}
              </Typography>
            </div>

            <div className="mt-6">
              <div className="mb-4">
                <label className="block text-xs font-medium text-[#7A798A] mb-1">
                  {t("complaint.block.addModal.tagLabel", {
                    defaultValue: "TAG Number",
                  })}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={tagNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers
                    setTagNumber(val);
                    validateTagNumber(val);
                  }}
                  maxLength={8}
                  placeholder={t("complaint.block.addModal.tagPlaceholder", {
                    defaultValue: "Enter tag number (3-8 digits)",
                  })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-secondary text-sm"
                />
                {tagError && (
                  <p className="text-xs text-red-500 mt-1">{tagError}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {t("complaint.block.addModal.tagHint", {
                    defaultValue: "Enter 3 to 8 digits only",
                  })}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-[#7A798A] mb-1">
                  {t("complaint.block.addModal.customerTypeLabel", {
                    defaultValue: "Block Reason",
                  })}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-secondary text-sm"
                >
                  <option value={options.option1}>{options.option1}</option>
                  <option value={options.option2}>{options.option2}</option>
                  <option value={options.option3}>{options.option3}</option>
                  <option value={options.option4}>{options.option4}</option>
                  <option value={options.option5}>{options.option5}</option>
                  <option value={options.option6}>{options.option6}</option>
                  <option value={options.option7}>{options.option7}</option>
                  <option value={options.option8}>{options.option8}</option>
                  <option value={options.option9}>{options.option9}</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  {t("complaint.block.addModal.blockMessage", {
                    defaultValue:
                      "Once a caller is blocked, all future incoming calls from that number will be automatically rejected.",
                  })}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                className="flex-1 py-2.5 bg-gray-300 text-gray-800 shadow-none hover:shadow-none"
                onClick={() => {
                  setShowAddModal(false);
                  setTagNumber("");
                  setTagError("");
                  setIsValidTag(false);
                  setBlockReason("SPAM_CALL");
                }}
                disabled={addingNumber}
              >
                {t("complaint.block.addModal.cancel", {
                  defaultValue: "Cancel",
                })}
              </Button>
              <Button
                className="flex-1 py-2.5 bg-secondary text-white shadow-none hover:shadow-none"
                onClick={handleAddBlockNumber}
                disabled={addingNumber || !isValidTag}
              >
                {addingNumber ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner size="sm" className="h-3 w-3" />
                    {t("complaint.block.addModal.processing", {
                      defaultValue: "Processing...",
                    })}
                  </div>
                ) : (
                  t("complaint.block.addModal.submit", {
                    defaultValue: "Submit",
                  })
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed p-2 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6">
            <div
              className="absolute right-4 top-4 cursor-pointer text-xl text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedNumber(null);
              }}
            >
              <IoMdCloseCircle />
            </div>

            <div className="mt-4 text-center">
              <Typography variant="h5" className="font-bold text-gray-900">
                {t("complaint.block.deleteModal.title", {
                  defaultValue: "Confirm Deletion",
                })}
              </Typography>
              <Typography className="mt-2 text-sm text-gray-600">
                {t("complaint.block.deleteModal.desc1", {
                  defaultValue:
                    "Are you sure you want to remove this number from blocklist?",
                })}
              </Typography>
              {selectedNumber && (
                <Typography className="mt-2 text-sm text-gray-800 font-medium">
                  {selectedNumber.blocked_tag
                    ? `#${selectedNumber.blocked_tag}`
                    : formatPhoneNumberCustom(selectedNumber.blocked_no)}
                </Typography>
              )}
              <Typography className="mt-2 text-sm text-gray-600">
                {t("complaint.block.deleteModal.desc2", {
                  defaultValue:
                    "This number will be able to make calls on your TAG number",
                })}
              </Typography>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                className="flex-1 py-2.5 bg-gray-300 text-gray-800 shadow-none hover:shadow-none"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedNumber(null);
                }}
                disabled={deletingNumber}
              >
                {t("complaint.block.deleteModal.cancel", {
                  defaultValue: "Cancel",
                })}
              </Button>
              <Button
                className="flex-1 py-2.5 bg-red-500 text-white shadow-none hover:shadow-none hover:bg-red-600"
                onClick={confirmDelete}
                disabled={deletingNumber}
              >
                {deletingNumber ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner size="sm" className="h-3 w-3" />
                    {t("complaint.block.deleteModal.deleting", {
                      defaultValue: "Deleting...",
                    })}
                  </div>
                ) : (
                  t("complaint.block.deleteModal.confirm", {
                    defaultValue: "Confirm",
                  })
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GuestBlock;
