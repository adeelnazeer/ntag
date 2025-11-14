import { Button, Card, Chip, Spinner, Typography } from "@material-tailwind/react";
import { FaSearch } from "react-icons/fa";
import { FaRegPlayCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useVoiceMailHook } from "./hooks/useVoiceMailHook";
import moment from "moment";

const Voicemail = () => {
  const getVoiceMail = useVoiceMailHook()
  const TABLE_HEAD = ["#", " Caller No", "Caller Time", "Status", "Action"];

  return (
    <div className="rounded-xl shadow pb-7">
      <Typography className="text-[#1F1F2C] p-3 px-6 border-b text-lg font-bold ">
        Corporate NameTAG
      </Typography>
      <div className=" w-4/5 mx-auto mt-4">
        <div className="flex md:justify-between p-3 px-6  justify-start flex-col-reverse gap-4 md:gap-0 md:flex-row items-center">
          <div className="btn">
            <Button className="bg-[#F6F7FB] border shadow-none font-normal border-[#77777733]  py-2 px-6  text-primary">
              Voice Mail
            </Button>
          </div>

          <div className="flex items-center bg-white rounded-md relative md:w-[220px] w-full">
            <input
              type="text"
              placeholder="Search..."
              className=" border rounded bg-white flex-grow outline-none p-2 "
            />
            <div className="p-2 bg-secondary rounded right-1 absolute">
              <FaSearch className="text-white " />
            </div>
          </div>
        </div>
        {
          getVoiceMail?.loading ?
            <div className=" min-h-44 flex col-span-2 justify-between items-center">
              <Spinner className=" h-12 w-12 mx-auto" color="green" />
            </div>
            :
            <>
              <div className="w-full mt-2   px-6  ">
                <div className="flex justify-between bg-[#F6F7FB] border border-[#77777733] rounded-lg p-2  px-4">
                  <Typography className="text-[16px] ">Total Voice Mail</Typography>
                  <Typography className="font-bold">{getVoiceMail?.voiceMail?.meta?.total || 0}</Typography>
                </div>
                <div className="flex justify-between mt-5 bg-[#F6F7FB] border border-[#77777733] rounded-lg p-2 px-4">
                  <Typography className="text-[16px] ">New Voice mail </Typography>
                  <Typography className="font-bold">{getVoiceMail?.voiceMail?.data?.filter(x => x?.status == 1)?.length}</Typography>
                </div>
              </div>
              <div className="px-6 py-4">
                <Card className="h-full w-full overflow-auto mt-4">
                  <table className="w-full min-w-max table-auto text-left">
                    <thead>
                      <tr>
                        {TABLE_HEAD.map((head) => (
                          <th
                            key={head}
                            className=" bg-secondary p-3 text-white font-bold"
                          >
                            <Typography
                              variant="small"
                              className="font-bold leading-none "
                            >
                              {head}
                            </Typography>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {getVoiceMail?.voiceMail?.data?.length > 0 ? getVoiceMail?.voiceMail?.data?.map(single =>
                        <tr key={single?.id}>
                          <td className="p-5 border-b border-blue-gray-50">
                            <Typography variant="small" color="black" className="font-bold">
                              {single?.id}
                            </Typography>
                          </td>
                          <td className="p-4 border-b border-blue-gray-50">
                            <Typography
                              variant="small"
                              color="black"
                              className="font-normal"
                            >
                              {single?.caller_no}
                            </Typography>
                          </td>
                          <td className="p-4 border-b border-blue-gray-50 ">
                            <Typography
                              variant="small"
                              color="black"
                              className="font-normal bg-[#F6F7FB] w-[94px] text-center"
                            >
                              {moment(single?.created_at).format("DD-MM-YYYY")}<br></br> {moment(single?.created_at).format("hh:mm A")}
                            </Typography>
                          </td>
                          <td className="p-4 border-b border-blue-gray-50">
                            {single?.status == 1 ?
                              <Chip className="w-[74px] bg-secondary py-3 text-center" value="New" />
                              :
                              <Chip className="w-[74px] rounded bg-white border text-black border-secondary py-3 text-center" value="Old" />
                            }

                          </td>
                          <td className="p-4 border-b border-blue-gray-50">
                            <div className="flex gap-3 items-center bg-[#F6F7FB] w-[94px] justify-center p-2">
                              <FaRegPlayCircle className="text-2xl" />
                              <MdDelete className="text-2xl" />
                            </div>
                          </td>
                        </tr>
                      ) :
                        <tr>
                          <td colSpan={5}>
                            <Typography className="my-6 font-normal text-base text-center">
                              Currently no NameTAG is register against your account
                            </Typography>
                          </td>
                        </tr>
                      }

                    </tbody>
                  </table>
                </Card>
              </div>
            </>
        }
      </div>
    </div>
  );
};

export default Voicemail;
