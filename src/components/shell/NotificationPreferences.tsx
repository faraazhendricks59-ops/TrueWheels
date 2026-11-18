"use client";

import Link from "next/link";
import { Bell, Moon, Settings2, SlidersHorizontal } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { DIGEST_CONFIG, NOTIFICATION_CATEGORIES } from "@/lib/notification-categories";
import { useNotificationPreferences } from "@/lib/notification-preferences";

/**
 * The notification centre's Preferences tab.
 *
 * This used to render its own push and email switches. Those wrote to local
 * component state only, so they did nothing and were lost on close — and once the
 * real preferences screen existed, two preference panels with different models
 * were actively contradictory. It is now a read-only summary of the live
 * preferences, with editing moved to Settings where each control can be explained.
 */
export function NotificationPreferences() {
  const preferences = useNotificationPreferences();
  const dnd = preferences.dnd;

  const offCategories = NOTIFICATION_CATEGORIES.filter(
    (category) => preferences.categories[category.id]?.digest === "off"
  );
  const batched = NOTIFICATION_CATEGORIES.filter((category) => {
    const mode = preferences.categories[category.id]?.digest;
    return mode === "daily" || mode === "weekly";
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="p-4 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
        <p className="flex items-center gap-2 text-xs font-semibold text-ink-900 dark:text-white mb-2">
          <Icon icon={SlidersHorizontal} size={14} className="text-brand" />
          Current settings
        </p>
        <ul className="space-y-1.5 text-[11px] text-ink-600 dark:text-ink-300">
          <li>
            {offCategories.length === 0
              ? "No category is switched off."
              : `${offCategories.length} ${offCategories.length === 1 ? "category is" : "categories are"} switched off.`}
          </li>
          <li>
            {batched.length === 0
              ? "Everything is delivered instantly."
              : `${batched.length} batched into a digest.`}
          </li>
          <li className={clsx(dnd.enabled && "text-aurora-purple")}>
            {dnd.enabled ? `Quiet hours on, ${dnd.start} to ${dnd.end}.` : "Quiet hours are off."}
          </li>
        </ul>
      </div>

      <ul className="space-y-1.5">
        {NOTIFICATION_CATEGORIES.map((category) => {
          const digest = preferences.categories[category.id]?.digest ?? category.defaultDigest;
          return (
            <li
              key={category.id}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-ink-50/60 dark:bg-ink-950/40"
            >
              <span className="flex items-center gap-2 text-[11px] text-ink-600 dark:text-ink-300 min-w-0">
                <Icon icon={category.icon} size={12} className="text-ink-400 flex-shrink-0" />
                <span className="truncate">{category.label}</span>
              </span>
              <span
                className={clsx(
                  "text-[10px] font-semibold flex-shrink-0",
                  digest === "off" ? "text-ink-400" : "text-ink-500 dark:text-ink-300"
                )}
              >
                {DIGEST_CONFIG[digest].label}
              </span>
            </li>
          );
        })}
      </ul>

      <Link
        href="/settings"
        className="flex items-center justify-center gap-2 min-h-[44px] rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand-600 transition-colors"
      >
        <Icon icon={Settings2} size={14} />
        Change in Settings
      </Link>

      <p className="flex items-start gap-2 text-[11px] text-ink-400 dark:text-ink-500 leading-relaxed">
        <Icon icon={dnd.enabled ? Moon : Bell} size={13} className="mt-0.5 flex-shrink-0" />
        Preferences are stored on this device. Email and SMS are recorded but not dispatched — no
        mail or SMS service is connected to this build yet.
      </p>
    </div>
  );
}
