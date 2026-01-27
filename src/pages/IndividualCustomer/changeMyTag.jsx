/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Typography, Button, Spinner } from "@material-tailwind/react";
import { toast } from 'react-toastify';
import { formatPhoneNumberCustom } from '../../utilities/formatMobileNumber';
import EndPoints from '../../network/EndPoints';
import APICall from '../../network/APICall';
import { useAppSelector } from '../../redux/hooks';
import { IoMdCloseCircle } from "react-icons/io";
import { ConstentRoutes, getTagStatus } from '../../utilities/routesConst';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const ChangeMyTAG = () => {
  const { t } = useTranslation(["changeTag"]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [changingTag, setChangingTag] = useState(false);
  const [tagData, setTagData] = useState({
    tag_number: '',
    registered_number: '',
    subscription_date: '',
    service_status: '',
    change_count: 0,
    max_changes: 5
  });

  // Get user info
  let userData = useAppSelector(state => state?.user?.userData);
  if (!userData) {
    userData = JSON.parse(localStorage.getItem('user'));
  }

  useEffect(() => {
    fetchTagInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTagInfo = async () => {
    try {
      setLoading(true);
      const response = await APICall("get", null, `${EndPoints.customer.newSecurityEndPoints.individual.getReserveTags}`);

      if (response?.success && response?.data) {
        setTagData(response?.data);
      }
    } catch (error) {
      console.error("Error fetching TAG info:", error);
      toast.error(t("messages.fetchError"));

    } finally {
      setLoading(false);
    }
  };

  const handleChangeTag = () => {
    // Instead of showing the confirm dialog immediately, navigate to the buy tag page
    navigate(ConstentRoutes.buyTagCustomer, {
      state: {
        isExchangeFlow: true,
        currentTagData: tagData, // Pass current tag data for reference
      }
    });
  };

  const confirmChangeTag = async () => {
    try {
      setChangingTag(true);
      setTimeout(() => {
        toast.success(t("messages.changeSuccess"));
        setTagData({
          ...tagData,
          change_count: tagData.change_count + 1
        });
        setChangingTag(false);
        setShowConfirmDialog(false);
      }, 1500);

    } catch (error) {
      console.error("Error changing TAG:", error);
      toast.error(t("messages.changeFailed"));
      setChangingTag(false);
      setShowConfirmDialog(false);
    }
  };

  const getRemainingChanges = () => {
    return tagData.max_changes - tagData.change_count;
  };

  const isChangeDisabled = () => {
    return tagData.change_count >= tagData.max_changes;
  };

  return (
    <div className="bg-white rounded-xl shadow">
      <Typography className="font-sans block antialiased text-[#1F1F2C] p-3 px-6 border-b text-md font-medium">
        {t("title")}
      </Typography>
      {tagData?.length > 0 &&
        <p className="flex justify-between border border-blue-200 bg-blue-50 mx-8 px-4 text-sm text-blue-800 py-3 rounded-lg mt-3">
          {t("note")}
        </p>

      }
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner className="h-10 w-10 text-secondary" />
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto  p-6">

            {(tagData?.[0]?.type == "reserve" || tagData?.[0]?.status != 1) ?
              <div className='pt-4 text-center'>
                <p>{t("table.noActiveLinked")}</p>
              </div>
              :
              <table className="min-w-full bg-white">
                <thead className="bg-[#F8FAFF]">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      {t("table.headers.nameTagNumber")}
                    </th>
                    <th className="py-3 px-4 whitespace-pre text-left text-sm font-medium text-gray-700">
                      {t("table.headers.mobileNumber")}
                    </th>
                    <th className="py-3 px-4 whitespace-pre text-left text-sm font-medium text-gray-700">
                      {t("table.headers.recurringFeeDueDate")}
                    </th>
                    <th className="py-3 px-4 whitespace-pre text-left text-sm font-medium text-gray-700">
                      {t("table.headers.outstandingFee")}
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      {t("table.headers.status")}
                    </th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">
                      {t("table.headers.action")}
                    </th>
                  </tr>
                </thead>
                <tbody>

                  <tr>
                    {tagData.length > 0 ? <>
                      <td className="py-4 px-4 text-sm text-gray-700">#{tagData[0].tag_no || t("common.na")}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {formatPhoneNumberCustom(userData.phone_number || t("common.na"))}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {tagData[0]?.next_charge_dt ? (tagData?.[0]?.next_charge_dt) : t("common.na")}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {(tagData?.[0]?.dues > 0 ? 0 : Math.abs(tagData?.[0]?.dues || 0))} {t("common.etb")}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 capitalize">{getTagStatus(tagData?.[0]?.status)}</td>
                      <td className="py-4 px-4 text-center">
                        <Button
                          onClick={() => handleChangeTag(tagData[0].tag_no)}
                          size="sm"
                          className="bg-secondary"
                          disabled={isChangeDisabled()}
                        >
                          {t("buttons.changeNameTag")}
                        </Button>
                      </td>
                    </> : <p>{t("table.noTagLinked")}</p>}

                  </tr>
                </tbody>
              </table>
            }
          </div>

          {/* <div className="mt-4 text-sm text-gray-600">
            You have changed NameTAG {tagData.change_count} out of {tagData.max_changes} times
          </div> */}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6">
            <div
              className="absolute right-4 top-4 cursor-pointer text-xl text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmDialog(false)}
            >
              <IoMdCloseCircle />
            </div>

            <div className="mt-4 text-center">
              <Typography variant="h5" className="font-bold text-gray-900">
                {t("confirmDialog.title")}
              </Typography>

              <Typography className="mt-2 text-sm text-gray-600">
                {t("confirmDialog.description")}
              </Typography>
              <Typography className="mt-2 text-sm text-gray-600">
                {t("confirmDialog.remaining", { count: getRemainingChanges() })}
              </Typography>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                className="flex-1 py-2.5 bg-gray-300 text-gray-800 shadow-none hover:shadow-none"
                onClick={() => setShowConfirmDialog(false)}
                disabled={changingTag}
              >
                {t("confirmDialog.buttons.cancel")}
              </Button>
              <Button
                className="flex-1 py-2.5 bg-secondary text-white shadow-none hover:shadow-none"
                onClick={confirmChangeTag}
                disabled={changingTag}
              >
                {changingTag ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="h-3 w-3" /> {t("confirmDialog.buttons.processing")}
                  </div>
                ) : t("confirmDialog.buttons.confirm")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeMyTAG;