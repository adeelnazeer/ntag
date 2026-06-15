/* eslint-disable react/prop-types */
import { HiOutlineClock } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

const STEP_CONTENT = {
  3: {
    titleKey: "brandName:step3.title",
    descriptionKey: "brandName:step3.description",
    messageKey: "brandName:step3.pendingMessage",
  },
  4: {
    titleKey: "brandName:step4.title",
    descriptionKey: "brandName:step4.description",
    messageKey: "brandName:step4.pendingMessage",
  },
  5: {
    titleKey: "brandName:step5.title",
    descriptionKey: "brandName:step5.description",
    messageKey: "brandName:step5.pendingMessage",
  },
};

export default function BrandNamePendingStep({ step, brandName }) {
  const { t } = useTranslation(["brandName"]);
  const content = STEP_CONTENT[step];

  if (!content) return null;

  return (
    <section className="flex flex-col gap-4 py-2">
      <div className="flex items-start gap-2">
        <HiOutlineClock className="mt-1 h-5 w-5 shrink-0 text-brand-blue" />
        <div>
          <h2 className="text-base sm:text-lg font-bold text-brand-blue">
            {t(content.titleKey)}
          </h2>
          <p className="mt-1 text-sm text-[#6B7280] leading-relaxed">
            {t(content.descriptionKey)}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-brand-blue-border-soft bg-brand-blue-tint px-4 py-4">
        <p className="text-sm text-brand-blue-text-muted">
          {t(content.messageKey, { name: brandName })}
        </p>
      </div>
    </section>
  );
}
