import { Button, Checkbox, Typography } from "@material-tailwind/react";
import Img from "../assets/images/wallet (2).png";
import { useLocation, useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";

import { useForm } from "react-hook-form";

const TagDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stateData = location.state;
  const docStatus = JSON.parse(localStorage.getItem('data'))

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const taxAmount = (Number(stateData.tag_price) * Number(stateData.service_fee)) / 100;
  const totalAfterTax = (Number(stateData.tag_price) + taxAmount).toFixed(0);
  const onSubmit = (data) => {
    let payLoad = {
      ...stateData,
      totalPrice: totalAfterTax,
      terms: data.term,
    }
    navigate(ConstentRoutes.processPayment, { state: payLoad })
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-4 rounded-xl shadow mt-6">
        <Typography className="text-[#1F1F2C] pb-3 px-6 border-b text-lg font-bold ">
          {docStatus?.doc_approval_status == 0 ? "Reserve" : "Buy"} Name TAG
        </Typography>
        <div className="flex justify-between mt-3 border bg-[#F6F7FB] border-[#77777733] px-5 py-3 rounded-xl">
          <Typography className="text-[14px]">Name Tag</Typography>
          <Typography className="text-[14px] ">
            {stateData.tag_name}
          </Typography>
        </div>
        <div className="flex justify-between border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
          <Typography className="text-[14px]">Name TAG Number</Typography>
          <Typography className="text-[14px] ">
            #{stateData.tag_no}
          </Typography>
        </div>
        <div className=" border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
          <div className="flex justify-between">
            <Typography className="text-[14px]">Name TAG Price</Typography>
            <Typography className="text-[14px] ">
              #{stateData.tag_price}
            </Typography>
          </div>
          <div className="flex justify-between mt-3">
            <Typography className="text-[14px]">Tax</Typography>
            <Typography className="text-[17px] ">
              {stateData?.service_fee}
            </Typography>
          </div>
          <div className="flex justify-between mt-3 border-t py-2">
            <Typography className="text-[14px]">Total Price</Typography>
            <Typography className="text-[17px] ">{totalAfterTax}</Typography>
          </div>
        </div>
        <div className="flex items-center justify-between border border-[#77777733] bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
          <Typography className="text-[14px]">Payment Method</Typography>
          <div className="flex items-center px-2 py-1 border rounded-lg border-[#88C140] gap-2">
            <img src={Img} alt="abc" />
            <Typography className="text-[14px] font-bold">
              Mobile Wallet
            </Typography>
          </div>
        </div>
        <div className=" px-5 py-3 rounded-xl mt-3 text-[#555]">
          <Typography className="font-normal text-sm">
            Term of Services
          </Typography>
          <div className=" flex items-start">
            <span>*</span>{" "}
            <Checkbox
              {...register("term", {
                required: true,
              })}
              style={
                errors.term
                  ? { border: "1px solid red" }
                  : { border: "1px solid #8A8AA033" }
              }
            />
            <Typography className="text-sm cursor-pointer  leading-[40px] ">
              <span className="text-[#5B6AB0] hover:underline"
                onClick={() => {
                  navigate(ConstentRoutes.termofuse)
                }}
              >Term & Conditions </span>
            </Typography>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <Button
            className=" bg-secondary text-white text-[14px] w-[400px]"
            type="submit"
          // onClick={() => navigate(ConstentRoutes.processPayment)}
          >
            {docStatus?.doc_approval_status == 0 ? "Reserve" : "Purchase"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TagDetails;
