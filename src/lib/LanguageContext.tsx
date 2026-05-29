import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'id' | 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'id',
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('appLang');
      return (saved as Language) || 'id';
    }
    return 'id';
  });

  useEffect(() => {
    localStorage.setItem('appLang', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

interface TransProps {
  children: string | number;
}

export const useTranslation = () => {
  const { language } = useLanguage();
  const [cache, setCache] = useState<Record<string, string>>({});

  const t = async (text: string): Promise<string> => {
    if (language === 'id' || !text || text.trim() === '') return text;
    const cacheKey = `trans_${language}_${text}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=id|${language}`);
      const data = await response.json();
      if (data.responseData?.translatedText) {
        const result = data.responseData.translatedText;
        localStorage.setItem(cacheKey, result);
        return result;
      }
    } catch {}
    return text;
  };
  return { t, language };
};

export const Trans: React.FC<TransProps> = ({ children }) => {
  const { language } = useLanguage();
  const text = String(children);
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
     // Re-run whenever text or language changes
    setTranslatedText(text); // reset to original temporarily or while fetching

    if (language === 'id' || !text || text.trim() === '') {
      return;
    }

    const translate = async () => {
      const cacheKey = `trans_${language}_${text}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        setTranslatedText(cached);
        return;
      }

      try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=id|${language}`);
        const data = await response.json();
        
        if (data.responseData?.translatedText) {
          const result = data.responseData.translatedText;
          localStorage.setItem(cacheKey, result);
          setTranslatedText(result);
        } else {
          setTranslatedText(text);
        }
      } catch (error) {
        console.error("Translation error:", error);
        setTranslatedText(text);
      }
    };

    translate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, text]);

  return <>{translatedText}</>;
};
