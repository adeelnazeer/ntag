import React, { useState, useEffect } from 'react';
import { Button, Typography, Spinner } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
// import APICall from "../network/APICall";
import { toast } from "react-toastify";
// import { getTagStatusDashboard, getPaymentStatus } from "../utilities/routesConst";
import moment from "moment";
import { getTagStatusDashboard } from '../../utilities/routesConst';
import BuyTagConfirmationModal from '../../modals/buy-tag-modals';
import EndPoints from '../../network/EndPoints';
import APICall from '../../network/APICall';
import { formatPhoneNumberCustom } from '../../utilities/formatMobileNumber';
// import BuyTagConfirmationModal from "../modals/buy-tag-modals";
// import EndPoints from '../network/EndPoints';

function UnsubscribeCustomer() {
  const navigate = useNavigate();
  const [tagData, setTagData] = useState([]);
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
      console.error("No customer account ID found");
      setLoading(false);
      return;
    }

    APICall("get", null, `${EndPoints.customer.getReserveTagsCustomer}/${user?.id}`)
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
        toast.error("Failed to load NameTAG data");
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
          toast.success(res?.message || "Successfully unsubscribed");
          // Refresh tag data after successful unsubscribe
          fetchTagData();
        } else {
          toast.error(res?.message || "Failed to unsubscribe");
        }
        setUnsubscribing(false);
      })
      .catch(err => {
        toast.error(err?.message || "An error occurred");
        setUnsubscribing(false);
      });
  };

  const renderTagItem = (tag) => {
    if (!tag) return null;

    console.log("Tag data:", tag); // Debugging line

    const isPremium = tag?.tag_list_premium_id == 1;
    const tagInfo = isPremium && tag?.corp_premium_tag_list ? tag?.corp_premium_tag_list : (tag || {});

    return (
      <tr key={tag?.id} className="border-b">
        <td className="py-4 px-6 text-sm text-center">#{tagInfo?.tag_no || 'N/A'}</td>
        <td className="py-4 px-6 text-sm whitespace-pre text-center">{formatPhoneNumberCustom(tag?.msisdn)}</td>
        <td className="py-4 px-6 text-sm text-center">
          {tag?.created_date ? moment(tag.created_date).format("YYYY-MM-DD") : 'N/A'}
        </td>
        <td className="py-4 px-6 text-sm text-center">
          {getTagStatusDashboard(tag?.status)}
        </td>
        <td className="py-4 px-6 text-sm text-center">
          <Button
            size={'sm'}
            className="bg-red-500 text-white text-[14px]"
            onClick={() => confirmUnsubscribe(tag?.reserve_tag_id)}
            disabled={unsubscribing}
          >
            {unsubscribing && selectedTagId === tag?.reserve_tag_id ? "Processing..." : "Unsubscribe"}
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <div className="shadow bg-white rounded-xl">
      <Typography className="text-[#1F1F2C] p-3 px-6 border-b text-md font-bold">
        Manage NameTAG Service
      </Typography>

      <div className="p-8">
        {loading ? (
          <div className="min-h-44 flex justify-center items-center">
            <Spinner className="h-12 w-12" color="green" />
          </div>
        ) : (
          <>
            {(tagData?.length === 0 || tagData?.[0]?.type == "reserve") ? (
              <Typography className=" py-2">
                You don't have any TAG linked to your mobile number.
              </Typography>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-4 px-6 font-semibold text-sm">TAG Number</th>
                      <th className="py-4 px-6 font-semibold whitespace-pre text-sm"> Mobile Number</th>
                      <th className="py-4 px-6 font-semibold text-sm">Registration Date</th>
                      <th className="py-4 px-6 font-semibold text-sm">Status</th>
                      <th className="py-4 px-6 font-semibold text-sm">Action</th>
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
      />
    </div>
  );
}

export default UnsubscribeCustomer;