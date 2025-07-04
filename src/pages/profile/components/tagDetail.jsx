import { Spinner, Typography } from "@material-tailwind/react";
import { getTagStatus, getPaymentStatus, getTagStatusDashboard } from "../../../utilities/routesConst";
import moment from "moment";
import useSchedularHook from "../../hooks/schedularHook";
import { formatPhoneNumberCustom } from "../../../utilities/formatMobileNumber";

const TagDetails = () => {
  const { data, loading } = useSchedularHook("tagname");

  const formatPrice = (price) => {
    if (!price) return "0.00";
    return Number(price).toFixed(2);
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
              {single?.created_date ? moment(single.created_date).format("DD-MM-YYYY") : 'N/A'}
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
 
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <div className="min-h-44 flex col-span-2 justify-between items-center">
          <Spinner className="h-12 w-12 mx-auto" color="green" />
        </div>
      ) : (
        <>
          {(!Array.isArray(data) || data.length === 0) && (
            <Typography className="mt-6 font-normal text-base text-center">
              No NameTAG numbers are currently registered to your account.
                          </Typography>
          )}

          <div className="grid md:grid-cols-1 grid-cols-1 gap-4">
            {Array.isArray(data) && data.map(single => renderTagData(single))}
          </div>
        </>
      )}
    </>
  );
};

export default TagDetails;