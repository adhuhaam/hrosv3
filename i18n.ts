// i18n.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import bn from './locales/bn.json';
import dv from './locales/dv.json';
import en from './locales/en.json';
import hi from './locales/hi.json';
import ml from './locales/ml.json';
import si from './locales/si.json';
import ta from './locales/ta.json';

// AsyncStorage-based language detector
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const storedLang = await AsyncStorage.getItem('lang');
      const deviceLang = Localization.locale?.split?.('-')[0] || 'en';
      callback(storedLang || deviceLang);
    } catch {
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (lang: string) => {
    await AsyncStorage.setItem('lang', lang);
  },
};

i18n
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      dv: { translation: dv },
      hi: { translation: hi },
      ta: { translation: ta },
      ml: { translation: ml },
      bn: { translation: bn },
      si: { translation: si },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
