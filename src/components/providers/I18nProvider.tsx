"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  dictionaries,
  localeTag,
  type Locale,
  type TranslationKey,
} from "@/lib/i18n/dictionaries";

export const LOCALE_STORAGE_KEY = "truewheels-locale";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  /** BCP-47 tag for Intl, e.g. "en" -> "en-ZA". */
  tag: string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useTranslation must be used inside an I18nProvider");
  return context;
}

const isLocale = (value: string | null): value is Locale =>
  SUPPORTED_LOCALES.some((l) => l.code === value);

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    /* Storage can be unavailable in private mode. */
  }
  const candidates = [navigator.language, ...(navigator.languages ?? [])];
  for (const candidate of candidates) {
    const base = candidate?.split("-")[0]?.toLowerCase();
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Children render unconditionally. The sketched `if (!mounted) return null`
  // would emit an empty document on every server render, which is a blank page
  // for crawlers and throws for any consumer calling useTranslation during SSR.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const initial = detectLocale();
    setLocaleState(initial);
    document.documentElement.lang = initial;
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* The in-memory locale still applies for this session. */
    }
    document.documentElement.lang = next;
    // Keep the document language in sync for screen readers and SEO.
    document.documentElement.setAttribute("data-locale", next);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => dictionaries[locale][key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key,
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, tag: localeTag(locale) }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
