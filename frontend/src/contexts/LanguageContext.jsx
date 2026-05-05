import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../i18n/en';
import ar from '../i18n/ar';

const LanguageContext = createContext(null);

const translations = { en, ar };

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('manikan_lang') || 'en');

  // Apply RTL / LTR and lang attribute to document
  useEffect(() => {
    const isRTL = lang === 'ar';
    document.documentElement.dir  = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('manikan_lang', lang);
  }, [lang]);

  // Translation function — falls back to key if missing
  const t = (key) => translations[lang]?.[key] ?? translations['en']?.[key] ?? key;

  const isRTL = lang === 'ar';

  const toggleLang = () => setLang((l) => (l === 'en' ? 'ar' : 'en'));

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook — use anywhere in the app
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
