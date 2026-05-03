import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../redux/hooks";
import APICall from "../../../network/APICall";
import EndPoints from "../../../network/EndPoints";
import { ConstentRoutes } from "../../../utilities/routesConst";

/** Matches i18n codes used in HeaderNew when `footer.languages` is still a string array (index order). */
const FOOTER_LANG_CODES_FALLBACK = ["en", "amET", "or", "ti", "so"];

export default function FooterSection() {
  const { t, i18n } = useTranslation("homePage2");
  const navigate = useNavigate();
  const location = useLocation();
  const userFromStore = useAppSelector((state) => state.user.userData);
  const userFromStorage = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);
  const userData = userFromStore ?? userFromStorage;
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

  const footerSubscribeLinks = useMemo(() => {
    const items = t("footer.subscribeLinks", { returnObjects: true });
    return Array.isArray(items) ? items : [];
  }, [t]);

  /** Same destinations as `src/components/footer.jsx`; labels follow `footer.supportLinks` order. */
  const footerSupportNavItems = useMemo(() => {
    const labels = t("footer.supportLinks", { returnObjects: true });
    if (!Array.isArray(labels)) return [];

    const actions = [
      () => navigate(ConstentRoutes.termofuse),
      () => navigate(ConstentRoutes.privacyPolicy),
      () =>
        navigate(ConstentRoutes.FrequentlyAskedQuestions, {
          state: { isIndividual: Boolean(location?.pathname?.includes("customer")) },
        }),
      () => {
        if (token && userData) {
          if (userData.customer_type === "individual") {
            navigate("/individual/contact");
          } else {
            navigate("/contact");
          }
        } else {
          navigate("/contact-us");
        }
      },
      () => navigate(ConstentRoutes.complaint),
    ];

    return labels
      .map((label, i) => {
        if (i >= actions.length) return null;
        const text = typeof label === "string" ? label : label?.label;
        if (!text) return null;
        return { key: `support-${i}`, label: text, onClick: actions[i] };
      })
      .filter(Boolean);
  }, [t, navigate, location?.pathname, token, userData]);

  const footerLanguages = useMemo(() => {
    const items = t("footer.languages", { returnObjects: true });
    if (!Array.isArray(items)) return [];
    return items
      .map((item, index) => {
        if (item && typeof item === "object" && item.code && item.label) {
          return { code: item.code, label: item.label };
        }
        if (typeof item === "string") {
          const code = FOOTER_LANG_CODES_FALLBACK[index] ?? "en";
          return { code, label: item };
        }
        return null;
      })
      .filter(Boolean);
  }, [t]);

  const handleLanguageChange = async (code) => {
    i18n.changeLanguage(code);
    try {
      localStorage.setItem("i18nextLng", code);
    } catch {
      /* ignore */
    }

    if (token && userData) {
      try {
        const userId =
          localStorage.getItem("id") ||
          userData?.id ||
          userData?.customer_account_id ||
          userData?.customer_id;

        if (userId) {
          const payload = {
            user_lang: code === "amET" ? "am" : code,
          };
          const endpoint =
            userData?.customer_type === "individual"
              ? EndPoints.customer.newSecurityEndPoints.individual.updateProfile
              : EndPoints.customer.newSecurityEndPoints.corporate.updateProfile;
          const method = userData?.customer_type === "individual" ? "post" : "put";

          const response = await APICall(method, payload, endpoint);

          if (response?.success) {
            if (response?.data) {
              localStorage.setItem("user", JSON.stringify(response.data));
            }
            window.location.reload();
          } else {
            console.error("Failed to update language on server:", response?.message);
          }
        }
      } catch (error) {
        console.error("Error updating language:", error);
      }
    }
  };

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
              {footerSupportNavItems.map(({ key, label, onClick }) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={onClick}
                    className="text-left underline-offset-2 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[1px]">{t("footer.languagesTitle")}</p>
            <ul className="space-y-1.5 text-xs text-white/75">
              {footerLanguages.map(({ code, label }) => (
                <li key={code}>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange(code)}
                    className="text-left underline-offset-2 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                  >
                    {label}
                  </button>
                </li>
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
