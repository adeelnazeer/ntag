import { useMemo, useState } from "react";
import { Button } from "@material-tailwind/react";
import {
  FaCalendarDays,
  FaCircleCheck,
  FaCircleInfo,
  FaClock,
  FaFloppyDisk,
  FaListUl,
  FaPenToSquare,
  FaRepeat,
  FaUsers,
  FaXmark,
} from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const REPEAT_TYPES = ["once", "daily", "weekly", "monthly", "alwaysOn"];
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MOCK_SUMMARY = {
  brandName: "MIDROC",
  brandTier: "Gold Tier",
  brandStatus: "Active",
  primaryMobile: "+251 967 837 872",
  activeCallers: 3,
};

const MOCK_ACTIVE_SCHEDULE = {
  startDate: "27-06-2024, 08:00 AM",
  endDate: "31-12-2026, 06:00 PM",
  repeat: "Weekly",
  activeDays: "Mon, Tue, Wed, Thu, Fri",
  callersAffected: 3,
  windowStartHour: 8,
  windowEndHour: 18,
};

const MOCK_HISTORY = [
  {
    id: 1,
    start: "27-06-2024, 08:00 AM",
    end: "31-12-2026, 06:00 PM",
    repeat: "Weekly",
    days: "Mon–Fri",
    setBy: "Admin User",
    status: "active",
  },
  {
    id: 2,
    start: "01-01-2024, 09:00 AM",
    end: "30-06-2024, 05:00 PM",
    repeat: "Weekly",
    days: "Mon–Fri",
    setBy: "Admin User",
    status: "completed",
  },
  {
    id: 3,
    start: "15-08-2023, 08:00 AM",
    end: "31-12-2023, 06:00 PM",
    repeat: "Daily",
    days: "All days",
    setBy: "Admin User",
    status: "completed",
  },
  {
    id: 4,
    start: "01-06-2023, 10:00 AM",
    end: "30-06-2023, 04:00 PM",
    repeat: "Once",
    days: "—",
    setBy: "Admin User",
    status: "completed",
  },
  {
    id: 5,
    start: "01-01-2023, 08:00 AM",
    end: "31-03-2023, 06:00 PM",
    repeat: "Monthly",
    days: "1st of month",
    setBy: "Admin User",
    status: "completed",
  },
];

