import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./en.json";
import hiTranslations from "./hi.json";
import teTranslations from "./te.json";

// Get language from localStorage safely (with fallback)
const getStoredLanguage = () => {
  try {
    return localStorage.getItem("language") || "en";
  } catch (e) {
    return "en";
  }
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    hi: { translation: hiTranslations },
    te: { translation: teTranslations },
  },
  lng: getStoredLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false, // Disable Suspense for initial load
  },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
  document.documentElement.lang = lng;
});

export default i18n;
