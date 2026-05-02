import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TIER_STYLES } from "../constants";
import SectionTitle from "./SectionTitle";

export default function TiersSection() {
  const { t } = useTranslation("homePage2");
  const tiers = useMemo(() => {
    const items = t("tiers.items", { returnObjects: true });
    if (!Array.isArray(items)) return [];
    return items.map((item) => ({
      ...item,
      ...(TIER_STYLES[item.id] || {}),
    }));
  }, [t]);

  return (
    <section id="tiers" className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
      <div className="mb-10 text-center">
        <SectionTitle label={t("tiers.label")} title={t("tiers.title")} sub={t("tiers.sub")} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => (
          <div
            key={tier.id || tier.name}
            className="overflow-hidden rounded-2xl border cursor-pointer border-[#E6E6E6] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          >
            <div className={`px-6 py-8 text-center text-white ${tier.headerClass}`}>
              <div className="text-sm font-extrabold uppercase tracking-[1.5px]">{tier.name}</div>
              <div className="my-2 text-[32px] font-black leading-none">{tier.tag}</div>
              <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[1px] ${tier.chipClass}`}>
                {tier.chipLabel}
              </span>
            </div>
            <div className="space-y-1 px-5 py-8">
              <div className={`text-[13px] font-extrabold uppercase tracking-[1.2px] ${tier.levelClass}`}>{tier.level}</div>
              <div className="text-sm leading-snug text-[#666]">{tier.description}</div>
              <div className="text-sm leading-snug text-[#666]">
                {t("tiers.examplesPrefix")}
                <span className="font-semibold text-[#4D4D4D]">{tier.examples}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
