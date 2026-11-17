"use client";

import Link from "next/link";
import { Clock, Trash2 } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { PersonalizedRail } from "@/components/home/PersonalizedRail";
import { usePersonalization } from "@/components/providers/PersonalizationProvider";
import { viewedVehicles } from "@/lib/personalization";
import { localeTag } from "@/lib/i18n/locale";

export function RecentlyViewedRail() {
  const { viewedVehicles: viewedIds, clearHistory, isHydrated } = usePersonalization();

  // Resolved from the catalogue, so a stale id left in storage is skipped
  // rather than rendered as a placeholder vehicle.
  const vehicles = viewedVehicles(viewedIds);

  if (!isHydrated || vehicles.length === 0) return null;

  return (
    <FeatureGate featureKey="personalization.recently_viewed">
      <PersonalizedRail title="Recently viewed" delay={400}>
        <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 snap-x snap-mandatory w-full">
          {vehicles.slice(0, 6).map((vehicle) => (
            <Link
              key={vehicle.id}
              href={`/vehicles/${vehicle.id}`}
              className="flex-shrink-0 w-[200px] snap-start group"
            >
              <span className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-700 mb-2 relative flex items-center justify-center">
                <span className="font-display font-bold text-ink-400 dark:text-ink-500">
                  {vehicle.year}
                </span>
                <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-ink-950/60 backdrop-blur flex items-center justify-center text-white">
                  <Icon icon={Clock} size={12} />
                </span>
              </span>
              <span className="block text-sm font-bold text-ink-900 dark:text-white truncate">
                {vehicle.title}
              </span>
              <span className="block text-xs font-display font-bold text-brand tabular-nums">
                R {vehicle.price.toLocaleString(localeTag("en"))}
              </span>
            </Link>
          ))}

          <div className="flex-shrink-0 w-[200px] snap-start flex items-center justify-center">
            <SmartButton
              featureKey="personalization.clear_history"
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="!h-12 !rounded-xl border border-dashed border-ink-200 dark:border-ink-800"
              leftIcon={Trash2}
            >
              Clear history
            </SmartButton>
          </div>
        </div>
      </PersonalizedRail>
    </FeatureGate>
  );
}
