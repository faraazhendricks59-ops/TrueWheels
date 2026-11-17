"use client";

import Link from "next/link";
import { Gauge, MapPin } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Sheet } from "@/components/ui/Sheet";
import { SmartButton } from "@/components/ui/SmartButton";
import { Badge, TrustBadge } from "@/components/ui/Badge";
import { matchesForQuery, matchReasons } from "@/lib/saved-search-matches";
import { localeTag } from "@/lib/i18n/locale";

interface MatchHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  searchName: string;
  queryString: string;
}

export function MatchHistoryDrawer({
  isOpen,
  onClose,
  searchName,
  queryString,
}: MatchHistoryDrawerProps) {
  // Computed from the live listings, so the drawer shows the vehicles that
  // really satisfy this saved search rather than a fixed sample.
  const { matches, recent } = matchesForQuery(queryString);
  const shown = (recent.length > 0 ? recent : matches).slice(0, 12);
  const href = `/marketplace${queryString ? `?${queryString}` : ""}`;

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title={`Matches for “${searchName}”`} side="right">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 p-3 bg-ink-50 dark:bg-ink-950 rounded-xl border border-ink-100 dark:border-ink-800">
          <span className="text-xs text-ink-500">
            {recent.length > 0
              ? `${recent.length} new in the last 24 hours`
              : `All ${matches.length} matching vehicles`}
          </span>
          <SmartButton
            featureKey="saved_searches.view_all"
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <Link href={href}>View all {matches.length}</Link>
          </SmartButton>
        </div>

        {shown.length === 0 ? (
          <p className="text-sm text-ink-500 dark:text-ink-300 py-8 text-center">
            Nothing matches this search right now. We will let you know when that changes.
          </p>
        ) : (
          shown.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex gap-4 p-3 rounded-xl border border-ink-100 dark:border-ink-800 hover:bg-ink-50 dark:hover:bg-ink-950 transition-colors"
            >
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-700 flex items-center justify-center flex-shrink-0">
                <span className="font-display font-bold text-ink-400 dark:text-ink-500">
                  {vehicle.year}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-ink-900 dark:text-white truncate">
                  {vehicle.title}
                </h4>
                <p className="text-sm font-display font-bold text-brand mt-0.5 tabular-nums">
                  R {vehicle.price.toLocaleString(localeTag("en"))}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-ink-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Icon icon={MapPin} size={10} /> {vehicle.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon={Gauge} size={10} /> {vehicle.mileage.toLocaleString(localeTag("en"))} km
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {matchReasons(vehicle, queryString)
                    .slice(0, 2)
                    .map((reason) => (
                      <TrustBadge key={reason} label="Matched" source={reason} tone="green" />
                    ))}
                  <Badge variant="spec" tone="ink">
                    {vehicle.year}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Sheet>
  );
}