const ScheduleTimeline = ({ startHour, endHour }) => {
  const markers = [0, 6, 12, 18, 24];
  const left = (startHour / 24) * 100;
  const width = ((endHour - startHour) / 24) * 100;

  return (
    <div className="mt-4 rounded-xl border border-brand-green/20 bg-brand-mint-softer px-4 py-4">
      <div className="relative h-3 rounded-full bg-[#E5E7EB]">
        <div
          className="absolute top-0 h-3 rounded-full bg-secondary"
          style={{ left: `${left}%`, width: `${width}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-medium text-[#9CA3AF] sm:text-xs">
        {markers.map((hour) => (
          <span key={hour}>
            {hour === 0 || hour === 24 ? "12 AM" : hour === 12 ? "12 PM" : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
          </span>
        ))}
      </div>
    </div>
  );
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 border-b border-[#EEF2E8] py-3 last:border-b-0">
    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-green-pale text-secondary">
      <Icon className="h-4 w-4" aria-hidden />
    </span>
    <div>
      <p className="text-xs font-medium text-[#9CA3AF]">{label}</p>
      <p className="text-sm font-semibold text-[#1F2937]">{value}</p>
    </div>
  </div>
);

export default function BrandNameSchedulePage() {
  const { t } = useTranslation(["brandName"]);
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [repeatType, setRepeatType] = useState("weekly");
  const [selectedDays, setSelectedDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [startDateTime, setStartDateTime] = useState("2024-06-27T08:00");
  const [endDateTime, setEndDateTime] = useState("2026-12-31T18:00");

  const previewText = useMemo(() => {
    const daysLabel =
      repeatType === "alwaysOn"
        ? t("brandName:schedule.preview.allDays")
        : selectedDays.length > 0
          ? selectedDays.join(", ")
          : t("brandName:schedule.preview.noDays");

    return t("brandName:schedule.preview.message", {
      brand: MOCK_SUMMARY.brandName,
      repeat: t(`brandName:schedule.repeat.${repeatType}`),
      days: daysLabel,
    });
  }, [repeatType, selectedDays, t]);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]
    );
  };

  const handleClear = () => {
    setRepeatType("weekly");
    setSelectedDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
    setStartDateTime("2024-06-27T08:00");
    setEndDateTime("2026-12-31T18:00");
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-brand-green/25 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
            {t("brandName:schedule.summary.brandName")}
          </p>
          <p className="mt-1 text-xl font-extrabold text-secondary">{MOCK_SUMMARY.brandName}</p>
          <p className="mt-1 text-xs text-[#6B7280]">
            {MOCK_SUMMARY.brandTier} · {MOCK_SUMMARY.brandStatus}
          </p>
        </div>

        <div className="rounded-xl border border-brand-green/25 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
            {t("brandName:schedule.summary.primaryMobile")}
          </p>
          <p className="mt-1 text-lg font-bold text-[#1F2937]">{MOCK_SUMMARY.primaryMobile}</p>
          <p className="mt-1 text-xs text-[#6B7280]">
            {t("brandName:schedule.summary.registeredAccount")}
          </p>
        </div>

        <div className="rounded-xl border border-brand-green/25 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
            {t("brandName:schedule.summary.activeCallers")}
          </p>
          <p className="mt-1 text-xl font-extrabold text-secondary">{MOCK_SUMMARY.activeCallers}</p>
          <p className="mt-1 text-xs text-[#6B7280]">
            {t("brandName:schedule.summary.linkedActive")}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-brand-blue-soft bg-brand-blue-tint px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <FaCircleInfo className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" aria-hidden />
          <div>
            <h2 className="text-sm font-bold text-brand-blue sm:text-base">
              {t("brandName:schedule.howItWorks.title")}
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-relaxed text-brand-blue-text-muted">
              <li>{t("brandName:schedule.howItWorks.point1")}</li>
              <li>{t("brandName:schedule.howItWorks.point2")}</li>
              <li>{t("brandName:schedule.howItWorks.point3")}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-brand-green/25 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-brand-green/15 bg-brand-green-pale px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-white">
              <FaCalendarDays className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-sm font-bold text-brand-blue sm:text-base">
                {t("brandName:schedule.currentStatus.title")}
              </h2>
              <p className="mt-1 text-xs text-[#6B7280] sm:text-sm">
                {scheduleEnabled
                  ? t("brandName:schedule.currentStatus.onDescription")
                  : t("brandName:schedule.currentStatus.offDescription")}
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={scheduleEnabled}
            onClick={() => setScheduleEnabled((prev) => !prev)}
            className={`relative h-8 w-14 shrink-0 rounded-full transition ${
              scheduleEnabled ? "bg-secondary" : "bg-[#D1D5DB]"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                scheduleEnabled ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </section>

      {scheduleEnabled ? (
        <section className="overflow-hidden rounded-xl border border-brand-green/25 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-brand-green/15 bg-brand-green-pale px-4 py-3">
            <div className="flex items-center gap-2">
              <FaCircleCheck className="h-4 w-4 text-secondary" aria-hidden />
              <h2 className="text-sm font-bold text-brand-blue sm:text-base">
                {t("brandName:schedule.active.title")}
              </h2>
            </div>
            <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-brand-green-dark">
              {t("brandName:schedule.active.runningNow")}
            </span>
          </div>

          <div className="px-4 py-2 sm:px-5">
            <DetailRow
              icon={FaCalendarDays}
              label={t("brandName:schedule.active.startDateTime")}
              value={MOCK_ACTIVE_SCHEDULE.startDate}
            />
            <DetailRow
              icon={FaCalendarDays}
              label={t("brandName:schedule.active.endDateTime")}
              value={MOCK_ACTIVE_SCHEDULE.endDate}
            />
         
            <DetailRow
              icon={FaUsers}
              label={t("brandName:schedule.active.callersAffected")}
              value={t("brandName:schedule.active.callersCount", {
                count: MOCK_ACTIVE_SCHEDULE.callersAffected,
              })}
            />
          </div>

          <div className="px-4 pb-4 sm:px-5">
            <ScheduleTimeline
              startHour={MOCK_ACTIVE_SCHEDULE.windowStartHour}
              endHour={MOCK_ACTIVE_SCHEDULE.windowEndHour}
            />
          </div>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-xl border border-brand-green/25 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-brand-green/15 bg-brand-green-pale px-4 py-3">
          <FaPenToSquare className="h-4 w-4 text-secondary" aria-hidden />
          <h2 className="text-sm font-bold text-brand-blue sm:text-base">
            {t("brandName:schedule.form.title")}
          </h2>
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          {/* <div>
            <p className="mb-2 text-sm font-semibold text-[#374151]">
              {t("brandName:schedule.form.repeatType")}
            </p>
            <div className="flex flex-wrap gap-2">
              {REPEAT_TYPES.map((type) => {
                const active = repeatType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRepeatType(type)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-secondary text-white shadow-sm"
                        : "border border-[#E5E7EB] bg-white text-[#6B7280] hover:border-secondary/40"
                    }`}
                  >
                    {t(`brandName:schedule.repeat.${type}`)}
                  </button>
                );
              })}
            </div>
          </div> */}

          {/* {repeatType !== "once" && repeatType !== "alwaysOn" ? (
            <div>
              <p className="mb-2 text-sm font-semibold text-[#374151]">
                {t("brandName:schedule.form.activeDays")}
              </p>
              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS.map((day) => {
                  const active = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`grid h-10 w-10 place-items-center rounded-full text-xs font-bold transition ${
                        active
                          ? "bg-secondary text-white"
                          : "border border-[#E5E7EB] bg-white text-[#6B7280] hover:border-secondary/40"
                      }`}
                    >
                      {day.slice(0, 1)}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null} */}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#374151]">
                {t("brandName:schedule.form.startDateTime")}
              </label>
              <p className="mb-2 text-xs text-[#9CA3AF]">
                {t("brandName:schedule.form.startHint")}
              </p>
              <div className="relative">
                <FaCalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="datetime-local"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  className="w-full rounded-lg border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-3 text-sm text-[#1F2937] outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#374151]">
                {t("brandName:schedule.form.endDateTime")}
              </label>
              <p className="mb-2 text-xs text-[#9CA3AF]">
                {t("brandName:schedule.form.endHint")}
              </p>
              <div className="relative">
                <FaCalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="datetime-local"
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                  className="w-full rounded-lg border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-3 text-sm text-[#1F2937] outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <div className="flex items-start gap-2">
              <FaCalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
              <div>
                <p className="text-sm font-bold text-amber-900">
                  {t("brandName:schedule.preview.title")}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-amber-950">{previewText}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 bg-secondary py-3 text-sm font-semibold normal-case text-white shadow-none hover:bg-brand-green-dark hover:shadow-none"
            >
              <FaFloppyDisk className="h-4 w-4" aria-hidden />
              {t("brandName:schedule.form.setSchedule")}
            </Button>
            <Button
              type="button"
              onClick={handleClear}
              className="flex items-center justify-center gap-2 border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold normal-case text-[#374151] shadow-none hover:bg-gray-50 hover:shadow-none"
            >
              <FaXmark className="h-4 w-4 text-red-500" aria-hidden />
              {t("brandName:schedule.form.clear")}
            </Button>
          </div>
        </div>
      </section>

      {/* <section className="overflow-hidden rounded-xl border border-brand-green/25 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-brand-green/15 bg-brand-green-pale px-4 py-3">
          <div className="flex items-center gap-2">
            <FaListUl className="h-4 w-4 text-secondary" aria-hidden />
            <h2 className="text-sm font-bold text-brand-blue sm:text-base">
              {t("brandName:schedule.history.title")}
            </h2>
          </div>
          <span className="text-xs font-medium text-[#6B7280]">
            {t("brandName:schedule.history.lastCount", { count: 5 })}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#E5E7EB] bg-[#FAFAFA] text-xs uppercase tracking-wide text-[#6B7280]">
              <tr>
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">
                  {t("brandName:schedule.history.columns.start")}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {t("brandName:schedule.history.columns.end")}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {t("brandName:schedule.history.columns.repeat")}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {t("brandName:schedule.history.columns.days")}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {t("brandName:schedule.history.columns.setBy")}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {t("brandName:schedule.history.columns.status")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF2E8]">
              {MOCK_HISTORY.map((row, index) => (
                <tr key={row.id} className={index % 2 === 0 ? "bg-brand-mint-softer" : "bg-white"}>
                  <td className="px-4 py-3 text-[#4B5563]">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-[#1F2937]">{row.start}</td>
                  <td className="px-4 py-3 text-[#4B5563]">{row.end}</td>
                  <td className="px-4 py-3 text-[#4B5563]">{row.repeat}</td>
                  <td className="px-4 py-3 text-[#4B5563]">{row.days}</td>
                  <td className="px-4 py-3 text-[#4B5563]">{row.setBy}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        row.status === "active"
                          ? "bg-brand-green-pale text-brand-green-dark"
                          : "bg-[#F3F4F6] text-[#6B7280]"
                      }`}
                    >
                      {row.status === "active" ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      ) : null}
                      {row.status === "active"
                        ? t("brandName:schedule.history.statusActive")
                        : t("brandName:schedule.history.statusCompleted")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section> */}
    </div>
  );
}
