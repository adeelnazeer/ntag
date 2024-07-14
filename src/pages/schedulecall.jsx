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
    <Typography className="text-[41px] example-custom-input text-[#646E82]" onClick={onClick} ref={ref}>
      {value?.split(" ")?.[0] || "00:00"} <span className="text-xs ml-[-10px] ">{value?.split(" ")?.[1]}</span>
    </Typography>

  ));

  return (
    <div className=" grid grid-cols-2 gap-x-6 gap-y-10 mt-4">
      {loading ?
        <div className=" min-h-44 flex col-span-2 justify-between items-center">
          <Spinner className=" h-12 w-12 mx-auto" color="green" />
        </div>
        :
        <>
          {data?.map((single, index) =>
            <div key={single?.id}>
              <div className="flex justify-between">
                <Typography className=" font-semibold">
                  Schedule Incoming Call
                </Typography>
                <Typography className=" text-[14px] font-semibold">
                  #{single?.tag_no}
                </Typography>
                <Typography className=" text-[14px] font-semibold">
                  {single?.msisdn}
                </Typography>
              </div>
              <div className="container max-w-[800px]">
                <div className="p-4 rounded-xl shadow pb-6 mt-1 ">
                  <div className="flex justify-between ">
                    <div className="flex gap-2 items-center">
                      <LuCalendarClock className="text-secondary text-xl" />
                      <Typography className="text-sm font-semibold">
                        Schedule Service Is Active
                      </Typography>
                    </div>
                    <Switch className="checked:bg-secondary"
                      checked={single?.incoming_call_status || selected == single?.id}
                      onChange={(e) => {
                        const newFormValues = [...data]
                        newFormValues[index]['incoming_call_status'] = e?.target?.checked
                        setData(newFormValues)
                        setSelected(selected == single?.id ? "" : single?.id)
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-5 gap-2">
                    <div className="clock rounded-xl bg-[#F5F5F5] p-3 w-full">
                      <Typography className="text-[14px] text-[#898F9A] font-normal">
                        FROM
                      </Typography>
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
                    <div className="clock rounded-xl bg-[#F5F5F5] p-3 w-full">
                      <Typography className="text-[14px] text-[#898F9A] font-normal">
                        TO
                      </Typography>
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
                  <Typography className="mt-5 ">
                    Your Service will be activated from {single?.incall_start_dt && moment(single?.incall_start_dt).format("hh:mm A") || "00:00"}  to {single?.incall_end_dt && moment(single?.incall_end_dt).format("hh:mm A") || "00:00"}
                  </Typography>
                  <div className="p-4 rounded-xl shadow pb-6 mt-6 ">
                    <div className="flex justify-between">
                      <Typography className="text-sm font-semibold">Voice Mail</Typography>
                      <Switch className="checked:bg-secondary"
                        checked={single?.voic_email}
                        onChange={(date) => {
                          const newFormValues = [...data]
                          newFormValues[index]['voic_email'] = date
                          setData(newFormValues)
                        }}
                      />
                    </div>
                  </div>
                  {selected == single?.id &&
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
          )}
        </>
      }
    </div>
  );
};

export default Schedulecall;
