"use client";

import { X } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { FeatureGate } from "@/components/feature/FeatureGate";

export interface Filter {
  id: string;
  label: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: Filter[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <FeatureGate featureKey="marketplace.active_filters">
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-2">
        <span className="text-xs font-semibold text-ink-400 uppercase tracking-wide flex-shrink-0">
          Active
        </span>

        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => onRemove(filter.id)}
            aria-label={`Remove filter ${filter.label}: ${filter.value}`}
            className="group flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full bg-brand/5 border border-brand/20 text-brand text-xs font-semibold hover:bg-brand/10 transition-colors flex-shrink-0"
          >
            <span>
              {filter.label}:{" "}
              <span className="text-ink-900 dark:text-white">{filter.value}</span>
            </span>
            <span className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
              <Icon icon={X} size={10} strokeWidth={2.5} />
            </span>
          </button>
        ))}

        <SmartButton
          featureKey="marketplace.clear_filters"
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="!h-7 !px-2 !text-[10px] !rounded-full flex-shrink-0"
        >
          Clear all
        </SmartButton>
      </div>
    </FeatureGate>
  );
}
