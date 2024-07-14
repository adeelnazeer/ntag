import { Button, Chip, Spinner, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
import useSchedularHook from "./hooks/schedularHook";
import Img from "../assets/images/wallet (2).png";
import moment from "moment";

const TagNames = () => {
  const navigate = useNavigate();
  const { data, loading } = useSchedularHook()
  const docStatus = JSON.parse(localStorage.getItem('data'))
  
  return (
    <div className="p-4">
      <div className="mt-4">
        <Typography className="text-[#1F1F2C] text-[26px] font-bold">
          Welcome Back Name tag services!
        </Typography>
        {loading ?
          <div className=" min-h-44 flex col-span-2 justify-between items-center">
            <Spinner className=" h-12 w-12 mx-auto" color="green" />
          </div>
          :
          <>
            {data?.length == 0 &&
              <Typography className="mt-4 font-normal text-[26px]">
                Currently no name Tag is register against your account
              </Typography>
            }
            <div className="grid grid-cols-2 gap-4">
              {data?.map(single =>
                <div className="p-4 rounded-xl shadow pb-6 mt-6 " key={single?.id}>
                  <>
                    <div className="flex justify-between bg-[#F6F7FB] px-5 py-3 rounded-xl">
                      <img className="rounded h-[40px]" src={Img} alt="kfc" />
                      <div>
                        <Typography className="text-[14px] font-bold bg-secondary py-1 px-4 text-white">
                          #{single?.tag_no}
                        </Typography>
                      </div>
                    </div>
                    <div className="flex justify-between  px-5 py-3 rounded-xl mt-1">
                      <Typography className="text-[14px]">
                        Registered Mobile Number
                      </Typography>
                      <Typography className="text-[17px] font-bold">{single?.msisdn}</Typography>
                    </div>
                    <div className="px-5 py-3 rounded-xl mt-1">
                      <div className="flex justify-between">
                        <Typography className="text-[14px]">Contact Number</Typography>
                        <Typography className="text-[17px] font-bold">{single?.msisdn}</Typography>
                      </div>
                    </div>
                    <div className="flex justify-between  px-5 py-3 rounded-xl mt-1">
                      <Typography className="text-[14px]">Service Monthly Fee</Typography>
                      <Typography className="text-[17px] font-bold">{single?.service_fee}</Typography>
                    </div>
                    <div className="flex justify-between  px-5 py-3 rounded-xl mt-1">
                      <Typography className="text-[14px]">Expiry Date</Typography>
                      <Typography className="text-[17px] font-bold">{moment(single?.expiry_date).format("DD-MM-YYYY")}</Typography>
                    </div>
                    <div className="flex justify-between  px-5 py-3 rounded-xl mt-1">
                      <Typography className="text-[14px]">
                        Service Registration Date
                      </Typography>
                      <Typography className="text-[17px] font-bold">{moment(single?.created_date).format('DD-MM-YYYY')}</Typography>
                    </div>
                    <div className="flex justify-between  px-5 py-3 rounded-xl mt-1">
                      <Typography className="text-[14px]">Current Service Status</Typography>
                      <Chip className="bg-secondary" value={single?.status} />
                    </div>
                    {/* <div className="flex justify-center gap-4 mt-2 ">
                <Button className=" bg-secondary text-white text-[14px] font-normal">
                  Unsubscribe
                </Button>
                <Button className=" bg-secondary text-white text-[14px] font-normal">
                  Deactivate
                </Button>
              </div> */}
                  </>
                </div>
              )}
            </div>
            <div className="text-center">
              <Button
                className="mt-8 bg-secondary text-white text-[14px] w-[400px]"
                onClick={() => navigate(ConstentRoutes.dashboard)}
              >
                {docStatus?.doc_approval_status == 0 ? "Reserve  Name TAG " : "BUY Name TAG"}
              </Button>
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default TagNames;
