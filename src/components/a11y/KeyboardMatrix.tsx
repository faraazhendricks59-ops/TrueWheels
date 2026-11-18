"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";

interface Shortcut {
  keys: string[];
  action: string;
  scope: string;
  category: "navigation" | "action" | "widget" | "media";
}

/**
 * Only shortcuts that are actually wired up in the codebase are listed here. Each
 * one was checked against its handler before being documented — a shortcut chart
 * that promises a key which does nothing is worse than no chart, because it teaches
 * a reader a habit that fails. If you add a handler, add its row.
 *
 * Deliberately NOT listed (no handler exists): Cmd+/ to focus search, ? for a
 * shortcuts dialog, and Cmd+B for a quick bid.
 */
const SHORTCUTS: Shortcut[] = [
  { keys: ["⌘", "K"], action: "Open the command palette", scope: "Anywhere", category: "navigation" },
  { keys: ["Esc"], action: "Close the top modal, sheet or dropdown", scope: "Anywhere", category: "navigation" },
  { keys: ["Tab"], action: "Move to the next focusable element", scope: "Anywhere", category: "navigation" },
  { keys: ["Shift", "Tab"], action: "Move to the previous focusable element", scope: "Anywhere", category: "navigation" },
  { keys: ["Enter"], action: "Activate the focused control", scope: "Anywhere", category: "action" },
  { keys: ["Space"], action: "Toggle the focused control", scope: "Anywhere", category: "action" },
  { keys: ["↑"], action: "Previous result", scope: "Command palette", category: "widget" },
  { keys: ["↓"], action: "Next result", scope: "Command palette", category: "widget" },
  { keys: ["↵"], action: "Open the highlighted result", scope: "Command palette", category: "action" },
  { keys: ["←"], action: "Previous tab", scope: "Tab lists", category: "widget" },
  { keys: ["→"], action: "Next tab", scope: "Tab lists", category: "widget" },
  { keys: ["Home"], action: "First tab", scope: "Tab lists", category: "widget" },
  { keys: ["End"], action: "Last tab", scope: "Tab lists", category: "widget" },
  { keys: ["←"], action: "Previous photo", scope: "Vehicle gallery", category: "media" },
  { keys: ["→"], action: "Next photo", scope: "Vehicle gallery", category: "media" },
  { keys: ["+"], action: "Zoom in", scope: "Photo lightbox", category: "media" },
  { keys: ["−"], action: "Zoom out", scope: "Photo lightbox", category: "media" },
  { keys: ["⌘", "↵"], action: "Send a message or post a comment", scope: "Messages & comments", category: "action" },
];

const CATEGORIES = {
  navigation: { label: "Navigation", className: "bg-aurora-blue/10 text-aurora-blue" },
  action: { label: "Actions", className: "bg-brand/10 text-brand" },
  widget: { label: "Widgets", className: "bg-aurora-purple/10 text-aurora-purple" },
  media: { label: "Media", className: "bg-semantic-success/10 text-semantic-success" },
} as const;

type CategoryKey = keyof typeof CATEGORIES;

export function KeyboardMatrix() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | CategoryKey>("all");

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return SHORTCUTS.filter((s) => {
      const matchesCategory = category === "all" || s.category === category;
      const matchesSearch =
        !needle ||
        s.action.toLowerCase().includes(needle) ||
        s.scope.toLowerCase().includes(needle) ||
        s.keys.join(" ").toLowerCase().includes(needle);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <Reveal variant="up">
      <section
        aria-labelledby="keyboard-matrix-heading"
        className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-lift overflow-hidden"
      >
        <div className="p-5 border-b border-ink-100 dark:border-ink-800">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2
                id="keyboard-matrix-heading"
                className="text-lg font-display font-bold text-ink-900 dark:text-white"
              >
                Keyboard Navigation Matrix
              </h2>
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
                Every shortcut that is actually wired up, and nothing that is not.
              </p>
            </div>
            <Badge variant="status" tone="green" dot>
              {SHORTCUTS.length} shortcuts
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                label="Filter shortcuts"
                placeholder="Search shortcuts…"
                leftIcon={Search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div
              role="group"
              aria-label="Filter by category"
              className="flex gap-2 overflow-x-auto hide-scrollbar sm:items-end sm:pb-1"
            >
              <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
                All
              </FilterChip>
              {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => (
                <FilterChip key={key} active={category === key} onClick={() => setCategory(key)}>
                  {CATEGORIES[key].label}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-ink-100 dark:divide-ink-800 max-h-[600px] overflow-y-auto custom-scrollbar">
          {filtered.length === 0 ? (
            <p className="p-12 text-center text-sm text-ink-500 dark:text-ink-400" role="status">
              No shortcuts match your search.
            </p>
          ) : (
            filtered.map((shortcut, i) => {
              const cat = CATEGORIES[shortcut.category];
              return (
                <div
                  key={`${shortcut.action}-${i}`}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-ink-50/50 dark:hover:bg-ink-950/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {shortcut.keys.map((key, j) => (
                        <span key={j} className="flex items-center gap-1">
                          <kbd className="min-w-[28px] h-7 px-2 rounded-lg bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-700 text-xs font-mono font-bold text-ink-700 dark:text-ink-200 shadow-sm flex items-center justify-center">
                            {key}
                          </kbd>
                          {j < shortcut.keys.length - 1 && (
                            <span aria-hidden="true" className="text-[10px] text-ink-400 mx-0.5">
                              +
                            </span>
                          )}
                        </span>
                      ))}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-900 dark:text-white truncate">
                        {shortcut.action}
                      </p>
                      <p className="text-[10px] text-ink-500 dark:text-ink-400 mt-0.5">
                        {shortcut.scope}
                      </p>
                    </div>
                  </div>

                  <span
                    className={clsx(
                      "px-2 py-1 rounded-lg text-[10px] font-bold flex-shrink-0",
                      cat.className
                    )}
                  >
                    {cat.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>
    </Reveal>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors",
        active
          ? "bg-ink-900 dark:bg-white text-white dark:text-ink-900 border-transparent"
          : "bg-transparent text-ink-600 dark:text-ink-300 border-ink-200 dark:border-ink-700 hover:border-ink-300 dark:hover:border-ink-600"
      )}
    >
      {children}
    </button>
  );
}
