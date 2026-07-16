/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, Typography } from "@material-tailwind/react";
import { IoMdCloseCircle } from "react-icons/io";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

const isActiveStatus = (status) => String(status) === "1";

const isPrimaryCaller = (caller) => caller?.corp_type === "Primary";

const mergeWithPrimaryCallers = (selected, callersList) => {
  const primaryCallers = callersList.filter(isPrimaryCaller);
  const merged = new Map(selected.map((caller) => [caller.id, caller]));
  primaryCallers.forEach((caller) => merged.set(caller.id, caller));
  return Array.from(merged.values());
};

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
  const [isSaving, setIsSaving] = useState(false);
  const [showFewerCallersConfirm, setShowFewerCallersConfirm] = useState(false);
  const requiredCount = maxSelectable;

  useEffect(() => {
    if (isOpen) {
      setDraftSelected(mergeWithPrimaryCallers(initialSelected, callers));
      setIsSaving(false);
      setShowFewerCallersConfirm(false);
    }
  }, [isOpen, initialSelected, callers]);

  const selectedIds = useMemo(
    () => new Set(draftSelected.map((caller) => caller.id)),
    [draftSelected]
  );

  const sortedCallers = useMemo(
    () =>
      [...callers].sort((a, b) => {
        const aPrimary = isPrimaryCaller(a) ? 0 : 1;
        const bPrimary = isPrimaryCaller(b) ? 0 : 1;
        return aPrimary - bPrimary;
      }),
    [callers]
  );

  if (!isOpen) return null;

  const approvedCount = requiredCount;
  const hasValidSelection = draftSelected.length > 0;
  const allCallersSelected =
    callers.length > 0 && draftSelected.length === callers.length;
  const isIndeterminate =
    draftSelected.length > 0 && draftSelected.length < callers.length;
  const selectionDiffersFromApproved = draftSelected.length !== approvedCount;

  const toggleCaller = (caller) => {
    if (isPrimaryCaller(caller)) return;

    if (selectedIds.has(caller.id)) {
      setDraftSelected((prev) =>
        mergeWithPrimaryCallers(
          prev.filter((item) => item.id !== caller.id),
          callers
        )
      );
      return;
    }
    setDraftSelected((prev) => mergeWithPrimaryCallers([...prev, caller], callers));
  };

  const toggleAll = () => {
    if (allCallersSelected) {
      setDraftSelected(mergeWithPrimaryCallers([], callers));
      return;
    }
    setDraftSelected(mergeWithPrimaryCallers(callers, callers));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.(mergeWithPrimaryCallers(draftSelected, callers));
      setShowFewerCallersConfirm(false);
      onClose?.();
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveClick = () => {
    if (!hasValidSelection || isSaving) return;
    if (selectionDiffersFromApproved) {
      setShowFewerCallersConfirm(true);
      return;
    }
    handleSave();
  };

  return (
    <>
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 p-2 backdrop-blur-sm">
      <div className="relative flex max-h-[92%] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white">
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
                  count: approvedCount,
                  selected: draftSelected.length,
                })}
              </Typography>
            </div>
          </div>
          <button
            type="button"
            className="!text-xl text-gray-400 hover:text-gray-600"
            onClick={onClose}
            disabled={isSaving}
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
                    <th className="px-4">
                      <Checkbox
                        checked={allCallersSelected}
                        indeterminate={isIndeterminate}
                        onChange={toggleAll}
                        disabled={isSaving}
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
                  {sortedCallers.map((caller) => {
                    const checked = selectedIds.has(caller.id);
                    const isLockedPrimary = isPrimaryCaller(caller);
                    const disabled = isSaving || isLockedPrimary;
                    return (
                      <tr
                        key={caller.id}
                        className={`border-t border-[#E5E7EB] transition ${
                          checked ? "bg-brand-green-pale/60" : "bg-white"
                        } ${disabled && !checked && !isLockedPrimary ? "opacity-60" : "hover:bg-gray-50"}`}
                      >
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={checked || isLockedPrimary}
                            disabled={disabled}
                            onChange={() => toggleCaller(caller)}
                            className={`border-secondary checked:border-secondary checked:bg-secondary ${
                              isLockedPrimary ? "cursor-not-allowed opacity-80" : ""
                            }`}
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-[#1F2937]">{+(caller.msisdn)}</td>
                        <td className="px-4 py-3 text-[#4B5563]">{caller.name_tag?.trim() || "—"}</td>
                        <td className="px-4 py-3 text-[#4B5563]">#{caller.tagname || "—"}</td>
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
            disabled={isSaving}
          >
            {t("brandName:approved.linkCallers.cancel")}
          </Button>
          <Button
            type="button"
            disabled={!hasValidSelection || isSaving}
            className="bg-secondary px-6 py-2.5 text-sm font-semibold normal-case text-white shadow-none hover:shadow-none disabled:opacity-60"
            onClick={handleSaveClick}
          >
            {isSaving
              ? t("brandName:approved.linkCallers.priceLoading")
              : t("brandName:approved.linkCallers.saveSelection", {
                  count: draftSelected.length,
                })}
          </Button>
        </div>
      </div>
    </div>

    {showFewerCallersConfirm ? (
      <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center bg-black bg-opacity-60 p-2 backdrop-blur-sm">
        <div className="relative max-h-[92%] w-full max-w-md overflow-auto rounded-2xl bg-white p-6">
          <button
            type="button"
            className="absolute right-4 top-4 text-xl text-gray-400 hover:text-gray-600"
            onClick={() => setShowFewerCallersConfirm(false)}
            disabled={isSaving}
            aria-label={t("brandName:approved.linkCallers.fewerCallersKeepEditing")}
          >
            <IoMdCloseCircle />
          </button>

          <div className="mt-4 text-center">
            <Typography className="text-lg font-bold text-gray-900">
              {t("brandName:approved.linkCallers.fewerCallersConfirmTitle")}
            </Typography>
            <Typography className="mt-2 text-sm text-gray-600">
              {t("brandName:approved.linkCallers.fewerCallersConfirmMessage", {
                selected: draftSelected.length,
                max: approvedCount,
              })}
            </Typography>
          </div>

          <div className="mt-6 flex gap-4">
            <Button
              type="button"
              className="flex-1 bg-gray-300 py-2.5 text-gray-800 shadow-none hover:shadow-none"
              onClick={() => setShowFewerCallersConfirm(false)}
              disabled={isSaving}
            >
              {t("brandName:approved.linkCallers.fewerCallersKeepEditing")}
            </Button>
            <Button
              type="button"
              className="flex-1 bg-secondary py-2.5 text-white shadow-none hover:shadow-none disabled:opacity-60"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving
                ? t("brandName:approved.linkCallers.priceLoading")
                : t("brandName:approved.linkCallers.fewerCallersConfirmButton")}
            </Button>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
}
