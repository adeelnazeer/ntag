import React, { useState } from "react";
import { Button, Chip, Radio, Typography } from "@material-tailwind/react";
import Img from "../assets/images/IMG (1).png";

const Nametagdetails = () => {
  return (
    <div className="p-4 rounded-xl shadow pb-6 mt-6 ">
      <Typography className="text-[#1F1F2C] text-[26px] font-semibold">
        Welcome Back Name tag services!
      </Typography>
      <Typography className="my-3 font-normal">
        Your Name TAG Details
      </Typography>
      <div className="flex justify-between bg-[#F6F7FB] px-5 py-3 rounded-xl">
        <img className="rounded h-[40px]" src={Img} alt="kfc" />
        <div>
          <Typography className="text-[14px] font-bold bg-secondary py-1 px-4 text-white">
            #532
          </Typography>
        </div>
      </div>
      <div className="flex justify-between  px-5 py-3 rounded-xl mt-1">
        <Typography className="text-[14px]">
          Registered Mobile Number
        </Typography>
        <Typography className="text-[17px] font-bold">0911246534</Typography>
      </div>
      <div className="px-5 py-3 rounded-xl mt-1">
        <div className="flex justify-between">
          <Typography className="text-[14px]">Contact Number</Typography>
          <Typography className="text-[17px] font-bold">0911246533</Typography>
        </div>
      </div>
      <div className="flex justify-between  px-5 py-3 rounded-xl mt-1">
        <Typography className="text-[14px]">Service Monthly Fee</Typography>
        <Typography className="text-[17px] font-bold">1000</Typography>
      </div>
      <div className="flex justify-between  px-5 py-3 rounded-xl mt-1">
        <Typography className="text-[14px]">Expiry Date</Typography>
        <Typography className="text-[17px] font-bold">25-04-2024</Typography>
      </div>
      <div className="flex justify-between  px-5 py-3 rounded-xl mt-1">
        <Typography className="text-[14px]">
          Service Registration Date
        </Typography>
        <Typography className="text-[17px] font-bold">25-04-2024</Typography>
      </div>
      <div className="flex justify-between  px-5 py-3 rounded-xl mt-1">
        <Typography className="text-[14px]">Current Service Status</Typography>
        <Chip className="bg-secondary" value="Active" />
      </div>
      <div className="flex justify-center gap-4 mt-2 ">
        <Button className=" bg-secondary text-white text-[14px] font-normal">
          Unsubscribe
        </Button>
        <Button className=" bg-secondary text-white text-[14px] font-normal">
          Deactivate
        </Button>
      </div>
    </div>
  );
};

export default Nametagdetails;
