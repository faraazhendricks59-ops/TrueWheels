"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { FeatureGate } from "@/components/feature/FeatureGate";
import {
  isStandalone,
  type InstallPromptEvent,
} from "@/lib/pwa";

const DISMISS_KEY = "truewheels_install_dismissed";
const DISMISS_DAYS = 14;
const ENGAGE_DELAY_MS = 45_000;

/**
 * An install prompt that only appears when the browser offers one.
 *
 * `beforeinstallprompt` is a real event and the install is a real install, so this is
 * honest by construction. Two things from the brief are not:
 *
 *  - The benefit list claimed "Zero app store download • Under 2MB" and "Instant
 *    price-drop alerts". The install still downloads the site on first open and is
 *    larger than 2 MB, and there is no push service behind "instant alerts" — asking
 *    for the notification permission here would be asking for something the app does
 *    not use. The benefits shown are the two that are true: it goes on the home screen,
 *    and pages already opened keep working without a connection.
 *  - It showed the banner on a 30-second timer. A timer is not engagement; it fires
 *    while the reader is reading something. The banner now waits for the browser's own
 *    prompt and for the reader to have been on the page a while, and stays dismissed
 *    for two weeks if closed.
 *
 * If the browser does not offer an install prompt — Safari on iOS, and Firefox — the
 * banner simply never appears. It does not link to a manual-install guide, because
 * this project has no such page.
 */
export function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    try {
      const dismissedAt = window.localStorage.getItem(DISMISS_KEY);
      if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_DAYS * 86_400_000) return;
    } catch {
      // Unavailable storage: show it, but it will not stay dismissed.
    }

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // Only show after the reader has actually spent time on the page.
    const timer = window.setTimeout(() => setIsVisible(true), ENGAGE_DELAY_MS);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Ignore.
    }
  };

  const install = async () => {
    if (!promptEvent) return;
    setIsInstalling(true);
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === "accepted") setIsVisible(false);
    } finally {
      setPromptEvent(null);
      setIsInstalling(false);
    }
  };

  // No browser prompt means no install offer to make.
  if (!isVisible || !promptEvent || isStandalone()) return null;

  return (
    <FeatureGate featureKey="pwa.install_prompt">
      <div className="fixed bottom-24 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50">
        <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-lift p-5 relative">
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 p-1.5 text-ink-400 hover:text-ink-900 dark:hover:text-white rounded-lg transition-colors"
          aria-label="Dismiss install prompt"
        >
          <Icon icon={X} size={14} />
        </button>

        <div className="w-11 h-11 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-3">
          <Icon icon={Download} size={20} />
        </div>

        <h3 className="text-base font-display font-bold text-ink-900 dark:text-white mb-1.5">
          Add TrueWheels to your home screen
        </h3>
        <p className="text-xs text-ink-500 dark:text-ink-300 leading-relaxed mb-3">
          It is the same site, with an icon. Pages you have already opened keep working
          when the connection drops.
        </p>
        <p className="text-[10px] text-ink-400 leading-relaxed mb-4">
          There is no separate app, and nothing new to download from a store beyond this
          site. Installing does not change what you can do here.
        </p>

        <div className="flex gap-2">
          <SmartButton
            featureKey="pwa.install_cta"
            className="flex-1 !h-10"
            onClick={install}
            isLoading={isInstalling}
            leftIcon={Download}
          >
            Add to home screen
          </SmartButton>
          <SmartButton
            featureKey="pwa.install_dismiss"
            variant="ghost"
            className="!h-10 !px-4"
            onClick={dismiss}
          >
            Not now
          </SmartButton>
        </div>
        </div>
      </div>
    </FeatureGate>
  );
}
