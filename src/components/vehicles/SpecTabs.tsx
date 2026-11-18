"use client";

import { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Gauge, ListChecks, ShieldQuestion, Users } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";
import type { FeatureKey } from "@/lib/feature-flags";
import { SpecTable } from "./SpecTable";
import { ServiceLog } from "./ServiceLog";
import { OwnershipTimeline } from "./OwnershipTimeline";
import { FeaturesList } from "./FeaturesList";
import type { DemoVehicle } from "@/lib/demo/vehicles";

type TabId = "specs" | "service" | "ownership" | "features";

const TABS: { id: TabId; label: string; icon: LucideIcon; featureKey: FeatureKey }[] = [
  { id: "specs", label: "Specifications", icon: Gauge, featureKey: "vdp.tab_specs" },
  { id: "service", label: "Service history", icon: ListChecks, featureKey: "vdp.tab_service" },
  { id: "ownership", label: "Ownership", icon: Users, featureKey: "vdp.tab_ownership" },
  { id: "features", label: "Features", icon: ShieldQuestion, featureKey: "vdp.tab_features" },
];

export function SpecTabs({ vehicle }: { vehicle: DemoVehicle }) {
  const [activeTab, setActiveTab] = useState<TabId>("specs");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow keys move between tabs, which is what the tab pattern expects.
  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = TABS.length - 1;
    let next = index;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;
    event.preventDefault();
    setActiveTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-[var(--header-height)] z-20 -mx-4 px-4 md:mx-0 md:px-0 py-2 bg-surface-paper/90 dark:bg-ink-950/90 backdrop-blur-lg border-b border-ink-100 dark:border-ink-800">
        <div role="tablist" aria-label="Vehicle information" className="flex gap-1 overflow-x-auto hide-scrollbar">
          {TABS.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <FeatureGate key={tab.id} featureKey={tab.featureKey}>
                <button
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`tab-${tab.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  // Only the active tab is in the tab order; arrow keys move between them.
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold whitespace-nowrap transition-colors border-b-2",
                    isActive
                      ? "text-brand border-brand"
                      : "text-ink-500 border-transparent hover:text-ink-900 dark:hover:text-white"
                  )}
                >
                  <Icon icon={tab.icon} size={14} />
                  {tab.label}
                </button>
              </FeatureGate>
            );
          })}
        </div>
      </div>

      {TABS.map((tab) => (
        // Gated the same way as its tab, so a hidden tab never leaves a panel
        // pointing at an id that is not in the document.
        <FeatureGate key={tab.id} featureKey={tab.featureKey}>
          <div
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            tabIndex={0}
          >
            {activeTab === tab.id && (
              <>
                {tab.id === "specs" && <SpecTable vehicle={vehicle} />}
                {tab.id === "service" && <ServiceLog vehicle={vehicle} />}
                {tab.id === "ownership" && <OwnershipTimeline vehicle={vehicle} />}
                {tab.id === "features" && <FeaturesList />}
              </>
            )}
          </div>
        </FeatureGate>
      ))}
    </div>
  );
}
