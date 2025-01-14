"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/lib/i18n/locales/en.json";
import tr from "@/lib/i18n/locales/tr.json";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

const initI18n = i18n.createInstance();

initI18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
  lng: "tr",
  fallbackLng: "tr",
  interpolation: {
    escapeValue: false,
  },
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLocale = Cookies.get("NEXT_LOCALE");
    if (savedLocale) {
      initI18n.changeLanguage(savedLocale);
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <I18nextProvider i18n={initI18n}>{children}</I18nextProvider>;
}
