"use client";

import { useId } from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";
import { Icon } from "./Icon";

// --- SWITCH ---
interface SwitchProps {
  label?: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ label, description, checked, onChange, disabled }: SwitchProps) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        {label && (
          <label htmlFor={id} className="text-sm font-semibold text-ink-900 dark:text-white block">
            {label}
          </label>
        )}
        {description && <p className="text-xs text-ink-500 mt-0.5">{description}</p>}
      </div>
      <button
        id={id}
        role="switch"
        type="button"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={clsx(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors ease-swift focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-ink-950",
          checked ? "bg-brand" : "bg-ink-200 dark:bg-ink-700",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          className={clsx(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ease-swift",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

// --- CHECKBOX ---
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ label, checked, onChange, disabled }: CheckboxProps) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={clsx("flex items-start gap-3 cursor-pointer group", disabled && "opacity-50 cursor-not-allowed")}
    >
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="peer sr-only"
        />
        {/* The real input is sr-only, so keyboard focus must be mirrored onto
            the visual box or focus is invisible. */}
        <div
          className={clsx(
            "w-5 h-5 rounded-md border-2 transition-all ease-swift flex items-center justify-center",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-ink-950",
            checked
              ? "bg-brand border-brand"
              : "bg-white dark:bg-ink-900 border-ink-300 dark:border-ink-700 group-hover:border-brand"
          )}
        >
          {checked && <Icon icon={Check} size={12} className="text-white" strokeWidth={3} />}
        </div>
      </div>
      <span className="text-sm text-ink-700 dark:text-ink-200 leading-tight select-none">{label}</span>
    </label>
  );
}
