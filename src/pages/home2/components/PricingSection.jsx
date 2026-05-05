import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import SectionTitle from "./SectionTitle";

export default function PricingSection() {
  const { t } = useTranslation("homePage2");
  const pricingPlans = useMemo(() => {
    const items = t("pricing.plans", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  const paymentChannels = useMemo(() => {
    const items = t("pricing.paymentChannels", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  const pricingNotes = useMemo(() => {
    const items = t("pricing.notes", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  return (
    <section id="pricing" className="bg-gradient-to-br from-brand-green-dark via-brand-green to-brand-green-muted py-16 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <SectionTitle white label={t("pricing.label")} title={t("pricing.title")} sub={t("pricing.sub")} 
        
        className="mb-2"
        />

        {pricingNotes.length > 0 ? (
          <ul className="mb-8 max-w-3xl list-none space-y-2 text-sm leading-relaxed text-white/90 md:text-[15px]">
            {pricingNotes.map((note) => (
              <li key={note} className="flex gap-2">
                <span className="shrink-0 select-none font-semibold" aria-hidden>
                  *
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`group relative min-h-[260px] cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white text-left shadow-[0_8px_18px_rgba(0,0,0,0.15)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(0,0,0,0.20)] ${plan.accent}`}
            >
              <div className="p-5">
                <div className="relative z-10 mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-brand-blue-soft bg-brand-blue-tint text-xs font-bold text-brand-blue">
                  {plan.code}
                </div>
                <div className="relative z-10 text-lg md:text-xl font-extrabold leading-tight text-brand-blue">{plan.name}</div>
                <p className="relative z-10 mt-1 text-sm md:text-base leading-relaxed text-brand-blue-text-muted">{plan.desc}</p>
              </div>
              <div className={`pointer-events-none absolute bottom-0 right-0 z-0 flex justify-end ${plan.tint}`}>
                <img src={plan.img} alt={plan.name} className="w-[230px] h-[190px] object-contain" />
              </div>
            </div>
          ))}
        </div>

        <h3 className="mb-4 mt-8 text-xl font-extrabold">{t("pricing.paymentTitle")}</h3>
        <div className="grid gap-4 lg:grid-cols-3">
          {paymentChannels.map((channel) => (
            <div
              key={channel.title}
              className="flex items-center gap-3 rounded-2xl border border-brand-blue-border-soft bg-brand-card-blue p-4 transition-all duration-200 hover:border-brand-blue/40 hover:bg-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
            >
              <div className="grid h-14 w-14 place-items-center bg-brand-blue-tint text-brand-blue">
                <img src={channel.img} alt={channel.title} className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-blue">{channel.title}</p>
                <p className="text-xs text-brand-blue-text-muted">{channel.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
