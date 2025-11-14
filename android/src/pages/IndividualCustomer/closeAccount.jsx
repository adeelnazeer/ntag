import { useState, useEffect } from 'react';
import { Button, Typography, Spinner } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import BuyTagConfirmationModal from "../../modals/buy-tag-modals";
import EndPoints from '../../network/EndPoints';
import { formatPhoneNumberCustom } from '../../utilities/formatMobileNumber';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import APICall from '../../network/APICall';
import { ConstentRoutes, getTagStatusDashboard } from '../../utilities/routesConst';
import { removeToken } from '../../utilities/auth';
import { clearUserData } from '../../redux/userSlice';
import { useTranslation } from "react-i18next";

function CloseAccountCustomer() {
    const { t } = useTranslation(["closeAccount"]);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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

    let userData = {}
    userData = useAppSelector(state => state.user.userData);
    if (userData == null || userData == undefined) {
        localStorage.getItem("user");
        userData = JSON.parse(localStorage.getItem("user"));
    }

    useEffect(() => {
        fetchTagData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTagData = () => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.id) {
            console.error(t("messages.noAccountId"));
            setLoading(false);
            return;
        }

        APICall("get", null, `${EndPoints.customer.getReserveTagsCustomer}/${user?.id}`)
            .then((res) => {
                if (res?.success) {
                    const activeTags = res?.data.filter(tag =>
                        tag.type !== 'reserve' &&
                        Number(tag.status) != 6
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



    const processCloseAccount = () => {
        if (comment?.value.trim() === "") {
            setComment(st => ({
                ...st,
                error: true
            }))
            toast.error(t("messages.commentRequired"));
            return
        }
        setUnsubscribing(true);

        const payload = {
            user_id: userData?.id || '',
            msisdn: userData?.phone_number || '',
            reason: comment?.value
        };

        APICall("post", payload, EndPoints.customer.individualCloseAccount)
            .then(res => {
                if (res?.success) {
                    toast.success(res?.message || t("messages.closeSuccess"));
                    handleCloseModal()
                    dispatch(clearUserData());
                    removeToken();
                    localStorage.removeItem("token");
                    localStorage.removeItem("id");
                    localStorage.clear();
                    navigate(ConstentRoutes.login);
                    // Refresh tag data after successful unsubscribe
                } else {
                    toast.error(res?.message || t("messages.closeFailed"));

                }
                setUnsubscribing(false);
            })
            .catch(err => {
                console.log({ err })
                toast.error(err?.message || t("messages.errorOccurred"));
                setUnsubscribing(false);
            });
    };

    const renderTagItem = (tag) => {
        return (
            <tr key={tag?.id}>
                <td className="py-4 px-4 text-sm text-gray-700">{userData?.first_name || ''} {userData?.last_name || ""}</td>
                <td className="py-4 px-4 text-sm text-gray-700">{formatPhoneNumberCustom(userData?.phone_number || t("common.na"))}</td>
                <td className="py-4 px-4 text-sm text-gray-700">
                    {moment(userData?.created_date).format("YYYY-MM-DD") || t("common.na")}
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">
                    {getTagStatusDashboard(userData?.status)}
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">
                    <Button
                        size={'sm'}
                        className="bg-red-500 text-white text-[14px]"
                        onClick={() => {
                            confirmUnsubscribe(tag?.reserve_tag_id)
                            setSelectedTagNumber(tag)

                        }}
                        disabled={tagData?.length > 0}
                    >
                        {unsubscribing && selectedTagId === tag?.reserve_tag_id ? t("buttons.processing") : t("buttons.closeAccount")}
                    </Button>
                </td>
            </tr>
        );
    };

    return (
        <div className="shadow bg-white rounded-xl">
            <div className=' border-b flex justify-between items-center'>
                <Typography className="text-[#1F1F2C] p-3 px-6 text-md font-bold">
                    {t("title")}
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
                                {t("note")}
                            </p>
                        )}
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead className="bg-[#F6F7FB]">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">{t("table.headers.name")}</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">{t("table.headers.mobileNumber")}</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">{t("table.headers.createdDate")}</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">{t("table.headers.status")}</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">{t("table.headers.action")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTagItem()}
                                </tbody>
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
                tagNo={selectedTagNumber?.tag_no || ''}
            />
        </div>
    );
}

export default CloseAccountCustomer;