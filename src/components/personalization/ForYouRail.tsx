"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { PersonalizedRail, RailCard } from "@/components/home/PersonalizedRail";
import { VehicleThumb } from "@/components/vehicles/VehicleThumb";
import { ReasonTooltip } from "./ReasonTooltip";
import { usePersonalization } from "@/components/providers/PersonalizationProvider";
import { recommendForYou, vehicleSummary } from "@/lib/personalization";
import { localeTag } from "@/lib/i18n/locale";

export function ForYouRail() {
  const { viewedVehicles, savedVehicles, searchQueries, isHydrated } = usePersonalization();

  const recommendations = recommendForYou({
    viewedIds: viewedVehicles,
    savedIds: savedVehicles,
    searchQueries,
  });

  // Rendering nothing until the signals are read avoids a flash of generic
  // recommendations that then reshuffle once storage is available.
  if (!isHydrated || recommendations.length === 0) return null;

  const hasSignals = viewedVehicles.length + savedVehicles.length + searchQueries.length > 0;

  return (
    <FeatureGate featureKey="personalization.for_you_rail">
      <PersonalizedRail
        title="Recommended for you"
        subtitle={
          hasSignals
            ? "Chosen from your searches and the cars you have viewed"
            : "Start browsing and these get more specific"
        }
        delay={300}
      >
        {recommendations.map(({ vehicle, reason }) => (
          <RailCard key={vehicle.id}>
            <Link href={`/vehicles/${vehicle.id}`} className="block group">
              <span className="relative block aspect-[16/10]">
                <VehicleThumb vehicle={vehicle} className="absolute inset-0" />
                <span className="absolute top-2 left-2">
                  <Badge variant="ai">
                    <Icon icon={Sparkles} size={8} />
                    For you
                  </Badge>
                </span>
              </span>
              <span className="block p-4">
                <span className="block font-bold text-ink-900 dark:text-white truncate mb-1">
                  {vehicle.title}
                </span>
                <span className="block text-lg font-display font-bold text-brand mb-2 tabular-nums">
                  R {vehicle.price.toLocaleString(localeTag("en"))}
                </span>
                <span className="block text-xs text-ink-500 dark:text-ink-300 mb-3">
                  {vehicleSummary(vehicle)}
                </span>
              </span>
            </Link>
            <div className="px-4 pb-4">
              <FeatureGate featureKey="personalization.reason_badge">
                <ReasonTooltip reason={reason} />
              </FeatureGate>
            </div>
          </RailCard>
        ))}
      </PersonalizedRail>
    </FeatureGate>
  );
}
