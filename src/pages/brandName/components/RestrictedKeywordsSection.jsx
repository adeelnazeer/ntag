import { useMemo, useState } from "react";
import {
  FaBuildingColumns,
  FaChevronDown,
  FaChevronUp,
  FaHospital,
  FaLandmark,
  FaMoneyBillWave,
  FaStar,
} from "react-icons/fa6";
import { MdEmergency } from "react-icons/md";
import { HiNoSymbol } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

const CATEGORY_ICONS = {
  govt: FaLandmark,
  regulatory: FaBuildingColumns,
  emergency: MdEmergency,
  financial: FaMoneyBillWave,
  health: FaHospital,
  platform: FaStar,
};

const TYPE_STYLES = {
  red: {
    card: "border-red-200 bg-red-50/90",
    title: "text-red-900",
    tag: "bg-red-100 text-red-800",
    icon: "text-red-600",
  },
  amber: {
    card: "border-amber-200 bg-amber-50/90",
    title: "text-amber-900",
    tag: "bg-amber-100 text-amber-900",
    icon: "text-amber-600",
  },
  blue: {
    card: "border-brand-blue-border-soft bg-brand-blue-tint",
    title: "text-brand-blue",
    tag: "bg-brand-blue-soft text-brand-blue",
    icon: "text-brand-blue",
  },
};

export default function RestrictedKeywordsSection({
  translationKey = "step1.restrictedKeywords",
  collapsible = true,
  defaultExpanded = true,
  footerNoteKey,
}) {
  const { t } = useTranslation(["brandName"]);
  const [expanded, setExpanded] = useState(defaultExpanded);

  const categories = useMemo(() => {
    const items = t(`brandName:${translationKey}.categories`, { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t, translationKey]);

  return (
    <div className="overflow-hidden rounded-xl border border-brand-green/25 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 bg-brand-green-pale px-4 py-3 sm:items-center">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-white">
            <HiNoSymbol className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-blue sm:text-[15px]">
              {t(`brandName:${translationKey}.title`)}
            </p>
            <p className="mt-0.5 text-xs text-brand-blue-text-muted sm:text-sm">
              {t(`brandName:${translationKey}.subtitle`)}
            </p>
          </div>
        </div>
        {collapsible ? (
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-secondary hover:text-brand-green-dark sm:text-sm"
          >
            {expanded
              ? t(`brandName:${translationKey}.hide`)
              : t(`brandName:${translationKey}.show`)}
            {expanded ? (
              <FaChevronUp className="h-3 w-3" aria-hidden />
            ) : (
              <FaChevronDown className="h-3 w-3" aria-hidden />
            )}
          </button>
        ) : null}
      </div>

      {expanded || !collapsible ? (
        <div className="space-y-3 border-t border-brand-green/15 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const styles = TYPE_STYLES[category.type] || TYPE_STYLES.red;
              const Icon = CATEGORY_ICONS[category.id] || FaLandmark;
              const keywords = Array.isArray(category.keywords) ? category.keywords : [];

              return (
                <div
                  key={category.id}
                  className={`rounded-xl border p-3 ${styles.card}`}
                >
                  <div className="mb-2.5 flex items-center gap-2">
                    <Icon className={`h-4 w-4 shrink-0 ${styles.icon}`} aria-hidden />
                    <div>
                      <p className={`text-xs font-bold leading-tight sm:text-sm ${styles.title}`}>
                        {category.title}
                      </p>
                      {category.note ? (
                        <p className="mt-0.5 text-[10px] font-medium leading-tight text-[#6B7280] sm:text-[11px]">
                          {category.note}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className={`rounded-md px-2 py-0.5 text-[11px] font-semibold sm:text-xs ${styles.tag}`}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2.5 text-xs leading-relaxed text-amber-950 sm:text-sm">
            <span className="font-semibold text-red-600">
              {t(`brandName:${translationKey}.legend.red`)}
            </span>
            {" = "}
            {t(`brandName:${translationKey}.legend.autoRejected`)}
            {". "}
            <span className="font-semibold text-amber-700">
              {t(`brandName:${translationKey}.legend.amber`)}
            </span>
            {" = "}
            {t(`brandName:${translationKey}.legend.manualReview`)}
            {". "}
            <span className="font-semibold text-brand-blue">
              {t(`brandName:${translationKey}.legend.blue`)}
            </span>
            {" = "}
            {t(`brandName:${translationKey}.legend.platformTerms`)}
          </div>

          {footerNoteKey ? (
            <p className="text-xs leading-relaxed text-brand-blue-text-muted sm:text-sm">
              {t(`brandName:${footerNoteKey}`)}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
