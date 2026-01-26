import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import pirate from './locales/pirate.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pirate: { translation: pirate }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
