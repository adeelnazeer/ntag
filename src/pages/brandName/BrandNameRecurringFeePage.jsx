import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Spinner } from "@material-tailwind/react";
import {
  FaCircleExclamation,
  FaCircleXmark,
  FaUsers,
} from "react-icons/fa6";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { ConstentRoutes } from "../../utilities/routesConst";
import { formatPhoneNumberCustom } from "../../utilities/formatMobileNumber";
import BrandNameRequestPending from "./components/BrandNameRequestPending";
import BrandNameRequestRejected from "./components/BrandNameRequestRejected";
import BrandNameRequestApproved from "./components/BrandNameRequestApproved";
import BrandNameRequestEmpty from "./components/BrandNameRequestEmpty";

const STATUS_PENDING = 0;
const MAX_ALLOWED_CALLERS = import.meta.env.VITE_MAX_ALLOWED_LIMIT || "1000";

const matchesLabel = (request, label) =>
  String(request?.status_label || "").toLowerCase() === label;

const isLinkedToBrandCall = (brandCallStatus) => Number(brandCallStatus) === 1;

const isActiveStatus = (status) => String(status) === "1";

const formatPrice = (value) => Number(value || 0).toFixed(2);

const formatDisplayDate = (value) => value || "—";

const getPaymentMethodLabel = (paymentMethod) => {
  if (paymentMethod === "telebirr" || paymentMethod === "telebirr_super_app") {
    return "Telebirr Super App";
  }
  if (paymentMethod === "telebirr_partnerapp") {
    return "telebirr partner App";
  }
  return paymentMethod || "—";
};

const getLinkedDate = (caller) =>
  caller?.brandname_charge_dt ||
  caller?.brand_call_linked_at ||
  caller?.linked_at ||
  caller?.linked_date ||
  caller?.created_at ||
  "—";

const getCallerNameTag = (caller) =>
  caller?.name_tag?.trim() || caller?.tagname?.trim() || "—";

