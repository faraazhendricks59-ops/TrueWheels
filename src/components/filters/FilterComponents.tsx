"use client";

import { useId, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Switch } from "@/components/ui/Toggles";

interface FilterFacetProps {
  title: string;
  options: { id: string; label: string; count: number }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  defaultOpen?: boolean;
}

export function FilterFacet({ title, options, selected, onChange, defaultOpen = false }: FilterFacetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();

  const toggleOption = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id]);
  };

  return (
    <div className="border-b border-ink-100 dark:border-ink-800 last:border-0 py-4">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center justify-between text-sm font-semibold text-ink-900 dark:text-white"
      >
        <span className="flex items-center gap-2">
          {title}
          {selected.length > 0 && (
            <span className="text-[10px] font-bold text-white bg-brand px-1.5 py-0.5 rounded-full">
              {selected.length}
            </span>
          )}
        </span>
        <Icon
          icon={ChevronDown}
          size={14}
          className={clsx("transition-transform text-ink-400", isOpen && "rotate-180")}
        />
      </button>

      <div id={panelId} hidden={!isOpen} className="space-y-2 pt-3">
        {options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <label key={option.id} className="flex items-center justify-between cursor-pointer group gap-3">
              <span className="flex items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => toggleOption(option.id)}
                />
                <span
                  aria-hidden="true"
                  className={clsx(
                    "w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0",
                    isSelected
                      ? "bg-brand border-brand"
                      : "border-ink-300 dark:border-ink-700 group-hover:border-brand"
                  )}
                >
                  {isSelected && <Icon icon={Check} size={10} className="text-white" strokeWidth={3} />}
                </span>
                <span
                  className={clsx(
                    "text-sm truncate transition-colors",
                    isSelected ? "text-ink-900 dark:text-white font-medium" : "text-ink-600 dark:text-ink-300"
                  )}
                >
                  {option.label}
                </span>
              </span>
              <span className="text-xs text-ink-400 tabular-nums flex-shrink-0">{option.count}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

interface FilterToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  premium?: boolean;
}

export function FilterToggle({ label, checked, onChange, premium = false }: FilterToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm text-ink-700 dark:text-ink-200 flex items-center gap-2">
        {label}
        {premium && (
          <span className="text-[9px] font-bold text-aurora-purple bg-aurora-purple/10 px-1.5 py-0.5 rounded uppercase">
            AI
          </span>
        )}
      </span>
      <Switch
        label={<span className="sr-only">{label}</span>}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
}
