"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LOCALES } from "@/lib/i18n/dictionaries";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t("language.change")}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-neutral-muted transition-colors hover:bg-neutral-hover hover:text-brand-graphite"
      >
        <Globe size={18} aria-hidden="true" />
        <span className="hidden text-xs font-semibold uppercase sm:inline">{current.code}</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={t("language.change")}
          className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-brand-silver bg-surface-white shadow-lg"
        >
          {LOCALES.map((l) => {
            const isActive = l.code === locale;
            return (
              <button
                key={l.code}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                lang={l.code}
                onClick={() => {
                  setLocale(l.code);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-brand-red/10 font-semibold text-brand-red"
                    : "text-brand-graphite hover:bg-surface-grey"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{l.flag}</span> {l.label}
                </span>
                {isActive && <Check size={14} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
