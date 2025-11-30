// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";

// import en from "./locale/en.json";
// import ar from "./locale/ar.json";
// import amET from "./locale/am-ET.json";

// const resources = {
//   en: { common: en },
//   ar: { common: ar },
//   amET: { common: amET },
// };

// // Languages that should render RTL
// const RTL_LANGS = new Set(["ar", "fa", "ur", "he"]);

// // Update <html dir> when language changes
// function applyDir(lang) {
//   const dir = RTL_LANGS.has(lang) ? "rtl" : "ltr";
//   document.documentElement.setAttribute("dir", dir);
//   document.documentElement.setAttribute("lang", lang);
// }

// i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     resources,
//     // fallbackLng: "en",
//     supportedLngs: ["en", "ar", "amET"],
//     ns: ["common"],
//     defaultNS: "common",
//     detection: {
//       order: ["localStorage", "querystring", "navigator", "htmlTag"],
//       caches: ["localStorage"],
//     },
//     interpolation: { escapeValue: false },
//   });

// // set dir on first load
// applyDir(i18n.resolvedLanguage);

// // set dir whenever language changes
// i18n.on("languageChanged", (lng) => applyDir(lng));

// export default i18n;



import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

/**
 * Vite will import all JSON translation files.
 * Supports:
 *  - src/locale/{lng}/{ns}.json  (folder style)
 *  - src/locale/{lng}.json       (flat style, treated as ns "common")
 */
const modules = import.meta.glob("./locale/**/**.json", { eager: true });

/** Helper: normalize language codes */
const normalizeLang = (lng) => {
  // keep BCP-47 with dash (am-ET), but also accept amET → am-ET
  if (!lng) return "en";
  if (lng === "amET") return "amET";
  if (lng.toLowerCase() === "amet" || lng.toLowerCase() === "am-et") return "am-ET";
  if (lng === "ar") return "ar";
  if (lng === "en") return "en";
  if (lng === "or") return "or";

  return lng;
};

/** Build resources = { lng: { ns: {...} } } */
const resources = {};
Object.entries(modules).forEach(([p, mod]) => {
  // Examples of p:
  //   "./locale/en/common.json"  -> lng="en", ns="common"
  //   "./locale/ar.json"         -> lng="ar",  ns="common"
  const m1 = p.match(/locale\/([^/]+)\/([^/]+)\.json$/);   // folder style
  const m2 = p.match(/locale\/([^/]+)\.json$/);            // flat style

  let lng, ns;
  if (m1) {
    lng = normalizeLang(m1[1]);
    ns = m1[2]; // filename is the namespace
  } else if (m2) {
    lng = normalizeLang(m2[1]);
    ns = "common";
  } else {
    return;
  }

  resources[lng] ??= {};
  resources[lng][ns] ??= {};

  // merge in case both flat and folder exist
  const json = mod.default || mod;
  Object.assign(resources[lng][ns], json);
});

/** Determine supported languages & namespaces */
const supportedLngs = Object.keys(resources).length
  ? Object.keys(resources)
  : ["en"];

const ns = Object.keys(resources[supportedLngs[0]] || { common: {} });

/** RTL languages */
const RTL_LANGS = new Set(["ar", "fa", "ur", "he"]);
function applyDir(lang) {
  const lng = normalizeLang(lang);
  const dir = RTL_LANGS.has(lng) ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lng);
}

/** Init i18next */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    ns,
    defaultNS: "common",
    // fallbackLng: "en",
    supportedLngs,
    detection: {
      order: ["localStorage", "querystring", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: true },
  });

/** Apply dir initially & on change */
applyDir(i18n.resolvedLanguage || "en");
i18n.on("languageChanged", (lng) => applyDir(lng));

export default i18n;
