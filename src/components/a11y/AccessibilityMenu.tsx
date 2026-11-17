"use client";

import { Accessibility, Check, Contrast } from "lucide-react";
import { clsx } from "clsx";
import { Magnetic } from "@/components/motion/Magnetic";
import { Dropdown, DropdownItem } from "@/components/ui/Floating";
import { Icon } from "@/components/ui/Icon";
import { useAccessibility, type FontScale } from "@/components/providers/AccessibilityProvider";

const SCALES: { value: FontScale; label: string }[] = [
  { value: "normal", label: "Default text size" },
  { value: "large", label: "Large text" },
  { value: "x-large", label: "Extra large text" },
];

export function AccessibilityMenu() {
  const { fontScale, highContrast, setFontScale, toggleHighContrast } = useAccessibility();

  return (
    <Magnetic strength={0.15}>
      <Dropdown
        label="Accessibility settings"
        trigger={
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
            <Icon icon={Accessibility} size={16} />
          </span>
        }
      >
        <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
          Text size
        </p>
        {SCALES.map((scale) => (
          <DropdownItem
            key={scale.value}
            selected={fontScale === scale.value}
            onClick={() => setFontScale(scale.value)}
          >
            <span className="flex-1 text-left">{scale.label}</span>
            {fontScale === scale.value && <Icon icon={Check} size={14} />}
          </DropdownItem>
        ))}

        <div className="my-1 border-t border-ink-100 dark:border-ink-800" />
        <button
          type="button"
          role="menuitemcheckbox"
          aria-checked={highContrast}
          onClick={toggleHighContrast}
          className={clsx(
            "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2",
            "text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800",
            "focus:outline-none focus:bg-ink-50 dark:focus:bg-ink-800"
          )}
        >
          <Icon icon={Contrast} size={14} />
          <span className="flex-1">High contrast</span>
          <span
            className={clsx(
              "w-8 h-4 rounded-full transition-colors relative",
              highContrast ? "bg-brand" : "bg-ink-200 dark:bg-ink-700"
            )}
            aria-hidden="true"
          >
            <span
              className={clsx(
                "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all",
                highContrast ? "left-4" : "left-0.5"
              )}
            />
          </span>
        </button>
      </Dropdown>
    </Magnetic>
  );
}
