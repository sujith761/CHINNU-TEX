import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import translations from '../data/translations';

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('chinnutex-lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('chinnutex-lang', lang);
    document.documentElement.lang = lang === 'ta' ? 'ta' : 'en';
  }, [lang]);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ta' : 'en');

  const t = useCallback((key) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.en || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
