/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const STEPPER_LINE_TOP = "1.375rem";

export default function BrandNameStepper({ currentStep }) {
  const { t } = useTranslation(["brandName"]);

  const steps = useMemo(
    () => [
      { id: 1, label: t("brandName:stepper.step1") },
      { id: 2, label: t("brandName:stepper.step2") },
      { id: 3, label: t("brandName:stepper.step3") },
      { id: 4, label: t("brandName:stepper.step4") },
      { id: 5, label: t("brandName:stepper.step5") },
    ],
    [t]
  );

  return (
    <div className="relative w-full px-1 sm:px-2 pt-1 pb-2">
      <div
        className="absolute left-[calc(10%+0.55rem)] right-[calc(10%+0.55rem)] h-0.5 bg-[#E0E0E0] z-0 pointer-events-none"
        style={{ top: STEPPER_LINE_TOP }}
        aria-hidden
      />
      <div
        className="absolute left-[calc(10%+0.55rem)] h-0.5 bg-secondary z-0 pointer-events-none transition-all duration-300"
        style={{
          top: STEPPER_LINE_TOP,
          width: `${Math.max(0, Math.min(currentStep - 1, 4)) * 20}%`,
        }}
        aria-hidden
      />
      <div className="relative z-[1] grid grid-cols-5 gap-0">
        {steps.map((step) => {
          const isCurrent = currentStep === step.id;
          const isDone = currentStep > step.id;
          const active = isCurrent || isDone;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center text-center min-w-0 px-0.5"
            >
              <div
                className={[
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  isCurrent
                    ? "bg-brand-blue text-white shadow-sm"
                    : isDone
                      ? "bg-secondary text-white"
                      : "border border-[#D1D5DB] bg-white text-[#9CA3AF]",
                ].join(" ")}
              >
                {step.id}
              </div>
              <p
                className={[
                  "mt-2 text-[10px] sm:text-[11px] font-medium leading-tight max-w-[4.5rem] sm:max-w-[6rem]",
                  active ? "text-secondary" : "text-[#9CA3AF]",
                ].join(" ")}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
