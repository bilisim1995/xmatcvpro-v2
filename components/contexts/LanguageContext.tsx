'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '@/app/locales/en.json';
import tr from '@/app/locales/tr.json';
import ru from '@/app/locales/ru.json';
import hi from '@/app/locales/hi.json';
import de from '@/app/locales/de.json';

const translations = { en, ru, hi, de, tr };

type Language = 'en' | 'ru' | 'hi' | 'de' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as Language;
    if (storedLang) {
      setLanguageState(storedLang);
    } else {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('tr')) {
        setLanguageState('tr');
        localStorage.setItem('lang', 'tr');
      } else if (browserLang.startsWith('ru')) {
        setLanguageState('ru');
        localStorage.setItem('lang', 'ru');
      } else if (browserLang.startsWith('hi')) {
        setLanguageState('hi');
        localStorage.setItem('lang', 'hi');
      } else if (browserLang.startsWith('de')) {
        setLanguageState('de');
        localStorage.setItem('lang', 'de');
      } else {
        setLanguageState('en');
        localStorage.setItem('lang', 'en');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lang', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}