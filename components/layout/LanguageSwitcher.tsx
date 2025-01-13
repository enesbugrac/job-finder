"use client";

import { useTranslation } from "react-i18next";
import { useCallback } from "react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = useCallback(() => {
    const newLang = i18n.language === "en" ? "tr" : "en";
    i18n.changeLanguage(newLang).catch(console.error);
  }, [i18n]);

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
    >
      {i18n.language === "en" ? "TR" : "EN"}
    </button>
  );
}
