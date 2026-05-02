import { useTranslation } from "react-i18next";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { IoCallOutline, IoMailOutline } from "react-icons/io5";

export default function CtaSection() {
  const { t } = useTranslation("homePage2");

  return (
    <section className="bg-brand-green py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-5 px-4 md:flex-row md:items-center md:px-6">
        <div>
          <h2 className="text-3xl font-black text-white">{t("cta.title")}</h2>
          <p className="text-white/85">{t("cta.sub")}</p>
        </div>
        <div className="w-full md:w-auto md:min-w-[520px]">
          <p className="text-base mb-4   font-semibold leading-none text-white">{t("cta.contactHeading")}</p>
          <div className="grid grid-cols-1 gap-3.5 text-white sm:grid-cols-2">
            <a href="tel:9234" className="flex items-center gap-2.5 text-sm font-semibold leading-none hover:text-white/80">
              <IoCallOutline className="text-base" />
              <span>{t("cta.phone")}</span>
            </a>
            <a href="mailto:info@tech-vas.com" className="flex items-center gap-2.5 text-sm font-semibold leading-none hover:text-white/80">
              <IoMailOutline className="text-base" />
              <span>{t("cta.email")}</span>
            </a>
            <a href="https://wa.me/" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-sm font-semibold leading-none hover:text-white/80">
              <FaWhatsapp className="text-base" />
              <span>{t("cta.whatsapp")}</span>
            </a>
            <a href="https://t.me/" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-sm font-semibold leading-none hover:text-white/80">
              <FaTelegramPlane className="text-base" />
              <span>{t("cta.telegram")}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
