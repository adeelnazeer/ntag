import { Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import Img from "../assets/images/wallet (2).png";
import Paymentsuccessful from "../modals/paymentsuccessful";
import { useLocation } from "react-router-dom";
import { Input } from "@headlessui/react";
import { useTagList } from "../pages/hooks/useDashboard";
import { useForm } from "react-hook-form";
const ProceedPayment = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const dashboard = useTagList();
  const location = useLocation();
  const state = location.state;
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = (data) => {
  let payLoad={
    ...state,
    data
  }
    dashboard.handleTagDetails(data);
    setIsOpen(true);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-4 rounded-xl shadow pb-6 mt-6">
        <div className="flex justify-between bg-[#F6F7FB] px-5 py-3 rounded-xl">
          <Typography className="text-[14px]">Name Tag</Typography>
          <Typography className="text-[17px] font-bold">{state.tag_name}</Typography>
        </div>
        <div className="flex justify-between bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
          <Typography className="text-[14px]">TAG Price</Typography>
          <Typography className="text-[17px] font-bold">{state.totalPrice}</Typography>
        </div>
        <div className=" bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
          <div className="flex justify-between">
            <Typography className="text-[14px]">
              Please Enter your Mobile{" "}
            </Typography>
            <Input
              className="mt-2 w-[25%] rounded-xl px-4 py-2 bg-white outline-none "
              placeholder="Mobile Number"
              {...register("mobile_no", {
                required: true,
              })}
              style={
                errors.term
                  ? { border: "1px solid red" }
                  : { border: "1px solid #8A8AA033" }
              }
            />
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
          <Button className=" bg-secondary text-white text-[14px] w-[400px]"
          type="submit"
          >
            Proceed Payment
          </Button>
        </div>
        {isOpen && <Paymentsuccessful isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>
    </form>
  );
};

export default ProceedPayment;
