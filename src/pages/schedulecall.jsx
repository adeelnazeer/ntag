/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Spinner,
  Switch,
  Typography,
} from "@material-tailwind/react";
import { LuCalendarClock } from "react-icons/lu";
import useSchedularHook from "./hooks/schedularHook";
import { forwardRef, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { PiXCircleBold } from "react-icons/pi";
import moment from "moment";
import { formatPhoneNumberCustom } from "../utilities/formatMobileNumber";
import { getTagStatusDashboard } from "../utilities/routesConst";

const Schedulecall = () => {
  const {
    buyData,
    loading,
    setData,
    handleSchedular,
    serverStatus,
    incommingCallStatus,
  } = useSchedularHook();

  // Track intended toggle per row (do not mutate server value until API succeeds)
  const [pendingToggle, setPendingToggle] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [dateErrors, setDateErrors] = useState({});
  // Snapshot of server state to compare against for "dirty" check
  const [serverBaseline, setServerBaseline] = useState({}); // { [id]: { enabled, start, end } }

  // ---------- Helpers ----------
  const parseServerDate = (d) => {
    if (!d || (typeof d === "string" && (d.includes("0000-00-00") || d.startsWith("0000")))) return null;
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? null : dt;
  };

  // Treat zero/invalid as null
  const isZeroOrInvalid = (d) =>
    !d ||
    (typeof d === "string" && (d.includes("0000-00-00") || d.startsWith("0000"))) ||
    isNaN(new Date(d).getTime());

  // Convert any input (Date/string/null) to a comparable "minute key"
  const toMinuteKey = (d) => {
    if (!d) return null;
    const dt = d instanceof Date ? d : new Date(d);
    if (isNaN(dt.getTime())) return null;
    return Math.floor(dt.getTime() / 60000);
  };

// Robust dirty check: ignore date changes when both UI and server are OFF
const isRowDirty = (row, idx) => {
  const id = row?.id;
  const baseline = serverBaseline[id] || {
    enabled: String(row?.incoming_call_status) === "1",
    start: parseServerDate(row?.incall_start_dt),
    end: parseServerDate(row?.incall_end_dt),
  };

  const uiEnabled = pendingToggle[id] ?? baseline.enabled;

  // Prefer locally edited values (buyData) if present
  const localRawStart = buyData?.[idx]?.incall_start_dt ?? row?.incall_start_dt ?? null;
  const localRawEnd   = buyData?.[idx]?.incall_end_dt   ?? row?.incall_end_dt   ?? null;

  // Normalize "0000-00-00 ..." to null before comparing
  const localStartKey    = isZeroOrInvalid(localRawStart) ? null : toMinuteKey(localRawStart);
  const localEndKey      = isZeroOrInvalid(localRawEnd)   ? null : toMinuteKey(localRawEnd);
  const baselineStartKey = toMinuteKey(baseline.start);
  const baselineEndKey   = toMinuteKey(baseline.end);

  const toggleChanged = uiEnabled !== baseline.enabled;

  // 👇 Only consider date changes if either side is enabled
  const considerDates = uiEnabled || baseline.enabled;
  const startChanged = considerDates ? (localStartKey !== baselineStartKey) : false;
  const endChanged   = considerDates ? (localEndKey   !== baselineEndKey)   : false;

  return toggleChanged || startChanged || endChanged;
};


  const validateDateRange = (startDate, endDate, index) => {
    const errors = {};
    if (startDate && endDate) {
      if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
        errors[`end_${index}`] = "End date/time cannot be earlier than start date/time";
      } else {
        errors[`end_${index}`] = undefined;
      }
    }
    setDateErrors((prev) => {
      const merged = { ...prev, ...errors };
      if (!merged[`end_${index}`]) delete merged[`end_${index}`];
      return merged;
    });
    return Object.keys(errors).filter((k) => errors[k]).length === 0;
  };

  useEffect(() => {
    if (!Array.isArray(buyData)) return;
    setServerBaseline((prev) => {
      const next = { ...prev };
      buyData.forEach((r) => {
        const id = r?.id;
        if (id == null) return;
        if (!next[id]) {
          next[id] = {
            enabled: String(r?.incoming_call_status) === "1",
            start: parseServerDate(r?.incall_start_dt),
            end: parseServerDate(r?.incall_end_dt),
          };
        }
      });
      return next;
    });
  }, [buyData]);

  const ExampleCustomInput = forwardRef(({ value, onClick, error }, ref) => {
    if (!value) return null;
    const date = new Date(value);
    const timeStr = date
      .toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
      .toUpperCase();
    const dateStr = date.toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric" });

    return (
      <div className="flex flex-col justify-center align-center min-w-[281px]">
        <div className="flex cursor-pointer justify-center items-baseline" onClick={onClick} ref={ref}>
          <Typography className="md:text-[30px] text-[25px] example-custom-input font-medium text-[#646E82] p-2">
            {timeStr} <span className="text-xs ml-2">{dateStr}</span>
          </Typography>
        </div>
        {error && (
          <Typography className="text-xs text-red-500 mt-1 px-2 text-center self-center">{error}</Typography>
        )}
      </div>
    );
  });

  const formatDateTime = (date) => {
    if (!date) return { time: "", date: "" };
    const dateObj = new Date(date);
    return {
      time: dateObj
        .toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
        .toUpperCase(),
      date: dateObj.toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric" }),
    };
  };

  const handleDateChange = (date, type, index) => {
    const newFormValues = [...buyData];
    const currentStartDate = newFormValues[index].incall_start_dt;
    const currentEndDate = newFormValues[index].incall_end_dt;

    if (type === "start") {
      newFormValues[index].incall_start_dt = date;
      validateDateRange(date, currentEndDate, index);
    } else {
      newFormValues[index].incall_end_dt = date;
      validateDateRange(currentStartDate, date, index);
    }
    setData(newFormValues);

    if (selectedIndex === index && selectedSchedule) {
      setSelectedSchedule((prev) => ({
        ...prev,
        incall_start_dt: newFormValues[index].incall_start_dt,
        incall_end_dt: newFormValues[index].incall_end_dt,
      }));
    }
  };

  const getDateTime = (dateStr, isStartDate = true) => {
    const invalid =
      !dateStr || (typeof dateStr === "string" && (dateStr.includes("0000-00-00") || dateStr.startsWith("0000")));
    if (invalid) {
      const now = new Date();
      now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15);
      now.setSeconds(0);
      now.setMilliseconds(0);
      if (!isStartDate) now.setHours(now.getHours() + 2);
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
    <div className="grid rounded-xl bg-white shadow grid-cols-1 gap-x-6 gap-y-6 pb-6">
      {/* Confirm Dialog */}
      <Dialog open={showConfirm} handler={() => setShowConfirm(false)} size="sm">
        <DialogHeader className="flex justify-between">
          <Typography variant="h6">Confirm Incoming Call Schedule?</Typography>
          <IconButton variant="text" onClick={() => setShowConfirm(false)}>
            <PiXCircleBold className="h-6 w-6" />
          </IconButton>
        </DialogHeader>
        <DialogBody divider>
          <Typography className="text-[14px]">
            {pendingToggle[selectedSchedule?.id]
              ? (() => {
                  const start = formatDateTime(selectedSchedule?.incall_start_dt);
                  const end = formatDateTime(selectedSchedule?.incall_end_dt);
                  return (
                    <>
                      Are you sure you want to <b>enable</b> incoming call scheduling from {start.time} {start.date} to{" "}
                      {end.time} {end.date}?
                    </>
                  );
                })()
              : selectedSchedule?.incoming_call_status
              ? "Are you sure you want to turn off incoming call scheduling?"
              : "Are you sure you want to turn off incoming call scheduling?"}
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button className="bg-white text-[#757575] border border-secondary py-2 px-6 sm:px-6" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button
            className="bg-secondary py-2 px-6 text-white sm:px-6"
            onClick={() => {
              if (!selectedSchedule) return;
              const serverEnabled = String(selectedSchedule?.incoming_call_status) === "1";
              const intendedEnabled = pendingToggle[selectedSchedule.id] ?? serverEnabled;
              const row = buyData?.[selectedIndex] ?? selectedSchedule;

              handleSchedular({
                ...selectedSchedule,
                incoming_call_status: intendedEnabled ? 1 : 0,
                incall_start_dt: row?.incall_start_dt,
                incall_end_dt: row?.incall_end_dt,
              });

              setPendingToggle((prev) => {
                const copy = { ...prev };
                delete copy[selectedSchedule.id];
                return copy;
              });

              // Snapshot newly applied state so row becomes "not dirty"
              setServerBaseline((prev) => ({
                ...prev,
                [selectedSchedule.id]: {
                  enabled: intendedEnabled,
                  start: row?.incall_start_dt ? new Date(row.incall_start_dt) : null,
                  end: row?.incall_end_dt ? new Date(row.incall_end_dt) : null,
                },
              }));

              setShowConfirm(false);
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>

      <Typography className="text-[#1F1F2C] p-3 px-6 border-b text-lg font-bold">Manage Incoming Call</Typography>

      {loading ? (
        <div className="min-h-44 flex col-span-2 justify-between items-center">
          <Spinner className="h-12 w-12 mx-auto" color="green" />
        </div>
      ) : (
        <>
          {buyData?.length > 0 ? (
            buyData.map((single, index) => {
              const serverEnabled = String(single?.incoming_call_status) === "1";

              // Only these allow action
              const isActive = [1, 4].includes(Number(single?.status));

              const uiEnabled =
                pendingToggle[single?.id] ??
                (serverBaseline[single?.id]?.enabled ?? serverEnabled);

              const rawStart = buyData[index]?.incall_start_dt ?? single?.incall_start_dt;
              const rawEnd = buyData[index]?.incall_end_dt ?? single?.incall_end_dt;
              const hasValidDates = !isZeroOrInvalid(rawStart) && !isZeroOrInvalid(rawEnd);

              const rowDirty = isRowDirty(single, index);

              const isApplyDisabled =
                !isActive ||                  // blocked by status
                !rowDirty ||                  // enable ONLY when something changed
                !!dateErrors[`end_${index}`] ||
                (uiEnabled && !hasValidDates); // turning ON requires real dates

              return (
                <div key={single?.id}>
                  <div className="container px-6 max-w-full text-[#737791]">
                    <div className="md:p-6 p-4 border-[#77777733] rounded-2xl border bg-[#F6F7FB]shadow pb-6 mt-1">
                      <Typography className="text-sm font-extrabold mb-4">NameTAG: {index + 1}</Typography>

                      <div className="flex gap-8 pb-4 w-full">
                        <div className="flex gap-1 flex-col p-3 rounded-lg shadow border border-[#8080801f]">
                          <Typography className="font-medium md:text-[14px] text-[12px]">NameTAG:</Typography>
                          <Typography className="md:text-[14px] text-[12px]">#{single?.name_tag}</Typography>
                        </div>
                        <div className="flex gap-1 flex-col p-3 rounded-lg shadow border border-[#8080801f]">
                          <Typography className="font-medium md:text-[14px] text-[12px]">TAG Number:</Typography>
                          <Typography className="md:text-[14px] text-[12px] ">#{single?.tag_no}</Typography>
                        </div>
                        <div className="flex gap-1 flex-col p-3 border border-[#8080801f] rounded-lg shadow">
                          <Typography className="md:text-[14px] text-[12px] font-medium">Mobile Number:</Typography>
                          <Typography className="md:text-[14px] text-[12px] ">{formatPhoneNumberCustom(single?.msisdn)}</Typography>
                        </div>
                        <div className="flex gap-1 flex-col p-3 border border-[#8080801f] rounded-lg shadow">
                          <Typography className="md:text-[14px] text-[12px] font-medium">Service Status:</Typography>
                          <Typography className="md:text-[14px] text-[12px] ">{getTagStatusDashboard(single?.status)}</Typography>
                        </div>
                      </div>

                      {/* Reflect ONLY server value */}
                      <Typography className="mt-5 md:text-[14px] text-[12px]">
                        Current Incoming Call Scheduling= <span className="font-semibold">{serverEnabled ? "ON" : "OFF"}</span>
                      </Typography>

                      <Typography className="mt-5 md:text-[14px] text-[12px]">
                        If incoming call scheduling is OFF you will receive incoming calls 24/7
                      </Typography>

                      {serverEnabled ? (
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
                      ) : null}

                      <div className="flex justify-between mt-6 gap-7">
                        <div className="flex gap-4 flex-1">
                          <div className="flex gap-2 items-center">
                            <LuCalendarClock className="text-secondary text-xl" />
                            <Typography className="md:text-[14px] text-[12px] font-medium">
                              Schedule Incoming Calls
                            </Typography>
                          </div>

                          {/* Switch: drives ONLY local pending state */}
                          <Switch
                            className="checked:bg-secondary"
                            checked={uiEnabled}
                            disabled={!isActive}
                            onChange={(e) => {
                              const next = e.target.checked;

                              // remember intent for this row
                              setPendingToggle((prev) => ({ ...prev, [single.id]: next }));

                              // init default dates if enabling and empty
                              if (next && (isZeroOrInvalid(single?.incall_start_dt) || isZeroOrInvalid(single?.incall_end_dt))) {
                                const now = new Date();
                                const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                                const newFormValues = [...buyData];
                                newFormValues[index].incall_start_dt = now;
                                newFormValues[index].incall_end_dt = twoHoursLater;
                                setData(newFormValues);
                              }

                              setSelectedSchedule({
                                ...single,
                                incall_start_dt: buyData[index]?.incall_start_dt ?? single?.incall_start_dt,
                                incall_end_dt: buyData[index]?.incall_end_dt ?? single?.incall_end_dt,
                              });
                              setSelectedIndex(index);
                            }}
                          />
                        </div>
                      </div>

                      {/* Show pickers when UI toggle is ON */}
                      {uiEnabled ? (
                        <div className="flex md:flex-row flex-col mt-5 gap-2">
                          <div>
                            <Typography className="md:text-[14px] text-[12px] text-[#898F9A] font-normal">FROM</Typography>
                            <div className="clock rounded-xl bg-[#F5F5F5] pr-9 p-3">
                              <div className="flex justify-between gap-4">
                                <DatePicker
                                  selected={getDateTime(buyData[index]?.incall_start_dt, true)}
                                  onChange={(date) => handleDateChange(date, "start", index)}
                                  showTimeSelect
                                  timeIntervals={1}
                                  timeCaption="Time"
                                  dateFormat="h:mm aa d MMMM yyyy"
                                  minDate={new Date()}
                                  filterTime={filterPassedTime}
                                  customInput={<ExampleCustomInput error={dateErrors[`start_${index}`]} />}
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <Typography className="md:text-[14px] text-[12px] text-[#898F9A] font-normal">TO</Typography>
                            <div className="clock rounded-xl bg-[#F5F5F5] pr-9 p-3">
                              <div className="flex justify-between gap-4">
                                <DatePicker
                                  selected={getDateTime(buyData[index]?.incall_end_dt, false)}
                                  onChange={(date) => handleDateChange(date, "end", index)}
                                  showTimeSelect
                                  dateFormat="h:mm aa d MMMM yyyy"
                                  minDate={
                                    buyData[index]?.incall_start_dt ? new Date(buyData[index]?.incall_start_dt) : new Date()
                                  }
                                  timeIntervals={1}
                                  timeCaption="Time"
                                  filterTime={(time) => filterPassedTime(time, buyData[index]?.incall_start_dt)}
                                  customInput={<ExampleCustomInput error={dateErrors[`end_${index}`]} />}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {uiEnabled &&
                        !isZeroOrInvalid(single?.incall_start_dt) &&
                        !isZeroOrInvalid(single?.incall_end_dt) && (
                          <Typography className="mt-5 md:text-[14px] text-[12px]">
                            Your Service will be {serverEnabled ? "activated" : "inactive"} from{" "}
                            <>
                              <span className="text-[#646E82] font-medium">
                                {moment(single.incall_start_dt).format("hh:mm A D MMM YYYY")}
                              </span>
                              <span> to </span>
                              <span className="text-[#646E82] font-medium">
                                {moment(single.incall_end_dt).format("hh:mm A D MMM YYYY")}
                              </span>
                            </>
                          </Typography>
                        )}

                      <div className="flex gap-4 mt-5">
                        <Button
                          className="bg-secondary text-white px-6 min-w-32 text-[14px] py-2 font-normal"
                          size="small"
                          disabled={isApplyDisabled}
                          onClick={() => {
                            setSelectedSchedule({
                              ...single,
                              incall_start_dt: buyData[index]?.incall_start_dt ?? single?.incall_start_dt,
                              incall_end_dt: buyData[index]?.incall_end_dt ?? single?.incall_end_dt,
                            });
                            setSelectedIndex(index);
                            setShowConfirm(true);
                          }}
                        >
                          Apply Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center mb-10">Currently no NameTAG is register against your account</div>
          )}
        </>
      )}
    </div>
  );
};

export default Schedulecall;
