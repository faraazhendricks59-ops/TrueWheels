"use client";

import { useId, useState, useRef, useEffect, useCallback } from "react";
import { clsx } from "clsx";
import { ChevronDown, Check } from "lucide-react";
import { Icon } from "./Icon";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/**
 * Custom listbox. Follows the WAI-ARIA listbox pattern: the trigger is a
 * combobox, options carry role=option, and the active option is tracked so
 * keyboard and mouse stay in sync.
 */
export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  error,
  hint,
  disabled,
  id: propsId,
  className,
}: SelectProps) {
  const autoId = useId();
  const id = propsId || autoId;
  const listboxId = `${id}-listbox`;

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const enabledIndexes = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);

  const open = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : (enabledIndexes[0] ?? -1));
  }, [disabled, selectedIndex, enabledIndexes]);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  const select = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option || option.disabled) return;
      onChange?.(option.value);
      close();
    },
    [options, onChange, close]
  );

  const move = useCallback(
    (direction: 1 | -1) => {
      if (!enabledIndexes.length) return;
      setActiveIndex((current) => {
        const at = enabledIndexes.indexOf(current);
        if (at === -1) return enabledIndexes[0];
        const next = (at + direction + enabledIndexes.length) % enabledIndexes.length;
        return enabledIndexes[next];
      });
    },
    [enabledIndexes]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) open();
        else move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) open();
        else move(-1);
        break;
      case "Home":
        if (isOpen) {
          e.preventDefault();
          setActiveIndex(enabledIndexes[0] ?? -1);
        }
        break;
      case "End":
        if (isOpen) {
          e.preventDefault();
          setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isOpen) open();
        else if (activeIndex >= 0) select(activeIndex);
        break;
      case "Escape":
        if (isOpen) {
          e.preventDefault();
          close();
        }
        break;
      case "Tab":
        if (isOpen) close();
        break;
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) close();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  // Keep the active option in view while arrowing through a long list.
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [isOpen, activeIndex]);

  return (
    <div className={clsx("flex flex-col gap-1.5", className)} ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wide"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={isOpen ? listboxId : undefined}
          aria-activedescendant={isOpen && activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          onClick={() => (isOpen ? close() : open())}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={clsx(
            "w-full h-11 px-3.5 rounded-xl bg-white dark:bg-ink-900 border text-sm text-left flex items-center justify-between",
            "transition-all ease-swift focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand",
            "disabled:bg-ink-50 disabled:text-ink-400 disabled:cursor-not-allowed",
            error ? "border-semantic-error" : "border-ink-200 dark:border-ink-800",
            !selectedOption && "text-ink-400"
          )}
        >
          <span className={clsx("truncate", !selectedOption && "italic")}>
            {selectedOption?.label || placeholder}
          </span>
          <Icon icon={ChevronDown} size={16} className={clsx("transition-transform shrink-0", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div
            id={listboxId}
            ref={listRef}
            role="listbox"
            aria-labelledby={id}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl shadow-lift overflow-hidden animate-rise"
          >
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isActive = index === activeIndex;
                return (
                  <div
                    key={option.value}
                    id={`${listboxId}-opt-${index}`}
                    data-index={index}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    onClick={() => select(index)}
                    onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                    className={clsx(
                      "w-full px-3.5 py-2.5 text-sm text-left flex items-center justify-between transition-colors",
                      option.disabled
                        ? "text-ink-300 cursor-not-allowed"
                        : "cursor-pointer text-ink-700 dark:text-ink-200",
                      isActive && !option.disabled && "bg-ink-50 dark:bg-ink-800",
                      isSelected && "text-brand font-semibold bg-brand/5"
                    )}
                  >
                    {option.label}
                    {isSelected && <Icon icon={Check} size={14} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs text-semantic-error font-medium">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-ink-400">
          {hint}
        </p>
      )}
    </div>
  );
}
