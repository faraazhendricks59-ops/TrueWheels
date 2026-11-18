"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, MessageSquarePlus, Car } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useMessages } from "@/components/providers/MessagesProvider";
import { KIND_LABELS, MESSAGES_DISCLOSURE, NO_DRAFTS, type MessageDraft, type MessageKind } from "@/lib/messages";
import { localeTag } from "@/lib/i18n/locale";

type FilterType = "all" | MessageKind;

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "enquiry", label: "Enquiries" },
  { id: "offer", label: "Offers" },
  { id: "test_drive", label: "Test drives" },
];

const KIND_TONE: Record<MessageKind, "blue" | "red" | "green"> = {
  enquiry: "blue",
  offer: "red",
  test_drive: "green",
};

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(localeTag("en"), { day: "numeric", month: "short" }).format(date);
}

/**
 * The list of messages the reader has written.
 *
 * The brief called this an inbox of conversations, with unread counts, "Active now"
 * dots, "Within 1 hour" response times and trust badges. Every one of those needs a
 * second person, and there is no account system, so there is no second person; the
 * counts and badges would be invented. What the reader does have is a set of real
 * messages they wrote to sellers, so this lists those and filters by what kind of
 * message it is.
 */
export function MessageInbox({ activeId }: { activeId?: string }) {
  const { drafts, isHydrated } = useMessages();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const term = query.trim().toLowerCase();
  const filtered = drafts.filter((draft) => {
    const matchesFilter = filter === "all" || draft.kind === filter;
    const matchesSearch =
      !term ||
      draft.vehicleTitle.toLowerCase().includes(term) ||
      draft.body.toLowerCase().includes(term) ||
      draft.vehicleLocation.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-sm overflow-hidden flex flex-col lg:h-[calc(100vh-140px)]">
      <div className="p-5 border-b border-ink-100 dark:border-ink-800 flex-shrink-0">
        <h2 className="text-lg font-display font-bold text-ink-900 dark:text-white mb-3">Your messages</h2>
        <Input
          placeholder="Search your messages…"
          leftIcon={Search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search your messages"
        />
        <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
          {FILTERS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              aria-pressed={filter === option.id}
              className={clsx(
                "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border",
                filter === option.id
                  ? "bg-brand text-white border-brand"
                  : "bg-transparent text-ink-500 border-ink-100 dark:border-ink-800 hover:border-ink-200 dark:hover:border-ink-700",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!isHydrated ? null : drafts.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={MessageSquarePlus}
              title="No messages yet"
              description={NO_DRAFTS}
              actionLabel="Browse listings"
              actionFeatureKey="nav.marketplace"
            />
          </div>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-400">
            Nothing matches {term ? `"${query.trim()}"` : "that filter"}.
          </p>
        ) : (
          <ul className="divide-y divide-ink-100 dark:divide-ink-800">
            {filtered.map((draft) => (
              <li key={draft.id}>
                <ConversationRow draft={draft} isActive={draft.id === activeId} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {isHydrated && drafts.length > 0 && (
        <p className="px-5 py-3 border-t border-ink-100 dark:border-ink-800 text-[10px] text-ink-400 leading-relaxed flex-shrink-0">
          {MESSAGES_DISCLOSURE}
        </p>
      )}
    </div>
  );
}

function ConversationRow({ draft, isActive }: { draft: MessageDraft; isActive: boolean }) {
  const preview = draft.body.split("\n").filter(Boolean)[1] ?? draft.body;

  return (
    <Link
      href={`/messages/${draft.id}`}
      aria-current={isActive ? "page" : undefined}
      className={clsx(
        "flex gap-3 px-4 py-3 transition-colors",
        isActive
          ? "bg-ink-100 dark:bg-ink-800"
          : "hover:bg-ink-50 dark:hover:bg-ink-950/50",
      )}
    >
      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-ink-200 text-ink-500 dark:bg-ink-700 dark:text-ink-300">
        <Icon icon={Car} size={20} />
      </span>

      <div className="min-w-0 flex-1">
        {/* Name and time on one line, with the time hard right — the chat-list
            convention, so the eye can find the most recent thread. */}
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-semibold text-ink-900 dark:text-white">
            {draft.vehicleTitle}
          </span>
          <span className="flex-shrink-0 text-[11px] text-ink-400 dark:text-ink-300">
            {formatWhen(draft.updatedAt)}
          </span>
        </div>

        <div className="mt-0.5 flex items-center gap-2">
          <span className="truncate text-xs text-ink-500 dark:text-ink-400">{preview}</span>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <Badge variant="status" tone={KIND_TONE[draft.kind]}>
            {KIND_LABELS[draft.kind]}
          </Badge>
          <span className="truncate text-[10px] text-ink-400 dark:text-ink-300">{draft.vehicleLocation}</span>
        </div>
      </div>
    </Link>
  );
}
