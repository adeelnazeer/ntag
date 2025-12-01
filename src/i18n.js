import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locale/en.json";
import ar from "./locale/ar.json";
import amET from "./locale/am-ET.json";

const resources = {
  en: { common: en },
  ar: { common: ar },
  amET: { common: amET },
};

// Languages that should render RTL
const RTL_LANGS = new Set(["ar", "fa", "ur", "he"]);

// Update <html dir> when language changes
function applyDir(lang) {
  const dir = RTL_LANGS.has(lang) ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lang);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // fallbackLng: "en",
    supportedLngs: ["en", "ar", "amET"],
    ns: ["common"],
    defaultNS: "common",
    detection: {
      order: ["localStorage", "querystring", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
  });

// set dir on first load
applyDir(i18n.resolvedLanguage);

// set dir whenever language changes
i18n.on("languageChanged", (lng) => applyDir(lng));

export default i18n;
