"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Mail, MoreVertical, Search, Smartphone, Trash2, TrendingUp } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Switch } from "@/components/ui/Toggles";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { Dropdown, DropdownItem } from "@/components/ui/Floating";
import { MatchHistoryDrawer } from "./MatchHistoryDrawer";
import { AlertFrequencyModal } from "./AlertFrequencyModal";
import {
  describeFilters,
  frequencyOf,
  removeSavedSearch,
  updateSavedSearch,
  type SavedSearch,
} from "@/lib/saved-searches";
import { matchesForQuery } from "@/lib/saved-search-matches";
import { localeTag } from "@/lib/i18n/locale";

interface SavedSearchCardProps {
  search: SavedSearch;
  onChanged: () => void;
}

export function SavedSearchCard({ search, onChanged }: SavedSearchCardProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFrequencyOpen, setIsFrequencyOpen] = useState(false);

  // Match counts are resolved from the live listings, so they move when the
  // underlying data changes instead of being stored and going stale.
  const { recentCount, total } = matchesForQuery(search.query);
  const criteria = describeFilters(search.query)
    .split(", ")
    .filter((part) => part !== "All vehicles");
  const frequency = frequencyOf(search);
  const isPaused = frequency === "off";

  const setChannel = (patch: { pushAlerts?: boolean; emailAlerts?: boolean }) => {
    updateSavedSearch(search.id, patch);
    onChanged();
  };

  return (
    <>
      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 shadow-lift hover:border-brand/20 transition-all ease-swift flex flex-col">
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center text-brand flex-shrink-0">
              <Icon icon={Search} size={18} />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-ink-900 dark:text-white truncate">{search.name}</h3>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {criteria.length > 0 ? (
                  criteria.map((criterion) => (
                    <span
                      key={criterion}
                      className="text-[10px] font-mono font-semibold text-ink-500 bg-ink-50 dark:bg-ink-800 px-1.5 py-0.5 rounded"
                    >
                      {criterion}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] font-mono font-semibold text-ink-500">All vehicles</span>
                )}
              </div>
            </div>
          </div>

          <Dropdown
            label={`Options for ${search.name}`}
            trigger={
              <span className="p-2 text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-50 dark:hover:bg-ink-800 rounded-lg transition-colors inline-flex">
                <Icon icon={MoreVertical} size={16} />
              </span>
            }
          >
            <DropdownItem onClick={() => setIsFrequencyOpen(true)}>
              <Icon icon={Clock} size={14} /> Alert frequency
            </DropdownItem>
            <DropdownItem onClick={() => setIsDrawerOpen(true)}>
              <Icon icon={TrendingUp} size={14} /> View matches
            </DropdownItem>
            <FeatureGate featureKey="saved_searches.delete">
              <DropdownItem
                destructive
                onClick={() => {
                  removeSavedSearch(search.id);
                  onChanged();
                }}
              >
                <Icon icon={Trash2} size={14} /> Delete search
              </DropdownItem>
            </FeatureGate>
          </Dropdown>
        </div>

        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="w-full flex items-center gap-2 mb-5 p-3 bg-semantic-success/5 border border-semantic-success/10 rounded-xl text-left hover:border-semantic-success/30 transition-colors"
        >
          <span className="w-8 h-8 rounded-lg bg-semantic-success/10 flex items-center justify-center text-semantic-success flex-shrink-0">
            <Icon icon={TrendingUp} size={16} />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-xs font-bold text-ink-900 dark:text-white">
              {recentCount} new {recentCount === 1 ? "match" : "matches"}{" "}
              <span className="text-ink-400 font-normal">in the last 24 hours</span>
            </span>
            <span className="block text-[10px] text-ink-500">
              {total.toLocaleString(localeTag("en"))} total{" "}
              {total === 1 ? "match" : "matches"} · View vehicles →
            </span>
          </span>
        </button>

        <div className="space-y-3 pt-4 border-t border-ink-100 dark:border-ink-800 mt-auto">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-xs text-ink-600 dark:text-ink-300">
              <Icon icon={Smartphone} size={14} /> Push alerts
            </span>
            <FeatureGate featureKey="alerts.push_toggle">
              <Switch
                label={<span className="sr-only">Push alerts for {search.name}</span>}
                checked={search.pushAlerts}
                onChange={(checked) => setChannel({ pushAlerts: checked })}
                disabled={isPaused}
              />
            </FeatureGate>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-xs text-ink-600 dark:text-ink-300">
              <Icon icon={Mail} size={14} /> Email digest
            </span>
            <FeatureGate featureKey="alerts.email_toggle">
              <Switch
                label={<span className="sr-only">Email alerts for {search.name}</span>}
                checked={search.emailAlerts}
                onChange={(checked) => setChannel({ emailAlerts: checked })}
                disabled={isPaused}
              />
            </FeatureGate>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => setIsFrequencyOpen(true)}
              className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-brand transition-colors"
            >
              <Icon icon={Clock} size={12} />
              {isPaused ? "Alerts paused" : FREQUENCY_LABEL[frequency]}
            </button>
            <Link
              href={`/marketplace${search.query ? `?${search.query}` : ""}`}
              className="text-xs font-semibold text-brand hover:underline"
            >
              Open search
            </Link>
          </div>
        </div>
      </div>

      <MatchHistoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        searchName={search.name}
        queryString={search.query}
      />

      <AlertFrequencyModal
        isOpen={isFrequencyOpen}
        onClose={() => setIsFrequencyOpen(false)}
        search={search}
        onSaved={onChanged}
      />
    </>
  );
}

const FREQUENCY_LABEL: Record<string, string> = {
  instant: "Instant alerts",
  daily: "Daily digest",
  weekly: "Weekly digest",
  off: "Alerts paused",
};

