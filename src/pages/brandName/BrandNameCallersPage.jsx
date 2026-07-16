import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Checkbox, Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { ConstentRoutes } from "../../utilities/routesConst";
import { formatPhoneNumberCustom } from "../../utilities/formatMobileNumber";

const isActiveStatus = (status) => String(status) === "1";

const isLinkedToBrandCall = (brandCallStatus) =>
  Number(brandCallStatus) === 1;

const isPrimaryCaller = (caller) => caller?.corp_type === "Primary";

const TABS = {
  LINKED: "linked",
  UNLINKED: "unlinked",
};

export default function BrandNameCallersPage() {
  const { t } = useTranslation(["brandName"]);
  const navigate = useNavigate();
  const [callers, setCallers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingEligibility, setIsLoadingEligibility] = useState(true);
  const [isRecurringAccepted, setIsRecurringAccepted] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.LINKED);
  const [selectedCallerIds, setSelectedCallerIds] = useState([]);

  const selectedIds = useMemo(
    () => new Set(selectedCallerIds),
    [selectedCallerIds]
  );

  const linkedCallers = useMemo(
    () => callers.filter((caller) => isLinkedToBrandCall(caller.brand_call_status)),
    [callers]
  );

  const unlinkedCallers = useMemo(
    () => callers.filter((caller) => !isLinkedToBrandCall(caller.brand_call_status)),
    [callers]
  );

  const isUnlinkedTab = activeTab === TABS.UNLINKED;
  const allUnlinkedSelected =
    unlinkedCallers.length > 0 &&
    selectedCallerIds.length === unlinkedCallers.length;
  const isSelectionIndeterminate =
    selectedCallerIds.length > 0 &&
    selectedCallerIds.length < unlinkedCallers.length;

  const filteredCallers =
    activeTab === TABS.LINKED ? linkedCallers : unlinkedCallers;

  useEffect(() => {
    setSelectedCallerIds([]);
  }, [activeTab]);

  const toggleCallerSelection = (callerId) => {
    setSelectedCallerIds((prev) =>
      prev.includes(callerId)
        ? prev.filter((id) => id !== callerId)
        : [...prev, callerId]
    );
  };

  const toggleAllUnlinked = () => {
    if (allUnlinkedSelected) {
      setSelectedCallerIds([]);
      return;
    }
    setSelectedCallerIds(unlinkedCallers.map((caller) => caller.id));
  };

  const handleLinkCallers = () => {
    if (selectedCallerIds.length === 0) {
      toast.error(t("brandName:addRemoveNumbers.selectAtLeastOne"));
      return;
    }

    const selectedCallers = unlinkedCallers.filter((caller) =>
      selectedCallerIds.includes(caller.id)
    );

    navigate(ConstentRoutes.brandNameCallLinkNumbers, {
      state: { selectedCallers },
    });
  };

  const fetchCallers = useCallback(() => {
    setLoading(true);

    APICall("get", null, EndPoints.customer.brandNameCallersList)
      .then((res) => {
        if (res?.success) {
          setCallers(Array.isArray(res.data) ? res.data : []);
        } else {
          toast.error(res?.message || t("brandName:addRemoveNumbers.loadError"));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching brand name callers:", err);
        toast.error(t("brandName:addRemoveNumbers.loadError"));
        setLoading(false);
      });
  }, [t]);

  useEffect(() => {
    const fetchSubscriberStatus = async () => {
      setIsLoadingEligibility(true);
      try {
        const response = await APICall("get", null, EndPoints.customer.subscriberTagStatus);
        const accepted = Boolean(response?.data?.is_recurring_acceptance);
        setIsRecurringAccepted(accepted);
      } catch {
        setIsRecurringAccepted(false);
      } finally {
        setIsLoadingEligibility(false);
      }
    };

    fetchSubscriberStatus();
  }, []);

  useEffect(() => {
    if (isRecurringAccepted) {
      fetchCallers();
    }
  }, [isRecurringAccepted, fetchCallers]);

  const renderCallerRow = (caller) => {
    const isPrimary = isPrimaryCaller(caller);
    const isSelected = selectedIds.has(caller.id);

    return (
      <tr
        key={caller.id}
        className={isUnlinkedTab && isSelected ? "bg-brand-green-pale/40" : ""}
      >
        {isUnlinkedTab ? (
          <td className="py-4 px-4 text-sm text-gray-700">
            <Checkbox
              checked={isSelected}
              onChange={() => toggleCallerSelection(caller.id)}
              className="border-secondary checked:border-secondary checked:bg-secondary"
            />
          </td>
        ) : null}
         <td className="py-4 px-4 text-sm text-gray-700">
          {formatPhoneNumberCustom(caller.msisdn || t("brandName:addRemoveNumbers.na"))}
        </td>
        <td className="py-4 px-4 text-sm text-gray-700">
          #{caller.tagname || t("brandName:addRemoveNumbers.na")}
        </td>
       
        <td className="py-4 px-4 text-sm text-gray-700">
          {caller.name_tag?.trim() || t("brandName:addRemoveNumbers.na")}
        </td>
        <td className="py-4 px-4 text-sm text-gray-700">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isPrimary
                ? "bg-secondary/15 text-brand-green-dark"
                : "bg-[#EEF2FF] text-brand-blue"
            }`}
          >
            {caller.corp_type || t("brandName:addRemoveNumbers.na")}
          </span>
        </td>
        <td className="py-4 px-4 text-sm text-gray-700">
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
        {!isUnlinkedTab ? (
          <td className="py-4 px-4 text-sm text-gray-700">
            <Button
              size="sm"
              className="bg-red-500 text-white text-[14px]"
              disabled={isPrimary}
            >
              {t("brandName:addRemoveNumbers.remove")}
            </Button>
          </td>
        ) : null}
      </tr>
    );
  };

  const emptyMessage =
    activeTab === TABS.LINKED
      ? t("brandName:addRemoveNumbers.emptyLinked")
      : t("brandName:addRemoveNumbers.emptyUnlinked");

  if (isLoadingEligibility) {
    return (
      <div className="shadow bg-white rounded-xl px-4 py-6 pb-10">
        <div className="min-h-44 flex justify-center items-center">
          <Spinner className="h-12 w-12" color="green" />
        </div>
      </div>
    );
  }

  if (!isRecurringAccepted) {
    return (
      <div className="shadow bg-white rounded-xl px-4 py-6 pb-10">
        <Typography className="text-[#1F1F2C] mb-4 text-md font-medium">
          {t("brandName:addRemoveNumbers.title")}
        </Typography>
        <div>
          <p className="text-sm font-bold text-brand-blue">
            {t("brandName:addRemoveNumbers.restrictionTitle")}
          </p>
          <p className="mt-1 text-sm text-red-500">
            {t("brandName:addRemoveNumbers.restrictionDescription")}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              size="sm"
              className="bg-secondary px-6 text-sm font-semibold normal-case text-white shadow-none hover:shadow-none"
              onClick={() => navigate(ConstentRoutes.dashboard)}
            >
              {t("brandName:addRemoveNumbers.goToDashboardButton")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shadow bg-white rounded-xl px-4 py-6 pb-10">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
     

        {isUnlinkedTab ? (
          <Button
            size="sm"
            className="bg-secondary px-6 text-sm font-semibold normal-case text-white shadow-none hover:shadow-none"
            disabled={selectedCallerIds.length === 0 || loading}
            onClick={handleLinkCallers}
          >
            {t("brandName:addRemoveNumbers.linkCallerButton", {
              count: selectedCallerIds.length,
            })}
          </Button>
        ) : null}
      </div>

      <div className="flex gap-8 overflow-auto border-b">
        <div className="w-full">
          <p
            className={`w-full pb-2 whitespace-pre text-center text-[#000] font-medium text-base cursor-pointer ${
              activeTab === TABS.LINKED ? "opacity-100" : "opacity-40"
            }`}
            onClick={() => setActiveTab(TABS.LINKED)}
          >
            {t("brandName:addRemoveNumbers.tabs.linked")}
          </p>
          <div
            className={`w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${
              activeTab === TABS.LINKED ? "bg-secondary" : ""
            }`}
          />
        </div>
        <div className="w-full">
          <p
            className={`w-full pb-2 whitespace-pre text-center text-[#000] font-medium text-base cursor-pointer ${
              activeTab === TABS.UNLINKED ? "opacity-100" : "opacity-40"
            }`}
            onClick={() => setActiveTab(TABS.UNLINKED)}
          >
            {t("brandName:addRemoveNumbers.tabs.unlinked")}
          </p>
          <div
            className={`w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${
              activeTab === TABS.UNLINKED ? "bg-secondary" : ""
            }`}
          />
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="min-h-44 flex justify-center items-center">
            <Spinner className="h-12 w-12" color="green" />
          </div>
        ) : filteredCallers.length === 0 ? (
          <Typography className="text-center py-8">
            {callers.length === 0
              ? t("brandName:addRemoveNumbers.empty")
              : emptyMessage}
          </Typography>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-[#F6F7FB]">
                <tr>
                  {isUnlinkedTab ? (
                    <th className="py-3 px-4 text-left text-xs text-[#7A798A]">
                      <Checkbox
                        checked={allUnlinkedSelected}
                        indeterminate={isSelectionIndeterminate}
                        onChange={toggleAllUnlinked}
                        disabled={unlinkedCallers.length === 0}
                        className="border-secondary checked:border-secondary checked:bg-secondary"
                      />
                    </th>
                  ) : null}
                       <th className="py-3 px-4 text-left text-xs text-[#7A798A]">
                    {t("brandName:approved.linkCallers.columns.msisdn")}
                  </th>
                  <th className="py-3 px-4 text-left text-xs text-[#7A798A]">
                    {t("brandName:approved.linkCallers.columns.tagNo")}
                  </th>
             
                  <th className="py-3 px-4 text-left text-xs text-[#7A798A]">
                    {t("brandName:approved.linkCallers.columns.nameTag")}
                  </th>
                  <th className="py-3 px-4 text-left text-xs text-[#7A798A]">
                    {t("brandName:approved.linkCallers.columns.corpType")}
                  </th>
                  <th className="py-3 px-4 text-left text-xs text-[#7A798A]">
                    {t("brandName:approved.linkCallers.columns.status")}
                  </th>
                  {!isUnlinkedTab ? (
                    <th className="py-3 px-4 text-left text-xs text-[#7A798A]">
                      {t("brandName:addRemoveNumbers.action")}
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>{filteredCallers.map((caller) => renderCallerRow(caller))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
