import { useEffect, useMemo, useState } from "react";
import { Spinner } from "@material-tailwind/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { ConstentRoutes } from "../../utilities/routesConst";
import BrandNameRequestApproved from "./components/BrandNameRequestApproved";

export default function BrandNameLinkCallersPage() {
  const { t } = useTranslation(["brandName"]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedCallers = useMemo(
    () => (Array.isArray(state?.selectedCallers) ? state.selectedCallers : []),
    [state?.selectedCallers]
  );

  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (selectedCallers.length === 0) {
      navigate(ConstentRoutes.brandNameCallNumbers, { replace: true });
    }
  }, [navigate, selectedCallers.length]);

  useEffect(() => {
    const fetchRequest = async () => {
      setIsLoading(true);
      try {
        const response = await APICall("get", null, EndPoints.customer.brandNameRequests);
        const requestData = Array.isArray(response?.data)
          ? response.data[0]
          : response?.data;

        if (response?.success && requestData) {
          setRequest(requestData);
        } else {
          toast.error(response?.message || t("brandName:addRemoveNumbers.loadError"));
          navigate(ConstentRoutes.brandNameCallNumbers, { replace: true });
        }
      } catch (error) {
        const message = typeof error === "string" ? error : error?.message;
        if (message) toast.error(message);
        navigate(ConstentRoutes.brandNameCallNumbers, { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedCallers.length > 0) {
      fetchRequest();
    }
  }, [navigate, selectedCallers.length, t]);

  const handleProceedPayment = async (method, callers = []) => {
    if (!request) return;

    setIsProcessingPayment(true);
    try {
      const isSuperApp = method === "super_app";
      const payload = {
        service_id: request.service_id,
        channel: "WEB",
        payment_method: "Mobile Wallet",
        business_type: isSuperApp ? "BuyGoods" : "TransferToOtherOrg",
        caller_ids: callers.map((caller) => caller.id?.toString()),
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

  if (selectedCallers.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <Spinner className="h-8 w-8 text-secondary" />
        <p className="text-sm text-[#6B7280]">{t("brandName:approved.linkCallers.priceLoading")}</p>
      </div>
    );
  }

  if (!request) {
    return null;
  }

  return (
    <BrandNameRequestApproved
      request={request}
      initialSelectedCallers={selectedCallers}
      linkFlowMode
      onProceed={handleProceedPayment}
      isProcessing={isProcessingPayment}
    />
  );
}
