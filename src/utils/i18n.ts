import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from '../assets/languages/en.json';
import kn from '../assets/languages/kn.json';

const resources = {
  en: { translation: en },
  kn: { translation: kn },
};

// Get device language
const getDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  if (Array.isArray(locales) && locales.length > 0) {
    const langCode = locales[0].languageCode;
    if (Object.keys(resources).includes(langCode)) {
      return langCode; 
    }
  }
  return 'en'; // fallback
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(), // 👈 dynamic
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;

