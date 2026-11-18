"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { usePersonalization } from "@/components/providers/PersonalizationProvider";
import { readSavedSearches } from "@/lib/saved-searches";
import { NO_SUGGESTED_PEOPLE, suggestVehicles, type NetworkSignals } from "@/lib/network";
import { localeTag } from "@/lib/i18n/locale";

/**
 * Suggestions that can be checked.
 *
 * The brief's version suggested people, each with a reasoning string ("Owns a VW
 * Golf GTI and follows 3 people in your network") and a confidence score, under an
 * "NVIDIA NIM" badge. Every part of that was fabricated: there are no members to
 * analyse, no follow graph to traverse, no model running here, and a confidence
 * percentage invents certainty on top of invented data.
 *
 * This keeps the useful part — a suggestion with a stated reason — and grounds it
 * in the only signals that exist: what the reader viewed, saved and searched for
 * on this device. The reasons come from the existing recommendation engine
 * (`recommendForYou`), so each one names the signal it came from. No percentage is
 * shown, because the underlying score is a fixed weighting of price band, body type
 * and mileage, and dressing that up as a confidence figure would overstate it.
 */
export function SuggestedUsers() {
  const { viewedVehicles, savedVehicles, searchQueries, isHydrated } = usePersonalization();

  const signals: NetworkSignals = {
    viewedIds: viewedVehicles,
    savedIds: savedVehicles,
    searchQueries,
    garaged: [],
    savedSearches: readSavedSearches().map((search) => ({
      id: search.id,
      name: search.name,
      query: search.query,
    })),
  };

  const suggestions = isHydrated ? suggestVehicles(signals) : [];

  return (
    <FeatureGate featureKey="social.ai_suggestions">
      <Reveal variant="up" delay={200}>
        <section className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-ink-100 dark:border-ink-800 flex items-center gap-2">
            <Icon icon={Sparkles} size={14} className="text-aurora-purple" />
            <h2 className="text-sm font-bold text-ink-900 dark:text-white">Suggested for you</h2>
          </div>

          <p className="px-5 pt-3 text-[11px] text-ink-400 leading-relaxed">{NO_SUGGESTED_PEOPLE}</p>

          <div className="divide-y divide-ink-100 dark:divide-ink-800 mt-3">
            {suggestions.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-ink-500 dark:text-ink-400">Nothing to suggest yet.</p>
                <p className="text-xs text-ink-400 mt-1 max-w-xs mx-auto">
                  View or save a vehicle, or keep a search, and a matching listing will appear here.
                </p>
              </div>
            ) : (
              suggestions.map((suggestion) => (
                <Link
                  key={suggestion.vehicle.id}
                  href={`/vehicles/${suggestion.vehicle.id}`}
                  className="block p-4 hover:bg-ink-50/50 dark:hover:bg-ink-950/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-bold text-ink-900 dark:text-white truncate group-hover:text-brand">
                      {suggestion.vehicle.title}
                    </span>
                    <span className="text-sm font-display font-bold text-ink-900 dark:text-white tabular-nums flex-shrink-0">
                      R {suggestion.vehicle.price.toLocaleString(localeTag("en"))}
                    </span>
                  </div>
                  <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">
                    {suggestion.vehicle.location} ·{" "}
                    {suggestion.vehicle.mileage.toLocaleString(localeTag("en"))} km
                  </p>
                  <p className="text-[11px] text-aurora-purple mt-2 flex items-center gap-1.5">
                    <Icon icon={Sparkles} size={10} />
                    {suggestion.reason}
                  </p>
                </Link>
              ))
            )}
          </div>
        </section>
      </Reveal>
    </FeatureGate>
  );
}
