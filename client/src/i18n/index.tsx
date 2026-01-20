import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import en from "./locales/en.json";
import pt from "./locales/pt.json";
import es from "./locales/es.json";

type Translations = typeof en;
type Language = "en" | "pt" | "es";

const translations: Record<Language, Translations> = { en, pt, es };

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "US" },
  { code: "pt", name: "Portugues", flag: "BR" },
  { code: "es", name: "Espanol", flag: "ES" },
];

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getNestedValue(obj: any, path: string): string {
  const keys = path.split(".");
  let result = obj;
  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = result[key];
    } else {
      return path;
    }
  }
  return typeof result === "string" ? result : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language;
      if (saved && translations[saved]) {
        return saved;
      }
      const browserLang = navigator.language.split("-")[0] as Language;
      if (translations[browserLang]) {
        return browserLang;
      }
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return getNestedValue(translations[language], key);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
