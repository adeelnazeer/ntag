import { useState, useEffect } from "react";
import { Button, Typography, Spinner } from "@material-tailwind/react";
import APICall from "../network/APICall";
import { toast } from "react-toastify";
import { getTagStatusDashboard } from "../utilities/routesConst";
import moment from "moment";
import BuyTagConfirmationModal from "../modals/buy-tag-modals";
import EndPoints from "../network/EndPoints";
import { formatPhoneNumberCustom } from "../utilities/formatMobileNumber";
import { useAppSelector } from "../redux/hooks";
import { useTranslation } from "react-i18next";

function CloseAccount() {
  const { t } = useTranslation(["schedule"]);
  const [tagData, setTagData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unsubscribing, setUnsubscribing] = useState(false);
  const [comment, setComment] = useState({
    value: "",
    error: false,
  });

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [selectedTagNumber, setSelectedTagNumber] = useState(null);

  let userData = {};
  userData = useAppSelector((state) => state.user.userData);
  if (userData == null || userData == undefined) {
    localStorage.getItem("user");
    userData = JSON.parse(localStorage.getItem("user"));
  }

  useEffect(() => {
    fetchTagData();
  }, []);

  const fetchTagData = () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    const accountId =
      user?.parent_id != null && user?.parent?.customer_account_id
        ? user.parent.customer_account_id
        : user?.customer_account_id;
    setLoading(true);
    const params = {
      msisdn: user?.phone_number,
    };

    if (!user?.customer_account_id) {
      console.error("No customer account ID found");
      setLoading(false);
      return;
    }

    APICall(
      "get",
      user?.parent_id != null ? params : null,
      `${EndPoints.customer.getReserve}/${accountId}`
    )
      .then((res) => {
        if (res?.success) {
          const activeTags = res?.data.filter(
            (tag) => tag.type !== "reserve" && Number(tag.status) != 6
          );
          setTagData(activeTags);
        } else {
          toast.error(res?.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tag data:", err);
        toast.error(t("closeAccount.toastMessages.failedToLoad"));
        setLoading(false);
      });
  };

  // Show confirmation modal
  const confirmUnsubscribe = (tagId) => {
    setSelectedTagId(tagId);
    setOpenModal(true);
  };

  // Close modal and reset state
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTagId(null);
  };

  const processCloseAccount = () => {
    if (comment?.value.trim() === "") {
      setComment((st) => ({
        ...st,
        error: true,
      }));
      return;
    }
    setUnsubscribing(true);

    const payload = {
      account_id: userData?.id || "",
      phone_number: userData?.phone_number || "",
      account_close_req: true,
      comments: comment?.value,
    };

    APICall("post", payload, EndPoints.customer.updateStatus)
      .then((res) => {
        if (res?.success) {
          toast.success(
            res?.message ||
              t("closeAccount.toastMessages.successfullyClosedAccount")
          );
          handleCloseModal();
          // Refresh tag data after successful unsubscribe
        } else {
          toast.error(
            res?.message || t("closeAccount.toastMessages.failedToCloseAccount")
          );
        }
        setUnsubscribing(false);
      })
      .catch((err) => {
        toast.error(
          err?.message || t("closeAccount.toastMessages.anErrorOccurred")
        );
        setUnsubscribing(false);
      });
  };

  const renderTagItem = (tag) => {
    return (
      <tr key={tag?.id}>
        <td className="py-4 px-4 text-sm text-gray-700">
          {userData?.comp_name || t("closeAccount.common.na")}
        </td>
        <td className="py-4 px-4 text-sm text-gray-700">
          {formatPhoneNumberCustom(
            userData?.phone_number || t("closeAccount.common.na")
          )}
        </td>
        <td className="py-4 px-4 text-sm text-gray-700">
          {(userData?.created_date) ||
            t("closeAccount.common.na")}
        </td>
        <td className="py-4 px-4 text-sm text-gray-700">
          {getTagStatusDashboard(userData?.status)}
        </td>
        <td className="py-4 px-4 text-sm text-gray-700">
          <Button
            size={"sm"}
            className="bg-red-500 text-white text-[14px]"
            onClick={() => {
              confirmUnsubscribe(tag?.reserve_tag_id);
              setSelectedTagNumber(tag);
            }}
            disabled={tagData?.length > 0}
          >
            {unsubscribing && selectedTagId === tag?.reserve_tag_id
              ? t("closeAccount.buttons.processing")
              : t("closeAccount.buttons.closeAccount")}
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <div className="shadow bg-white rounded-xl">
      <div className=" border-b flex justify-between items-center">
        <Typography className="text-[#1F1F2C] p-3 px-6 text-md font-bold">
          {t("closeAccount.title")}
        </Typography>
        {/* <Button
                    size={'sm'}
                    className="bg-red-500 text-white text-[14px]"
                   
                >
                    Close Account
                </Button>      */}
      </div>

      <div className="p-8 pt-4">
        {loading ? (
          <div className="min-h-44 flex justify-center items-center">
            <Spinner className="h-12 w-12" color="green" />
          </div>
        ) : (
          <>
            {tagData?.length > 0 && (
              <p className="block text-blue-600 antialiased font-sans text-[14px] mb-3">
                {t("closeAccount.warningMessage")}
              </p>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-[#F6F7FB]">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                      {t("closeAccount.table.companyName")}
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                      {t("closeAccount.table.mobileNumber")}
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                      {t("closeAccount.table.createdDate")}
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                      {t("closeAccount.table.status")}
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                      {t("closeAccount.table.action")}
                    </th>
                  </tr>
                </thead>
                <tbody>{renderTagItem()}</tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <BuyTagConfirmationModal
        isOpen={openModal}
        onClose={handleCloseModal}
        modalAction="close"
        onConfirm={processCloseAccount}
        comment={comment}
        setComment={setComment}
        tagNo={selectedTagNumber?.tag_no || ""}
      />
    </div>
  );
}

export default CloseAccount;
