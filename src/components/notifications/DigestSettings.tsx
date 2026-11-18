"use client";

import { Calendar, Check, Clock, Info, Sun } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Toggles";
import { Reveal } from "@/components/motion/Reveal";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { NOTIFICATION_CATEGORIES } from "@/lib/notification-categories";
import {
  updateNotificationPreferences,
  useNotificationPreferences,
} from "@/lib/notification-preferences";

const WEEKDAYS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const TIMEZONES = [
  { value: "Africa/Johannesburg", label: "SAST — South Africa (UTC+2)" },
  { value: "Africa/Harare", label: "CAT — Harare (UTC+2)" },
  { value: "Africa/Windhoek", label: "WAT — Windhoek (UTC+2)" },
];

/**
 * Digest scheduling.
 *
 * The two times here set when batched categories are sent. The list below is
 * derived from the live preferences, so it shows exactly which categories will
 * land in each digest rather than a generic promise.
 */
export function DigestSettings() {
  const preferences = useNotificationPreferences();
  const { digest } = preferences;

  const updateDigest = (patch: Partial<typeof digest>) =>
    updateNotificationPreferences((current) => ({
      ...current,
      digest: { ...current.digest, ...patch },
    }));

  const dailyCategories = NOTIFICATION_CATEGORIES.filter(
    (c) => preferences.categories[c.id]?.digest === "daily"
  );
  const weeklyCategories = NOTIFICATION_CATEGORIES.filter(
    (c) => preferences.categories[c.id]?.digest === "weekly"
  );

  return (
    <Reveal variant="up" delay={80}>
      <section
        aria-labelledby="digest-heading"
        className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 sm:p-6 shadow-card"
      >
        <h2
          id="digest-heading"
          className="text-lg font-display font-bold text-ink-900 dark:text-white flex items-center gap-2"
        >
          <Icon icon={Clock} size={18} className="text-aurora-blue" />
          Digest schedule
        </h2>
        <p className="text-sm text-ink-500 dark:text-ink-300 mt-1.5 max-w-2xl">
          Categories set to <strong className="font-semibold">Daily</strong> or{" "}
          <strong className="font-semibold">Weekly</strong> are held and sent in one summary at
          the times below, instead of one notification at a time.
        </p>

        <div className="space-y-5 mt-5">
          <FeatureGate featureKey="notifications.daily_digest">
            <div className="p-4 sm:p-5 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
              <Switch
                label={
                  <span className="flex items-center gap-2">
                    <Icon icon={Sun} size={15} className="text-aurora-blue" />
                    Daily digest
                  </span>
                }
                description="One summary a day of everything batched daily."
                checked={digest.dailyEnabled}
                onChange={(value) => updateDigest({ dailyEnabled: value })}
              />

              {digest.dailyEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 mt-4 border-t border-ink-100 dark:border-ink-800">
                  <Input
                    label="Delivery time"
                    type="time"
                    value={digest.dailyTime}
                    onChange={(e) => updateDigest({ dailyTime: e.target.value })}
                  />
                  <Select
                    label="Timezone"
                    options={TIMEZONES}
                    value={digest.timezone}
                    onChange={(value) => updateDigest({ timezone: value })}
                  />
                </div>
              )}

              <DigestContents categories={dailyCategories} enabled={digest.dailyEnabled} />
            </div>
          </FeatureGate>

          <FeatureGate featureKey="notifications.weekly_digest">
            <div className="p-4 sm:p-5 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
              <Switch
                label={
                  <span className="flex items-center gap-2">
                    <Icon icon={Calendar} size={15} className="text-aurora-blue" />
                    Weekly digest
                  </span>
                }
                description="One summary a week of everything batched weekly."
                checked={digest.weeklyEnabled}
                onChange={(value) => updateDigest({ weeklyEnabled: value })}
              />

              {digest.weeklyEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 mt-4 border-t border-ink-100 dark:border-ink-800">
                  <Select
                    label="Delivery day"
                    options={WEEKDAYS}
                    value={digest.weeklyDay}
                    onChange={(value) => updateDigest({ weeklyDay: value })}
                  />
                  <Input
                    label="Delivery time"
                    type="time"
                    value={digest.weeklyTime}
                    onChange={(e) => updateDigest({ weeklyTime: e.target.value })}
                  />
                </div>
              )}

              <DigestContents categories={weeklyCategories} enabled={digest.weeklyEnabled} />
            </div>
          </FeatureGate>

          {!digest.dailyEnabled && !digest.weeklyEnabled && (
            <p className="flex items-start gap-2 p-4 rounded-xl bg-semantic-warning/10 border border-semantic-warning/25 text-[11px] text-ink-700 dark:text-ink-200 leading-relaxed">
              <Icon icon={Info} size={14} className="mt-0.5 flex-shrink-0 text-semantic-warning" />
              <span>
                Both digests are off. Any category set to Daily or Weekly will not be delivered
                at all until you switch a digest back on, or change that category to Instant.
              </span>
            </p>
          )}
        </div>
      </section>
    </Reveal>
  );
}

function DigestContents({
  categories,
  enabled,
}: {
  categories: typeof NOTIFICATION_CATEGORIES;
  enabled: boolean;
}) {
  return (
    <div className="mt-4 pt-4 border-t border-ink-100 dark:border-ink-800">
      <p className="text-[11px] font-bold text-ink-400 uppercase tracking-wider mb-2">
        Included in this digest
      </p>
      {categories.length === 0 ? (
        <p className="text-[11px] text-ink-500 dark:text-ink-400">
          Nothing yet. Set a category&apos;s delivery to this cadence in Notification preferences
          and it will be listed here.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {categories.map((category) => (
            <li
              key={category.id}
              className={clsx(
                "flex items-center gap-2 text-[11px]",
                enabled ? "text-ink-600 dark:text-ink-300" : "text-ink-400 line-through"
              )}
            >
              <Icon icon={Check} size={12} className="text-semantic-success flex-shrink-0" />
              {category.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
