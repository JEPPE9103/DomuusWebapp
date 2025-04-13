import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import sv from './locales/sv.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector) // Detekterar språk från browser/cookies
  .use(initReactI18next) // Kopplar till React
  .init({
    fallbackLng: 'sv', // Standard om språk ej hittas
    debug: false,
    interpolation: {
      escapeValue: false, // React hanterar XSS
    },
    resources: {
      sv: { translation: sv },
      en: { translation: en },
    },
  });

export default i18n;
