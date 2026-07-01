import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import BrandNameStepper from "./components/BrandNameStepper";
import CheckAvailabilityStep, { BRAND_NAME_PATTERN } from "./components/CheckAvailabilityStep";
import SubmitBrandRequestStep from "./components/SubmitBrandRequestStep";
import BrandNamePendingStep from "./components/BrandNamePendingStep";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";

export default function BuyBrandNameFlow() {
  const { t } = useTranslation(["brandName"]);

  const [currentStep, setCurrentStep] = useState(1);
  const [brandName, setBrandName] = useState("");
  const [callerCount, setCallerCount] = useState(1);
  const [servicePlan, setServicePlan] = useState("Monthly");
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [hasSubscriber, setHasSubscriber] = useState(null);
  const [isLoadingEligibility, setIsLoadingEligibility] = useState(true);

  useEffect(() => {
    const fetchSubscriberStatus = async () => {
      setIsLoadingEligibility(true);
      try {
        const response = await APICall("get", null, EndPoints.customer.subscriberTagStatus);
        setHasSubscriber(Boolean(response?.data?.has_subscriber));
      } catch {
        setHasSubscriber(false);
      } finally {
        setIsLoadingEligibility(false);
      }
    };

    fetchSubscriberStatus();
  }, []);

  const handleBrandNameChange = (value) => {
    const sanitized = value.replace(/[^a-zA-Z0-9]/g, "");
    setBrandName(sanitized);
    setIsAvailable(false);
    setErrorMessage("");
    setCheckResult(null);
    if (currentStep > 2) {
      setCurrentStep(1);
    }
  };

  const handleCheckAvailability = async () => {
    const trimmed = brandName.trim();
    const userData=JSON.parse(localStorage.getItem("user"))


    if (!trimmed) {
      setErrorMessage(t("brandName:step1.required"));
      setIsAvailable(false);
      return;
    }

    if (!BRAND_NAME_PATTERN.test(trimmed)) {
      setErrorMessage(t("brandName:step1.invalidFormat"));
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    setErrorMessage("");
    setIsAvailable(false);
    setCheckResult(null);

    try {
      const response = await APICall(
        "post",
        { brandname: trimmed ,phone_number:userData?.phone_number},
        EndPoints.customer.brandNameCheck
      );

      const data = response?.data;

      if (response?.success && data?.available) {
        setCheckResult(data);
        setIsAvailable(true);
        setCurrentStep(2);
      } else {
        setIsAvailable(false);
        setErrorMessage(
          data?.message ||
          response?.message ||
          t("brandName:step1.unavailable", { name: trimmed })
        );
      }
      toast.success(response?.message)
    } catch (error) {
      setIsAvailable(false);
      const message =
        typeof error === "string"
          ? error
          : error?.message || t("brandName:step1.unavailable", { name: trimmed });
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async () => {
    const trimmed = brandName.trim();
    const userData=JSON.parse(localStorage.getItem("user"))

    if (!hasSubscriber) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await APICall(
        "post",
        {
          brandname: trimmed,
          callers_count: callerCount,
          service_id: servicePlan,
          channel: "WEB",
          phone_number: userData?.phone_number,
        },
        EndPoints.customer.brandNameRequest
      );

      if (response?.success) {
        setCurrentStep(3);
        toast.success(
          response?.message || t("brandName:step3.pendingMessage", { name: trimmed })
        );
      } else {
        toast.error(response?.message || t("brandName:step1.unavailable", { name: trimmed }));
      }
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || t("brandName:step1.unavailable", { name: trimmed });
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showFormSteps = currentStep <= 2;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 sm:p-6 shadow-sm">
        <BrandNameStepper currentStep={currentStep} />
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 sm:p-6 shadow-sm">
        {showFormSteps && (
          <>
            <CheckAvailabilityStep
              brandName={brandName}
              onBrandNameChange={handleBrandNameChange}
              onCheckAvailability={handleCheckAvailability}
              isChecking={isChecking}
              isAvailable={isAvailable}
              errorMessage={errorMessage}
              hasSubscriber={hasSubscriber}
              isLoadingEligibility={isLoadingEligibility}
            />
            {isAvailable && currentStep >= 2 && (
              <SubmitBrandRequestStep
                callerCount={callerCount}
                onCallerCountChange={setCallerCount}
                servicePlan={servicePlan}
                onServicePlanChange={setServicePlan}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                pricing={checkResult?.pricing}
                brandType={checkResult?.brand_type}
                hasSubscriber={hasSubscriber}
              />
            )}
          </>
        )}

        {!showFormSteps && (
          <BrandNamePendingStep step={currentStep} brandName={brandName.trim()} />
        )}
      </div>
    </div>
  );
}
