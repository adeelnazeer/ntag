import React, { useState, useEffect } from 'react';
import { Button, Typography, Spinner, Chip, Tooltip } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import APICall from "../network/APICall";
import { toast } from "react-toastify";
import { getTagStatusDashboard, getPaymentStatus, ConstentRoutes } from "../utilities/routesConst";
import moment from "moment";
import BuyTagConfirmationModal from "../modals/buy-tag-modals";
import EndPoints from '../network/EndPoints';
import { formatPhoneNumberCustom } from '../utilities/formatMobileNumber';
import AddNumberModal from '../modals/Add-number-modals';
import { useAppSelector } from '../redux/hooks';

function ChangeNumber() {
    const navigate = useNavigate();
    const [tagData, setTagData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unsubscribing, setUnsubscribing] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState({ show: false });
    const [selectedTag, setSelectedTag] = useState(null)
    const userData = useAppSelector(state => state.user.userData);
    const customerId = userData?.id;
    // Modal state

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
                    {userData?.phone_number == tag?.msisdn ? (
                        <div className="w-max">
                            <Chip
                                size="sm"
                                variant="ghost"
                                value="Primary"
                                color="green"
                                className="rounded-full bg-green-100 text-secondary px-2 py-1 text-xs font-medium"
                            />
                        </div>
                    ) : (
                        <div className="w-max">
                            <Chip
                                size="sm"
                                variant="ghost"
                                value="Additional"
                                color="blue"
                                className="rounded-full bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium"
                            />
                        </div>
                    )}
                </td>
                {/* <td className="py-4 px-4 text-sm text-gray-700">
                    {tag?.created_date ? moment(tag.created_date).format("YYYY-MM-DD") : 'N/A'}
                </td> */}
                <td className="py-4 px-4 text-sm text-gray-700">
                    {tag?.service_fee ? tag?.service_fee : ""} ETB
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">
                    {tag?.next_charge_dt ? moment(tag.next_charge_dt).format("DD-MM-YYYY") : 'N/A'}
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">
                    {tag?.dues > 0 ? 0 : Math.abs(tag?.dues)} ETB
                </td>

                <td className="py-4 px-4 text-sm text-gray-700">
                    {getTagStatusDashboard(tag?.status)}
                </td>
                <td className="py-4 px-4 text-sm text-gray-700 flex gap-2">
                    <Button
                        size={'sm'}
                        className="bg-secondary text-white text-[14px]"
                        onClick={() => {
                            if (tag?.dues < 0) {
                                navigate(ConstentRoutes.changeNumberDetailPage, { state: { ...tag } });
                            } else {
                                setOpenAddDialog(st => ({
                                    ...st,
                                    show: true,
                                }));
                                setSelectedTag(tag)
                            }

                        }}
                        disabled={unsubscribing}
                    >
                        {"Change Mobile Number"}
                    </Button>

                </td>
            </tr>
        );
    };

    return (
        <div className="shadow bg-white rounded-xl">
            <Typography className="text-[#1F1F2C] p-3 px-6 border-b text-md font-bold">
                Change Mobile Number
            </Typography>

            <div className="p-8">
                {loading ? (
                    <div className="min-h-44 flex justify-center items-center">
                        <Spinner className="h-12 w-12" color="green" />
                    </div>
                ) : (
                    <>
                        {tagData.length === 0 ? (
                            <Typography className="text-center py-8">
                                No active NameTAG services found.
                            </Typography>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-[#F6F7FB]">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">NameTAG Number</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">Mobile Number</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">Mobile Number Type</th>

                                            {/* <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">Registration Date</th> */}
                                            <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">Recurring Fee</th>

                                            <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">Recurring Fee Due Date</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">Outstanding Recurring Fee</th>

                                            <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">Status</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">Action</th>
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

            {openAddDialog?.show &&
                <AddNumberModal
                    isOpen={openAddDialog?.show}
                    onClose={() => setOpenAddDialog({ show: false })}
                    onAddNumber={fetchTagData}
                    customerId={customerId}
                    isChangeNumberFlow={true}
                    selectedTag={selectedTag}
                />
            }


        </div>
    );
}

export default ChangeNumber;