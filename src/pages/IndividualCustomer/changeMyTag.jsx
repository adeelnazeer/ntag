/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Typography, Button, Spinner } from "@material-tailwind/react";
import { toast } from 'react-toastify';
import { formatPhoneNumberCustom } from '../../utilities/formatMobileNumber';
import EndPoints from '../../network/EndPoints';
import APICall from '../../network/APICall';
import { useAppSelector } from '../../redux/hooks';
import { IoMdCloseCircle } from "react-icons/io";
import moment from 'moment';
import { ConstentRoutes, getTagStatus } from '../../utilities/routesConst';
import { useNavigate } from 'react-router-dom';

const ChangeMyTAG = () => {
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
  }, []);

  const fetchTagInfo = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const response = await APICall("get", null, `${EndPoints.customer.getReserveTagsCustomer}/${user?.id}`);

      if (response?.success && response?.data) {
        setTagData(response?.data);
      }
    } catch (error) {
      console.error("Error fetching TAG info:", error);
      toast.error("Error loading TAG information");

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
        toast.success("Your TAG has been changed successfully");
        setTagData({
          ...tagData,
          change_count: tagData.change_count + 1
        });
        setChangingTag(false);
        setShowConfirmDialog(false);
      }, 1500);

    } catch (error) {
      console.error("Error changing TAG:", error);
      toast.error("Failed to change your TAG");
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
        Change NameTAG
      </Typography>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner className="h-10 w-10 text-secondary" />
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto  p-6">
            <Typography className="text-center py-8">
              The NameTAG change feature will be available soon.
            </Typography>
            {/* {(tagData?.[0]?.type == "reserve" || tagData?.[0]?.status != 1) ?
              <div className='pt-4'>
                <p>You don't have any active NameTAG linked to your mobile number, and no NameTAG is available to change.</p>
              </div>
              :
              <table className="min-w-full bg-white">
                <thead className="bg-[#F8FAFF]">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      TAG Number
                    </th>
                    <th className="py-3 px-4 whitespace-pre text-left text-sm font-medium text-gray-700">
                      Registered Number
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      Subscription Date
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      Service Status
                    </th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>

                  <tr>
                    {tagData.length > 0 ? <>
                      <td className="py-4 px-4 text-sm text-gray-700">#{tagData[0].tag_no}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{formatPhoneNumberCustom(userData.phone_number)}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{moment(tagData[0].created_date).format('DD-MM-YYYY')}</td>
                      <td className="py-4 px-4 text-sm text-gray-700 capitalize">{getTagStatus(tagData?.[0]?.status)}</td>
                      <td className="py-4 px-4 text-center">
                        <Button
                          onClick={handleChangeTag}
                          size="sm"
                          className="bg-secondary"
                          disabled={isChangeDisabled()}
                        >
                          Change NameTAG
                        </Button>
                      </td>
                    </> : <p>You don't have any TAG linked to your mobile number. </p>}

                  </tr>
                </tbody>
              </table>
            } */}
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
                Change NameTAG
              </Typography>

              <Typography className="mt-2 text-sm text-gray-600">
                Are you sure you want to change your NameTAG?
              </Typography>
              <Typography className="mt-2 text-sm text-gray-600">
                You have {getRemainingChanges()} changes remaining.
              </Typography>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                className="flex-1 py-2.5 bg-gray-300 text-gray-800 shadow-none hover:shadow-none"
                onClick={() => setShowConfirmDialog(false)}
                disabled={changingTag}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 py-2.5 bg-secondary text-white shadow-none hover:shadow-none"
                onClick={confirmChangeTag}
                disabled={changingTag}
              >
                {changingTag ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="h-3 w-3" /> Processing...
                  </div>
                ) : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeMyTAG;