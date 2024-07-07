import { Button, Card, Chip, Typography } from "@material-tailwind/react";
import { FaSearch } from "react-icons/fa";
import { FaRegPlayCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
import { useVoiceMailHook } from "./hooks/useVoiceMailHook";
import { useEffect } from "react";

const Voicemail = () => {
  const getVoiceMail=useVoiceMailHook()
  const TABLE_HEAD = ["#", " Caller No", "Caller Time", "Status", "Action"];
  const navigate = useNavigate();
  useEffect(()=>{
getVoiceMail.handleGetVoiceMail()
  },[])
  console.log(getVoiceMail.voiceMail,"voive")
  return (
    <div className="p-4 rounded-xl shadow pb-7">
      <div className="flex justify-between items-center">
        <div className="btn">
          <Button className="bg-secondary  py-2 px-6 text-white">
            Voice Mail
          </Button>
        </div>

        <div className="flex items-center bg-white rounded-md relative">
          <input
            type="text"
            placeholder="Search..."
            className="text-white border rounded bg-white flex-grow outline-none p-2"
          />
          <div className="p-2 bg-secondary rounded right-1 absolute">
            <FaSearch className="text-white " />
          </div>
        </div>
      </div>
      <div className="max-w-[300px] mt-6  ">
        <div className="flex justify-between bg-[#F6F7FB] p-2">
          <Typography className="text-[16px] ">Total Voice Mail</Typography>
          <Typography className="font-bold">500</Typography>
        </div>
        <div className="flex justify-between bg-[#F6F7FB] mt-5 p-2">
          <Typography className="text-[16px] ">New Voice mail </Typography>
          <Typography className="font-bold">100</Typography>
        </div>
      </div>
      <Card className="h-full w-full overflow-auto mt-4">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className=" bg-secondary p-6 text-white font-bold"
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
            <tr>
              <td className="p-5 border-b border-blue-gray-50">
                <Typography variant="small" color="black" className="font-bold">
                  1
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                  variant="small"
                  color="black"
                  className="font-normal"
                >
                  09123446754
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50 ">
                <Typography
                  variant="small"
                  color="black"
                  className="font-normal bg-[#F6F7FB] w-[94px] text-center"
                >
                  05-08-2024<br></br> 10:30 AM
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Chip className="w-[74px] bg-secondary py-3" value="New" />
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <div className="flex gap-3 items-center bg-[#F6F7FB] w-[94px] justify-center p-2">
                  <FaRegPlayCircle className="text-2xl" />
                  <MdDelete className="text-2xl" />
                </div>
              </td>
            </tr>
            <tr>
              <td className="p-5 border-b border-blue-gray-50">
                <Typography variant="small" color="black" className="font-bold">
                  2
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                  variant="small"
                  color="black"
                  className="font-normal"
                >
                  09123446754
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50 ">
                <Typography
                  variant="small"
                  color="black"
                  className="font-normal bg-[#F6F7FB] w-[94px] text-center"
                >
                  05-08-2024<br></br> 10:30 AM
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Chip className="w-[74px] bg-secondary py-3 text-center" value="New" />
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <div className="flex gap-3 items-center bg-[#F6F7FB] w-[94px] justify-center p-2">
                  <FaRegPlayCircle className="text-2xl" />
                  <MdDelete className="text-2xl" />
                </div>
              </td>
            </tr>
            <tr>
              <td className="p-5 border-b border-blue-gray-50">
                <Typography variant="small" color="black" className="font-bold">
                  3
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                  variant="small"
                  color="black"
                  className="font-normal"
                >
                  09123446754
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50 ">
                <Typography
                  variant="small"
                  color="black"
                  className="font-normal bg-[#F6F7FB] w-[94px] text-center"
                >
                  05-08-2024<br></br> 10:30 AM
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Chip className="w-[74px] rounded bg-white border text-black border-secondary py-3" value="Old" />
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <div className="flex gap-3 items-center bg-[#F6F7FB] w-[94px] justify-center p-2">
                  <FaRegPlayCircle className="text-2xl" />
                  <MdDelete className="text-2xl" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Voicemail;
