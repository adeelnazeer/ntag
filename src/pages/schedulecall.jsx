/* eslint-disable react/prop-types */
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Spinner, Switch, Typography } from "@material-tailwind/react";
import { LuCalendarClock } from "react-icons/lu";
import useSchedularHook from "./hooks/schedularHook";
import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import { PiXCircleBold } from "react-icons/pi";
import moment from "moment";
import { formatPhoneNumberCustom } from "../utilities/formatMobileNumber";
import { getTagStatusDashboard } from "../utilities/routesConst";

const Schedulecall = () => {
  const { buyData, loading, setData, handleSchedular, serverStatus, incommingCallStatus } = useSchedularHook();
  const [selected, setSelected] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [dateErrors, setDateErrors] = useState({});

  const validateDateRange = (startDate, endDate, index) => {
    const errors = {};

    if (startDate && endDate) {
      if (startDate > endDate) {
        errors[`end_${index}`] = "End date/time cannot be earlier than start date/time";
      }
    }

    setDateErrors(prev => ({
      ...prev,
      ...errors
    }));

    return Object.keys(errors).length === 0;
  };

  const ExampleCustomInput = forwardRef(({ value, onClick, error }, ref) => {
    if (!value) return null;
    const date = new Date(value);
    const timeStr = date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toUpperCase();

    const dateStr = date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return (
      <div className="flex flex-col justify-center align-center min-w-[281px]">
        <div
          className={`flex cursor-pointer justify-center items-baseline  `}
          onClick={onClick}
          ref={ref}
        >
          <Typography className="md:text-[30px] text-[25px] example-custom-input  font-medium text-[#646E82]  p-2">
            {timeStr}   <span className="text-xs ml-2">  {dateStr}</span>

          </Typography>

        </div>
        {error && (
          <Typography className="text-xs text-red-500 mt-1 px-2  text-center self-center">
            {error}
          </Typography>
        )}
      </div>
    );
  });

  const formatDateTime = (date) => {
    if (!date) return { time: "", date: "" };
    const dateObj = new Date(date);

    return {
      time: dateObj.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).toUpperCase(),
      date: dateObj.toLocaleString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };
  };

  const handleDateChange = (date, type, index) => {
    const newFormValues = [...buyData];
    const currentStartDate = newFormValues[index].incall_start_dt;
    const currentEndDate = newFormValues[index].incall_end_dt;

    if (type === 'start') {
      newFormValues[index].incall_start_dt = date;
      validateDateRange(date, currentEndDate, index);
    } else {
      newFormValues[index].incall_end_dt = date;
      validateDateRange(currentStartDate, date, index);
    }

    setData(newFormValues);
  };
  const getDateTime = (dateStr, isStartDate = true) => {
    const isInvalidDate = !dateStr ||
      (typeof dateStr === 'string' && (
        dateStr.includes("0000-00-00") ||
        dateStr.startsWith("0000")
      ));

    if (isInvalidDate) {
      const now = new Date();
      now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15);
      now.setSeconds(0);
      now.setMilliseconds(0);

      if (!isStartDate) {
        now.setHours(now.getHours() + 2);
      }
      return now;
    }

    const date = new Date(dateStr);
    return !isNaN(date) ? date : null;
  };

  const filterPassedTime = (time, startDate = null) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    if (!startDate) {
      if (
        selectedDate.getDate() === currentDate.getDate() &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear()
      ) {
        return currentDate.getTime() < selectedDate.getTime();
      }
      return true;
    }
    const start = new Date(startDate);
    if (
      selectedDate.getDate() === start.getDate() &&
      selectedDate.getMonth() === start.getMonth() &&
      selectedDate.getFullYear() === start.getFullYear()
    ) {
      return start.getTime() < selectedDate.getTime();
    }
    return true;
  };

  return (
    <div className="grid rounded-xl  bg-white shadow grid-cols-1 gap-x-6 gap-y-6 pb-6">
      <Dialog open={showConfirm} handler={() => setShowConfirm(false)} size="sm">
        <DialogHeader className="flex justify-between">
          <Typography variant="h6">Confirm Incoming Call Schedule?</Typography>
          <IconButton variant="text" onClick={() => setShowConfirm(false)}>
            <PiXCircleBold className="h-6 w-6" />
          </IconButton>
        </DialogHeader>
        <DialogBody divider>
          <Typography className="text-[14px]">
            Are you sure you want to {selectedSchedule?.incoming_call_status ? 'activate' : 'deactivate'} incoming calls
            {selectedSchedule?.incoming_call_status && selectedSchedule?.incall_start_dt ?
              (() => {
                const start = formatDateTime(selectedSchedule?.incall_start_dt);
                const end = formatDateTime(selectedSchedule?.incall_end_dt);
                return ` from ${start.time} ${start.date} to ${end.time} ${end.date}`;
              })() :
              ''}?
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            className="bg-white text-[#757575] border border-secondary py-2 px-6 sm:px-6"
            onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button
            className="bg-secondary py-2 px-6 text-white sm:px-6"

            onClick={() => {
              handleSchedular(selectedSchedule);
              setShowConfirm(false);
            }}>
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>

      <Typography className="text-[#1F1F2C] p-3 px-6 border-b text-lg font-bold">
        Manage Corporate NameTAG Service
      </Typography>

      {loading ? (
        <div className="min-h-44 flex col-span-2 justify-between items-center">
          <Spinner className="h-12 w-12 mx-auto" color="green" />
        </div>
      ) : (
        <>
          {buyData?.length > 0 ? buyData?.map((single, index) => {

            return (
              <div key={single?.id}>
                <div className="container px-6 max-w-full text-[#737791]">
                  <div className="md:p-6 p-4 border-[#77777733] rounded-2xl border bg-[#F6F7FB]shadow pb-6 mt-1">
                    <Typography className="text-sm font-extrabold  mb-4">NameTAG: {index + 1} </Typography>

                    <div className="flex gap-8 pb-4 w-full">
                      <div className="flex gap-4 p-3 rounded-lg shadow border border-[#8080801f]">
                        <Typography className="font-medium md:text-[14px] text-[12px]">
                          NameTAG:
                        </Typography>
                        <Typography className="md:text-[14px] text-[12px] font-medium">
                          #{single?.name_tag}
                        </Typography>
                      </div>
                      <div className="flex gap-4 p-3 rounded-lg shadow border border-[#8080801f]">
                        <Typography className="font-medium md:text-[14px] text-[12px]">
                          TAG Number:
                        </Typography>
                        <Typography className="md:text-[14px] text-[12px] font-medium">
                          #{single?.tag_no}
                        </Typography>
                      </div>
                      <div className="flex gap-4 p-3 border border-[#8080801f] rounded-lg shadow">
                        <Typography className="md:text-[14px] text-[12px] font-medium">
                          Mobile Number:
                        </Typography>
                        <Typography className="md:text-[14px] text-[12px] font-medium">
                          {formatPhoneNumberCustom(single?.msisdn)}
                        </Typography>
                      </div>
                        <div className="flex gap-4 p-3 border border-[#8080801f] rounded-lg shadow">
                        <Typography className="md:text-[14px] text-[12px] font-medium">
                         Service Status:
                        </Typography>
                        <Typography className="md:text-[14px] text-[12px] font-medium">
                          {getTagStatusDashboard(single?.status)}
                        </Typography>
                      </div>
                    </div>
                    <Typography className="mt-5 md:text-[14px] text-[12px]">
                      Current Incoming Call Scheduling= <span className="font-semibold">{single.incoming_call_status == "1" ? "ON" : "OFF"}</span>
                    </Typography>

                    <Typography className="mt-5 md:text-[14px] text-[12px]">
                      If incoming call scheduling is OFF you will receive incoming calls 24/7
                    </Typography>

                    {single.incoming_call_status == "1" ? (
                      <Typography className="mt-5 md:text-[14px] text-[12px]">
                        Current Incoming Calls Schedule=
                        <span className="font-semibold">
                          {(() => {
                            const start = formatDateTime(single?.incall_start_dt);
                            const end = formatDateTime(single?.incall_end_dt);
                            return (
                              <>
                                <span className="text-[#646E82]">{start.time}</span>
                                <span className="text-[#737791]"> on {start.date}</span>
                                <span> to </span>
                                <span className="text-[#646E82]">{end.time}</span>
                                <span className="text-[#737791]"> on {end.date}</span>
                              </>
                            );
                          })()}
                        </span>
                      </Typography>
                    ) : <></>}
                    <div className="flex justify-between mt-6 gap-7">
                      {/* <div className="flex justify-around flex-1">
                      <div className="flex gap-2 items-center">
                        <Typography className="md:text-[14px] text-[12px]   font-medium">
                          Voice mail
                        </Typography>
                      </div>
                      <Switch className="checked:bg-secondary"
                        checked={single?.voic_email}
                        onChange={(e) => {
                          const newFormValues = [...buyData]
                          newFormValues[index]['voic_email'] = e?.target?.checked
                          setData(newFormValues)
                          setSelected(selected == single?.id ? "" : single?.id)
                        }}
                      />
                    </div> */}
                      {/* <div className="flex gap-6 flex-1">
                      <div className="flex gap-2 items-center">
                        <Typography className="md:text-[14px] text-[12px]   font-medium">
                          Service ON/OFF
                        </Typography>
                      </div>
                      <Switch className="checked:bg-secondary"
                        checked={single?.service_status}
                        onChange={(e) => {
                          const newFormValues = [...buyData]
                          newFormValues[index]['service_status'] = e?.target?.checked
                          setData(newFormValues)
                          if (e.target?.checked == false) {
                            newFormValues[index]['incoming_call_status'] = e?.target?.checked
                          }
                          setSelected(selected == single?.id ? "" : single?.id)
                        }}
                      />
                    </div> */}
                      <div className="flex gap-4 flex-1">
                        <div className="flex gap-2 items-center">
                          <LuCalendarClock className="text-secondary text-xl" />
                          <Typography className="md:text-[14px] text-[12px] font-medium">
                            Schedule Incoming Calls
                          </Typography>
                        </div>
                        <Switch
                          className="checked:bg-secondary"
                          checked={single?.incoming_call_status}
                          disabled={single?.status != 1}
                          onChange={(e) => {
                            const newFormValues = [...buyData];
                            newFormValues[index]['incoming_call_status'] = e?.target?.checked;

                            if (e?.target?.checked) {
                              if (!newFormValues[index]['incall_start_dt']) {
                                const now = new Date();
                                const twoHoursLater = new Date(now.getTime() + (2 * 60 * 60 * 1000));

                                newFormValues[index]['incall_start_dt'] = now;
                                newFormValues[index]['incall_end_dt'] = twoHoursLater;
                              }
                            } else {
                              newFormValues[index]['incall_start_dt'] = null;
                              newFormValues[index]['incall_end_dt'] = null;
                              setDateErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors[`start_${index}`];
                                delete newErrors[`end_${index}`];
                                return newErrors;
                              });
                            }

                            setData(newFormValues);
                            setSelected(selected == single?.id ? "" : single?.id);
                          }}
                        />
                      </div>
                    </div>
                    {single?.incoming_call_status ? (<div className="flex md:flex-row flex-col mt-5 gap-2">
                      <div>
                        <Typography className="md:text-[14px] text-[12px] text-[#898F9A] font-normal">
                          FROM
                        </Typography>
                        <div className="clock rounded-xl bg-[#F5F5F5] pr-9 p-3">
                          <div className="flex justify-between gap-4">
                            <DatePicker
                              selected={getDateTime(single?.incall_start_dt, true)}
                              onChange={(date) => handleDateChange(date, 'start', index)}
                              showTimeSelect
                              timeIntervals={15}
                              timeCaption="Time"
                              dateFormat="h:mm aa d MMMM yyyy"
                              minDate={new Date()}
                              filterTime={filterPassedTime}
                              customInput={
                                <ExampleCustomInput
                                  error={dateErrors[`start_${index}`]}
                                />
                              }
                            />
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
                              selected={getDateTime(single?.incall_end_dt, true)}
                              onChange={(date) => handleDateChange(date, 'end', index)}
                              showTimeSelect
                              dateFormat="h:mm aa d MMMM yyyy"
                              minDate={single?.incall_start_dt ? new Date(single?.incall_start_dt) : new Date()}
                              timeIntervals={15}
                              timeCaption="Time"
                              filterTime={(time) => filterPassedTime(time, single?.incall_start_dt)}
                              customInput={
                                <ExampleCustomInput
                                  error={dateErrors[`end_${index}`]}
                                />
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>) : <></>
                    }

                    {(single.incoming_call_status && single?.incall_start_dt != "0000-00-00 00:00:00" && single?.incall_end_dt != "0000-00-00 00:00:00") ? (
                      <Typography className="mt-5 md:text-[14px] text-[12px]">
                        Your Service will be {single?.incoming_call_status ? "activated" : "inactive"} from{" "}
                        {
                          <>
                            <span className="text-[#646E82] font-medium">
                              {moment(single.incall_start_dt).format("hh:mm A D MMM YYYY")}
                            </span>
                            <span> to </span>
                            <span className="text-[#646E82] font-medium">
                              {moment(single.incall_end_dt).format("hh:mm A D MMM YYYY")}
                            </span>
                          </>
                        }
                      </Typography>
                    ) : <></>}
                    <div className="flex gap-4 mt-5">
                      <Button
                        className="bg-secondary text-white px-6 min-w-32 text-[14px] py-2 font-normal"
                        size="small"
                        disabled={single?.status != 1}
                        onClick={() => {
                          setSelectedSchedule(single);
                          setShowConfirm(true);
                        }}
                      >
                        Apply Schedule
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }) : (
            <div className="text-center mb-10">
              Currently no NameTAG is register against your account
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Schedulecall;