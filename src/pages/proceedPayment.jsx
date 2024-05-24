import { Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import Img from "../assets/images/wallet (2).png";
import Paymentsuccessful from "../modals/paymentsuccessful";

const ProceedPayment = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="p-4 rounded-xl shadow pb-6 mt-6">
      <div className="flex justify-between bg-[#F6F7FB] px-5 py-3 rounded-xl">
        <Typography className="text-[14px]">Name Tag</Typography>
        <Typography className="text-[17px] font-bold">#KFC</Typography>
      </div>
      <div className="flex justify-between bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
        <Typography className="text-[14px]">TAG Price</Typography>
        <Typography className="text-[17px] font-bold">5000</Typography>
      </div>
      <div className=" bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
        <div className="flex justify-between">
          <Typography className="text-[14px]">
            Please Enter your Mobile{" "}
          </Typography>
          <Typography className="text-[17px] font-bold">
            Mobile Number
          </Typography>
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

      <div className="flex justify-center mt-2">
        <Button
          className=" bg-secondary text-white text-[14px] w-[400px]"
          onClick={() => setIsOpen(true)}
        >
          Proceed Payment
        </Button>
      </div>
      {isOpen && <Paymentsuccessful isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  );
};

export default ProceedPayment;
