import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Curve from "../../../assets/images/curve.svg";
import SectionTitle from "./SectionTitle";

export default function WhatSection() {
  const { t } = useTranslation("homePage2");
  const whatBullets = useMemo(() => {
    const items = t("what.bullets", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6" id="what">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionTitle label={t("what.label")} title={t("what.title")} sub={t("what.sub")} />
          <div className="space-y-4">
            {whatBullets.map((title) => (
              <div
                key={title}
                className="rounded-xl cursor-pointer border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
              >
                <h3 className="mb-1 text-sm font-bold text-brand-blue">{title}</h3>
                <p className="text-sm text-[#666]">{t("what.bulletBody")}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-[#F3F4F6] p-5 md:p-6">
          <div className="space-y-3">
            <div className="rounded-xl bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-extrabold uppercase tracking-tight text-brand-green">{t("what.corporate.label")}</p>
                  <p className="mt-1 text-sm font-black leading-none text-[#2B2B2B]">{t("what.corporate.tagLine")}</p>
                  <p className="mt-1 text-sm font-bold text-[#2B2B2B]">{t("what.corporate.subtitle")}</p>
                  <p className="mt-1 text-sm text-[#787878]">{t("what.corporate.body")}</p>
                </div>
                <div className="w-[118px] shrink-0 rounded-[10px] bg-secondary p-3 text-center text-white">
                  <p className="text-[9px] font-semibold text-white/80">{t("what.corporate.incoming")}</p>
                  <div className="mx-auto mt-2 w-fit rounded-full bg-white px-4 py-1 text-sm font-bold text-[#2B2B2B]">{t("what.corporate.cli")}</div>
                  <div className="mt-3 flex items-center justify-center gap-3">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#FF3B30] text-[10px]">•</span>
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1DD75B] text-[10px]">•</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-extrabold uppercase tracking-tight text-brand-green">{t("what.individual.label")}</p>
                  <p className="mt-1 text-sm font-black leading-none text-[#2B2B2B]">{t("what.individual.tagLine")}</p>
                  <p className="mt-1 text-sm font-bold text-[#2B2B2B]">{t("what.individual.subtitle")}</p>
                  <p className="mt-1 text-sm text-[#787878]">{t("what.individual.body")}</p>
                </div>
                <div className="w-[118px] shrink-0 rounded-[10px] bg-brand-blue p-3 text-center text-white">
                  <p className="text-[9px] font-semibold text-white/80">{t("what.individual.incoming")}</p>
                  <div className="mx-auto mt-2 w-fit rounded-full bg-white px-4 py-1 text-sm font-bold text-[#2B2B2B]">{t("what.individual.cli")}</div>
                  <div className="mt-3 flex items-center justify-center gap-3">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#FF3B30] text-[10px]">•</span>
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1DD75B] text-[10px]">•</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <div className="  w-fit rounded-full border border-brand-blue/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[1.5px] text-brand-blue">
                {t("what.businessCardChip")}
              </div>
            </div>
            <div className="relative mx-auto mt-2 max-w-full overflow-hidden rounded-[28px] bg-[#F3F4F6] p-5 shadow-[0_16px_30px_rgba(0,0,0,0.14)]">
              <div className="absolute left-0 top-0 h-3 w-full bg-secondary" />
              <div className="pt-4">
                <div className="flex items-start justify-between border-b border-gray-400 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex gap-1">
                      <span className="h-8 w-1.5 -rotate-25 rounded bg-secondary" />
                      <span className="h-8 w-1.5 rotate-25 rounded bg-secondary" />
                      <span className="h-8 w-1.5 -rotate-25 rounded bg-brand-blue" />
                      <span className="h-8 w-1.5 rotate-25 rounded bg-brand-blue" />
                    </div>
                    <div>
                      <p className="text-[15px] font-extrabold tracking-tight text-brand-blue md:text-[18px]">{t("what.businessCard.company")}</p>
                      <p className="text-[11px] text-[#6f6f6f] md:text-[13px]">{t("what.businessCard.official")}</p>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-brand-blue md:text-[13px]">{t("what.businessCard.website")}</p>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-brand-blue">
                      <span className="grid h-7 w-7 place-items-center bg-secondary text-xl font-black text-white">#</span>
                      <p className="text-sm font-medium leading-none">{t("what.businessCard.tag")}</p>
                    </div>
                    <div className="flex items-center gap-2 text-brand-blue">
                      <span className="grid h-7 w-7 place-items-center bg-secondary text-sm text-white">☎</span>
                      <p className="text-sm">{t("what.businessCard.phone")}</p>
                    </div>
                    <div className="flex items-center gap-2 text-brand-blue">
                      <span className="grid h-7 w-7 place-items-center bg-secondary text-xs text-white">✉</span>
                      <p className="text-sm">{t("what.businessCard.email")}</p>
                    </div>
                    <div className="flex items-center gap-2 text-brand-blue">
                      <span className="grid h-7 w-7 place-items-center bg-secondary text-xs text-white">⌖</span>
                      <p className="text-sm">{t("what.businessCard.address")}</p>
                    </div>
                  </div>

                  <div className="relative min-w-0 self-end pr-0 text-left md:min-w-[160px] md:pr-2 md:text-right">
                    <img src={Curve} alt={t("what.curveAlt")} className="absolute -bottom-6 -right-2 z-[1] h-[130px] w-[170px] object-contain opacity-95" />
                    <div className="absolute -bottom-8 -right-16 z-0 h-[120px] w-[120px] rotate-45 bg-brand-blue" />
                    <div className="relative z-10 pb-7">
                      <p className="text-3xl font-black text-brand-blue">{t("what.businessCard.nameBlock")}</p>
                      <p className="text-base font-semibold text-[#7A7A7A]">{t("what.businessCard.role")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
