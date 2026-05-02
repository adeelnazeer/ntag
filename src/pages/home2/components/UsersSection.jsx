import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaLongArrowAltRight } from "react-icons/fa";
import AParty from "../../../assets/images/a-party.svg";
import BParty from "../../../assets/images/b-party.svg";
import { USER_FEATURE_ICONS } from "../constants";
import SectionTitle from "./SectionTitle";

export default function UsersSection() {
  const { t } = useTranslation("homePage2");
  const [activeTab, setActiveTab] = useState("individual");

  const activeTabItems = useMemo(() => {
    const key = activeTab === "individual" ? "users.features.individual" : "users.features.corporate";
    const items = t(key, { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [activeTab, t]);

  return (
    <section className=" bg-brand-green py-16 text-white" id="users">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <SectionTitle blue label={t("users.label")} title={t("users.title")} sub={t("users.sub")} />

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                type="button"
                className={`rounded-full border-1 px-5 py-2 text-sm font-bold ${
                  activeTab === "individual" ? "border-brand-blue bg-brand-blue text-white" : "border-white text-white"
                }`}
                onClick={() => setActiveTab("individual")}
              >
                {t("users.tabIndividual")}
              </button>
              <button
                type="button"
                className={`rounded-full border-1 px-5 py-2 text-sm font-bold ${
                  activeTab === "corporate" ? "border-brand-blue bg-brand-blue text-white" : "border-white text-white"
                }`}
                onClick={() => setActiveTab("corporate")}
              >
                {t("users.tabCorporate")}
              </button>
            </div>
            <ul className="space-y-3">
              {activeTabItems.map((item, idx) => {
                const FeatureIcon = USER_FEATURE_ICONS[idx % USER_FEATURE_ICONS.length];
                return (
                  <li key={`${activeTab}-${idx}`} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/95 text-brand-blue shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
                      <FeatureIcon className="text-lg" />
                    </span>
                    <div>
                      <div className="pt-1 text-sm font-bold">{item}</div>
                      <div className="text-xs text-white/70">{t("users.featureHint")}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-[28px] bg-[#d5d9df]  p-4 text-[#222] shadow-[0_14px_28px_rgba(0,0,0,0.2)] md:p-6">
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
              <div className="text-center">
                <p className="mb-4 text-base font-bold text-[#2D2D2D] md:mb-6 md:text-lg">{t("users.partyA")}</p>
                <img src={AParty} alt={t("users.partyA")} className="float-slow mx-auto w-[140px] object-contain md:w-[180px]" />
              </div>

              <div className="hidden px-2 text-[#fff] md:block">
                <FaLongArrowAltRight className="text-4xl text-white" />
              </div>

              <div className="text-center">
                <p className="mb-4 text-base font-bold text-[#2D2D2D] md:mb-6 md:text-lg">{t("users.partyB")}</p>
                <img src={BParty} alt={t("users.partyB")} className="float-slower mx-auto w-[140px] object-contain md:w-[180px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
