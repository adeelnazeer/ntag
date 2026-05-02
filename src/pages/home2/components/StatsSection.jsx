import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function StatsSection() {
  const { t } = useTranslation("homePage2");
  const stats = useMemo(() => {
    const items = t("stats.items", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  return (
    <section className=" bg-brand-blue">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border-white/20 px-4 py-6 text-center odd:border-r md:border-r last:border-r-0">
            <div className="text-2xl font-black text-white md:text-2xl">{s.value}</div>
            <div className="mt-1 text-xs font-semibold text-white">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
