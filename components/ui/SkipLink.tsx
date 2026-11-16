"use client";

import { useTranslation } from "@/components/providers/LanguageProvider";

/**
 * First focusable element in the document. Hidden until it receives keyboard
 * focus, at which point it overlays the page so a keyboard user can jump past
 * the header straight to <main id="main-content">.
 */
export function SkipLink() {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-graphite focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
    >
      {t("a11y.skipToContent")}
    </a>
  );
}
