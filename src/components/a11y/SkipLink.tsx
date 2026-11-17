"use client";

import { useTranslation } from "@/components/providers/I18nProvider";

/** First focusable element in the document, so it is reachable by one Tab. */
export function SkipLink() {
  const { t } = useTranslation();
  return (
    <a href="#main-content" className="skip-link">
      {t("a11y.skip_to_content")}
    </a>
  );
}
