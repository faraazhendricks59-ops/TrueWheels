"use client";

import { useCallback, useEffect, useState } from "react";
import { Cookie, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import {
  DEFAULT_PREFERENCES,
  OPEN_CONSENT_EVENT,
  readConsent,
  needsConsent,
  writeConsent,
  type CookiePreferences,
} from "@/lib/legal/cookie-consent";

interface CategoryDef {
  key: keyof CookiePreferences;
  labelKey: TranslationKey;
  descKey: TranslationKey;
  locked: boolean;
}

const CATEGORIES: CategoryDef[] = [
  { key: "essential", labelKey: "cookie.essential", descKey: "cookie.essentialDesc", locked: true },
  { key: "analytics", labelKey: "cookie.analytics", descKey: "cookie.analyticsDesc", locked: false },
  { key: "marketing", labelKey: "cookie.marketing", descKey: "cookie.marketingDesc", locked: false },
];

export function CookieConsentBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  // Show only when there is no valid, current-version decision on record.
  useEffect(() => {
    if (needsConsent()) setVisible(true);
  }, []);

  // Allow any UI (e.g. the footer) to reopen the panel with saved choices.
  useEffect(() => {
    const onOpen = () => {
      const saved = readConsent();
      setPrefs({
        essential: true,
        analytics: saved?.analytics ?? false,
        marketing: saved?.marketing ?? false,
      });
      setShowPreferences(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  const saveConsent = useCallback((choices: CookiePreferences) => {
    writeConsent(choices);
    setVisible(false);
    setShowPreferences(false);
    // Consent-gated scripts (analytics/marketing) would be initialised here
    // based on `choices`; nothing is loaded before this point.
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label={t("cookie.title")}
      // Clears the fixed mobile nav on small screens.
      className="fixed bottom-16 left-0 right-0 z-50 p-4 md:bottom-0 animate-banner-in"
    >
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-brand-silver bg-surface-white shadow-2xl">
        <div className="p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-red/10">
              <Cookie size={20} className="text-brand-red" />
            </div>
            <div>
              <h3 className="mb-1 text-sm font-bold text-brand-graphite">{t("cookie.title")}</h3>
              <p className="text-xs leading-relaxed text-neutral-muted">
                {t("cookie.description")}{" "}
                <a href="/legal/cookies" className="text-brand-red hover:underline">
                  {t("cookie.policyLink")}
                </a>
                .
              </p>
            </div>
          </div>

          {showPreferences && (
            <div className="mb-4 space-y-3 rounded-xl border border-brand-silver bg-surface-grey p-4">
              {CATEGORIES.map((item) => (
                <label key={item.key} className="flex cursor-pointer items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-brand-graphite">{t(item.labelKey)}</p>
                    <p className="text-xs text-neutral-muted">{t(item.descKey)}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs[item.key]}
                    disabled={item.locked}
                    onChange={(e) => setPrefs((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                    className="h-5 w-5 rounded accent-brand-red disabled:opacity-60"
                  />
                </label>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="flex-1"
              onClick={() => saveConsent({ essential: true, analytics: true, marketing: true })}
            >
              {t("cookie.acceptAll")}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => saveConsent({ essential: true, analytics: false, marketing: false })}
            >
              {t("cookie.rejectNonEssential")}
            </Button>
            {showPreferences ? (
              <Button variant="ghost" className="flex-1" onClick={() => saveConsent(prefs)}>
                {t("cookie.saveChoices")}
              </Button>
            ) : (
              <Button variant="ghost" className="flex-1" onClick={() => setShowPreferences(true)}>
                <Settings2 size={14} />
                {t("cookie.managePreferences")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
