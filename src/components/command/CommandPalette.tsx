"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, CornerDownLeft } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { useAnnounce } from "@/components/a11y/AriaLiveAnnouncer";
import { DEMO_VEHICLES, type DemoVehicle } from "@/lib/demo/vehicles";
import { localeTag } from "@/lib/i18n/locale";

export const COMMAND_PALETTE_OPEN_EVENT = "truewheels:command-palette-open";

interface Result {
  id: string;
  title: string;
  meta: string;
  href: string;
}

const PAGES: Result[] = [
  { id: "p-marketplace", title: "Marketplace", meta: "Browse listings", href: "/marketplace" },
  { id: "p-list", title: "List a vehicle", meta: "Sell your car", href: "/#list" },
  { id: "p-auctions", title: "Auctions", meta: "Live bidding", href: "/#auctions" },
];

function vehicleToResult(vehicle: DemoVehicle): Result {
  return {
    id: vehicle.id,
    title: vehicle.title,
    meta: `R ${vehicle.price.toLocaleString(localeTag("en"))} · ${vehicle.location}`,
    href: "/marketplace",
  };
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { announce } = useAnnounce();

  // Any part of the app can open the palette by dispatching this event, which
  // keeps the omnibox free of palette-specific state.
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(COMMAND_PALETTE_OPEN_EVENT, open);
    return () => window.removeEventListener(COMMAND_PALETTE_OPEN_EVENT, open);
  }, []);

  // Cmd/Ctrl+K from anywhere.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...PAGES, ...DEMO_VEHICLES.slice(0, 5).map(vehicleToResult)];
    const matches = (value: string) => value.toLowerCase().includes(q);
    const vehicles = DEMO_VEHICLES.filter(
      (v) => matches(v.title) || matches(v.location)
    ).slice(0, 8);
    return [
      ...PAGES.filter((p) => matches(p.title) || matches(p.meta)),
      ...vehicles.map(vehicleToResult),
    ];
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Reset and focus when opening. The input is inside a dialog that mounts on
  // open, so focus has to happen after that render.
  useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    setActiveIndex(0);
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  // Announce the result count to screen readers, which have no other way to
  // know the list changed.
  useEffect(() => {
    if (!isOpen) return;
    announce(`${results.length} ${results.length === 1 ? "result" : "results"} available`);
  }, [isOpen, results.length, announce]);

  const go = (result?: Result) => {
    if (!result) return;
    setIsOpen(false);
    window.location.assign(result.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center pt-[15vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search and commands"
    >
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xl bg-white dark:bg-ink-900 rounded-2xl shadow-lift border border-ink-100 dark:border-ink-800 overflow-hidden">
        <div className="flex items-center gap-3 px-4 h-14 border-b border-ink-100 dark:border-ink-800">
          <Icon icon={Search} size={16} className="text-ink-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search make, model, or keyword..."
            aria-label="Search listings and pages"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={results[activeIndex] ? `cmd-${results[activeIndex].id}` : undefined}
            className="flex-1 bg-transparent outline-none text-sm text-ink-900 dark:text-white placeholder:text-ink-400"
          />
          <kbd className="hidden sm:block text-[10px] font-mono text-ink-400 border border-ink-200 dark:border-ink-700 rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        <ul id="command-results" role="listbox" className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-ink-400">
              No matches for &ldquo;{query}&rdquo;
            </li>
          )}
          {results.map((result, index) => (
            <li key={result.id} role="option" aria-selected={index === activeIndex} id={`cmd-${result.id}`}>
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => go(result)}
                className={clsx(
                  "w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors",
                  index === activeIndex
                    ? "bg-brand/10 text-brand"
                    : "text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800"
                )}
              >
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium truncate">{result.title}</span>
                  <span className="block text-[10px] text-ink-400 truncate">{result.meta}</span>
                </span>
                {index === activeIndex && <Icon icon={CornerDownLeft} size={12} />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
