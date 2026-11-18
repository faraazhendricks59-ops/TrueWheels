"use client";

import Link from "next/link";
import { Car, Eye, Heart, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { usePersonalization } from "@/components/providers/PersonalizationProvider";
import { useGarage } from "@/components/providers/GarageProvider";
import { readSavedSearches } from "@/lib/saved-searches";
import {
  ACTIVITY_LOCAL_ONLY,
  buildActivity,
  type ActivityKind,
  type NetworkSignals,
} from "@/lib/network";

const KIND_CONFIG: Record<ActivityKind, { icon: LucideIcon; color: string; bg: string }> = {
  garaged: { icon: Car, color: "text-semantic-success", bg: "bg-semantic-success/10" },
  saved: { icon: Heart, color: "text-brand", bg: "bg-brand/10" },
  searched: { icon: Search, color: "text-aurora-blue", bg: "bg-aurora-blue/10" },
  viewed: { icon: Eye, color: "text-ink-400", bg: "bg-ink-100 dark:bg-ink-800" },
};

/**
 * Your activity, not a fabricated feed.
 *
 * The brief called this a "realtime network pulse" and supplied four invented
 * events, including a purchase and a sale by people who do not exist, each with a
 * relative timestamp and a pulsing live dot. Nothing in this project records
 * another person's actions, so the panel is built from the one activity that is
 * genuinely recorded: the reader's own, in this browser.
 *
 * There is no relative time anywhere, because "2h ago" is a claim about when
 * something happened and the stores do not carry it. Each row names the store it
 * came from instead, which the reader can check.
 */
export function ActivityRail() {
  const { viewedVehicles, savedVehicles, searchQueries, isHydrated } = usePersonalization();
  const { garage, isHydrated: garageHydrated } = useGarage();

  const signals: NetworkSignals = {
    viewedIds: viewedVehicles,
    savedIds: savedVehicles,
    searchQueries,
    garaged: garage.vehicles.map((vehicle) => ({
      id: vehicle.id,
      title: `${vehicle.year} ${vehicle.title}`,
    })),
    savedSearches: readSavedSearches().map((search) => ({
      id: search.id,
      name: search.name,
      query: search.query,
    })),
  };

  const activity = buildActivity(signals);
  const ready = isHydrated && garageHydrated;

  return (
    <FeatureGate featureKey="social.activity_rail">
      <section className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink-900 dark:text-white flex items-center gap-2">
            <Icon icon={Eye} size={14} className="text-ink-400" />
            Your activity
          </h2>
          <span className="text-xs font-mono font-bold text-ink-400 tabular-nums">
            {ready ? activity.length : 0}
          </span>
        </div>

        <p className="px-5 pt-3 text-[11px] text-ink-400 leading-relaxed">{ACTIVITY_LOCAL_ONLY}</p>

        <div className="divide-y divide-ink-100 dark:divide-ink-800 max-h-[500px] overflow-y-auto mt-3">
          {!ready || activity.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-ink-500 dark:text-ink-400">Nothing recorded yet.</p>
              <p className="text-xs text-ink-400 mt-1 max-w-xs mx-auto">
                View, save or garage a vehicle, or keep a search, and it will appear here. It stays
                on this device.
              </p>
            </div>
          ) : (
            activity.map((entry) => {
              const config = KIND_CONFIG[entry.kind];
              return (
                <Link
                  key={entry.id}
                  href={entry.href}
                  className="flex items-start gap-3 p-4 hover:bg-ink-50/50 dark:hover:bg-ink-950/50 transition-colors group"
                >
                  <span
                    className={clsx(
                      "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                      config.bg,
                    )}
                  >
                    <Icon icon={config.icon} size={15} className={config.color} />
                  </span>

                  <span className="flex-1 min-w-0">
                    <span className="block text-xs text-ink-700 dark:text-ink-200 leading-relaxed group-hover:text-brand">
                      {entry.summary}
                    </span>
                    <span className="block text-[10px] text-ink-400 mt-1">{entry.source}</span>
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </section>
    </FeatureGate>
  );
}
