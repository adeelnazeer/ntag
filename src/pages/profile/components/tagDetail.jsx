import { Chip, Spinner, Typography } from "@material-tailwind/react";
import { getPaymentStatus, getTagStatus } from "../../../utilities/routesConst";

import Img from "../../../assets/images/wallet (2).png";
import moment from "moment";
import useSchedularHook from "../../hooks/schedularHook";

const TagDetails = () => {
    const { data, loading } = useSchedularHook("tagname")

    return (
        <>
            {loading ?
                <div className=" min-h-44 flex col-span-2 justify-between items-center">
                    <Spinner className=" h-12 w-12 mx-auto" color="green" />
                </div>
                :
                <>
                    {data?.length == 0 &&
                        <Typography className="mt-6 font-normal text-base text-center">
                            Currently no name Tag is register against your account
                        </Typography>
                    }
                    <div className="grid md:grid-cols-1 grid-cols-1 gap-4">
                        {data?.map(single =>
                            <div className="md:p-4 p-1 flex flex-col gap-2 rounded-xl shadow pb-6 md:mt-6 mt-2" key={single?.id}>
                                <div className="flex mb-2 justify-between bg-[#F6F7FB] md:px-3 px-2 rounded-xl items-center">
                                    <div className=" flex items-center gap-3">
                                        <img className="rounded h-[40px]" src={Img} alt="kfc" />
                                        <Typography className="md:text-[14px] text-[12px]">
                                            {single?.corp_tag_list?.tag_name}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography className="text-[14px]  bg-secondary py-1 px-4 rounded-lg text-white">
                                            #{single?.corp_tag_list?.tag_no}
                                        </Typography>
                                    </div>
                                </div>
                                <div className="flex justify-between text-[#232323]  md:px-5 px-2 rounded-xl mt-1">
                                    <Typography className="md:text-[14px] text-[12px]">
                                        Registered Mobile Number
                                    </Typography>
                                    <Typography className="md:text-[14px] text-[12px] ">{single?.msisdn}</Typography>
                                </div>
                                <div className="md:px-5 px-2 rounded-xl mt-1">
                                    <div className="flex justify-between">
                                        <Typography className="text-[14px]">Registration Date</Typography>
                                        <Typography className="md:text-[14px] text-[12px] ">{moment(single?.corp_tag_list?.created_date).format("DD-MM-YYYY")}</Typography>
                                    </div>
                                </div>

                                <div className="flex justify-between  md:px-5 px-2 rounded-xl mt-1">
                                    <Typography className="text-[14px]">Expiry Date</Typography>
                                    <Typography className="md:text-[14px] text-[12px] ">{moment(single?.expiry_date).add(1, 'year').format("DD-MM-YYYY")}</Typography>
                                </div>

                                {/* <div className="flex justify-between  gap-1 md:px-5 px-2 rounded-xl mt-1">
                                    <Typography className="text-[14px]">Name TAG Status</Typography>
                                    <Chip className="bg-secondary capitalize whitespace-normal" value={getTagStatus(single?.corp_tag_list?.status)} />
                                </div> */}

                                <div className="flex justify-between  gap-1 md:px-5 px-2 rounded-xl mt-1">
                                    <Typography className="text-[14px]">Service Status</Typography>
                                    <Chip className="bg-secondary capitalize whitespace-normal" value={getTagStatus(single?.status)} />
                                </div>

                                <div className="flex justify-between  gap-1 md:px-5 px-2 rounded-xl mt-1">
                                    <Typography className="text-[14px]">Payment Status</Typography>
                                    <Chip className="bg-secondary capitalize whitespace-normal" value={getPaymentStatus(single?.payment_status)} />
                                </div>


                                {/* <div className="flex justify-between text-[#232323]  md:px-5 px-2 rounded-xl mt-1">
                      <Typography className="md:text-[14px] text-[12px]">
                        Contact Number
                      </Typography>
                      <Typography className="md:text-[14px] text-[12px] ">{docStatus?.contact_no}</Typography>
                    </div> */}
                                <div className="flex justify-between  md:px-5 px-2 rounded-xl mt-1">
                                    <Typography className="text-[14px]">Name TAG Price</Typography>
                                    <Typography className="md:text-[14px] text-[12px] ">Birr. {single?.corp_tag_list?.tag_price}</Typography>
                                </div>
                                <div className="flex justify-between  md:px-5 px-2 rounded-xl mt-1">
                                    <Typography className="text-[14px]"> Monthly Fee</Typography>
                                    <Typography className="md:text-[14px] text-[12px] ">Birr. {single?.corp_tag_list?.service_fee}</Typography>
                                </div>
                                <div className="md:px-5 px-2 rounded-xl mt-1">
                                    <div className="flex justify-between">
                                        <Typography className="text-[14px]">Payment Date</Typography>
                                        <Typography className="md:text-[14px] text-[12px] ">{moment(single?.payment_date).format("DD-MM-YYYY")}</Typography>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            }
        </>
    );
};

export default TagDetails;
