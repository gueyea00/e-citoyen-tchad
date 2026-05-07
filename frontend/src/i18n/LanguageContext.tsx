import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations, type Locale } from "./translations";

type TranslationType = (typeof translations)[Locale];

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationType;
  dir: "ltr" | "rtl";
  cmsLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const API_BASE = '/api';


/**
 * Fusionne en profondeur deux objets (les valeurs CMS écrasent les valeurs par défaut)
 */
function deepMerge(target: any, source: any): any {
  if (!source || typeof source !== "object") return target;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (typeof source[key] === "object" && source[key] !== null && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("locale") as Locale;
    if (saved && ["fr", "ar", "en"].includes(saved)) return saved;
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang === "ar") return "ar";
    if (browserLang === "en") return "en";
    return "fr";
  });

  // Stock les traductions courantes (par défaut + overrides CMS)
  const [currentTranslations, setCurrentTranslations] = useState<TranslationType>(translations[locale]);
  const [cmsLoaded, setCmsLoaded] = useState(false);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }, []);

  const dir = locale === "ar" ? "rtl" : "ltr";

  // Charge les textes CMS pour la locale active
  useEffect(() => {
    const localDefault = translations[locale];

    // Toujours commencer avec les valeurs par défaut
    setCurrentTranslations(localDefault);
    setCmsLoaded(false);

    // Essaie de charger les overrides depuis le CMS
    fetch(`${API_BASE}/admin/content/translations_${locale}`)
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(data => {
        if (data?.value && typeof data.value === "object") {
          // Fusionne : les valeurs CMS écrasent les defaults
          const merged = deepMerge(localDefault, data.value);
          setCurrentTranslations(merged as TranslationType);
        }
        setCmsLoaded(true);
      })
      .catch(() => {
        // Silently fallback sur les defaults si le backend n'est pas disponible
        setCmsLoaded(true);
      });
  }, [locale]);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale, dir]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: currentTranslations, dir, cmsLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
