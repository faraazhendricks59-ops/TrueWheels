"use client";

import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import {
  DIGEST_CONFIG,
  NOTIFICATION_CATEGORIES,
  PRIORITY_CONFIG,
  type NotificationPriority,
} from "@/lib/notification-categories";
import {
  enabledCount,
  useNotificationPreferences,
  type NotificationPreferences,
} from "@/lib/notification-preferences";

const PRIORITY_TONE: Record<NotificationPriority, "red" | "amber" | "blue" | "ink"> = {
  critical: "red",
  high: "amber",
  medium: "blue",
  low: "ink",
};

/**
 * A one-glance map of the notification taxonomy.
 *
 * It reads the live preferences rather than a static list, so it doubles as a
 * summary of what the account is currently set to receive: each tile shows the
 * category's urgency, its delivery mode, and how many of its alerts are on.
 */
export function NotificationCategories() {
  const preferences = useNotificationPreferences();

  return (
    <section
      aria-labelledby="notification-map-heading"
      className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-card"
    >
      <h2 id="notification-map-heading" className="text-sm font-bold text-ink-900 dark:text-white mb-1">
        What can reach you
      </h2>
      <p className="text-xs text-ink-500 dark:text-ink-300 mb-5">
        Every category the platform can notify you about, and how it is currently set.
      </p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {NOTIFICATION_CATEGORIES.map((category) => {
          const priority = PRIORITY_CONFIG[category.priority];
          const on = enabledCount(preferences, category.id);
          const total = category.subcategories.length;
          const digest = preferences.categories[category.id]?.digest ?? category.defaultDigest;

          return (
            <li
              key={category.id}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/40"
            >
              <span
                className={clsx(
                  "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                  priority.bg,
                  priority.color
                )}
              >
                <Icon icon={category.icon} size={16} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-bold text-ink-900 dark:text-white">{category.label}</p>
                  <Badge tone={PRIORITY_TONE[category.priority]}>{priority.label}</Badge>
                </div>
                <p className="text-[11px] text-ink-500 dark:text-ink-300 mt-1 leading-relaxed">
                  {digest === "off"
                    ? "Switched off — nothing is sent"
                    : `${DIGEST_CONFIG[digest].label} delivery · ${on} of ${total} alerts on`}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-[11px] text-ink-400 dark:text-ink-500 mt-4 leading-relaxed">
        Critical account and security notices are never batched into a digest, and are never
        silenced by quiet hours unless you turn that exception off.
      </p>
    </section>
  );
}

/** Describes the current mix of delivery modes, e.g. "2 instant · 3 batched · 1 off". */
export function summariseDelivery(preferences: NotificationPreferences): string {
  const count = (predicate: (mode: string | undefined) => boolean) =>
    NOTIFICATION_CATEGORIES.filter((c) => predicate(preferences.categories[c.id]?.digest)).length;

  return [
    `${count((m) => m === "instant")} instant`,
    `${count((m) => m === "daily" || m === "weekly")} batched`,
    `${count((m) => m === "off")} off`,
  ].join(" · ");
}
