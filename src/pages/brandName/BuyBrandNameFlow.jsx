import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import BrandNameStepper from "./components/BrandNameStepper";
import CheckAvailabilityStep, { BRAND_NAME_PATTERN } from "./components/CheckAvailabilityStep";
import SubmitBrandRequestStep from "./components/SubmitBrandRequestStep";
import BrandNamePendingStep from "./components/BrandNamePendingStep";

export default function BuyBrandNameFlow() {
  const { t } = useTranslation(["brandName"]);

  const [currentStep, setCurrentStep] = useState(1);
  const [brandName, setBrandName] = useState("");
  const [callerCount, setCallerCount] = useState(1);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleBrandNameChange = (value) => {
    const sanitized = value.replace(/[^a-zA-Z0-9]/g, "");
    setBrandName(sanitized);
    setIsAvailable(false);
    setErrorMessage("");
    if (currentStep > 2) {
      setCurrentStep(1);
    }
  };

  const handleCheckAvailability = async () => {
    const trimmed = brandName.trim();

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

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const unavailableNames = ["ETHIO", "TELECOM", "NAMETAG"];
      const isTaken = unavailableNames.includes(trimmed.toUpperCase());

      if (isTaken) {
        setErrorMessage(t("brandName:step1.unavailable", { name: trimmed }));
        setIsAvailable(false);
        return;
      }

      setIsAvailable(true);
      setCurrentStep(2);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCurrentStep(3);
      toast.success(t("brandName:step3.pendingMessage", { name: brandName.trim() }));
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
            />
            {isAvailable && currentStep >= 2 && (
              <SubmitBrandRequestStep
                callerCount={callerCount}
                onCallerCountChange={setCallerCount}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
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
