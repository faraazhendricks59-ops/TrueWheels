"use client";

import { Clock, Gauge, Sparkles, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Dropdown, DropdownItem } from "@/components/ui/Floating";
import { FeatureGate } from "@/components/feature/FeatureGate";

export type SortOption = "relevance" | "price_asc" | "price_desc" | "newest" | "mileage_asc";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export const SORT_OPTIONS: { id: SortOption; label: string; icon: LucideIcon }[] = [
  { id: "relevance", label: "AI relevance", icon: Sparkles },
  { id: "price_asc", label: "Price: low to high", icon: TrendingUp },
  { id: "price_desc", label: "Price: high to low", icon: TrendingDown },
  { id: "newest", label: "Newest first", icon: Clock },
  { id: "mileage_asc", label: "Lowest mileage", icon: Gauge },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const current = SORT_OPTIONS.find((option) => option.id === value) ?? SORT_OPTIONS[0];

  return (
    <FeatureGate featureKey="marketplace.sort">
      <Dropdown
        label="Sort results"
        trigger={
          <span className="flex items-center gap-2 h-9 px-3 rounded-xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 text-sm font-medium text-ink-700 dark:text-ink-200 hover:border-ink-200 dark:hover:border-ink-700 transition-colors whitespace-nowrap">
            <Icon
              icon={current.icon}
              size={14}
              className={value === "relevance" ? "text-aurora-purple" : "text-ink-400"}
            />
            {current.label}
          </span>
        }
      >
        {SORT_OPTIONS.map((option) => (
          <DropdownItem
            key={option.id}
            onClick={() => onChange(option.id)}
            selected={value === option.id}
          >
            <Icon
              icon={option.icon}
              size={14}
              className={value === option.id ? "text-brand" : "text-ink-400"}
            />
            <span className={value === option.id ? "text-brand font-semibold" : undefined}>{option.label}</span>
          </DropdownItem>
        ))}
      </Dropdown>
    </FeatureGate>
  );
}
