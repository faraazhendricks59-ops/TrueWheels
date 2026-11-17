"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define every atomic feature in the platform
export const FEATURE_KEYS = {
  // Global
  "global.maintenance": false,
  "global.disable_payments": false,
  "global.retry_action": true,

  // Navigation
  "nav.auctions": true,
  "nav.community": true,
  "nav.parts": true,

  // Auctions
  "auctions.global_freeze": false,
  "auctions.place_bid": true,
  "auctions.create_listing": true,

  // Commerce
  "commerce.checkout": true,
  "commerce.trade_in": true,

  // Auth
  "auth.email_login": true,
  "auth.google_login": true,

  // Onboarding
  "onboarding.intent_gate": true,

  // Listings
  "listings.publish": true,
  "listings.cancel": true,
  "listings.delete": true,

  // Marketplace
  "marketplace.clear_filters": true,
  "marketplace.view_all": true,

  // Form wizard
  "wizard.previous_step": true,
  "wizard.next_step": true,
} as const;

export type FeatureKey = keyof typeof FEATURE_KEYS;

interface FeatureContextType {
  flags: Record<string, boolean>;
  isEnabled: (key: FeatureKey) => boolean;
  isLoading: boolean;
}

const FeatureContext = createContext<FeatureContextType>({
  flags: FEATURE_KEYS,
  isEnabled: () => true,
  isLoading: true,
});

export const useFeatureFlags = () => useContext(FeatureContext);

export function FeatureProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<Record<string, boolean>>(FEATURE_KEYS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In production, this listens to the Firestore 'feature_flags' collection in real-time.
    // Phase 1 initializes with defaults; a later phase wires the Firestore listener.
    setIsLoading(false);
  }, []);

  const isEnabled = (key: FeatureKey) => flags[key] ?? true;

  return (
    <FeatureContext.Provider value={{ flags, isEnabled, isLoading }}>
      {children}
    </FeatureContext.Provider>
  );
}
