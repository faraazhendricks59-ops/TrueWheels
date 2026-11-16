"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft, X } from "lucide-react";
import { searchCommands, type CommandResult } from "@/components/command/search-index";

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const flat = useMemo(() => searchCommands(query), [query]);

  // Flat index per result id, so rendering never mutates state during render.
  const indexOf = useMemo(() => new Map(flat.map((r, i) => [r.id, i])), [flat]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandResult[]>();
    for (const r of flat) {
      const bucket = map.get(r.group);
      if (bucket) bucket.push(r);
      else map.set(r.group, [r]);
    }
    return Array.from(map.entries());
  }, [flat]);

  const activeId = flat[selectedIndex] ? `cmd-option-${flat[selectedIndex].id}` : undefined;

  const navigate = useCallback(
    (result: CommandResult) => {
      onClose();
      router.push(result.href);
    },
    [onClose, router],
  );

  // Reset the highlight whenever the result set changes.
  useEffect(() => setSelectedIndex(0), [flat]);

  // Autofocus the input on open, and restore focus to whatever was focused
  // before (the trigger). Capturing here — before we move focus — is essential:
  // a separate effect declared earlier would already see the input as active.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => previouslyFocused?.focus?.();
  }, []);

  // Lock body scroll while the palette is open.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Keep the highlighted row visible.
  useEffect(() => {
    panelRef.current
      ?.querySelector('[data-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  // Keyboard handling + focus trap.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const count = flat.length;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (count) setSelectedIndex((prev) => (prev + 1) % count);
          break;
        case "ArrowUp":
          e.preventDefault();
          if (count) setSelectedIndex((prev) => (prev - 1 + count) % count);
          break;
        case "Home":
          e.preventDefault();
          setSelectedIndex(0);
          break;
        case "End":
          e.preventDefault();
          if (count) setSelectedIndex(count - 1);
          break;
        case "Enter":
          e.preventDefault();
          if (flat[selectedIndex]) navigate(flat[selectedIndex]);
          break;
        case "Escape":
          e.preventDefault();
          e.stopPropagation();
          onClose();
          break;
        case "Tab": {
          // Trap focus inside the panel.
          const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
          if (!nodes || nodes.length === 0) break;
          const list = Array.from(nodes);
          const first = list[0];
          const last = list[list.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
          break;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flat, selectedIndex, navigate, onClose]);

  const palette = (
    <div
      className="animate-overlay-in fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[15vh]"
      role="presentation"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="animate-palette-in relative w-full max-w-xl overflow-hidden rounded-2xl border border-brand-silver bg-surface-white shadow-2xl"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-brand-silver px-4">
          <Search size={18} className="flex-shrink-0 text-neutral-subtle" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            placeholder="Search vehicles, parts, dealers, events..."
            className="h-14 flex-1 bg-transparent text-sm text-brand-graphite placeholder:text-neutral-subtle focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
            className="rounded-lg p-1.5 text-neutral-subtle transition-colors hover:bg-neutral-hover hover:text-brand-graphite"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div id="command-palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {flat.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-neutral-muted">No results for &ldquo;{query}&rdquo;</p>
              <p className="mt-1 text-xs text-neutral-subtle">Try searching by make, model, or part number.</p>
            </div>
          ) : (
            grouped.map(([groupName, items]) => (
              <div key={groupName} className="mb-2" role="group" aria-label={groupName}>
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-subtle">
                  {groupName}
                </p>
                {items.map((result) => {
                  const currentIndex = indexOf.get(result.id) ?? 0;
                  const isSelected = currentIndex === selectedIndex;
                  const Icon = result.icon;
                  return (
                    <button
                      key={result.id}
                      id={`cmd-option-${result.id}`}
                      role="option"
                      aria-selected={isSelected}
                      data-selected={isSelected}
                      onClick={() => navigate(result)}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        isSelected ? "bg-brand-red/10" : "hover:bg-surface-grey"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                          isSelected ? "bg-brand-red text-white" : "bg-surface-grey text-neutral-muted"
                        }`}
                      >
                        <Icon size={15} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-sm font-semibold ${
                            isSelected ? "text-brand-red" : "text-brand-graphite"
                          }`}
                        >
                          {result.title}
                        </span>
                        {result.subtitle && (
                          <span className="block truncate text-xs text-neutral-muted">{result.subtitle}</span>
                        )}
                      </span>
                      {isSelected && (
                        <CornerDownLeft size={14} className="flex-shrink-0 text-brand-red" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 border-t border-brand-silver bg-surface-grey/40 px-4 py-2.5 text-[10px] text-neutral-subtle">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-brand-silver bg-surface-white px-1.5 py-0.5 text-[9px]">↑↓</kbd>{" "}
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-brand-silver bg-surface-white px-1.5 py-0.5 text-[9px]">↵</kbd> open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-brand-silver bg-surface-white px-1.5 py-0.5 text-[9px]">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(palette, document.body);
}
