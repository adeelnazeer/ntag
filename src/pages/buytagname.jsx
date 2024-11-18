import { Button, Chip, Spinner, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes, getStatus, getTagStatus } from "../utilities/routesConst";
import useSchedularHook from "./hooks/schedularHook";
import Img from "../assets/images/wallet (2).png";
import moment from "moment";

const TagNames = () => {
  const navigate = useNavigate();
  const { data, loading } = useSchedularHook("tagname")
  const docStatus = JSON.parse(localStorage.getItem('data'))

  return (
    <div className=" shadow bg-white rounded-xl">
      <Typography className="text-[#1F1F2C] p-3 px-6 border-b text-lg font-bold ">
        Corporate Name TAG
      </Typography>
      <div className="p-8">
        <Typography className="text-[#1F1F2C] text-lg font-bold text-center">
          Welcome To Name tag services!
        </Typography>
        {loading ?
          <div className=" min-h-44 flex col-span-2 justify-between items-center">
            <Spinner className=" h-12 w-12 mx-auto" color="green" />
          </div>
          :
          <>
            {data?.length == 0 &&
              <Typography className="mt-2 font-normal text-base text-center">
                Currently no name Tag is register against your account
              </Typography>
            }
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              {data?.map(single =>
                <div className="md:p-4 p-1 rounded-xl shadow pb-6 md:mt-6 mt-2" key={single?.id}>
                  <>
                    <div className="flex justify-between bg-[#F6F7FB] md:px-3 px-2 py-3 rounded-xl items-center">
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
                    <div className="flex justify-between text-[#232323]  md:px-5 px-2 py-3 rounded-xl mt-1">
                      <Typography className="md:text-[14px] text-[12px]">
                        Registered Mobile Number
                      </Typography>
                      <Typography className="md:text-[14px] text-[12px] ">{single?.msisdn}</Typography>
                    </div>
                    {/* <div className="flex justify-between text-[#232323]  md:px-5 px-2 py-3 rounded-xl mt-1">
                      <Typography className="md:text-[14px] text-[12px]">
                        Contact Number
                      </Typography>
                      <Typography className="md:text-[14px] text-[12px] ">{docStatus?.contact_no}</Typography>
                    </div> */}
                    <div className="flex justify-between  md:px-5 px-2 py-3 rounded-xl mt-1">
                      <Typography className="text-[14px]">Service Monthly Fee</Typography>
                      <Typography className="md:text-[14px] text-[12px] ">Birr. {single?.corp_tag_list?.service_fee}</Typography>
                    </div>
                    <div className="flex justify-between  md:px-5 px-2 py-3 rounded-xl mt-1">
                      <Typography className="text-[14px]">Tag Price</Typography>
                      <Typography className="md:text-[14px] text-[12px] ">Birr. {single?.corp_tag_list?.tag_price}</Typography>
                    </div>
                    <div className="md:px-5 px-2 py-3 rounded-xl mt-1">
                      <div className="flex justify-between">
                        <Typography className="text-[14px]">Registration Date</Typography>
                        <Typography className="md:text-[14px] text-[12px] ">{moment(single?.corp_tag_list?.created_date).format("DD-MM-YYYY")}</Typography>
                      </div>
                    </div>

                    <div className="flex justify-between  md:px-5 px-2 py-3 rounded-xl mt-1">
                      <Typography className="text-[14px]">Expiry Date</Typography>
                      <Typography className="md:text-[14px] text-[12px] ">{moment(single?.expiry_date).add(1, 'year').format("DD-MM-YYYY")}</Typography>
                    </div>
                    <div className="flex justify-between  gap-1 md:px-5 px-2 py-3 rounded-xl mt-1">
                      <Typography className="text-[14px]">Service Status</Typography>
                      <Chip className="bg-secondary capitalize whitespace-normal" value={getTagStatus(single?.status)} />
                    </div>

                    {docStatus?.doc_approval_status == 1 &&
                      <div className="flex justify-center w-3/5 mx-auto gap-4 mt-2 ">
                        <Button
                          className="mt-4 bg-secondary text-white text-[14px] w-full"
                          onClick={() => navigate(ConstentRoutes.tagDetail, { state: single?.corp_tag_list })}
                        >
                          {"BUY Name TAG"}
                        </Button>
                      </div>
                    }
                  </>
                </div>
              )}
            </div>
            {data?.length == 0 &&
              <div className="text-center">
                <Button
                  className="mt-8 bg-secondary text-white text-[14px] md:w-[400px] w-full"
                  onClick={() => navigate(ConstentRoutes.buyTag)}
                >
                  {docStatus?.doc_approval_status == 0 ? "Reserve  Name TAG " : "BUY Name TAG"}
                </Button>
              </div>
            }
          </>
        }
      </div>
    </div>
  );
};

export default TagNames;