export default function BrandNameRecurringFeePage() {
  const { t } = useTranslation(["brandName"]);
  const navigate = useNavigate();
  const [callers, setCallers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const fetchLinkedCallers = useCallback(async () => {
    try {
      const response = await APICall("get", null, EndPoints.customer.brandNameCallersList);
      if (response?.success) {
        const allCallers = Array.isArray(response.data) ? response.data : [];
        setCallers(allCallers.filter((caller) => isLinkedToBrandCall(caller.brand_call_status)));
      } else {
        setCallers([]);
      }
    } catch (error) {
      const message = typeof error === "string" ? error : error?.message;
      if (message) toast.error(message);
      setCallers([]);
    }
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const [requestsResponse] = await Promise.all([
        APICall("get", null, EndPoints.customer.brandNameRequests),
        fetchLinkedCallers(),
      ]);
      setRequests(requestsResponse?.data == null ? [] : [requestsResponse.data]);
    } catch (error) {
      const message = typeof error === "string" ? error : error?.message;
      if (message) toast.error(message);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const pendingRequest = useMemo(
    () =>
      requests.find(
        (request) => request.status === STATUS_PENDING || matchesLabel(request, "pending")
      ),
    [requests]
  );

  const rejectedRequest = useMemo(
    () => requests.find((request) => matchesLabel(request, "rejected")),
    [requests]
  );

  const approvedRequest = useMemo(
    () => requests.find((request) => matchesLabel(request, "approved") && request.can_pay),
    [requests]
  );

  const activeSubscription = useMemo(() => {
    if (!Array.isArray(requests) || requests.length === 0) return null;

    return (
      requests.find((request) => {
        const label = String(request?.status_label || "").toLowerCase();
        if (request.status === STATUS_PENDING || label === "pending") return false;
        if (label === "rejected") return false;
        if (label === "approved" && request.can_pay) return false;
        return true;
      }) ?? null
    );
  }, [requests]);

  const handleProceedPayment = async (method, selectedCallers = []) => {
    if (!approvedRequest) return;
    setIsProcessingPayment(true);
    console.log(selectedCallers);
    try {
      const isSuperApp = method === "super_app";
      const payload = {
        service_id: approvedRequest.service_id,
        channel: "WEB",
        payment_method: isSuperApp ? "telebirr" : "telebirr_partnerapp",
        business_type: isSuperApp ? "BuyGoods" : "TransferToOtherOrg",
        caller_ids: selectedCallers.map((caller) => (caller.id)?.toString()),
      };

      const response = await APICall("post", payload, EndPoints.customer.brandNameBuy);

      if (response?.success && response?.data) {
        window.location.href = response.data;
      } else {
        toast.error(response?.message || t("brandName:approved.proceedButton"));
      }
    } catch (error) {
      const message = typeof error === "string" ? error : error?.message;
      if (message) toast.error(message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCancelRequest = async (request) => {
    if (!request?.request_id) return;
    setIsCancelling(true);
    try {
      const response = await APICall(
        "post",
        null,
        EndPoints.customer.brandNameRequestCancel(request.request_id)
      );
      if (response?.success) {
        toast.success(response?.message || t("brandName:pending.cancelSuccess"));
        await fetchRequests();
      } else {
        toast.error(response?.message || t("brandName:pending.cancelButton"));
      }
    } catch (error) {
      const message = typeof error === "string" ? error : error?.message;
      if (message) toast.error(message);
    } finally {
      setIsCancelling(false);
    }
  };

  const currency = t("brandName:recurringFee.currency");
  const brandName = activeSubscription?.brandname || "—";
  const registeredDate = formatDisplayDate(
    activeSubscription?.activation_date ||
    activeSubscription?.status_updated_at ||
    activeSubscription?.submitted_at
  );
  const perCallerFee =
    activeSubscription?.discounted_fee_per_caller ??
    activeSubscription?.monthly_fee_per_caller ??
    activeSubscription?.approved_fee_per_caller ??
    0;
  const linkedCount = callers.length;
  const monthlyFee =
    activeSubscription?.estimated_monthly_recurring ??
    activeSubscription?.total_recurring ??
    linkedCount * Number(perCallerFee);
  const totalCalls = Number(
    activeSubscription?.total_calls ?? activeSubscription?.calls_made ?? 0
  );

  const subscriptionRows = useMemo(() => {
    if (!activeSubscription) return [];

    const rows = [
      { key: "brandName", displayValue: brandName },
      {
        key: "subscriptionStatus",
        displayValue: activeSubscription.status_label || t("brandName:recurringFee.statusActive"),
        highlight: true,
      },
      {
        key: "registeredMobile",
        displayValue: activeSubscription.msisdn
          ? formatPhoneNumberCustom(activeSubscription.msisdn)
          : "—",
      },
      {
        key: "registrationFee",
        displayValue: `${formatPrice(
          activeSubscription.approved_registration_fee ?? activeSubscription.registration_fee
        )} ${currency}`,
      },
      {
        key: "recurringFeePerCaller",
        displayValue: `${formatPrice(perCallerFee)} ${currency}`,
      },
      {
        key: "subscriptionPlan",
        displayValue: activeSubscription.service_id || "—",
      },
      {
        key: "nextBillingDate",
        displayValue: formatDisplayDate(activeSubscription.next_billing_date),
      },
      {
        key: "paymentMethod",
        displayValue: getPaymentMethodLabel(activeSubscription.payment_method),
        link: Boolean(activeSubscription.payment_method),
      },
      {
        key: "brandType",
        displayValue: activeSubscription.brand_type || "—",
      },
      {
        key: "activationDate",
        displayValue: formatDisplayDate(
          activeSubscription.activation_date || activeSubscription.status_updated_at
        ),
      },
    ];

    return rows.map((row) => ({
      ...row,
      label: t(`brandName:recurringFee.subscription.${row.key}`),
    }));
  }, [activeSubscription, brandName, currency, perCallerFee, t]);

  const handleRemoveCaller = () => {
    navigate(ConstentRoutes.brandNameCallNumbers);
  };

  const canUnsubscribe = linkedCount === 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <Spinner className="h-8 w-8 text-secondary" />
        <p className="text-sm text-[#6B7280]">{t("brandName:pending.loading")}</p>
      </div>
    );
  }

  if (pendingRequest) {
    return (
      <BrandNameRequestPending
        request={pendingRequest}
        onCancel={() => handleCancelRequest(pendingRequest)}
        isCancelling={isCancelling}
      />
    );
  }

  if (rejectedRequest) {
    return (
      <BrandNameRequestRejected
        request={rejectedRequest}
        onApplyNew={() => navigate(ConstentRoutes.brandNameCallBuy)}
        onContactSupport={() => navigate("/contact")}
      />
    );
  }

  if (approvedRequest) {
    return (
      <BrandNameRequestApproved
        request={approvedRequest}
        onProceed={handleProceedPayment}
        onCancel={() => handleCancelRequest(approvedRequest)}
        isProcessing={isProcessingPayment}
        isCancelling={isCancelling}
      />
    );
  }

  if (!requests.length || !activeSubscription) {
    return (
      <BrandNameRequestEmpty
        onRegister={() => navigate(ConstentRoutes.brandNameCallBuy)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="overflow-hidden rounded-xl bg-gradient-to-r from-brand-green via-secondary to-brand-green-dark px-5 py-5 text-white shadow-sm sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{brandName}</h1>
            <p className="mt-1 text-sm text-white/90 sm:text-[15px]">
              {t("brandName:recurringFee.serviceSubtitle", {
                date: registeredDate,
              })}
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-green-dark shadow-sm sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-secondary" aria-hidden />
            {activeSubscription.status_label || t("brandName:recurringFee.statusActive")}
          </span>
        </div>
      </section>


      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-brand-green/30 bg-white px-4 py-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#6B7280] sm:text-xs">
            {t("brandName:recurringFee.stats.totalCalls")}
          </p>
          <p className="mt-2 text-2xl font-extrabold text-secondary sm:text-3xl">
            {totalCalls.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-[#9CA3AF]">{t("brandName:recurringFee.stats.sinceActivation")}</p>
        </div>
        <div className="rounded-xl border border-brand-green/30 bg-white px-4 py-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#6B7280] sm:text-xs">
            {t("brandName:recurringFee.stats.linkedCallers")}
          </p>
          <p className="mt-2 text-2xl font-extrabold text-secondary sm:text-3xl">{linkedCount}</p>
          <p className="mt-1 text-xs text-[#9CA3AF]">
            {t("brandName:recurringFee.stats.maxCallers", { max: MAX_ALLOWED_CALLERS })}
          </p>
        </div>
        <div className="rounded-xl border border-brand-green/30 bg-white px-4 py-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#6B7280] sm:text-xs">
            {t("brandName:recurringFee.stats.monthlyFee")}
          </p>
          <p className="mt-2 text-2xl font-extrabold text-secondary sm:text-3xl">
            {formatPrice(monthlyFee)} {currency}
          </p>
          <p className="mt-1 text-xs text-[#9CA3AF]">
            {t("brandName:recurringFee.stats.monthlyFeeBreakdown", {
              count: linkedCount,
              fee: formatPrice(perCallerFee),
            })}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-brand-green/25 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-brand-green/15 bg-brand-green-pale px-4 py-3">
          <HiOutlineClipboardDocumentList className="h-4 w-4 text-secondary" aria-hidden />
          <h2 className="text-sm font-bold text-brand-blue sm:text-base">
            {t("brandName:recurringFee.subscription.title")}
          </h2>
        </div>
        <div className="divide-y divide-[#EEF2E8]">
          {subscriptionRows.map((row, index) => (
            <div
              key={row.key}
              className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${index % 2 === 0 ? "bg-brand-mint-softer" : "bg-white"
                }`}
            >
              <p className="text-xs font-medium text-[#6B7280] sm:text-sm">{row.label}</p>
              {row.link ? (
                <button
                  type="button"
                  className="text-left text-sm font-semibold text-brand-blue hover:underline sm:text-right"
                >
                  {row.displayValue}
                </button>
              ) : (
                <p
                  className={`text-sm font-semibold sm:text-right ${row.highlight ? "text-secondary" : "text-[#1F2937]"
                    }`}
                >
                  {row.displayValue}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-brand-green/25 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-brand-green/15 bg-brand-green-pale px-4 py-3">
          <FaUsers className="h-4 w-4 text-secondary" aria-hidden />
          <h2 className="text-sm font-bold text-brand-blue sm:text-base">
            {t("brandName:recurringFee.callers.title")}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-[#E5E7EB] bg-[#FAFAFA] text-xs capitalize tracking-wide text-[#6B7280]">
              <tr>
                <th className="px-4 py-3 font-semibold">{t("brandName:recurringFee.callers.columns.index")}</th>
                <th className="px-4 py-3 font-semibold">{t("brandName:recurringFee.callers.columns.msisdn")}</th>
                <th className="px-4 py-3 font-semibold">{t("brandName:recurringFee.callers.columns.serviceFee")}</th>
                <th className="px-4 py-3 font-semibold">{t("brandName:recurringFee.callers.columns.linkedDate")}</th>
                <th className="px-4 py-3 font-semibold">{t("brandName:recurringFee.callers.columns.status")}</th>
                <th className="px-4 py-3 font-semibold text-center">
                  {t("brandName:recurringFee.callers.columns.action")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF2E8]">
              {callers.length > 0 ? (
                callers.map((caller, index) => (
                  <tr key={caller.id} className={index % 2 === 0 ? "bg-brand-mint-softer" : "bg-white"}>
                    <td className="px-4 py-3 text-[#4B5563]">{index + 1}</td>
                    <td className="px-4 py-3  text-[#1F2937]">
                      {formatPhoneNumberCustom(caller.msisdn)}
                    </td>
                    <td className="px-4 py-3  text-[#1F2937]">
                      {formatPrice(caller.brandname_service_fee)} {currency} <br />
                      Dis: {formatPrice(caller.brandname_fee_discount)} <br />
                      {caller?.brandname_payment_method}

                    </td>

                    <td className="px-4 py-3 text-[#4B5563]"> Linked Date: {getLinkedDate(caller)}
                      <br />
                      Next Charge: {caller?.brandname_next_charge_dt}


                    </td>
                    <td className="px-4 py-3 font-semibold text-secondary">
                      {isActiveStatus(caller.status)
                        ? t("brandName:recurringFee.statusActive")
                        : t("brandName:approved.linkCallers.inactive")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={handleRemoveCaller}
                        className="rounded-md border border-red-300 bg-white px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 sm:text-sm"
                      >
                        {t("brandName:recurringFee.callers.remove")}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-sm text-[#6B7280]">
                    {t("brandName:recurringFee.callers.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-red-200 bg-red-50/40 shadow-sm">
        <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-4 py-3">
          <FaCircleXmark className="h-4 w-4 text-red-600" aria-hidden />
          <h2 className="text-sm font-bold text-red-800 sm:text-base">
            {t("brandName:recurringFee.unsubscribe.title")}
          </h2>
        </div>

        <div className="space-y-4 p-4">
          {!canUnsubscribe ? (
            <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
              <FaCircleExclamation className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
              <p className="text-sm leading-relaxed text-amber-950">
                {t("brandName:recurringFee.unsubscribe.blockedWarning", { count: linkedCount })}
              </p>
            </div>
          ) : null}

          <p className="text-sm leading-relaxed text-[#4B5563]">
            {t("brandName:recurringFee.unsubscribe.description")}
          </p>

          <Button
            type="button"
            disabled={!canUnsubscribe}
            className="w-full bg-[#9CA3AF] py-3 text-sm font-semibold normal-case text-white shadow-none hover:shadow-none enabled:bg-red-600 enabled:hover:bg-red-700 disabled:opacity-100"
          >
            {t("brandName:recurringFee.unsubscribe.button")}
          </Button>
        </div>
      </section>
    </div>
  );
}
