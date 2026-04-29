/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react";
import { Button, Spinner, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import {
  ConstentRoutes,
  getPaymentStatus,
  getTagStatusDashboard,
} from "../utilities/routesConst";
import APICall from "../network/APICall";
import { toast } from "react-toastify";
import EndPoints from "../network/EndPoints";
import BuyTagConfirmationModal from "../modals/buy-tag-modals";
import { formatPhoneNumberCustom } from "../utilities/formatMobileNumber";
import { useAppSelector } from "../redux/hooks";
import { useTranslation } from "react-i18next";
import SimpleHeader from "./deleteAccount/components/Header";

const getPaymentMethod = (payment_method) => {
  if (payment_method == "telebirr") {
    return "  telebirr  super App ";
  }
  if (payment_method == "telebirr_super_app") {
    return "Telebirr Super App";
  }
  if (payment_method == "telebirr_partnerapp") {
    return "telebirr  partner App";
  }
  return payment_method || "";
};

function DelAccountDetail() {
  const { t } = useTranslation(["buyTag"]);
  const { t: ts } = useTranslation(["schedule"]);
  const { t:t2 } = useTranslation(["unsubscribe"]);
  const navigate = useNavigate();

  const [tagData, setTagData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [unsubscribing, setUnsubscribing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openUnsubModal, setOpenUnsubModal] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [selectedTagNumber, setSelectedTagNumber] = useState(null);
  const [comment, setComment] = useState({ value: "", error: false });

  let userData = useAppSelector((state) => state.user.userData);
  if (userData == null || userData == undefined) {
    const raw = localStorage.getItem("user");
    userData = raw ? JSON.parse(raw) : {};
  }
  const isIndividual = userData?.customer_type === "individual";

  const formatPrice = (price) => {
    if (!price) return "0.00";
    return Number(price).toFixed(2);
  };

  const fetchTagData = () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const deleteToken = localStorage.getItem("deleteToken");
    const params = {
      msisdn: user?.phone_number,
    };
    const reserveTagsEndpoint = isIndividual
      ? EndPoints.customer.newSecurityEndPoints.individual.getReserveTags
      : EndPoints.customer.newSecurityEndPoints.corporate.getReserveTags;

    APICall(
      "get",
      isIndividual ? params : user?.parent_id != null ? params : null,
      `${reserveTagsEndpoint}`,
      deleteToken
        ? { Authorization: `Bearer ${deleteToken}`, "x-no-auth-redirect": "1" }
        : null
    )
      .then((res) => {
        if (res?.success) {
          setTagData(Array.isArray(res?.data) ? res.data : []);
        } else {
          toast.error(res?.message);
          setTagData([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error(ts("deleteAccountDetail.toastMessages.failedToLoad"));
        setTagData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTagData();
  }, []);

  const activeSubscribedTags = useMemo(
    () =>
      tagData.filter(
        (tag) => tag.type !== "reserve" && Number(tag.status) !== 6
      ),
    [tagData]
  );

  const canRequestDelete = activeSubscribedTags.length === 0;

  const processCloseAccount = () => {
    if (comment?.value.trim() === "") {
      setComment((st) => ({ ...st, error: true }));
      return;
    }
    setSubmitting(true);
    const deleteToken = localStorage.getItem("deleteToken");

    const payload = isIndividual
      ? {
        user_id: userData?.id || "",
        msisdn: userData?.phone_number || "",
        reason: comment?.value,
      }
      : {
        account_id: userData?.id || "",
        phone_number: userData?.phone_number || "",
        account_close_req: true,
        comments: comment?.value,
      };

    const closeEndpoint = isIndividual
      ? EndPoints.customer.individualCloseAccount
      : EndPoints.customer.updateStatus;

    APICall(
      "post",
      payload,
      closeEndpoint,
      deleteToken
        ? { Authorization: `Bearer ${deleteToken}`, "x-no-auth-redirect": "1" }
        : null
    )
      .then((res) => {
        if (res?.success) {
          toast.success(
            res?.message ||
            ts("deleteAccountDetail.toastMessages.successfullyClosedAccount")
          );
          setOpenModal(false);
          setComment({ value: "", error: false });
          localStorage.removeItem("deleteToken");
          localStorage.clear();
          navigate(ConstentRoutes.login);
        } else {
          toast.error(
            res?.message ||
            ts("deleteAccountDetail.toastMessages.failedToCloseAccount")
          );
        }
        setSubmitting(false);
      })
      .catch((err) => {
        toast.error(
          err?.message ||
          ts("deleteAccountDetail.toastMessages.anErrorOccurred")
        );
        setSubmitting(false);
      });
  };

  const confirmUnsubscribe = (tagId, tagNo) => {
    setSelectedTagId(tagId);
    setSelectedTagNumber(tagNo || "");
    setOpenUnsubModal(true);
  };

  const handleCloseUnsubModal = () => {
    setOpenUnsubModal(false);
    setSelectedTagId(null);
    setSelectedTagNumber(null);
  };

  const processUnsubscribe = (tagId) => {
    if (!tagId) return;
    setUnsubscribing(true);
    const deleteToken = localStorage.getItem("deleteToken");
    const payload = isIndividual
      ? { msisdn: tagId }
      : { corp_subscriber_id: tagId };
    const endpoint = isIndividual
      ? EndPoints.customer.individualUnSun
      : "customer/unsubscribe";

    APICall(
      "post",
      payload,
      endpoint,
      deleteToken
        ? { Authorization: `Bearer ${deleteToken}`, "x-no-auth-redirect": "1" }
        : null
    )
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message || t("toastMessages.successfullyUnsubscribed"));
          fetchTagData();
        } else {
          toast.error(res?.message || t("toastMessages.failedToUnsubscribe"));
        }
        setUnsubscribing(false);
      })
      .catch((err) => {
        toast.error(err?.message || t("toastMessages.anErrorOccurred"));
        setUnsubscribing(false);
      });
  };

  const handleConfirmUnsubscribe = () => {
    processUnsubscribe(selectedTagId);
    handleCloseUnsubModal();
  };

  const renderTagCard = (single) => {
    if (!single) return null;

    const isPremium = single?.premium_tag_list;
    console.log(single);
    const tagInfo =
      isPremium && single?.premium_tag_list
        ? single?.premium_tag_list
        : single || {};
    const isReserved = single?.type === "reserve";
    const isPaid = single?.payment_status !== 0;
    const isUnsub = single.status == 6;
    const canUnsubscribe = !isReserved && isPaid && !isUnsub;

    return (
      <div
        className="md:p-4 p-1 rounded-xl shadow pb-6 md:mt-6 mt-2"
        key={single?.id ?? single?.reserve_tag_id}
      >
        {single?.status == 6 && (
          <Typography className="text-[14px] font-bold mb-3">
            <span>{t("notices.notice")} </span>
            <br />
            <span className="text-blue-600">{t("notices.unsubscribed")}</span>
          </Typography>
        )}
        <div className="flex justify-between bg-[#F6F7FB] md:px-3 px-2 py-3 rounded-xl items-center">
          <Typography className="md:text-[14px] text-[12px] font-bold">
            {tagInfo?.tag_name || t("common.na")}
          </Typography>
          <Typography className="text-[14px] bg-secondary py-1 px-4 rounded-lg text-white">
            #{tagInfo?.tag_no || t("common.na")}
          </Typography>
        </div>

        {/* <div className="flex justify-between border border-blue-200 bg-blue-50 md:px-5 px-2 py-3 rounded-xl mt-3">
          <Typography className="text-[14px]">{t("tagInfo.tagType")}</Typography>
          <Typography className="text-[14px] font-bold text-blue-600">
            {isPremium ? t("tagInfo.premium") : t("tagInfo.corporate")}
          </Typography>
        </div> */}
        <div className="flex justify-between text-[#232323] md:px-5 px-2 py-3 rounded-xl mt-1">
          <Typography className="md:text-[14px] text-[12px]">
            {t("tagInfo.nameTagCategory")}
          </Typography>
          <Typography className="md:text-[14px] text-[12px]">
            {tagInfo?.tag_type || t("common.na")}
          </Typography>
        </div>
        <div className="flex justify-between text-[#232323] md:px-5 px-2 py-3 rounded-xl mt-1">
          <Typography className="md:text-[14px] text-[12px]">
            {t("tagInfo.registeredMobileNumber")}
          </Typography>
          <Typography className="md:text-[14px] text-[12px]">
            {formatPhoneNumberCustom(single?.msisdn) || t("common.na")}
          </Typography>
        </div>

        <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
          <Typography className="text-[14px]">
            {t("tagInfo.subscriptionFee")}
          </Typography>
          <Typography className="md:text-[14px] text-[12px]">
            {formatPrice(
              isPremium ? tagInfo?.tag_price || "0" : tagInfo?.tag_price || "0"
            )}{" "}
            {t("common.etb")}
          </Typography>
        </div>

        <div className="flex justify-between gap-1 md:px-5 px-2 py-3 rounded-xl mt-1">
          <Typography className="text-[14px]">
            {t("tagInfo.subscriptionPaymentStatus")}
          </Typography>
          <Typography className="md:text-[14px] text-[12px]">
            {getPaymentStatus(single?.payment_status)}
          </Typography>
        </div>

        <div className="flex justify-between gap-1 md:px-5 px-2 py-3 rounded-xl mt-1">
          <Typography className="text-[14px]">Payment Method</Typography>
          <Typography className="md:text-[14px] text-[12px]">
            {getPaymentMethod(single?.payment_method)}
          </Typography>
        </div>

        <div className="md:px-5 px-2 py-3 rounded-xl mt-1">
          <div className="flex justify-between">
            <Typography className="text-[14px]">
              {isReserved
                ? t("tagInfo.reservationDate")
                : t("tagInfo.subscriptionDate")}
            </Typography>
            <Typography className="md:text-[14px] text-[12px]">
              {isReserved ? single?.created_date : single?.sub_date}
            </Typography>
          </div>
        </div>

        <div className="flex justify-between gap-1 md:px-5 px-2 py-3 rounded-xl mt-1">
          <Typography className="text-[14px]">
            {t("tagInfo.serviceStatus")}
          </Typography>
          <Typography className="md:text-[14px] text-[12px]">
            {single?.type === "reserve"
              ? t("tagInfo.reserved")
              : getTagStatusDashboard(single?.status)}
          </Typography>
        </div>

        <div className="flex justify-between gap-1 md:px-5 px-2 py-3 rounded-xl mt-1">
          <Typography className="text-[14px]">
            {t("tagInfo.servicePackage")}
          </Typography>
          <Typography className="md:text-[14px] text-[12px]">
            {single.service_id}
          </Typography>
        </div>

        <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
          <Typography className="text-[14px]">
            {single?.service_id || t("tagInfo.monthly")}{" "}
            {t("tagInfo.recurringFee")}
          </Typography>
          <Typography className="md:text-[14px] text-[12px]">
            {formatPrice(
              single?.service_id === "Monthly"
                ? tagInfo?.monthly_fee || single?.service_fee || "0"
                : single?.service_id === "Quarterly"
                  ? tagInfo?.quarterly_fee || single?.service_fee || "0"
                  : single?.service_id === "Semi-Annual"
                    ? tagInfo?.semiannually_fee || single?.service_fee || "0"
                    : single?.service_id === "Annually"
                      ? tagInfo?.annually_fee || single?.service_fee || "0"
                      : tagInfo?.service_fee || single?.service_fee || "0"
            )}{" "}
            {t("common.etb")}
          </Typography>
        </div>

        {!isReserved && isPaid && !isUnsub && (
          <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
            <Typography className="text-[14px]">
              {t("tagInfo.recurringFeeDueDate")}
            </Typography>
            <Typography className="md:text-[14px] text-[12px]">
              {single?.next_charge_dt
                ? single.next_charge_dt
                : t("tagInfo.notAvailable")}
            </Typography>
          </div>
        )}
        {!isReserved && isPaid && isUnsub && (
          <>
            <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
              <Typography className="text-[14px]">
                {t("tagInfo.unsubscribeDate")}
              </Typography>
              <Typography className="text-[14px]">
                {single?.unsub_date
                  ? single.unsub_date
                  : t("tagInfo.notAvailable")}
              </Typography>
            </div>
          </>
        )}
        {canUnsubscribe && (
          <div className="flex justify-center mt-4">
            <Button
              size="sm"
              className="bg-red-500 text-white text-[14px]"
              onClick={() =>
                confirmUnsubscribe(
                  single?.reserve_tag_id,
                  tagInfo?.tag_no || single?.tag_no || ""
                )
              }
              disabled={unsubscribing}
            >
              {unsubscribing && selectedTagId === single?.reserve_tag_id
                ? t2("buttons.processing")
                : t2("buttons.unsubscribe")}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col h-screen overflow-auto">
        <SimpleHeader />
        <div className="shadow flex-1 max-w-6xl mx-auto my-4 bg-white rounded-xl">
          <Typography className="text-[#1F1F2C] p-3 px-6 border-b text-lg font-bold">
            {ts("deleteAccountDetail.title")}
          </Typography>

          <div className="md:p-8 p-4 space-y-4">
            <Typography className="text-[#1F1F2C] text-sm md:text-base leading-relaxed">
              {ts("deleteAccountDetail.intro")}
            </Typography>

            {/* {!loading && !canRequestDelete && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <Typography className="text-sm text-amber-900 font-medium">
                  {ts("deleteAccountDetail.activeBlocking")}
                </Typography>
                <Button
                  variant="text"
                  className="mt-2 p-0 normal-case text-secondary underline text-sm"
                  onClick={() =>
                    navigate(
                      isIndividual
                        ? ConstentRoutes.unsubTagCustomer
                        : ConstentRoutes.UnSUBblockTag
                    )
                  }
                >
                  {ts("deleteAccountDetail.goToUnsubscribe")}
                </Button>
              </div>
            )} */}

            {loading ? (
              <div className="min-h-44 flex justify-center items-center">
                <Spinner className="h-12 w-12" color="green" />
              </div>
            ) : (
              <>
                {tagData.length === 0 ? (
                  <Typography className="text-center text-gray-600">
                    {ts("deleteAccountDetail.emptyTags")}
                  </Typography>
                ) : (
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                    {tagData.map((single) => renderTagCard(single))}
                  </div>
                )}

                <div className="flex flex-col items-stretch md:items-center gap-2 pt-4 border-t border-gray-100">
                  <Button
                    className="bg-red-500 text-white text-[14px] md:w-auto w-full max-w-md"
                    disabled={!canRequestDelete || submitting}
                    onClick={() => setOpenModal(true)}
                  >
                    {ts("deleteAccountDetail.deleteButton")}
                  </Button>
               
                </div>
              </>
            )}
          </div>

          <BuyTagConfirmationModal
            isOpen={openModal}
            onClose={() => {
              setOpenModal(false);
              setComment({ value: "", error: false });
            }}
            modalAction="close"
            isDeleteAccount={true}
            onConfirm={processCloseAccount}
            comment={comment}
            setComment={setComment}
            tagNo=""
          />
          <BuyTagConfirmationModal
            isOpen={openUnsubModal}
            onClose={handleCloseUnsubModal}
            modalAction="unsubscribe"
            onConfirm={handleConfirmUnsubscribe}
            isIndividual={isIndividual}
            tagNo={selectedTagNumber || ""}
          />
        </div>
      </div>

    </>
  );
}

export default DelAccountDetail;
