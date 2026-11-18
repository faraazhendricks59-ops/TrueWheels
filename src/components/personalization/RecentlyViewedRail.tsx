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
import { VehicleThumb } from "@/components/vehicles/VehicleThumb";

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
              <span className="relative mb-2 block aspect-[4/3] overflow-hidden rounded-lg">
                <VehicleThumb vehicle={vehicle} className="absolute inset-0" />
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink-950/60 text-white backdrop-blur">
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
