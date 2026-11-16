"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import {
  DEFAULT_LOCALE,
  dictionaries,
  isLocale,
  matchLocale,
  type Locale,
  type TranslationKey,
} from "@/lib/i18n/dictionaries";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => dictionaries[DEFAULT_LOCALE][key] ?? key,
});

export const useLanguage = () => useContext(LanguageContext);

/** Alias so pages can read as `const { t } = useTranslation()`. */
export const useTranslation = useLanguage;

const STORAGE_KEY = "truewheels-locale";

function readStoredLocale(): Locale | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isLocale(saved) ? saved : null;
  } catch {
    // localStorage can throw in private mode / sandboxed iframes.
    return null;
  }
}

function detectLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  // Prefer the ordered preference list; fall back to navigator.language.
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of candidates) {
    const matched = matchLocale(tag);
    // matchLocale returns DEFAULT_LOCALE for unsupported tags, so only accept a
    // non-default match, or the default if nothing else matches at all.
    if (matched !== DEFAULT_LOCALE) return matched;
  }
  return DEFAULT_LOCALE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Hydrate from storage, then browser preference.
  useEffect(() => {
    setLocaleState(readStoredLocale() ?? detectLocale());
  }, []);

  // Keep <html lang> in sync on hydration and on every change. The brief only
  // set it inside setLocale, so a reload with a saved locale left lang="en".
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // Persistence is best-effort.
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => dictionaries[locale][key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key,
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
