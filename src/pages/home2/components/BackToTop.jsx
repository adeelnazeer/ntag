import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoArrowUp } from "react-icons/io5";

export default function BackToTop() {
  const { t } = useTranslation("homePage2");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const scrollProgress = pageHeight > 0 ? scrollBottom / pageHeight : 0;
      setShowBackToTop(scrollProgress >= 0.7);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showBackToTop) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-base font-bold text-brand-blue shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white md:right-10"
    >
      <span>{t("backToTop")}</span>
      <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-blue text-white">
        <IoArrowUp className="text-base" />
      </span>
    </button>
  );
}
