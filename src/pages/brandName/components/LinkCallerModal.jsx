/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, Typography } from "@material-tailwind/react";
import { IoMdCloseCircle } from "react-icons/io";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

const isActiveStatus = (status) => String(status) === "1";

export default function LinkCallerModal({
  isOpen,
  onClose,
  callers = [],
  maxSelectable,
  initialSelected = [],
  onSave,
}) {
  const { t } = useTranslation(["brandName"]);
  const [draftSelected, setDraftSelected] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setDraftSelected(initialSelected);
    }
  }, [isOpen, initialSelected]);

  const selectedIds = useMemo(
    () => new Set(draftSelected.map((caller) => caller.id)),
    [draftSelected]
  );

  if (!isOpen) return null;

  const atMax = draftSelected.length >= maxSelectable;

  const toggleCaller = (caller) => {
    if (selectedIds.has(caller.id)) {
      setDraftSelected((prev) => prev.filter((item) => item.id !== caller.id));
      return;
    }
    if (atMax) return;
    setDraftSelected((prev) => [...prev, caller]);
  };

  const toggleAll = () => {
    if (draftSelected.length === callers.length || draftSelected.length === maxSelectable) {
      setDraftSelected([]);
      return;
    }
    setDraftSelected(callers.slice(0, maxSelectable));
  };

  const allChecked =
    callers.length > 0 &&
    (draftSelected.length === callers.length || draftSelected.length === maxSelectable);
  const isIndeterminate =
    draftSelected.length > 0 && draftSelected.length < Math.min(callers.length, maxSelectable);

  const handleSave = () => {
    onSave?.(draftSelected);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 p-2 backdrop-blur-sm">
      <div className="relative flex max-h-[92%] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white">
        <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-white">
              <HiOutlineUserGroup className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <Typography className="text-lg font-bold text-brand-blue">
                {t("brandName:approved.linkCallers.modalTitle")}
              </Typography>
              <Typography className="mt-1 text-sm text-[#6B7280]">
                {t("brandName:approved.linkCallers.modalSubtitle", {
                  max: maxSelectable,
                  selected: draftSelected.length,
                })}
              </Typography>
            </div>
          </div>
          <button
            type="button"
            className="text-xl text-gray-400 hover:text-gray-600"
            onClick={onClose}
            aria-label={t("brandName:approved.linkCallers.cancel")}
          >
            <IoMdCloseCircle />
          </button>
        </div>

        <div className="overflow-auto px-5 py-4 sm:px-6">
          {callers.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-brand-green-pale text-brand-blue">
                  <tr>
                    <th className="px-4 py-3">
                      <Checkbox
                        checked={allChecked}
                        indeterminate={isIndeterminate}
                        onChange={toggleAll}
                        className="border-secondary checked:border-secondary checked:bg-secondary"
                      />
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("brandName:approved.linkCallers.columns.msisdn")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("brandName:approved.linkCallers.columns.nameTag")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("brandName:approved.linkCallers.columns.tagNo")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("brandName:approved.linkCallers.columns.corpType")}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {t("brandName:approved.linkCallers.columns.status")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {callers.map((caller) => {
                    const checked = selectedIds.has(caller.id);
                    const disabled = !checked && atMax;
                    return (
                      <tr
                        key={caller.id}
                        className={`border-t border-[#E5E7EB] transition ${
                          checked ? "bg-brand-green-pale/60" : "bg-white"
                        } ${disabled ? "opacity-60" : "hover:bg-gray-50"}`}
                      >
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={checked}
                            disabled={disabled}
                            onChange={() => toggleCaller(caller)}
                            className="border-secondary checked:border-secondary checked:bg-secondary"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-[#1F2937]">{caller.msisdn}</td>
                        <td className="px-4 py-3 text-[#4B5563]">{caller.name_tag?.trim() || "—"}</td>
                        <td className="px-4 py-3 text-[#4B5563]">{caller.tagname || "—"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              caller.corp_type === "Primary"
                                ? "bg-secondary/15 text-brand-green-dark"
                                : "bg-[#EEF2FF] text-brand-blue"
                            }`}
                          >
                            {caller.corp_type || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              isActiveStatus(caller.status)
                                ? "bg-brand-green-pale text-brand-green-dark"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {isActiveStatus(caller.status)
                              ? t("brandName:approved.linkCallers.active")
                              : t("brandName:approved.linkCallers.inactive")}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#D1D5DB] bg-gray-50 px-4 py-10 text-center text-sm text-[#6B7280]">
              {t("brandName:approved.linkCallers.empty")}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#E5E7EB] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            className="bg-gray-200 px-6 py-2.5 text-sm font-semibold normal-case text-gray-800 shadow-none hover:shadow-none"
            onClick={onClose}
          >
            {t("brandName:approved.linkCallers.cancel")}
          </Button>
          <Button
            type="button"
            disabled={draftSelected.length === 0}
            className="bg-secondary px-6 py-2.5 text-sm font-semibold normal-case text-white shadow-none hover:shadow-none disabled:opacity-60"
            onClick={handleSave}
          >
            {t("brandName:approved.linkCallers.saveSelection", {
              count: draftSelected.length,
            })}
          </Button>
        </div>
      </div>
    </div>
  );
}
