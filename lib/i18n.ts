import i18next from "i18next";
import { initReactI18next } from "react-i18next";

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18next;
