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
  "marketplace.view_toggle": true,
  "marketplace.sort": true,
  "marketplace.active_filters": true,
  "filters.price_range": true,
  "filters.mileage_range": true,
  "filters.facets": true,
  "filters.features": true,
  "filters.ai_verified_only": true,
  "filters.apply": true,
  "filters.save_search": true,
  "filters.cancel_save": true,
  "filters.confirm_save": true,
  "filters.mobile_trigger": true,
  "map.view": true,
  "map.controls": true,
  "map.radius": true,

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
  "ai.concierge_sheet": true,
  "ai.streaming": true,
  "ai.tool_calls": true,
  "ai.citations": true,
  "ai.suggested_prompts": true,
  "ai.voice_input": false,
  "personalization.for_you_rail": true,
  "personalization.recently_viewed": true,
  "personalization.clear_history": true,
  "personalization.similar_cars": true,
  "personalization.reason_badge": true,
  "personalization.save_vehicle": true,
  "vdp.layout": true,
  "vdp.action_panel": true,
  "vdp.contact_seller": true,
  "vdp.make_offer": true,
  "vdp.trust_badges": true,
  "vdp.spec_grid": true,
  "vdp.finance_teaser": true,
  "vdp.gallery": true,
  "vdp.description": true,
  "vdp.similar_cars": true,
  "vdp.report_listing": true,
  "vdp.tab_specs": true,
  "vdp.tab_history": true,
  "history.unlock_report": true,
  "vdp.finance_calculator": true,
  "vdp.lender_comparison": true,
  "finance.apply": true,

  // Insurance
  "vdp.insurance_estimator": true,
  "vdp.insurance_comparison": true,
  "insurance.get_quote": true,

  // Seller and reviews
  "vdp.seller_card": true,
  "vdp.reviews": true,
  "seller.contact": true,
  "reviews.write": true,

  // Contact flows
  "contact.whatsapp": true,
  "contact.make_offer": true,
  "contact.test_drive": true,
  "contact.message": true,

  // Share and save
  "ui.garage": true,
  "garage.save_vehicle": true,
  "share.sheet": true,

  // VDP polish
  "vdp.scroll_spy": true,
  "vdp.activity_disclosure": true,
  "vdp.structured_data": true,

  // Community feed
  "community.feed": true,
  "community.post_composer": true,
  "community.submit_post": true,
  "community.discard_draft": true,
  "social.action_comment": true,
  "social.action_boost": true,
  "social.action_share": true,
  "social.reaction_rev": true,
  "profile.header": true,
  "profile.share": true,
  "profile.share_trigger": true,
  "profile.more": true,
  "profile.more_trigger": true,
  "profile.message": true,
  "profile.message_trigger": true,
  "profile.follow": true,
  "profile.tab_posts": true,
  "profile.tab_garage": true,
  "profile.tab_reviews": true,
  "profile.tab_about": true,
  "profile.garage_browse": true,
  "comments.thread": true,
  "comments.composer": true,
  "comments.submit": true,
  "vdp.tab_service": true,
  "vdp.tab_ownership": true,
  "vdp.tab_features": true,
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
  "ui.guided_tour": true,
  "ui.tour_prev": true,
  "ui.tour_next": true,
  "ui.notification_center": true,
  "ui.notification_simulation": true,
  "notifications.bid": true,
  "notifications.message": true,
  "notifications.saved_search": true,
  "notifications.event": true,
  "notifications.verification": true,
  "notifications.system": true,
  "notifications.ai": true,
  "settings.save_profile": true,
  "settings.update_password": true,
  "settings.two_factor": true,
  "settings.sign_out_session": true,
  "settings.export_data": true,
  "settings.delete_account": true,
  "settings.cancel_delete": true,
  "settings.confirm_delete": true,
  "settings.devices": true,
  "home.quick_chip": true,
  "home.live_rail": true,
  "home.ticker": true,
  "home.personalized_rails": true,
  "ai.concierge_dock": true,
  "search.voice_input": true,
  "search.ai_mode": true,
  "search.submit": true,
  "search.instant_answer": true,
  "search.did_you_mean": true,
  "search.ai_ranking_explanation": true,
  "search.zero_state": true,
  "search.zero_state_browse_all": true,
  "search.feedback_loop": true,
  "search.feedback_comment": true,
  "saved_searches.page": true,
  "saved_searches.create_new": true,
  "saved_searches.delete": true,
  "saved_searches.edit": true,
  "saved_searches.view_all": true,
  "saved_searches.empty_state_action": true,
  "alerts.push_toggle": true,
  "alerts.email_toggle": true,
  "alerts.frequency": true,
  "compare.page": true,
  "compare.add_vehicle": true,
  "compare.remove_vehicle": true,
  "compare.export": true,
  "compare.close_export": true,
  "compare.email_export": true,
  "compare.share_link": true,
  "compare.print": true,
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
