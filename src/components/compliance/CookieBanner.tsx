"use client";

import { useEffect, useState } from "react";
import { Cookie, Settings2 } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { Switch } from "@/components/ui/Toggles";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useAnnounce } from "@/components/a11y/AriaLiveAnnouncer";

export interface ConsentState {
  essential: true;
  analytics: boolean;
  marketing: boolean;
}

export const CONSENT_STORAGE_KEY = "truewheels_cookie_consent";

const DEFAULT_CONSENT: ConsentState = { essential: true, analytics: false, marketing: false };

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);
  const { announce } = useAnnounce();

  useEffect(() => {
    // Read in an effect, never during render: localStorage is unavailable on the
    // server and reading it during render would desync hydration.
    if (localStorage.getItem(CONSENT_STORAGE_KEY)) return;
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const save = (state: ConsentState) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
    setIsVisible(false);
    // Analytics and marketing tags are only loaded once consent is granted.
    announce("Cookie preferences saved");
  };

  if (!isVisible) return null;

  return (
    <FeatureGate featureKey="compliance.cookie_banner">
      <div className="fixed bottom-0 inset-x-0 z-[95] p-4 md:p-6 animate-slide-up">
        <div
          role="region"
          aria-label="Cookie preferences"
          className="max-w-4xl mx-auto glass rounded-2xl border border-ink-100/50 dark:border-ink-800/50 shadow-lift p-5 md:p-6"
        >
          <div className="flex items-start gap-4">
            <span className="w-10 h-10 rounded-xl bg-aurora-purple/10 flex items-center justify-center flex-shrink-0">
              <Icon icon={Cookie} className="text-aurora-purple" />
            </span>

            <div className="flex-1">
              <h2 className="text-sm font-bold text-ink-900 dark:text-white mb-1">We value your privacy</h2>
              <p className="text-xs text-ink-500 dark:text-ink-300 leading-relaxed mb-4">
                TrueWheels uses cookies to enhance your experience, analyse traffic and personalise
                content. In compliance with POPIA we need your consent for non-essential cookies.
              </p>

              {isExpanded && (
                <div className="space-y-3 mb-4 p-4 bg-ink-50 dark:bg-ink-900 rounded-xl border border-ink-100 dark:border-ink-800">
                  <Switch
                    label="Essential"
                    description="Required for the platform to function."
                    checked
                    disabled
                    onChange={() => {}}
                  />
                  <Switch
                    label="Analytics"
                    description="Helps us understand how you use the site."
                    checked={consent.analytics}
                    onChange={(analytics) => setConsent((c) => ({ ...c, analytics }))}
                  />
                  <Switch
                    label="Marketing"
                    description="Personalised ads and offers."
                    checked={consent.marketing}
                    onChange={(marketing) => setConsent((c) => ({ ...c, marketing }))}
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsExpanded((v) => !v)}
                  aria-expanded={isExpanded}
                  className="text-xs font-semibold text-ink-500 hover:text-brand transition-colors inline-flex items-center gap-1.5 sm:mr-auto"
                >
                  <Icon icon={Settings2} size={12} />
                  {isExpanded ? "Hide preferences" : "Customise"}
                </button>

                <SmartButton
                  featureKey="compliance.cookie_reject"
                  variant="ghost"
                  size="sm"
                  onClick={() => save({ essential: true, analytics: false, marketing: false })}
                >
                  Reject non-essential
                </SmartButton>
                <SmartButton
                  featureKey="compliance.cookie_accept"
                  size="sm"
                  onClick={() => save({ essential: true, analytics: true, marketing: true })}
                >
                  Accept all
                </SmartButton>
                {isExpanded && (
                  <SmartButton
                    featureKey="compliance.cookie_banner"
                    size="sm"
                    variant="ghost"
                    onClick={() => save(consent)}
                  >
                    Save preferences
                  </SmartButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FeatureGate>
  );
}
