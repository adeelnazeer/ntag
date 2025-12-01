/* eslint-disable react/prop-types */
import { Button, Chip, Spinner, Typography, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes, getPaymentStatus, getStatus, getTagStatus, getTagStatusDashboard } from "../utilities/routesConst";
import useSchedularHook from "./hooks/schedularHook";
import Img from "../assets/images/wallet (2).png";
import moment from "moment";
import { useEffect, useState } from "react";
import APICall from "../network/APICall";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setUserData, setCorporateDocuments } from "../redux/userSlice";
import { toast } from "react-toastify";
import EndPoints from "../network/EndPoints";
import BuyTagConfirmationModal from "../modals/buy-tag-modals";
import { formatPhoneNumberCustom } from "../utilities/formatMobileNumber";

const TagNames = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: tagData, loading: tagLoading, setData: setTagData, CompleteResponse, setCompleteResponse } = useSchedularHook("tagname");
  const [docStatus, setDocStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [resubscribing, setResubscribing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showMessage, setShowMessage] = useState(false)

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

  // Format price to always show 2 decimal places
  const formatPrice = (price) => {
    if (!price) return "0.00";
    return Number(price).toFixed(2);
  };

  useEffect(() => {
    checkDocument();
  }, []);

  const checkDocument = () => {
    setLoading(true);

    if (!userData?.customer_account_id) {
      console.error("No customer account ID found");
      setLoading(false);
      return;
    }

    APICall("get", null, `/customer/check-documents/${userData.customer_account_id}`)
      .then(res => {
        setDocStatus(res?.data || {});

        if (res?.data) {
          dispatch(setCorporateDocuments(res.data.corp_document || []));
        }

        setLoading(false);
      })
      .catch(err => {
        console.log("err", err);
        setLoading(false);
      });
  };

  const refreshTagData = () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    APICall("get", null, `${EndPoints.customer.getReserve}/${user?.customer_account_id}`)
      .then((res) => {
        if (res?.success) {
          setTagData(res?.data);
          setCompleteResponse(res)
        } else {
          toast.error(res?.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
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
    if (modalAction === 'resubscribe') {
      processResubscribe(selectedTagId);
    } else if (modalAction === 'cancel') {
      processCancelReservation(selectedTagId);
    }
    handleCloseModal();
  };

  const processResubscribe = (corp_subscriber_id) => {
    setResubscribing(true);

    const payload = {
      corp_subscriber_id: corp_subscriber_id
    };

    APICall("post", payload, "customer/re-subscribe")
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

    const payload = {
      corp_reserve_tag_id: reserve_tag_id
    };

    APICall("post", payload, "/customer/cancel-reservation")
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

  // Function to navigate to the document tab directly
  const navigateToDocuments = () => {
    navigate(ConstentRoutes.profilePage, { state: { activeTab: "document" } });
  };

  // Function to navigate to unsubscribe page
  const navigateToUnsubscribe = () => {
    navigate(ConstentRoutes.UnSUBblockTag);
  };


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
      const response = await APICall("post", payload, EndPoints.customer.createMandateCorp);
      if (response?.data?.status == 404 || !response?.data?.status) {
        // Update service status
        refreshTagData()
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

    // Check if premium tag
    const isPremium = single?.tag_list_premium_id == 1;
    // Use the premium tag data if it exists, otherwise use the regular tag data
    const tagInfo = isPremium && single?.corp_premium_tag_list ? single?.corp_premium_tag_list : (single?.corp_tag_list || {});
    const isReserved = single?.type === 'reserve';
    const isPaid = single?.payment_status !== 0;
    const isUnsub = single.status == 6;

    return (
      <div className="md:p-4 p-1 rounded-xl shadow pb-6 md:mt-6 mt-2" key={single?.id}>
        {(single?.is_recurring_acceptance == 0 && showMessage == false && single?.status != 6 && single?.payment_method=="telebirr") &&
          <Typography className="text-[14px] font-bold mb-3">
            <span>Action Required: Authorize Recurring Payment </span>
            <br />
            <span className=" md:block hidden text-blue-600">
              To keep your NameTAG number active, please authorize recurring payments via telebirr.
              You will receive a PIN prompt via push notification.
              If not authorized, your NameTAG number will be suspended 30 days after the recurring fee due date.     <Button className=" ml-1 cursor-pointer text-white px-2 py-2 bg-secondary"
                onClick={() => {
                  handleConfirmStatusChange(single)
                }}
              > Accept</Button></span>
            <span className="md:hidden block text-blue-600">
              To keep your NameTAG number active, please authorize recurring payments via telebirr.
              You will receive a PIN prompt via push notification.
              If not authorized, your NameTAG number will be suspended 30 days after the recurring fee due date.              <Button className=" ml-1 cursor-pointer text-white px-2 py-2 bg-secondary"
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
            {/* <img className="rounded h-[40px]" src={Img} alt="wallet" /> */}
            <Typography className="md:text-[14px] text-[12px] font-bold">
              {tagInfo?.tag_name || 'N/A'}
            </Typography>
          </div>
          <div>
            <Typography className="text-[14px] bg-secondary py-1 px-4 rounded-lg text-white">
              #{tagInfo?.tag_no || 'N/A'}
            </Typography>
          </div>
        </div>

        {/* Premium tag indicator */}
        <div className="flex justify-between border border-blue-200 bg-blue-50 md:px-5 px-2 py-3 rounded-xl mt-3">
          <Typography className="text-[14px]">TAG Type</Typography>
          <Typography className="text-[14px] font-bold text-blue-600">
            {isPremium ? "Premium" : "Corporate"}

          </Typography>
        </div>
        <div className="flex justify-between text-[#232323] md:px-5 px-2 py-3 rounded-xl mt-1">
          <Typography className="md:text-[14px] text-[12px]">
            NameTAG Category

          </Typography>
          <Typography className="md:text-[14px] text-[12px]">
            {(tagInfo?.tag_type) || 'N/A'}
          </Typography>
        </div>
        <div className="flex justify-between text-[#232323] md:px-5 px-2 py-3 rounded-xl mt-1">
          <Typography className="md:text-[14px] text-[12px]">
            Registered Mobile Number
          </Typography>
          <Typography className="md:text-[14px] text-[12px]">
            {formatPhoneNumberCustom(single?.msisdn) || 'N/A'}
          </Typography>
        </div>

        <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
          <Typography className="text-[14px]">Subscription Fee</Typography>
          <Typography className="md:text-[14px] text-[12px]">
            {formatPrice(isPremium ? (tagInfo?.tag_price || '0') : (tagInfo?.tag_price || '0'))} ETB
          </Typography>
        </div>

        {/* <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
          <Typography className="text-[14px]">Tax</Typography>
          <Typography className="md:text-[14px] text-[12px]">
            {formatPrice(Number(single?.total_amount) - Number(single?.tag_price) || '0')} ETB
          </Typography>
        </div> */}

        <div className="flex justify-between gap-1 md:px-5 px-2 py-3 rounded-xl mt-1">
          <Typography className="text-[14px]">Subscription Payment Status</Typography>
          <Typography className="md:text-[14px] text-[12px]">
            {getPaymentStatus(single?.payment_status)}
          </Typography>
        </div>

        <div className="md:px-5 px-2 py-3 rounded-xl mt-1">
          <div className="flex justify-between">
            <Typography className="text-[14px]">{isReserved ? "Reservation Date" : "Subscription Date"} </Typography>
            <Typography className="md:text-[14px] text-[12px]">
              {moment(isReserved ? single?.created_date : single?.sub_date).format("DD-MM-YYYY")}
            </Typography>
          </div>
        </div>

        {/* {(!isReserved && isPaid) ? (
          <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
            <Typography className="text-[14px]">Expiry Date</Typography>
            <Typography className="md:text-[14px] text-[12px]">
              {single?.expiry_date ? moment(single.expiry_date).format("DD-MM-YYYY") : 'N/A'}
            </Typography>
          </div>
        ) : <></>} */}

        <div className="flex justify-between gap-1 md:px-5 px-2 py-3 rounded-xl mt-1">
          <Typography className="text-[14px]">Service Status</Typography>
          <Typography className="md:text-[14px] text-[12px]">
            {getTagStatusDashboard(single?.status)}
          </Typography>
        </div>


        <div className="flex justify-between gap-1 md:px-5 px-2 py-3 rounded-xl mt-1">
          <Typography className="text-[14px]">Service Package</Typography>
          <Typography className="md:text-[14px] text-[12px]">
            {single.service_id}
          </Typography>
        </div>

        <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
          <Typography className="text-[14px]">
            {single?.service_id || "Monthly"} Recurring Fee
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
                <Typography className="text-[14px]">Recurring fee last charge Date</Typography>
                <Typography className="md:text-[14px] text-[12px]">
                  {single?.fee_charge_date || "Not Available"}
                </Typography>
              </div>
            )}

          </>
        )}
        {(!isReserved && isPaid && !isUnsub) ? (<>
          <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
            <Typography className="text-[14px]">Recurring fee due Date</Typography>
            <Typography className="md:text-[14px] text-[12px]">
              {single?.next_charge_dt ? moment(single.next_charge_dt).format("DD-MM-YYYY") : "Not Available"}
            </Typography>
          </div>
        </>) : <>


        </>}
        {(!isReserved && isPaid && isUnsub) ? (<>

          <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
            <Typography className="text-[14px]">Unsubscribe Date</Typography>
            <Typography className="text-[14px]">       {single?.unsub_date ? moment(single.unsub_date).format("DD-MM-YYYY") : "Not Available"} </Typography>
          </div>
          <div className="flex justify-between md:px-5 px-2 py-3 rounded-xl mt-1">
            <Typography className="text-[14px]">  You can Resubscribe this TAG Number within 7 days from unsubscription date. </Typography>
          </div>
        </>) :
          (<></>)
        }
        <div className="flex justify-center  mx-auto gap-4 mt-4">
          {/* Buy TAG button for reserved tags with approved documents */}
          {(docStatus?.corp_document?.[0]?.doc_status != "0" && isReserved) && (
            <>
              {(docStatus?.corp_document?.[0]?.doc_status != '1' || docStatus?.corp_document?.[1]?.doc_status != '1' || docStatus?.corp_document?.[2]?.doc_status != '1') ? <Button
                className="bg-secondary text-white text-[14px]"
                onClick={navigateToDocuments}
              >
                Resubmit Documents
              </Button> : <Button
                className="bg-secondary text-white text-[14px]"
                onClick={() => navigate(ConstentRoutes.tagDetail, {
                  state: {
                    // Use the premium tag data if it exists
                    ...(isPremium ? single.corp_premium_tag_list : single.corp_tag_list),
                    reserve_tag_id: single?.reserve_tag_id,
                    msisdn: single?.msisdn,
                    isReserve: true,
                    base_price: single?.base_price,

                    service_id: single.service_id, // Pass the service_id for correct fee selection
                    // For premium tags, add these fields
                    tag_list_premium_id: single.tag_list_premium_id,
                    corp_premium_tag_list: single.corp_premium_tag_list,
                    is_premium: isPremium,
                    // Include all tax-related fields directly from the complete tag data
                    tax: single.tax,
                    excisetax: single.excisetax,
                    vatable_total: single.vatable_total,
                    discount: single.discount,
                    VAT: single.VAT,
                    stamp_duty: single.stamp_duty,
                    total_amount: single.total_amount,
                  }
                })}
              >
                Buy TAG Number
              </Button>}

            </>
          )}
          {isReserved &&
            <Button
              className="bg-red-500 text-white text-[14px]"
              onClick={() => confirmAction('cancel', single?.reserve_tag_id)}
              disabled={cancelling}
            >
              {cancelling ? "Processing..." : "Cancel Reservation"}
            </Button>
          }

          {/* Resubscribe button for unsubscribed tags */}
          {(!isReserved && isPaid && isUnsub) && (
            <Button
              className="bg-secondary text-white text-[14px]"
              onClick={() => navigate(ConstentRoutes.tagDetail, {
                state: {
                  // Use the premium tag data if it exists
                  ...(isPremium ? single.corp_premium_tag_list : single.corp_tag_list),
                  reserve_tag_id: single?.reserve_tag_id,
                  base_price: single?.base_price,
                  msisdn: single?.msisdn,
                  service_id: single.service_id, // Pass the service_id for correct fee selection
                  // For premium tags, add these fields
                  tag_list_premium_id: single.tag_list_premium_id,
                  corp_premium_tag_list: single.corp_premium_tag_list,
                  is_premium: isPremium,
                  // Include all tax-related fields directly from the complete tag data
                  tax: single.tax,
                  excisetax: single.excisetax,
                  vatable_total: single.vatable_total,
                  discount: single.discount,
                  VAT: single.VAT,
                  isReserve: true,
                  stamp_duty: single.stamp_duty,
                  mode: "resubscribe",
                  total_amount: single.total_amount,
                }
              })}
              // onClick={() => confirmAction('resubscribe', single?.reserve_tag_id)}
              disabled={resubscribing}
            >
              {resubscribing ? "Processing..." : "Resubscribe TAG Number"}
            </Button>
          )}

        </div>
      </div>
    );
  };
  if (userData?.status == 5) {
    return (
      <div className="shadow bg-white rounded-xl">
        <Typography className="text-[#1F1F2C] p-3 px-6 border-b text-lg font-bold">
          Corporate NameTAG
        </Typography>
        <div className="md:p-8 p-4">
          <Typography className="text-red-500 text-lg font-semibold text-center">
            Your NameTAG account has been blocked. Please contact NameTAG Support for further assistance.
          </Typography>
        </div>
      </div>
    );
  }
  console.log(CompleteResponse, 'CompleteResponse')

  return (
    <div className="shadow bg-white rounded-xl">
      <Typography className="text-[#1F1F2C] p-3 px-6 border-b text-lg font-bold">
        {docStatus.corp_document?.[0]?.doc_status == "1" && docStatus.corp_document?.[1]?.doc_status == "1" ? ' Welcome To NameTAG service!' : 'Corporate NameTAG'}
      </Typography>
      <div className="md:p-8 p-4">
        {docStatus.corp_document?.[0]?.doc_status == "1" && docStatus.corp_document?.[1]?.doc_status == "1" ?
          <>
            <Typography className="text-[#1F1F2C] text-md font-bold text-left">
              {CompleteResponse.total > 0 ?
                `You have registered ${CompleteResponse.total} out of a maximum of ${CompleteResponse?.max_allowed_subscription} NameTAGs.`
                : ''}
            </Typography>

            {/* <Typography className="text-[#1F1F2C] text-md font-bold text-left">
        Max Allowed NameTAGs for corporate account = {CompleteResponse?.max_allowed_subscription}
        </Typography>  */}
          </>
          : <Typography className="text-[#1F1F2C] text-lg font-bold text-center">
            NameTAG Service
          </Typography>}


        {docStatus.corp_document?.[0]?.doc_status == "0" && docStatus.corp_document?.[1]?.doc_status == "0" && docStatus.corp_document?.[2]?.doc_status == "0" ? (
          <>
            <Typography className="text-red-500 text-lg font-medium text-center">
              Your document is currently under review. Please wait patiently.
            </Typography>

            <Typography className=" text-sm font-medium text-center">
              The review process may take up to 48 hours. You will receive an SMS notification once your document has been reviewed.
            </Typography>
          </>
        ) : <></>}
        {(docStatus.corp_document?.[0]?.doc_status == "2" || docStatus.corp_document?.[1]?.doc_status == "2" || docStatus.corp_document?.[2]?.doc_status == "2") ? (
          <Typography className="text-red-500 text-lg font-medium text-center">
            Your documents have been rejected. Please check the details and resubmit them
          </Typography>

        ) : <></>}



        {loading || tagLoading ? (
          <div className="min-h-44 flex col-span-2 justify-between items-center">
            <Spinner className="h-12 w-12 mx-auto" color="green" />
          </div>
        ) : (
          <>
            {(!Array.isArray(tagData) || tagData.length === 0) && (
              <Typography className="mt-2 font-normal text-base text-center">
                {docStatus?.corp_document?.[0]?.doc_status == "0" || docStatus?.corp_document?.[1]?.doc_status == "0" || docStatus?.corp_document?.[2]?.doc_status == "0" ?
                  "In the meantime, you can reserve NameTAG numbers while your document is being processed." : "No NameTAG number has been reserved or subscribed yet."}
              </Typography>
            )}

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              {Array.isArray(tagData) && tagData.map(single => renderTagData(single))}
            </div>

            {(!Array.isArray(tagData) || tagData.length === 0) && (
              <div className="text-center">
                <Button
                  className="mt-8 bg-secondary text-white text-[14px] md:w-[400px] w-full"
                  onClick={() => navigate(ConstentRoutes.buyTag)}
                >
                  {(docStatus?.corp_document?.[0]?.doc_status == "1" && docStatus?.corp_document?.[1]?.doc_status == "1" && docStatus?.corp_document?.[2]?.doc_status == "1") ? "BUY NameTAG" : "Reserve NameTAG"}
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
        modalAction={modalAction} // Will be 'resubscribe' or 'cancel' now
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default TagNames;