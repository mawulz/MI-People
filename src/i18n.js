import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome",
      "change_language": "Change Language"
    }
  },
  id: {
    translation: {
      "welcome": "Selamat datang di website kami",
      "change_language": "Ganti Bahasa"
    }
  }
};

i18n
  .use(initReactI18next) // Pass i18next to react-i18next
  .use(LanguageDetector)  // Detect user language
  .init({
    resources,
    fallbackLng: 'en', // Default language
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
