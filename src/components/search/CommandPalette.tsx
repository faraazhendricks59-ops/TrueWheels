"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Search, Sparkles, CornerDownLeft, X } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useScrollLock, useFocusTrap, useEscapeKey } from "@/components/ui/overlay-hooks";
import { useAnnounce } from "@/components/a11y/AriaLiveAnnouncer";
import { groupItems, searchItems, type SearchItem } from "@/lib/search-index";

type Mode = "search" | "ai";

/**
 * Preview of the concierge answer. The real model call lands with the AI
 * phases; this composes a deterministic summary from the local index so the AI
 * mode is exercised end to end without a network dependency.
 */
function buildAiAnswer(query: string, items: SearchItem[]): string {
  if (!query.trim()) return "Ask me about a vehicle, part, dealer or event.";
  if (items.length === 0) return `I could not find anything matching “${query}”. Try a make, model or city.`;

  const kinds = Array.from(new Set(items.map((item) => item.type)));
  const kindList = kinds.join(" and ");
  return `I found ${items.length} ${items.length === 1 ? "match" : "matches"} for “${query}” across ${kindList}. The closest listings are below.`;
}

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("search");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { announce } = useAnnounce();

  useScrollLock(true);
  useEscapeKey(true, onClose);
  useFocusTrap(true, dialogRef);

  useEffect(() => {
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, []);

  const results = useMemo(() => searchItems(query), [query]);
  const groups = useMemo(() => groupItems(results), [results]);
  const flatResults = useMemo(() => groups.flatMap((group) => group.items), [groups]);

  useEffect(() => setSelectedIndex(0), [query, mode]);

  useEffect(() => {
    announce(
      mode === "ai"
        ? "AI mode. " + buildAiAnswer(query, flatResults)
        : `${flatResults.length} ${flatResults.length === 1 ? "result" : "results"} available`
    );
  }, [announce, flatResults.length, mode, query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${selectedIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const select = (item?: SearchItem) => {
    if (!item) return;
    onClose();
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (flatResults.length ? (i + 1) % flatResults.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (flatResults.length ? (i - 1 + flatResults.length) % flatResults.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(flatResults[selectedIndex]);
    }
  };

  let runningIndex = -1;

  return createPortal(
    <FeatureGate featureKey="ui.command_palette" fallback={null}>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
        <div
          className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm noise"
          onClick={onClose}
          aria-hidden="true"
        />

        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Search and commands"
          className="relative w-full max-w-2xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-lift overflow-hidden animate-scale-in flex flex-col max-h-[60vh]"
        >
          <div className="flex items-center gap-3 px-5 py-4 border-b border-ink-100 dark:border-ink-800">
            <Icon
              icon={mode === "search" ? Search : Sparkles}
              size={20}
              className={mode === "ai" ? "text-aurora-purple" : "text-ink-400"}
            />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={mode === "search" ? "Search vehicles, parts, dealers..." : "Ask TrueWheels AI..."}
              aria-label="Search listings and pages"
              role="combobox"
              aria-expanded="true"
              aria-controls="command-results"
              aria-activedescendant={flatResults[selectedIndex] ? `cmd-${flatResults[selectedIndex].id}` : undefined}
              className="flex-1 bg-transparent text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none text-base"
            />

            <button
              type="button"
              onClick={() => setMode((m) => (m === "search" ? "ai" : "search"))}
              aria-pressed={mode === "ai"}
              className={clsx(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors",
                mode === "ai"
                  ? "bg-aurora-purple/10 text-aurora-purple"
                  : "bg-ink-50 dark:bg-ink-800 text-ink-400 hover:text-ink-600"
              )}
            >
              <Icon icon={Sparkles} size={10} />
              {mode === "ai" ? "AI Mode" : "Search"}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="p-1 text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors"
            >
              <Icon icon={X} size={16} />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto p-2">
            {mode === "ai" && (
              <div className="mx-2 mt-2 mb-3 p-3 rounded-xl bg-aurora-purple/5 border border-aurora-purple/20">
                <p className="text-[10px] font-bold uppercase tracking-wider text-aurora-purple mb-1">
                  AI Concierge · preview
                </p>
                <p className="text-sm text-ink-700 dark:text-ink-200">
                  {buildAiAnswer(query, flatResults)}
                </p>
              </div>
            )}

            {flatResults.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-ink-500 dark:text-ink-300">No results for “{query}”</p>
                {mode === "search" && (
                  <button
                    type="button"
                    onClick={() => setMode("ai")}
                    className="mt-2 text-xs font-semibold text-aurora-purple hover:underline inline-flex items-center gap-1"
                  >
                    <Icon icon={Sparkles} size={10} /> Ask AI instead
                  </button>
                )}
              </div>
            ) : (
              <ul id="command-results" role="listbox" aria-label="Results">
                {groups.map((group) => (
                  <li key={group.type}>
                    <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider px-3 py-1.5">
                      {group.label}
                    </p>
                    <ul role="group" aria-label={group.label}>
                      {group.items.map((item) => {
                        runningIndex += 1;
                        const index = runningIndex;
                        const isSelected = index === selectedIndex;
                        return (
                          <li key={item.id} role="option" aria-selected={isSelected} id={`cmd-${item.id}`}>
                            <button
                              type="button"
                              data-index={index}
                              onClick={() => select(item)}
                              onMouseEnter={() => setSelectedIndex(index)}
                              className={clsx(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors",
                                isSelected
                                  ? "bg-brand/10 text-brand"
                                  : "text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800"
                              )}
                            >
                              <span
                                className={clsx(
                                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                  isSelected ? "bg-brand text-white" : "bg-ink-100 dark:bg-ink-800 text-ink-500"
                                )}
                              >
                                <Icon icon={item.icon} size={14} />
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className="block text-sm font-semibold truncate">{item.title}</span>
                                <span className="block text-xs text-ink-400 truncate">{item.subtitle}</span>
                              </span>
                              {item.meta && (
                                <span
                                  className={clsx(
                                    "text-xs font-mono font-bold tabular-nums",
                                    isSelected ? "text-brand" : "text-ink-500"
                                  )}
                                >
                                  {item.meta}
                                </span>
                              )}
                              {isSelected && <Icon icon={CornerDownLeft} size={14} className="ml-2" />}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-2.5 border-t border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/50 text-[10px] text-ink-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded text-[9px] font-mono">↑↓</kbd> navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded text-[9px] font-mono">↵</kbd> open
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded text-[9px] font-mono">esc</kbd> close
            </span>
          </div>
        </div>
      </div>
    </FeatureGate>,
    document.body
  );
}
