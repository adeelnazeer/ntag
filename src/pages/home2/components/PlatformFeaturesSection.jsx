import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import SectionTitle from "./SectionTitle";

export default function PlatformFeaturesSection() {
  const { t } = useTranslation("homePage2");
  const features = useMemo(() => {
    const items = t("featuresSection.items", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  return (
    <section id="features" className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
      <div className="mb-10 text-center">
        <SectionTitle label={t("featuresSection.label")} title={t("featuresSection.title")} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border cursor-pointer border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          >
            <img src={feature.img} alt={feature.title} className="mb-4 w-12 h-12 object-contain" />
            <h3 className="mb-2 text-sm font-bold text-brand-blue">{feature.title}</h3>
            <p className="text-sm text-[#666]">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
