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
    <div className=" grid rounded-xl shadow grid-cols-1 gap-x-6 gap-y-6 pb-6">
      <Typography className="text-[#1F1F2C] p-3 px-6 border-b text-lg font-bold ">
        Corporate Name TAG
      </Typography>
      {loading ?
        <div className=" min-h-44 flex col-span-2 justify-between items-center">
          <Spinner className=" h-12 w-12 mx-auto" color="green" />
        </div>
        :
        <>
          {data?.length > 0 ? data?.map((single, index) =>
            <div key={single?.id}>
              <div className="container px-6 max-w-full">
                <div className="md:p-6 p-4 border-[#77777733] rounded-2xl border bg-[#F6F7FB]shadow pb-6 mt-1 ">
                  <div className="flex gap-8 pb-4 w-4/6">
                    <div className="flex gap-4 p-3 rounded-lg shadow border border-[#8080801f]">
                      <Typography className=" font-semibold md:text-[14px] text-[12px]">
                        Tag Number:
                      </Typography>
                      <Typography className=" md:text-[14px] text-[12px] font-semibold">
                        #{single?.tag_no}
                      </Typography>
                    </div>
                    <div className=" flex gap-4  p-3 border border-[#8080801f] rounded-lg shadow">
                      <Typography className=" md:text-[14px] text-[12px] font-semibold">
                        Mobile Number:
                      </Typography>
                      <Typography className=" md:text-[14px] text-[12px] font-semibold">
                        {single?.msisdn}
                      </Typography>
                    </div>
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
                        checked={single?.service}
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
                  <div className="flex  gap-4 mt-5">
                    <Button
                      className="border-secondary text-[14px] px-6 min-w-32 font-normal py-2"
                      variant="outlined"
                      size="small"
                    >
                      Cancel
                    </Button>
                    <Button className=" bg-secondary text-white px-6 min-w-32 text-[14px] py-2 font-normal"
                      disabled={!single?.incall_start_dt || !single?.incall_start_dt}
                      size="small"
                      onClick={() => {
                        handleSchedular(single)
                      }}
                    >
                      Apply
                    </Button>

                  </div>
                </div>
              </div>
            </div>
          ) : <div className="text-center mb-10">Currently no name Tag is register against your account
          </div>}
        </>
      }
    </div>
  );
};

export default Schedulecall;
