/* eslint-disable react/prop-types */
import { Button, Chip, Spinner, Typography, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes, getPaymentStatus, getStatus, getTagStatus, getTagStatusDashboard } from "../../utilities/routesConst";
import useSchedularHook from "../hooks/schedularHook";
import Img from "../../assets/images/wallet (2).png";
import moment from "moment";
import { useEffect, useState } from "react";
import APICall from "../../network/APICall";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setUserData, setCorporateDocuments } from "../../redux/userSlice";
import { toast } from "react-toastify";
import EndPoints from "../../network/EndPoints";
import BuyTagConfirmationModal from "../../modals/buy-tag-modals";

const TagNamesIndividual = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [docStatus, setDocStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [unsubscribing, setUnsubscribing] = useState(false);
    const [resubscribing, setResubscribing] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [state, setState] = useState([])

    // State for confirmation modal
    const [openModal, setOpenModal] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [selectedTagId, setSelectedTagId] = useState(null);

    let userData = {}
    userData = useAppSelector(state => state.user.userData);
    if (userData == null || userData == undefined) {
        localStorage.getItem("user");
        userData = JSON.parse(localStorage.getItem("user"));
    }
    const user = JSON.parse(localStorage.getItem("user"));

    // Format price to always show 2 decimal places
    const formatPrice = (price) => {
        if (!price) return "0.00";
        return Number(price).toFixed(2);
    };

    const getData = () => {
        setLoading(true)
        APICall("get", null, `${EndPoints.customer.getReserveTagsCustomer}/${user?.id}`)
            .then((res) => {
                if (res?.success) {
                    // const filterData = res?.data?.filter((item) => item?.type == "subscriber");
                    setState(res?.data || [])
                } else {
                    toast.error(res?.message);
                    setState([])
                }
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                setState([])
            })
    }

    useEffect(() => {
        if (user?.id) {
            getData()
        }
    }, [user?.id])


    const refreshTagData = () => {
        getData()
    };

    // Show confirmation modal first
    const confirmAction = (action, tagId) => {
        setModalAction(action);
        setSelectedTagId(tagId);
        setOpenModal(true);
    };

    // Close modal and reset state
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedTagId(null);
        setModalAction('');
    };

    // Proceed with the action after confirmation
    const handleConfirmAction = () => {
        if (modalAction === 'unsubscribe') {
            processUnsubscribe(selectedTagId);
        } else if (modalAction === 'resubscribe') {
            processResubscribe(selectedTagId);
        } else if (modalAction === 'cancel') {
            processCancelReservation(selectedTagId);
        }
        handleCloseModal();
    };

    const processUnsubscribe = (corp_subscriber_id) => {
        setUnsubscribing(true);

        const payload = {
            corp_subscriber_id: corp_subscriber_id
        };

        APICall("post", payload, "individual/unsubscribe")
            .then(res => {
                if (res?.success) {
                    toast.success(res?.message || "Successfully unsubscribed");
                    // Refresh tag data after successful unsubscribe
                    refreshTagData();
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

    const processResubscribe = (corp_subscriber_id) => {
        setResubscribing(true);

        const payload = {
            corp_subscriber_id: corp_subscriber_id
        };

        APICall("post", payload, "/individual/re-subscribe")
            .then(res => {
                if (res?.success) {
                    toast.success(res?.message || "Successfully resubscribed");
                    // Refresh tag data after successful resubscribe
                    refreshTagData();
                } else {
                    toast.error(res?.message || "Failed to resubscribe");
                }
                setResubscribing(false);
            })
            .catch(err => {
                toast.error(err?.message || "An error occurred");
                setResubscribing(false);
            });
    };

    const processCancelReservation = (reserve_tag_id) => {
        setCancelling(true);
        APICall("post", {}, `/individual/cancel-reservation/${reserve_tag_id}`)
            .then((res) => {
                if (res?.success) {
                    toast.success(res?.message || "Reservation is canceled");
                    // Refresh tag data after successful cancellation
                    refreshTagData();
                } else {
                    toast.error(res?.message || "Failed to cancel reservation");
                }
                setCancelling(false);
            })
            .catch((err) => {
                toast.error(err?.message || "An error occurred");
                setCancelling(false);
            });
    };
    const [showMessage, setShowMessage] = useState(false)

    const handleConfirmStatusChange = async (item) => {
        const toastStyle = {
            position: "top-center",        // Override global position
            autoClose: 9000,               // Override global duration
            hideProgressBar: false,
            closeOnClick: true,
            icon: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            className: 'w-[450px] left-0 mx-auto text-sm', // Tailwind classes to center & size
        }
        setLoading(true);
        try {
            const payload = {
                msisdn: item?.msisdn
            };
            const response = await APICall("post", payload, EndPoints.customer.createMandate);
            if (response?.data?.status == 404 || !response?.data?.status) {
                // Update service status
                getData()
                setShowMessage(true)
                toast.error("Sorry, we’re unable to process your request right now. Please try again later.", toastStyle);

                // Update localStorage for sidebar
                localStorage.setItem('serviceStatus', 1);

                // Trigger storage event to notify other components
                window.dispatchEvent(new Event('storage'));

            } else {
                setShowMessage(true)
                toast.success('Your request to initiate the telebirr mandate has been sent. Please check your mobile device and approve it using your telebirr PIN.', toastStyle);
            }
        } catch (error) {
            console.error("Error updating service status:", error);
            toast.error("Sorry, we’re unable to process your request right now. Please try again later.", toastStyle);
        } finally {
            setLoading(false);
        }
    };

    const renderTagData = (single) => {
        if (!single) return null;

        const isPremium = single?.tag_list_premium_id == 1;
        const tagInfo = isPremium && single?.corp_premium_tag_list ? single?.corp_premium_tag_list : (single?.corp_tag_list || {});
        const isReserved = single?.type === 'reserve';
        const isPaid = single?.payment_status !== 0;
        const isUnsub = single.status == 6;
        const isActive = single.status == 1;
        const isNotPremium = single?.premium_tag_list_id == null

        return (
            <div className="md:p-4 p-1 rounded-xl shadow pb-6 md:mt-6 mt-2" key={single?.id}>
                {(single?.is_recurring_acceptance == 0 && showMessage == false && single?.status != 6) &&
                    <Typography className="text-[14px] font-bold mb-3">
                        <span>Action Required: Authorize Recurring Payment </span>
                        <br />
                        <span className=" md:block hidden text-blue-600">
                            To keep your NameTAG number active, please authorize recurring payments via telebirr.
                            You will receive a PIN prompt via push notification.
                            If not authorized, your NameTAG number will be suspended 30 days after the recurring fee due date.
                            <Button className=" ml-1 cursor-pointer text-white px-2 py-2 bg-secondary"
                                onClick={() => {
                                    handleConfirmStatusChange(single)
                                }}
                            > Accept</Button></span>
                        <span className="md:hidden block text-blue-600">
                            To keep your NameTAG number active, please authorize recurring payments via telebirr.
                            You will receive a PIN prompt via push notification.
                            If not authorized, your NameTAG number will be suspended 30 days after the recurring fee due date.                            <Button className=" ml-1 cursor-pointer text-white px-2 py-2 bg-secondary"
                                onClick={() => {
                                    handleConfirmStatusChange(single)
                                }}
                            > Accept</Button></span>
                    </Typography>
                }
                {(single?.status == 6) &&
                    <Typography className="text-[14px] font-bold mb-3">
                        <span>Notice: </span>
                        <br />
                        <span className=" text-blue-600">
                            Your NameTAG service is unsubscribed
                        </span>
                    </Typography>
                }

                <div className="flex justify-between bg-[#F6F7FB] md:px-3 px-2 py-3 rounded-xl items-center">
                    <div className="flex items-center gap-3">
                        <Typography className="md:text-[14px] text-[12px]">
                            {isNotPremium ? single?.tag_name : single?.premium_tag_list?.tag_name || 'N/A'}
                        </Typography>
                    </div>
                    <div>
                        <Typography className="text-[14px] bg-secondary py-1 px-4 rounded-lg text-white">
                            #{isNotPremium ? single?.tag_no : single?.premium_tag_list?.tag_no || 'N/A'}
                        </Typography>
                    </div>
                </div>
                <div className="flex justify-between border border-blue-200 bg-blue-50 md:px-5 px-2 py-3 rounded-xl mt-3">
                    <Typography className="text-[14px]">NameTAG Category</Typography>
                    <Typography className="text-[14px] font-bold text-blue-600">
                        {isNotPremium ? single?.tag_type : single?.premium_tag_list?.tag_type || "N/A"}
                    </Typography>
                </div>
                {/* Premium tag indicator */}
                {/* {single?.tag_type && ( */}
                {/* <div className="flex justify-between border bg-[#008fd547] md:px-5 px-2 py-3 rounded-xl mt-3">
                        <Typography className="text-[14px]">TAG Type</Typography>
                        <Typography className="text-[14px] font-bold ">
                        {isPremium?"Premium":"Corporate"}
                        </Typography>
                    </div> */}
                {/* )} */}
                {/* <div className="flex justify-between text-[#232323] md:px-5 px-2 py-3 rounded-xl mt-1">
                    <Typography className="md:text-[14px] text-[12px]">
                        NameTAG Category

                    </Typography>
                    <Typography className="md:text-[14px] text-[12px]">
                        {(tagInfo?.tag_type) || 'N/A'}
                    </Typography>
                </div> */}
                <div className="flex justify-between text-[#232323] md:px-5 px-2 py-3 rounded-xl mt-1">
                    <Typography className="md:text-[14px] text-[12px]">
                        Registered Mobile Number
                    </Typography>
                    <Typography className="md:text-[14px] text-[12px]">
                        {`+${single?.msisdn}` || 'N/A'}
                    </Typography>
                </div>

                <div className="md:px-5 px-2 py-3 rounded-xl mt-1">
                    <div className="flex justify-between">
                        <Typography className="text-[14px]">{isReserved ? "Reservation Date" : "Subscription Date"} </Typography>
                        <Typography className="md:text-[14px] text-[12px]">
                            {moment(isReserved ? single?.created_date : single.sub_date).format('DD-MM-YYYY')}
                        </Typography>
                    </div>
                </div>

                <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
                    <Typography className="text-[14px]">Subscription Fee</Typography>
                    <Typography className="md:text-[14px] text-[12px]">
                        {formatPrice(isNotPremium ? single?.tagnoprice : single?.premium_tag_list?.tag_price || '0')} ETB
                    </Typography>
                </div>

                {/* <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
                    <Typography className="text-[14px]">Tax</Typography>
                    <Typography className="md:text-[14px] text-[12px]">
                        {formatPrice(Number(single?.total_amount) - Number(isNotPremium ? single?.tagnoprice : single?.premium_tag_list?.tag_price) || '0')} ETB
                    </Typography>
                </div> */}



                <div className="flex justify-between gap-1 md:px-5 px-2 py-3 rounded-xl mt-1">
                    <Typography className="text-[14px]"> Subscription Payment Status</Typography>
                    <Typography className="md:text-[14px] text-[12px]">
                        {getPaymentStatus(single?.payment_status)}
                    </Typography>
                </div>

                <div className="md:px-5 px-2 py-3 rounded-xl mt-1">
                    <div className="flex justify-between">
                        <Typography className="text-[14px]">Service Status </Typography>
                        <Typography className="md:text-[14px] text-[12px] capitalize">
                            {single?.type == "reserve" ? "Reserved" : getTagStatusDashboard(single?.status) || ""}
                        </Typography>
                    </div>
                </div>

                {/* Incoming Calls Status */}
                {!isReserved && isPaid && (
                    <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
                        <Typography className="text-[14px]">Incoming Calls Status</Typography>
                        <Typography className={`md:text-[14px] text-[12px] font-medium `}>
                            {single?.service_status == 1 ? "ON" : "OFF"}
                        </Typography>
                    </div>
                )}

                <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
                    <Typography className="text-[14px]">
                        {"Monthly"} Recurring Fee
                    </Typography>
                    <Typography className="md:text-[14px] text-[12px]">
                        {formatPrice(
                            single?.service_id === "Monthly" ? tagInfo?.monthly_fee || single?.service_fee || '0' :
                                single?.service_id === "Quarterly" ? tagInfo?.quarterly_fee || single?.service_fee || '0' :
                                    single?.service_id === "Semi-Annually" ? tagInfo?.semiannually_fee || single?.service_fee || '0' :
                                        single?.service_id === "Annually" ? tagInfo?.annually_fee || single?.service_fee || '0' :
                                            tagInfo?.service_fee || single?.service_fee || '0'
                        )} ETB
                    </Typography>
                </div>

                {(!isReserved && isPaid) && (
                    <>
                        {single?.fee_charge_date && (
                            <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
                                <Typography className="text-[14px]">Service Fee Last Charge Date</Typography>
                                <Typography className="md:text-[14px] text-[12px]">
                                    {single?.fee_charge_date || "Not Available"}
                                </Typography>
                            </div>
                        )}
                    </>
                )}

                {(!isReserved && isPaid && !isUnsub) ? (
                    <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
                        <Typography className="text-[14px]">Recurring Fee Next Due Date:</Typography>
                        <Typography className="md:text-[14px] text-[12px]">
                            {single?.next_charge_dt ? moment(single.next_charge_dt).format("DD-MM-YYYY") : "Not Available"}
                        </Typography>
                    </div>
                ) : null}


                <div className="flex justify-center mx-auto gap-4 mt-4">
                    {/* Buy TAG button for reserved tags with approved documents */}
                    {(docStatus?.corp_document?.[0]?.doc_status != "0" && isReserved) && (
                        <>
                            {(docStatus?.corp_document?.[0]?.doc_status == '2' || docStatus?.corp_document?.[1]?.doc_status == '2') ? (
                                <Button
                                    className="bg-secondary text-white text-[14px]"
                                    onClick={() => navigate(ConstentRoutes.profilePage)}
                                >
                                    ReSubmit Documents
                                </Button>
                            ) : (
                                <Button
                                    className="bg-secondary text-white text-[14px]"
                                    onClick={() => navigate(ConstentRoutes.tagDetailCustomer, {
                                        state: {
                                            ...single,
                                            isReserve: true,
                                            // Use the premium tag data if it exists
                                            ...(isPremium ? single.corp_premium_tag_list : single?.premium_tag_list),
                                            reserve_tag_id: single?.reserve_tag_id,
                                            msisdn: single?.msisdn,
                                            tax: single.tax,
                                            service_id: single.service_id, // Pass the service_id for correct fee selection
                                            // For premium tags, add these fields
                                            tag_list_premium_id: single.tag_list_premium_id,
                                            corp_premium_tag_list: single.corp_premium_tag_list,
                                            is_premium: isPremium
                                        }
                                    })}
                                >
                                    Buy TAG Number
                                </Button>
                            )}

                            <Button
                                className="bg-red-500 text-white text-[14px]"
                                onClick={() => confirmAction('cancel', single?.reserve_tag_id)}
                                disabled={cancelling}
                            >
                                {cancelling ? "Processing..." : "Cancel Reservation"}
                            </Button>
                        </>
                    )}

                    {/* Resubscribe button for unsubscribed tags */}
                    {(!isReserved && isPaid && isUnsub) && (
                        <Button
                            className="bg-secondary text-white text-[14px]"
                            onClick={() => confirmAction('resubscribe', single?.reserve_tag_id)}
                            disabled={resubscribing}
                        >
                            {resubscribing ? "Processing..." : "Resubscribe TAG Number"}
                        </Button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="shadow bg-white rounded-xl">
            <Typography className="text-[#1F1F2C] p-3 px-6 border-b text-lg font-bold">
                NameTAG Service
            </Typography>
            <div className="md:p-8 p-4">
                {loading ? (
                    <div className="min-h-44 flex col-span-2 justify-between items-center">
                        <Spinner className="h-12 w-12 mx-auto" color="green" />
                    </div>
                ) : (
                    <>
                        {(!Array.isArray(state) || state.length === 0) && (
                            <Typography className="mt-2 font-normal text-base text-center">
                                No NameTAG number has been reserved or subscribed yet.
                            </Typography>
                        )}

                        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                            {Array.isArray(state) && state?.map(single => renderTagData(single))}
                        </div>

                        {(!Array.isArray(state) || state.length === 0) && (
                            <div className="text-center">
                                <Button
                                    className="mt-8 bg-secondary text-white text-[14px] md:w-[400px] w-full"
                                    onClick={() => navigate(ConstentRoutes.buyTagCustomer)}
                                >
                                    BUY NameTAG
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Confirmation Modal */}
            <BuyTagConfirmationModal
                isOpen={openModal}
                onClose={handleCloseModal}
                modalAction={modalAction} // Will be 'unsubscribe', 'resubscribe', or 'cancel'
                onConfirm={handleConfirmAction}
            />
        </div>
    );
};

export default TagNamesIndividual;