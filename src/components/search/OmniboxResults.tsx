"use client";

import { Car, Sparkles, type LucideIcon } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { groupItems, type SearchItem } from "@/lib/search-index";

interface OmniboxResultsProps {
  items: SearchItem[];
  query: string;
  isAI: boolean;
  selectedIndex: number;
  onSelect: (item: SearchItem) => void;
  onHover: (index: number) => void;
  /** Leading content, e.g. the instant answer card. */
  header?: React.ReactNode;
}

export function OmniboxResults({
  items,
  query,
  isAI,
  selectedIndex,
  onSelect,
  onHover,
  header,
}: OmniboxResultsProps) {
  const groups = groupItems(items);

  if (!query) {
    return (
      <div className="p-8 text-center text-sm text-ink-400">Start typing to search</div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-ink-500 dark:text-ink-300">No results for &ldquo;{query}&rdquo;</p>
        {!isAI && (
          <p className="mt-1 text-xs text-ink-400">
            Try a make, model or city &mdash; or switch to AI mode for a summary.
          </p>
        )}
      </div>
    );
  }

  let runningIndex = -1;

  return (
    <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
      {header}

      {groups.map((group) => (
        <div key={group.type}>
          <div className="flex items-center gap-2 mb-3 px-2">
            <Icon icon={group.items[0].icon} size={14} className="text-ink-400" />
            <h4 className="text-xs font-bold text-ink-400 uppercase tracking-wider">{group.label}</h4>
          </div>
          <ul role="listbox" aria-label={group.label} className="space-y-1">
            {group.items.map((item) => {
              runningIndex += 1;
              const index = runningIndex;
              const isSelected = index === selectedIndex;
              return (
                <li key={item.id} role="option" aria-selected={isSelected} id={`omnibox-${item.id}`}>
                  <button
                    type="button"
                    data-index={index}
                    onMouseEnter={() => onHover(index)}
                    onClick={() => onSelect(item)}
                    className={clsx(
                      "w-full flex items-center justify-between gap-4 p-3 rounded-xl transition-colors text-left group",
                      isSelected ? "bg-brand/10" : "hover:bg-ink-50 dark:hover:bg-ink-800"
                    )}
                  >
                    <span className="flex-1 min-w-0">
                      <span
                        className={clsx(
                          "block text-sm font-semibold truncate transition-colors",
                          isSelected ? "text-brand" : "text-ink-900 dark:text-white group-hover:text-brand"
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="block text-xs text-ink-500 dark:text-ink-300 truncate mt-0.5">
                        {item.subtitle}
                      </span>
                    </span>
                    {item.meta && (
                      <span className="text-sm font-bold text-ink-900 dark:text-white tabular-nums flex-shrink-0">
                        {item.meta}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** AI-mode prompt rows, derived from the query rather than invented. */
export function AISuggestionGroup({
  query,
  onSelect,
}: {
  query: string;
  onSelect: (href: string) => void;
}) {
  const suggestions: { id: string; title: string; meta: string; href: string; icon: LucideIcon; badge: string }[] = [
    {
      id: "ai-compare",
      title: `Compare ${query} options`,
      meta: "Side-by-side spec and price",
      href: `/marketplace?q=${encodeURIComponent(query)}`,
      icon: Sparkles,
      badge: "Deep dive",
    },
    {
      id: "ai-finance",
      title: `Estimate finance for ${query}`,
      meta: "Monthly instalment on a 72-month term",
      href: `/marketplace?q=${encodeURIComponent(query)}`,
      icon: Car,
      badge: "Instant",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 px-2">
        <Icon icon={Sparkles} size={14} className="text-aurora-purple" />
        <h4 className="text-xs font-bold text-ink-400 uppercase tracking-wider">AI suggestions</h4>
      </div>
      <ul className="space-y-1">
        {suggestions.map((suggestion) => (
          <li key={suggestion.id}>
            <button
              type="button"
              onClick={() => onSelect(suggestion.href)}
              className="w-full flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors text-left group"
            >
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-ink-900 dark:text-white truncate group-hover:text-brand transition-colors">
                  {suggestion.title}
                </span>
                <span className="block text-xs text-ink-500 dark:text-ink-300 truncate mt-0.5">
                  {suggestion.meta}
                </span>
              </span>
              <Badge variant="ai" tone="aurora">{suggestion.badge}</Badge>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
