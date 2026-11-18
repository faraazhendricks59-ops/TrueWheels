"use client";

import { useRef } from "react";
import { Car, LayoutGrid, Star, User } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
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
 * panel was showing or to move between them. Here the arrow keys move the
 * selection (wrapping), Home and End jump to the ends, and only the selected tab
 * is in the tab order, which is what the tab pattern requires.
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
  const listRef = useRef<HTMLDivElement>(null);

  const move = (delta: number) => {
    const index = TABS.findIndex((tab) => tab.id === activeTab);
    const next = TABS[(index + delta + TABS.length) % TABS.length];
    onTabChange(next.id);
    // Move focus with the selection, which is the expected behaviour for tabs.
    const button = listRef.current?.querySelector<HTMLButtonElement>(`#tab-${next.id}`);
    button?.focus();
  };

  const jump = (to: "first" | "last") => {
    const next = to === "first" ? TABS[0] : TABS[TABS.length - 1];
    onTabChange(next.id);
    listRef.current?.querySelector<HTMLButtonElement>(`#tab-${next.id}`)?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        move(1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        move(-1);
        break;
      case "Home":
        event.preventDefault();
        jump("first");
        break;
      case "End":
        event.preventDefault();
        jump("last");
        break;
      default:
        break;
    }
  };

  return (
    <div className="sticky top-[calc(var(--header-height)+var(--sat))] z-30 bg-surface-paper/90 dark:bg-ink-950/90 backdrop-blur-lg border-b border-ink-100 dark:border-ink-800 -mx-4 px-4 md:mx-0 md:px-0">
      <div
        ref={listRef}
        role="tablist"
        aria-label="Profile sections"
        onKeyDown={onKeyDown}
        className="flex gap-1 overflow-x-auto hide-scrollbar py-2"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <FeatureGate key={tab.id} featureKey={tab.featureKey as "profile.tab_posts"}>
              <button
                id={`tab-${tab.id}`}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onTabChange(tab.id)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold whitespace-nowrap transition-colors border-b-2",
                  isActive
                    ? "text-brand border-brand bg-white/50 dark:bg-ink-900/50"
                    : "text-ink-500 border-transparent hover:text-ink-900 dark:hover:text-white"
                )}
              >
                <Icon icon={tab.icon} size={14} strokeWidth={isActive ? 2.5 : 1.75} />
                {tab.label}
              </button>
            </FeatureGate>
          );
        })}
      </div>
    </div>
  );
}
