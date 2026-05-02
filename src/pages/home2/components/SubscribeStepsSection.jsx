import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SUBSCRIBE_CHANNEL_ICONS } from "../constants";

export default function SubscribeStepsSection() {
  const { t } = useTranslation("homePage2");
  const subscribeSteps = useMemo(() => {
    const items = t("subscribeSteps.steps", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  const subscribeChannels = useMemo(() => {
    const items = t("subscribeSteps.channels", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  return (
    <section className="bg-[#f4f5f7] py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <p className="mb-2 text-[11px] font-black uppercase tracking-[2.4px] text-brand-green/70">{t("subscribeSteps.label")}</p>
          <h2 className="text-2xl font-black text-brand-blue md:text-4xl">{t("subscribeSteps.title")}</h2>
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
          {subscribeSteps.map((step) => (
            <div key={step.no} className="text-center">
              <p className="text-[44px] font-black leading-none text-brand-green/80 [text-shadow:_0_1px_0_#ffffff,_0_0_1px_#3f6212]">{step.no}</p>
              <p className="mt-1 text-sm font-extrabold text-brand-blue">{step.title}</p>
              <p className="mx-auto mt-1 max-w-[220px] text-xs leading-relaxed text-[#6c7a8f]">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid max-w-2xl mx-auto gap-6 md:grid-cols-3">
          {subscribeChannels.map((channel, chIdx) => {
            const ChannelIcon = SUBSCRIBE_CHANNEL_ICONS[chIdx % SUBSCRIBE_CHANNEL_ICONS.length];
            return (
              <div key={channel.title} className=" items-center gap-3 rounded-2xl border border-[#d9dde5] bg-white px-5 py-5 shadow-[0_6px_16px_rgba(0,0,0,0.06)]">
                <div className="grid h-11 w-11 mx-auto place-items-center rounded-xl border border-brand-blue-soft bg-brand-blue-tint text-brand-green">
                  <ChannelIcon className="text-[22px]" />
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm font-bold text-brand-blue">{channel.title}</p>
                  <p className="text-xs mt-2 text-[#7a8798]">{channel.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
