import React, { useState, useEffect } from 'react';
import { Button, Typography, Spinner } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import APICall from "../network/APICall";
import { toast } from "react-toastify";
import { getTagStatusDashboard, getPaymentStatus, ConstentRoutes } from "../utilities/routesConst";
import moment from "moment";
import BuyTagConfirmationModal from "../modals/buy-tag-modals";
import EndPoints from '../network/EndPoints';
import { formatPhoneNumberCustom } from '../utilities/formatMobileNumber';

function ChangeMyTag() {
    const navigate = useNavigate();
    const [tagData, setTagData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unsubscribing, setUnsubscribing] = useState(false);

    // Modal state
    const [openModal, setOpenModal] = useState(false);
    const [selectedTagId, setSelectedTagId] = useState(null);
    const [selectedTagNumber, setSelectedTagNumber] = useState(null);

    useEffect(() => {
        fetchTagData();
    }, []);

    const fetchTagData = () => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.customer_account_id) {
            console.error("No customer account ID found");
            setLoading(false);
            return;
        }

        APICall("get", null, `${EndPoints.customer.getReserve}/${user?.customer_account_id}`)
            .then((res) => {
                if (res?.success) {
                    const activeTags = res?.data.filter(tag =>
                        tag.type !== 'reserve' &&
                        tag.payment_status !== 0 &&
                        (tag.status !== 6 && tag?.status != "6")
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

    const handleChangeTag = (single) => {
        // Instead of showing the confirm dialog immediately, navigate to the buy tag page
        navigate(ConstentRoutes.buyTag, {
            state: {
                isExchangeFlow: true,
                currentTagData: single, // Pass current tag data for reference
            }
        });
    };

    // Process unsubscribe after confirmation
    const handleConfirmUnsubscribe = () => {
        processUnsubscribe(selectedTagId);
        handleCloseModal();
    };

    const processUnsubscribe = (corp_subscriber_id) => {
        setUnsubscribing(true);

        const payload = {
            corp_subscriber_id: corp_subscriber_id
        };

        APICall("post", payload, "customer/unsubscribe")
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

        // Check if premium tag
        const isPremium = tag?.tag_list_premium_id == 1;
        // Use the premium tag data if it exists, otherwise use the regular tag data
        const tagInfo = isPremium && tag?.corp_premium_tag_list ? tag?.corp_premium_tag_list : (tag?.corp_tag_list || {});

        return (
            <tr key={tag?.id}>
                <td className="py-4 px-4 text-sm text-gray-700">#{tagInfo?.tag_no || 'N/A'}</td>
                <td className="py-4 px-4 text-sm text-gray-700">{formatPhoneNumberCustom(tag?.msisdn || 'N/A')}</td>
                <td className="py-4 px-4 text-sm text-gray-700">
                    {tag?.created_date ? moment(tag.created_date).format("YYYY-MM-DD") : 'N/A'}
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">
                    {getTagStatusDashboard(tag?.status)}
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">
                    <Button
                        size={'sm'}
                        className="bg-secondary text-white text-[14px]"
                        onClick={() => {
                            handleChangeTag(tag)

                        }}
                    >
                        {unsubscribing && selectedTagId === tag?.reserve_tag_id ? "Processing..." : "Change NameTAG"}
                    </Button>
                </td>
            </tr>
        );
    };

    return (
        <div className="shadow bg-white rounded-xl">
            <Typography className="text-[#1F1F2C] p-3 px-6 border-b text-md font-bold">
                Manage Corporate NameTAG Service
            </Typography>

            <div className="p-8">
                {loading ? (
                    <div className="min-h-44 flex justify-center items-center">
                        <Spinner className="h-12 w-12" color="green" />
                    </div>
                ) : (
                    <Typography className="text-center py-8">
                        The NameTAG change feature will be available soon.
                    </Typography>
                    // <>
                    //     {tagData.length === 0 ? (
                    //         <Typography className="text-center py-8">
                    //             No active NameTAG services found to unsubscribe.
                    //         </Typography>
                    //     ) : (
                    //         <div className="overflow-x-auto">
                    //             <table className="min-w-full bg-white">
                    //                 <thead className="bg-[#F6F7FB]">
                    //                     <tr>
                    //                         <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">TAG Number</th>
                    //                         <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">Mobile Number</th>
                    //                         <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">Registration Date</th>
                    //                         <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">Status</th>
                    //                         <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">Action</th>
                    //                     </tr>
                    //                 </thead>
                    //                 <tbody>
                    //                     {tagData.map(tag => renderTagItem(tag))}
                    //                 </tbody>
                    //             </table>
                    //         </div>
                    //     )}
                    // </>
                )}
            </div>

            {/* Confirmation Modal */}
            <BuyTagConfirmationModal
                isOpen={openModal}
                onClose={handleCloseModal}
                modalAction="unsubscribe"
                onConfirm={handleConfirmUnsubscribe}
                tagNo={selectedTagNumber?.tag_no || ''}
            />
        </div>
    );
}

export default ChangeMyTag;