import { Button, Radio, Typography } from "@material-tailwind/react";
import Img from "../assets/images/wallet (2).png";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
const TagDetails = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4 rounded-xl shadow mt-6">
      <div className="flex justify-between bg-[#F6F7FB] px-5 py-3 rounded-xl">
        <Typography className="text-[14px]">Name Tag</Typography>
        <Typography className="text-[17px] font-bold">#KFC</Typography>
      </div>
      <div className="flex justify-between bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
        <Typography className="text-[14px]">Name TAG Number</Typography>
        <Typography className="text-[17px] font-bold">#782</Typography>
      </div>
      <div className=" bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
        <div className="flex justify-between">
          <Typography className="text-[14px]">Name TAG Price</Typography>
          <Typography className="text-[17px] font-bold">5000</Typography>
        </div>
        <div className="flex justify-between mt-3">
          <Typography className="text-[14px]">Tax</Typography>
          <Typography className="text-[17px] font-bold">100</Typography>
        </div>
        <div className="flex justify-between mt-3 border-t py-2">
          <Typography className="text-[14px]">Total Price</Typography>
          <Typography className="text-[17px] font-bold">100</Typography>
        </div>
      </div>
      <div className="flex justify-between bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
        <Typography className="text-[14px]">Payment Method</Typography>
        <div className="flex gap-2">
          <img src={Img} alt="abc" />
          <Typography className="text-[17px] font-bold">
            Mobile Wallet
          </Typography>
        </div>
      </div>
      <div className="bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3 text-[#555]">
        <Typography className="font-normal text-sm">
          Term of Services
        </Typography>
        <div className=" flex items-start">
          <span>*</span> <Radio />
          <Typography className="text-xs leading-[40px] ">
            I hereby confirm that the information above including information
            provided at the time of registration of this telecom cloud account,
            is complete, truthful and accurate, and will promptly provide
            telecom cloud with writen notice of any updates there to. I consent
            to the collection, use storage and disclosure of this information
            for the purposes of risk control and compliance with{" "}
          </Typography>
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <Button
          className=" bg-secondary text-white text-[14px] w-[400px]"
          onClick={() => navigate(ConstentRoutes.processPayment)}
        >
          Purchase
        </Button>
      </div>
    </div>
  );
};

export default TagDetails;
