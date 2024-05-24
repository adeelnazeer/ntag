import { Button, Switch, Typography } from "@material-tailwind/react";
import { LuCalendarClock } from "react-icons/lu";

const Schedulecall = () => {
  return (
    <div className="flex justify-center">
      <div className="container max-w-[800px]">
        <div className="p-4 rounded-xl shadow pb-6 mt-6 ">
          <Typography className="my-3 font-semibold">
            Schedule Incoming Call
          </Typography>
          <div className="flex justify-between mt-5">
            <div className="flex gap-2 items-center">
              <LuCalendarClock className="text-secondary text-xl" />
              <Typography className="text-sm font-semibold">
                Schedule Service Is Active
              </Typography>
            </div>
            <Switch className="checked:bg-secondary" />
          </div>
          <div className="flex justify-between mt-5">
            <div className="clock mt-5 rounded-xl bg-[#F5F5F5] p-3">
              <Typography className="text-[14px] text-[#898F9A] font-normal">
                FROM
              </Typography>
              <div className="flex justify-between  w-[300px]">
                <Typography className="text-[41px] text-[#646E82]">
                  9:00 <span className="text-xs ml-[-10px] ">AM</span>
                </Typography>
                <Switch className="checked:bg-secondary" />
              </div>
            </div>
            <div className="clock mt-5 rounded-xl bg-[#F5F5F5] p-3">
              <Typography className="text-[14px] text-[#898F9A] font-normal">
                TO
              </Typography>
              <div className="flex justify-between  w-[300px]">
                <Typography className="text-[41px] text-[#646E82]">
                  5:00 <span className="text-xs ml-[-10px] ">PM</span>
                </Typography>
                <Switch className="checked:bg-secondary" />
              </div>
            </div>
          </div>
          <Typography className="mt-5 ">
            Your Service will be activated from 09:00 am to 05:00 pm
          </Typography>
          <div className="flex justify-center gap-4 mt-5">
            <Button className=" bg-secondary text-white text-[14px] font-normal">
              Apply
            </Button>
            <Button
              className="border-secondary  text-[14px] font-normal"
              variant="outlined"
            >
              Cancel
            </Button>
          </div>
        </div>
        <div className="p-4 rounded-xl shadow pb-6 mt-6 ">
          <div className="flex justify-between">
            <Typography className="text-sm font-semibold">Voice Mail</Typography>
            <Switch className="checked:bg-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedulecall;
