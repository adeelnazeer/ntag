/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { Button, Spinner, Switch, Typography } from "@material-tailwind/react";
import { LuCalendarClock } from "react-icons/lu";
import useSchedularHook from "./hooks/schedularHook";
import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

const Schedulecall = () => {
  const { data, loading, setData, handleSchedular } = useSchedularHook()
  const [selected, setSelected] = useState("")

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <Typography className="md:text-[30px] text-[25px] example-custom-input text-[#646E82]" onClick={onClick} ref={ref}>
      {value?.split(" ")?.[0] || "00:00"} <span className="text-xs  ml-2 "> {value?.split(" ")?.[1]}</span>
    </Typography>

  ));

  return (
    <div className=" grid grid-cols-1 gap-x-6 gap-y-10 mt-4">
      {loading ?
        <div className=" min-h-44 flex col-span-2 justify-between items-center">
          <Spinner className=" h-12 w-12 mx-auto" color="green" />
        </div>
        :
        <>
          {data?.length > 0 ? data?.map((single, index) =>
            <div key={single?.id}>

              <div className="container max-w-full">
                <div className="md:p-4 p-2 rounded-xl shadow pb-6 mt-1 ">
                  <div className="flex gap-8 justify-between p-4 w-4/6 rounded-lg border bg-[#F0F0F8] shadow-md ">
                    <Typography className=" font-medium md:text-[14px] text-[12px]">
                      Tag Number
                    </Typography>
                    <Typography className=" md:text-[14px] text-[12px] font-medium">
                      #{single?.tag_no}
                    </Typography>
                    <Typography className=" md:text-[14px] text-[12px] font-medium">
                      Mobile Number
                    </Typography>
                    <Typography className=" md:text-[14px] text-[12px] font-medium">
                      {single?.msisdn}
                    </Typography>
                  </div>
                  <div className="flex justify-between mt-6 gap-7 ">
                    <div className="flex justify-between flex-1">
                      <div className="flex gap-2 items-center">
                        <LuCalendarClock className="text-secondary text-xl" />
                        <Typography className="md:text-[14px] text-[12px] font-semibold">
                          Schedule Service Is Active
                        </Typography>
                      </div>
                      <Switch className="checked:bg-secondary"
                        checked={single?.incoming_call_status}
                        onChange={(e) => {
                          const newFormValues = [...data]
                          newFormValues[index]['incoming_call_status'] = e?.target?.checked
                          setData(newFormValues)
                          setSelected(selected == single?.id ? "" : single?.id)
                        }}
                      />
                    </div>
                    <div className="flex justify-around flex-1">
                      <div className="flex gap-2 items-center">
                        <Typography className="md:text-[14px] text-[12px]   font-medium">
                          Voice mail
                        </Typography>
                      </div>
                      <Switch className="checked:bg-secondary"
                        checked={single?.voic_email}
                        onChange={(e) => {
                          const newFormValues = [...data]
                          newFormValues[index]['voic_email'] = e?.target?.checked
                          setData(newFormValues)
                          setSelected(selected == single?.id ? "" : single?.id)
                        }}
                      />
                    </div>
                    <div className="flex justify-around flex-1">
                      <div className="flex gap-2 items-center">
                        <Typography className="md:text-[14px] text-[12px]   font-medium">
                          Service ON/OFF
                        </Typography>
                      </div>
                      <Switch className="checked:bg-secondary"
                        checked={single?.servic}
                        onChange={(e) => {
                          const newFormValues = [...data]
                          newFormValues[index]['service'] = e?.target?.checked
                          setData(newFormValues)
                          setSelected(selected == single?.id ? "" : single?.id)
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex md:flex-row flex-col mt-5 gap-2">
                    <div>
                      <Typography className="md:text-[14px] text-[12px] text-[#898F9A] font-normal">
                        FROM
                      </Typography>
                      <div className="clock rounded-xl bg-[#F5F5F5] pr-9 p-3">
                        <div className="flex justify-between gap-4">
                          <DatePicker
                            selected={single?.incall_start_dt && new Date(single?.incall_start_dt)}
                            onChange={(date) => {
                              const newFormValues = [...data]
                              newFormValues[index]['incall_start_dt'] = date
                              setData(newFormValues)
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            customInput={<ExampleCustomInput />}
                          />
                          {/* <Typography className="text-[41px] text-[#646E82]">
                      9:00 <span className="text-xs ml-[-10px] ">AM</span>
                    </Typography> */}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Typography className="md:text-[14px] text-[12px] text-[#898F9A] font-normal">
                        TO
                      </Typography>
                      <div className="clock rounded-xl bg-[#F5F5F5] pr-9 p-3">

                        <div className="flex justify-between gap-4">
                          <DatePicker
                            selected={single?.incall_end_dt && new Date(single?.incall_end_dt)}
                            onChange={(date) => {
                              const newFormValues = [...data]
                              newFormValues[index]['incall_end_dt'] = date
                              setData(newFormValues)
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            customInput={<ExampleCustomInput />}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Typography className="mt-5 md:text-[14px] text-[12px]">
                    Your Service will be activated from {single?.incall_start_dt && moment(single?.incall_start_dt).format("hh:mm A") || "00:00"}  to {single?.incall_end_dt && moment(single?.incall_end_dt).format("hh:mm A") || "00:00"}
                  </Typography>

                  {single?.incoming_call_status == true &&
                    <div className="flex justify-center gap-4 mt-5">
                      <Button className=" bg-secondary text-white text-[14px] font-normal"
                        disabled={!single?.incall_start_dt || !single?.incall_start_dt}
                        onClick={() => {
                          handleSchedular(single)
                        }}
                      >
                        Apply
                      </Button>
                      <Button
                        className="border-secondary  text-[14px] font-normal"
                        variant="outlined"
                      >
                        Cancel
                      </Button>
                    </div>
                  }
                </div>
              </div>
            </div>
          ) : <div className="text-center">Currently no name Tag is register against your account
          </div>}
        </>
      }
    </div>
  );
};

export default Schedulecall;
