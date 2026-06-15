import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { FaCheck, FaCircleExclamation, FaDownload, FaPlus, FaStar, FaXmark } from "react-icons/fa6";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import { ConstentRoutes } from "../../utilities/routesConst";
import BrandNameStepper from "./components/BrandNameStepper";
import RestrictedKeywordsSection from "./components/RestrictedKeywordsSection";

const RULE_ICONS = {
  allowed: FaCheck,
  denied: FaXmark,
  warning: FaCircleExclamation,
};

const RULE_ICON_STYLES = {
  allowed: "bg-brand-green-pale text-secondary",
  denied: "bg-red-50 text-red-600",
  warning: "bg-amber-50 text-amber-600",
};

export default function BrandNameIntroPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(["brandName"]);

  const stepLabels = useMemo(() => {
    const items = t("brandName:intro.stepper", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  const stats = useMemo(() => {
    const items = t("brandName:intro.stats", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  const formattingRules = useMemo(() => {
    const items = t("brandName:intro.formattingRules.items", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  const reviewSteps = useMemo(() => {
    const items = t("brandName:intro.reviewProcess.steps", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  const goToApply = () => navigate(ConstentRoutes.brandNameCallBuy);

  return (
    <div className="flex flex-col gap-4">
      <section className="overflow-hidden rounded-xl bg-gradient-to-br from-brand-green via-secondary to-brand-green-dark text-white shadow-sm">
        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex items-start gap-3">
            <FaStar className="mt-1 h-5 w-5 shrink-0 text-white/90" aria-hidden />
            <div>
              <h1 className="text-xl font-extrabold leading-tight sm:text-2xl">
                {t("brandName:intro.hero.title")}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-[15px]">
                {t("brandName:intro.hero.description")}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              onClick={goToApply}
              className="flex items-center justify-center gap-2 bg-white text-brand-blue normal-case text-sm font-semibold shadow-none hover:shadow-none hover:bg-white/95"
            >
              <FaPlus className="h-3.5 w-3.5" aria-hidden />
              {t("brandName:intro.hero.applyButton")}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => window.open(t("brandName:intro.hero.policyPdfUrl"), "_blank", "noopener,noreferrer")}
              className="flex items-center justify-center gap-2 border-white/80 bg-transparent text-white normal-case text-sm font-semibold shadow-none hover:shadow-none hover:bg-white/10"
            >
              <FaDownload className="h-3.5 w-3.5" aria-hidden />
              {t("brandName:intro.hero.downloadButton")}
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6">
        <BrandNameStepper currentStep={5} stepLabels={stepLabels} />
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-brand-blue-border-soft bg-brand-card-blue px-4 py-4 sm:px-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue-text-muted sm:text-sm">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-extrabold text-brand-blue sm:text-3xl">{stat.value}</p>
            <p className="mt-1 text-xs text-[#6B7280] sm:text-sm">{stat.suffix}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-green-pale text-secondary">
            <FaCheck className="h-4 w-4" aria-hidden />
          </div>
          <h2 className="text-base font-bold text-brand-blue sm:text-lg">
            {t("brandName:intro.formattingRules.title")}
          </h2>
        </div>

        <ul className="space-y-3">
          {formattingRules.map((rule) => {
            const Icon = RULE_ICONS[rule.type] || FaCheck;
            const iconStyle = RULE_ICON_STYLES[rule.type] || RULE_ICON_STYLES.allowed;

            return (
              <li key={rule.text} className="flex items-start gap-3">
                <div className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${iconStyle}`}>
                  <Icon className="h-3 w-3" aria-hidden />
                </div>
                <p className="text-sm leading-relaxed text-[#4B5563]">{rule.text}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <RestrictedKeywordsSection
        translationKey="intro.restrictedKeywords"
        collapsible={false}
        footerNoteKey="intro.restrictedKeywords.licensedNote"
      />

      <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-blue-tint text-brand-blue">
            <HiOutlineClipboardDocumentList className="h-4 w-4" aria-hidden />
          </div>
          <h2 className="text-base font-bold text-brand-blue sm:text-lg">
            {t("brandName:intro.reviewProcess.title")}
          </h2>
        </div>

        <ol className="space-y-3">
          {reviewSteps.map((step, index) => (
            <li key={step} className="flex items-start gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-white">
                {index + 1}
              </span>
              <p className="pt-1 text-sm leading-relaxed text-[#4B5563]">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <Button
        type="button"
        onClick={goToApply}
        className="w-full bg-secondary py-3 text-sm font-semibold normal-case text-white shadow-none hover:shadow-none hover:bg-brand-green-dark"
      >
        {t("brandName:intro.ctaButton")}
      </Button>
    </div>
  );
}
