import { useState, useEffect } from 'react';
import { Button, Typography, Spinner } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { getTagStatusDashboard } from '../../utilities/routesConst';
import BuyTagConfirmationModal from '../../modals/buy-tag-modals';
import EndPoints from '../../network/EndPoints';
import APICall from '../../network/APICall';
import { formatPhoneNumberCustom } from '../../utilities/formatMobileNumber';
import { useTranslation } from "react-i18next";

function UnsubscribeCustomer() {
  const { t } = useTranslation(["unsubscribe"]);
  const [tagData, setTagData] = useState([]);
  const [tagNo, setTagNo] = useState("")
  const [loading, setLoading] = useState(true);
  const [unsubscribing, setUnsubscribing] = useState(false);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState(null);

  useEffect(() => {
    fetchTagData();
  }, []);

  const fetchTagData = () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) {
      console.error(t("messages.noAccountId"));
      setLoading(false);
      return;
    }

    APICall("get", null, `${EndPoints.customer.newSecurityEndPoints.individual.getReserveTags}`)
      .then((res) => {
        if (res?.success) {
          const activeTags = res?.data.filter(tag =>
            tag.type !== 'reserve' &&
            tag.status !== "6"
          );
          setTagData(activeTags);
        } else {
          toast.error(res?.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tag data:", err);
        toast.error(t("messages.fetchError"));
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

  // Process unsubscribe after confirmation
  const handleConfirmUnsubscribe = () => {
    processUnsubscribe(selectedTagId);
    handleCloseModal();
  };

  const processUnsubscribe = (corp_subscriber_id) => {
    setUnsubscribing(true);

    const payload = {
      msisdn: corp_subscriber_id
    };

    APICall("post", payload, EndPoints.customer.individualUnSun)
      .then(res => {
        if (res?.success) {
          toast.success(res?.message || t("messages.unsubscribeSuccess"));
          // Refresh tag data after successful unsubscribe
          fetchTagData();
        } else {
          toast.error(res?.message || t("messages.unsubscribeFailed"));
        }
        setUnsubscribing(false);
      })
      .catch(err => {
        toast.error(err?.message || t("messages.errorOccurred"));
        setUnsubscribing(false);
      });
  };

  const renderTagItem = (tag) => {
    if (!tag) return null;


    const isPremium = tag?.tag_list_premium_id == 1;
    const tagInfo = isPremium && tag?.corp_premium_tag_list ? tag?.corp_premium_tag_list : (tag || {});

    return (
      <tr key={tag?.id} className="border-b">
        <td className="py-4 px-6 text-sm text-center">#{tagInfo?.tag_no || t("common.na")}</td>
        <td className="py-4 px-6 text-sm whitespace-pre text-center">{formatPhoneNumberCustom(tag?.msisdn)}</td>
        <td className="py-4 px-6 text-sm text-center">
          {(tag.created_date) || t("common.na")}
        </td>
        <td className="py-4 px-6 text-sm text-center">
          {getTagStatusDashboard(tag?.status)}
        </td>
        <td className="py-4 px-6 text-sm text-center">
          <Button
            size={'sm'}
            className="bg-red-500 text-white text-[14px]"
            onClick={() => {
              confirmUnsubscribe(tag?.reserve_tag_id)
              setTagNo(tagInfo?.tag_no)

            }}
            disabled={unsubscribing}
          >
            {unsubscribing && selectedTagId === tag?.reserve_tag_id ? t("buttons.processing") : t("buttons.unsubscribe")}
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <div className="shadow bg-white rounded-xl">
      <Typography className="text-[#1F1F2C] p-3 px-6 border-b text-md font-medium">
        {t("title")}
      </Typography>

      <div className="p-8">
        {loading ? (
          <div className="min-h-44 flex justify-center items-center">
            <Spinner className="h-12 w-12" color="green" />
          </div>
        ) : (
          <>
            {(tagData?.length === 0 || tagData?.[0]?.type == "reserve") ? (
              <Typography className=" text-center py-2">
                {t("table.noActiveRegistered")}
              </Typography>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-4 px-6 text-sm">{t("table.headers.tagNumber")}</th>
                      <th className="py-4 px-6 whitespace-pre text-sm">{t("table.headers.mobileNumber")}</th>
                      <th className="py-4 px-6 text-sm">{t("table.headers.registrationDate")}</th>
                      <th className="py-4 px-6 text-sm">{t("table.headers.status")}</th>
                      <th className="py-4 px-6 text-sm">{t("table.headers.action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tagData.map(tag => renderTagItem(tag))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <BuyTagConfirmationModal
        isOpen={openModal}
        onClose={handleCloseModal}
        modalAction="unsubscribe"
        onConfirm={handleConfirmUnsubscribe}
        isIndividual={true}
        tagNo={tagNo}
      />
    </div>
  );
}

export default UnsubscribeCustomer;