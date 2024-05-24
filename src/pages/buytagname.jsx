import { Button, Typography } from "@material-tailwind/react";
import React from "react";

const TagNames = () => {
  return (
    <div className="p-4">
      <div className="mt-4">
        <Typography className="text-[#1F1F2C] text-[26px] font-bold">
          Welcome Back Name tag services!
        </Typography>
        <Typography className="mt-4 font-normal text-[26px]">
          Currently no name Tag is register against your account
        </Typography>
        <Button className="mt-32 bg-secondary text-white text-[14px] w-[400px]">BUY Name TAG</Button>
      </div>
    </div>
  );
};

export default TagNames;
