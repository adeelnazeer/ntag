import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import SectionTitle from "./SectionTitle";

export default function FaqSection() {
  const { t } = useTranslation("homePage2");
  const [openFaq, setOpenFaq] = useState(0);

  const faqItems = useMemo(() => {
    const items = t("faq.items", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  return (
    <section id="faq" className="mx-auto w-full max-w-4xl px-4 py-16 md:px-6">
      <div className="mb-8 text-center">
        <SectionTitle label={t("faq.label")} title={t("faq.title")} />
      </div>
      {faqItems.map((item, idx) => (
        <div
          key={item.id || item.q}
          className="mb-3 overflow-hidden rounded-xl border border-gray-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
        >
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between border-0 bg-white px-5 py-4 text-left text-sm font-bold text-brand-blue transition-colors duration-200 "
            onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
          >
            {item.q}
            <span className="text-xl text-brand-green">{openFaq === idx ? t("faq.iconExpanded") : t("faq.iconCollapsed")}</span>
          </button>
          {openFaq === idx && <div className="bg-[#F7F7F7] px-5 py-4 text-sm text-[#666]">{item.a}</div>}
        </div>
      ))}
      <button type="button" className="mt-2 text-sm font-bold text-brand-green hover:text-brand-green-dark">
        {t("faq.moreQuestions")}
      </button>
    </section>
  );
}
