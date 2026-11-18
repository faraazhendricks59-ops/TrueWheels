"use client";

import { useState } from "react";
import { Bell, ChevronDown, Info, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Toggles";
import { Reveal } from "@/components/motion/Reveal";
import { FeatureGate } from "@/components/feature/FeatureGate";
import {
  CHANNEL_CONFIG,
  DIGEST_CONFIG,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_CHANNELS,
  PRIORITY_CONFIG,
  type DigestMode,
  type NotificationChannel,
} from "@/lib/notification-categories";
import {
  channelSummary,
  enabledCount,
  updateNotificationPreferences,
  useNotificationPreferences,
  type NotificationPreferences,
} from "@/lib/notification-preferences";

/**
 * Category-based notification preferences.
 *
 * Every control writes straight through to the persisted preference store, which
 * the delivery gate in NotificationProvider reads. Switching a category off here
 * actually stops those notifications arriving — it is not a cosmetic switch.
 */
export function NotificationPreferencesV2() {
  const preferences = useNotificationPreferences();
  // Only one category is open at a time: the panel is long, and comparing two
  // categories side by side is not a task anyone has here.
  const [expanded, setExpanded] = useState<string | null>("marketplace");

  return (
    <Reveal variant="up">
      <section
        aria-labelledby="notification-prefs-heading"
        className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-card overflow-hidden"
      >
        <header className="p-5 sm:p-6 border-b border-ink-100 dark:border-ink-800">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <h2
              id="notification-prefs-heading"
              className="text-lg font-display font-bold text-ink-900 dark:text-white flex items-center gap-2"
            >
              <Icon icon={Bell} size={18} className="text-brand" />
              Notification preferences
            </h2>
            <Badge tone="ink">Saved on this device</Badge>
          </div>
          <p className="text-sm text-ink-500 dark:text-ink-300 mt-1.5 max-w-2xl">
            Choose what reaches you, and how. Changes apply immediately and are stored on this
            device.
          </p>
        </header>

        <ul className="divide-y divide-ink-100 dark:divide-ink-800">
          {NOTIFICATION_CATEGORIES.map((category) => {
            const isOpen = expanded === category.id;
            const priority = PRIORITY_CONFIG[category.priority];
            const categoryPrefs = preferences.categories[category.id];
            const digest = categoryPrefs?.digest ?? category.defaultDigest;
            const on = enabledCount(preferences, category.id);
            const total = category.subcategories.length;
            const isOff = digest === "off" || on === 0;
            const panelId = `notification-category-${category.id}`;

            return (
              <li key={category.id}>
                <FeatureGate featureKey={`notifications.category_${category.id}` as never}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setExpanded(isOpen ? null : category.id)}
                      className="w-full p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:bg-ink-50/60 dark:hover:bg-ink-950/50 transition-colors text-left"
                    >
                      <span
                        className={clsx(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          priority.bg,
                          priority.color
                        )}
                      >
                        <Icon icon={category.icon} size={18} />
                      </span>

                      <span className="flex-1 min-w-0">
                        <span className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-ink-900 dark:text-white">
                            {category.label}
                          </span>
                          {isOff ? (
                            <Badge tone="ink">Off</Badge>
                          ) : (
                            <Badge tone={category.priority === "critical" ? "red" : "ink"}>
                              {priority.label}
                            </Badge>
                          )}
                        </span>
                        <span className="block text-xs text-ink-500 dark:text-ink-300 mt-0.5 truncate">
                          {isOff
                            ? "Nothing from this category is sent"
                            : `${DIGEST_CONFIG[digest].label} · ${on} of ${total} alerts on`}
                        </span>
                      </span>

                      <Icon
                        icon={ChevronDown}
                        size={18}
                        className={clsx(
                          "text-ink-400 flex-shrink-0 transition-transform duration-200 ease-swift",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                  </h3>

                  {isOpen && (
                    <div id={panelId} className="px-4 sm:px-5 pb-5 space-y-5 animate-rise">
                      {/* Deep decode: what this category is and how urgent it is. */}
                      <div
                        className={clsx(
                          "p-4 rounded-xl border text-[11px] leading-relaxed",
                          priority.bg,
                          priority.border
                        )}
                      >
                        <p className="flex items-start gap-2 text-ink-700 dark:text-ink-200">
                          <Icon icon={Info} size={14} className={clsx("mt-0.5 flex-shrink-0", priority.color)} />
                          <span>
                            <strong className="font-semibold">{category.label}</strong> —{" "}
                            {category.description}. {priority.description}
                          </span>
                        </p>
                      </div>

                      {/* Delivery mode */}
                      <fieldset>
                        <legend className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-3">
                          How often
                        </legend>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                          {(Object.keys(DIGEST_CONFIG) as DigestMode[]).map((mode) => {
                            const config = DIGEST_CONFIG[mode];
                            const isSelected = digest === mode;
                            return (
                              <button
                                key={mode}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() =>
                                  updateNotificationPreferences((current) => ({
                                    ...current,
                                    categories: {
                                      ...current.categories,
                                      [category.id]: { ...current.categories[category.id], digest: mode },
                                    },
                                  }))
                                }
                                className={clsx(
                                  "p-3 rounded-lg border text-left transition-colors ease-swift",
                                  isSelected
                                    ? "border-brand bg-brand/5"
                                    : "border-ink-200 dark:border-ink-700 hover:border-ink-300 dark:hover:border-ink-600"
                                )}
                              >
                                <span className="flex items-center gap-1.5 mb-0.5">
                                  <Icon
                                    icon={config.icon}
                                    size={13}
                                    className={isSelected ? "text-brand" : "text-ink-400"}
                                  />
                                  <span
                                    className={clsx(
                                      "text-xs font-bold",
                                      isSelected ? "text-brand" : "text-ink-700 dark:text-ink-200"
                                    )}
                                  >
                                    {config.label}
                                  </span>
                                </span>
                                <span className="block text-[10px] text-ink-500 dark:text-ink-400 leading-tight">
                                  {config.description}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>

                      {/* Subcategories */}
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-ink-400 uppercase tracking-wider">
                          Specific alerts
                        </p>

                        {category.subcategories.map((sub) => {
                          const subPrefs = categoryPrefs?.subcategories[sub.id];
                          if (!subPrefs) return null;
                          const channelsOn = NOTIFICATION_CHANNELS.filter((c) => subPrefs[c]).length;

                          return (
                            <div
                              key={sub.id}
                              className="p-4 rounded-xl border border-ink-100 dark:border-ink-800"
                            >
                              <Switch
                                label={sub.label}
                                description={sub.description}
                                checked={subPrefs.enabled}
                                onChange={(value) =>
                                  updateNotificationPreferences((current) => ({
                                    ...current,
                                    categories: {
                                      ...current.categories,
                                      [category.id]: {
                                        ...current.categories[category.id],
                                        subcategories: {
                                          ...current.categories[category.id].subcategories,
                                          [sub.id]: {
                                            ...current.categories[category.id].subcategories[sub.id],
                                            enabled: value,
                                          },
                                        },
                                      },
                                    },
                                  }))
                                }
                              />

                              {/* Channels only matter while the alert is on. */}
                              {subPrefs.enabled && (
                                <fieldset className="mt-3 pt-3 border-t border-ink-100 dark:border-ink-800">
                                  <legend className="sr-only">
                                    Delivery channels for {sub.label}
                                  </legend>
                                  <div className="grid grid-cols-3 gap-2">
                                    {NOTIFICATION_CHANNELS.map((channel) => (
                                      <ChannelToggle
                                        key={channel}
                                        channel={channel}
                                        checked={subPrefs[channel]}
                                        onChange={(value) =>
                                          updateNotificationPreferences((current) => ({
                                            ...current,
                                            categories: {
                                              ...current.categories,
                                              [category.id]: {
                                                ...current.categories[category.id],
                                                subcategories: {
                                                  ...current.categories[category.id].subcategories,
                                                  [sub.id]: {
                                                    ...current.categories[category.id].subcategories[sub.id],
                                                    [channel]: value,
                                                  },
                                                },
                                              },
                                            },
                                          }))
                                        }
                                      />
                                    ))}
                                  </div>
                                  <p className="text-[10px] text-ink-400 dark:text-ink-500 mt-2">
                                    {channelsOn === 0
                                      ? "No channel selected — this alert is effectively off."
                                      : channelSummary(subPrefs)}
                                  </p>
                                </fieldset>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </FeatureGate>
              </li>
            );
          })}
        </ul>

        {/* The honest scope note: these preferences gate in-app delivery today. */}
        <footer className="p-5 sm:p-6 bg-ink-50 dark:bg-ink-950 border-t border-ink-100 dark:border-ink-800">
          <p className="flex items-start gap-2 text-[11px] text-ink-500 dark:text-ink-300 leading-relaxed">
            <Icon icon={ShieldCheck} size={14} className="mt-0.5 flex-shrink-0 text-ink-400" />
            <span>
              Switching a category off stops those notifications reaching you in the app. Email
              and SMS are recorded here, but no mail or SMS service is connected to this build
              yet, so nothing is dispatched on those channels.
            </span>
          </p>
        </footer>
      </section>
    </Reveal>
  );
}

function ChannelToggle({
  channel,
  checked,
  disabled,
  onChange,
}: {
  channel: NotificationChannel;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  const config = CHANNEL_CONFIG[channel];
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={`${config.label}: ${config.description}`}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        "flex items-center justify-center gap-1.5 min-h-[44px] px-2 rounded-lg border transition-colors ease-swift",
        checked
          ? "bg-brand/10 border-brand/30 text-brand"
          : "border-ink-200 dark:border-ink-700 text-ink-500 dark:text-ink-400 hover:border-ink-300 dark:hover:border-ink-600",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <Icon icon={config.icon} size={13} />
      <span className="text-[11px] font-semibold">{config.label}</span>
    </button>
  );
}

/** Exported for the delivery note elsewhere; kept close to the type it describes. */
export type { NotificationPreferences };
