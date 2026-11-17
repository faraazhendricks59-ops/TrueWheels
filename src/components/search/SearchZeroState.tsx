"use client";

import { Bell, MapPin, SearchX, SlidersHorizontal } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { Reveal } from "@/components/motion/Reveal";
import { FeatureGate } from "@/components/feature/FeatureGate";

export interface RecoveryAction {
  id: string;
  label: string;
  /** Plain-language description of what the action would do. */
  description: string;
  /** How many vehicles the action would bring back, when it can be counted. */
  recovered?: number;
}

interface SearchZeroStateProps {
  query: string;
  actions: RecoveryAction[];
  onAction: (id: string) => void;
}

const ACTION_ICON = {
  filters: SlidersHorizontal,
  radius: MapPin,
  alert: Bell,
} as const;

const ACTION_TONE = {
  filters: "bg-semantic-warning/10 text-semantic-warning",
  radius: "bg-aurora-blue/10 text-aurora-blue",
  alert: "bg-semantic-success/10 text-semantic-success",
} as const;

export function SearchZeroState({ query, actions, onAction }: SearchZeroStateProps) {
  return (
    <FeatureGate featureKey="search.zero_state">
      <Reveal variant="up">
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-20 h-20 rounded-3xl bg-ink-50 dark:bg-ink-900 border border-ink-100 dark:border-ink-800 flex items-center justify-center mb-6 text-ink-400">
            <Icon icon={SearchX} size={32} />
          </div>

          <h2 className="text-2xl font-display font-bold text-ink-900 dark:text-white mb-2">
            {query ? `No exact matches for “${query}”` : "No vehicles match these filters"}
          </h2>
          <p className="text-sm text-ink-500 dark:text-ink-300 max-w-md mb-8 leading-relaxed">
            Nothing matches your current criteria. One of these usually helps.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
            {actions.map((action) => {
              const ActionIcon = ACTION_ICON[action.id as keyof typeof ACTION_ICON] ?? SlidersHorizontal;
              const tone = ACTION_TONE[action.id as keyof typeof ACTION_TONE] ?? ACTION_TONE.filters;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => onAction(action.id)}
                  className="p-5 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl text-left hover:border-brand/30 transition-colors group"
                >
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${tone}`}>
                    <Icon icon={ActionIcon} size={18} />
                  </span>
                  <span className="block text-sm font-bold text-ink-900 dark:text-white mb-1">{action.label}</span>
                  <span className="block text-xs text-ink-500 dark:text-ink-300 leading-relaxed">
                    {action.description}
                  </span>
                </button>
              );
            })}
          </div>

          <SmartButton
            featureKey="search.zero_state_browse_all"
            variant="ghost"
            onClick={() => onAction("browse-all")}
          >
            Browse all vehicles instead
          </SmartButton>
        </div>
      </Reveal>
    </FeatureGate>
  );
}
