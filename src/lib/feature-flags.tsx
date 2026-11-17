"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define every atomic feature in the platform
export const FEATURE_KEYS = {
  // Global
  "global.maintenance": false,
  "global.disable_payments": false,
  "global.retry_action": true,

  // Navigation
  "nav.marketplace":
    true,
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
  "listings.create": true,

  // Marketplace
  "marketplace.clear_filters": true,
  "marketplace.view_all": true,

  // Form wizard
  "wizard.previous_step": true,
  "wizard.next_step": true,

  // UI chrome
  "ui.theme_toggle": true,
  "ui.language_switcher": true,
  "ui.right_rail": true,
  "ui.mobile_nav": true,
  "nav.mobile_home": true,
  "nav.mobile_search": true,
  "nav.mobile_messages": true,
  "nav.mobile_profile": true,
  "ui.mobile_menu": true,
  "ui.omnibox": true,
  "ui.ai_pill": true,
  "ui.profile_menu": true,
  "ai.concierge": true,
  "ui.command_palette": true,
  "ui.footer": true,
  "ui.dashboard": true,
  "dashboard.nav_overview": true,
  "dashboard.nav_listings": true,
  "dashboard.nav_bids": true,
  "dashboard.nav_messages": true,
  "dashboard.nav_saved": true,
  "dashboard.nav_settings": true,
  "dashboard.action_list": true,
  "dashboard.action_saved": true,
  "dashboard.action_messages": true,
  "dashboard.action_bids": true,
  "nav.dash_overview": true,
  "nav.dash_bids": true,
  "nav.dash_saved": true,
  "nav.dealer_inventory": true,
  "nav.dealer_leads": true,
  "nav.admin_users": true,
  "auth.demo_role_switch": true,
  "marketing.newsletter_footer": true,
  "marketing.newsletter_submit": true,
  "compliance.cookie_banner": true,
  "compliance.cookie_accept": true,
  "compliance.cookie_reject": true,
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
