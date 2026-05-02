import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function FooterSection() {
  const { t } = useTranslation("homePage2");

  const footerSubscribeLinks = useMemo(() => {
    const items = t("footer.subscribeLinks", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  const footerSupportLinks = useMemo(() => {
    const items = t("footer.supportLinks", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  const footerLanguages = useMemo(() => {
    const items = t("footer.languages", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  return (
    <footer className="bg-brand-blue text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-brand-blue text-2xl font-black text-brand-green">#</div>
              <div>
                <p className="text-base font-extrabold leading-none">{t("footer.brand")}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[1px] text-brand-green-footer">{t("footer.brandSub")}</p>
              </div>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-white/70">{t("footer.tagline")}</p>
          </div>

          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[1px]">{t("footer.subscribeTitle")}</p>
            <ul className="space-y-1.5 text-xs text-white/75">
              {footerSubscribeLinks.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[1px]">{t("footer.supportTitle")}</p>
            <ul className="space-y-1.5 text-xs text-white/75">
              {footerSupportLinks.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[1px]">{t("footer.languagesTitle")}</p>
            <ul className="space-y-1.5 text-xs text-white/75">
              {footerLanguages.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-2 border-t border-white/15 pt-3 text-[11px] text-white/45 md:flex-row md:items-center md:justify-between">
          <p>{t("footer.copyright")}</p>
          <p>{t("footer.sites")}</p>
        </div>
      </div>
    </footer>
  );
}
