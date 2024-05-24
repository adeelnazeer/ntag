import { Button, Typography } from "@material-tailwind/react";
import { FaSearch } from "react-icons/fa";
import Img from "../assets/images/IMG.png";
import Img1 from "../assets/images/IMG (1).png";
import Img2 from "../assets/images/IMG (2).png";
import Img3 from "../assets/images/IMG (3).png";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";

const Dashboardtable = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4 rounded-xl shadow pb-7">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Button className="py-[8px] px-[24px] bg-secondary text-white font-normal ">
            3-Digit
          </Button>
          <Button
            className="py-[8px] px-[24px] border-dashed border-[#47A432] text-[#1F1F2C] font-normal "
            variant="outlined"
          >
            4-Digit
          </Button>
          <Button
            className="py-[8px] px-[24px] border-dashed border-[#47A432] font-normal"
            variant="outlined"
          >
            5-Digit
          </Button>
          <Button
            className="py-[8px] px-[24px] border-dashed border-[#47A432] font-normal"
            variant="outlined"
          >
            More
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
      <div className="flex justify-between p-2 border rounded-xl mt-12 items-center">
        <div className="flex gap-8 items-center">
          <div>
            <img className="rounded" src={Img} alt="north" />
          </div>
          <Typography>The North Face</Typography>
          <Typography className="bg-[#EBEBEB] px-5 py-1">#111</Typography>
          <div>
            <p className="text-[#7A798A] text-[13px]">Current Price</p>
            <p className="text-secondary text-[18px] font-bold">
              50,000 <span className="text-[#7A798A] text-[13px]">+Tax</span>
            </p>
          </div>
        </div>
        <div className="">
          <Button className="bg-[#fecdcd]  py-2 px-6 text-[#FC4242]">
            Already Booked
          </Button>
        </div>
      </div>
      <div className="flex justify-between p-2 border rounded-xl mt-12 items-center mt-3">
        <div className="flex gap-8 items-center">
          <div>
            <img className="rounded" src={Img1} alt="north" />
          </div>
          <Typography className="w-[109px]">KFC</Typography>
          <Typography className="bg-[#EBEBEB] px-5 py-1">#111</Typography>
          <div>
            <p className="text-[#7A798A] text-[13px]">Current Price</p>
            <p className="text-secondary text-[18px] font-bold">
              50,000 <span className="text-[#7A798A] text-[13px]">+Tax</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="bg-[#edf6eb]  py-2 px-6 text-secondary">
            Available
          </Button>
          <Button
            className="bg-secondary  py-2 px-6 text-white"
            onClick={() => navigate(ConstentRoutes.tagDetail)}
          >
            Buy Now
          </Button>
        </div>
      </div>
      <div className="flex justify-between p-2 border rounded-xl mt-12 items-center mt-3">
        <div className="flex gap-8 items-center">
          <div>
            <img className="rounded" src={Img2} alt="north" />
          </div>
          <Typography className="w-[109px]">Coca Cola</Typography>
          <Typography className="bg-[#EBEBEB] px-5 py-1">#111</Typography>
          <div>
            <p className="text-[#7A798A] text-[13px]">Current Price</p>
            <p className="text-secondary text-[18px] font-bold">
              50,000 <span className="text-[#7A798A] text-[13px]">+Tax</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="bg-[#edf6eb]  py-2 px-6 text-secondary">
            Available
          </Button>
          <Button
            className="bg-secondary  py-2 px-6 text-white"
            onClick={() => navigate(ConstentRoutes.tagDetail)}
          >
            Buy Now
          </Button>
        </div>
      </div>
      <div className="flex justify-between p-2 border rounded-xl mt-12 items-center mt-3">
        <div className="flex gap-8 items-center">
          <div>
            <img className="rounded" src={Img3} alt="north" />
          </div>
          <Typography className="w-[109px]">KFC</Typography>
          <Typography className="bg-[#EBEBEB] px-5 py-1">#111</Typography>
          <div>
            <p className="text-[#7A798A] text-[13px]">Current Price</p>
            <p className="text-secondary text-[18px] font-bold">
              50,000 <span className="text-[#7A798A] text-[13px]">+Tax</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="bg-[#edf6eb]  py-2 px-6 text-secondary">
            Available
          </Button>
          <Button
            className="bg-secondary  py-2 px-6 text-white"
            onClick={() => navigate(ConstentRoutes.tagDetail)}
          >
            Buy Now
          </Button>
        </div>
      </div>
      <div className="flex justify-center gap-8 mt-4">
        <p>1</p>
        <p className="text-secondary">
          <u>2</u>
        </p>
        <p>3</p>
        <p>4</p>
      </div>
    </div>
  );
};

export default Dashboardtable;
