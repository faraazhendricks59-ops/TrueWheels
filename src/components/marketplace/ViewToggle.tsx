"use client";

import { LayoutGrid, List } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const MODES: { id: ViewMode; label: string; icon: typeof LayoutGrid }[] = [
  { id: "grid", label: "Grid view", icon: LayoutGrid },
  { id: "list", label: "List view", icon: List },
];

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <FeatureGate featureKey="marketplace.view_toggle">
      <div
        role="group"
        aria-label="Result layout"
        className="flex items-center p-1 bg-ink-50 dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl"
      >
        {MODES.map((mode) => {
          const isActive = value === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChange(mode.id)}
              aria-label={mode.label}
              aria-pressed={isActive}
              className={clsx(
                "flex items-center justify-center w-9 h-9 rounded-lg transition-all ease-swift",
                isActive
                  ? "bg-white dark:bg-ink-800 text-ink-900 dark:text-white shadow-sm"
                  : "text-ink-400 hover:text-ink-600 dark:hover:text-ink-300"
              )}
            >
              <Icon icon={mode.icon} size={16} strokeWidth={isActive ? 2 : 1.75} />
            </button>
          );
        })}
      </div>
    </FeatureGate>
  );
}
