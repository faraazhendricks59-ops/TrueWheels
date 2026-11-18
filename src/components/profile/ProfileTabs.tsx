"use client";

import { Car, LayoutGrid, Star, User } from "lucide-react";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { type ProfileTab } from "@/lib/profile";

const TABS: { id: ProfileTab; label: string; icon: typeof LayoutGrid; featureKey: string }[] = [
  { id: "posts", label: "Posts", icon: LayoutGrid, featureKey: "profile.tab_posts" },
  { id: "garage", label: "Garage", icon: Car, featureKey: "profile.tab_garage" },
  { id: "reviews", label: "Reviews", icon: Star, featureKey: "profile.tab_reviews" },
  { id: "about", label: "About", icon: User, featureKey: "profile.tab_about" },
];

/**
 * The tab bar.
 *
 * This is a real ARIA tablist, which the brief's version was not: it rendered
 * four buttons with no `role`, no `aria-selected`, no `aria-controls` and no
 * keyboard handling, so a keyboard or screen-reader user had no way to know which
 * panel was showing or to move between them. The keyboard handling and the ARIA
 * wiring now live in SlidingTabs, which also gives the active tab a marker that
 * slides between positions rather than a border that jumps.
 *
 * The brief also styled the bar with `sticky top-[var(--header-height)]` but
 * forgot the top safe-area inset that the header itself adds, so on a device with
 * a notch the bar would tuck under the header.
 */
export function ProfileTabs({
  activeTab,
  onTabChange,
  panelId,
}: {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  panelId: string;
}) {
  return (
    <div className="sticky top-[calc(var(--header-height)+var(--sat))] z-30 bg-surface-paper/90 dark:bg-ink-950/90 backdrop-blur-lg border-b border-ink-100 dark:border-ink-800 -mx-4 px-4 md:mx-0 md:px-0">
      <FeatureGate featureKey="profile.tab_posts">
        <SlidingTabs
          tabs={TABS}
          activeId={activeTab}
          onChange={onTabChange}
          panelId={panelId}
          ariaLabel="Profile sections"
          className="py-2"
        />
      </FeatureGate>
    </div>
  );
}
