"use client";

import { BellOff, Clock, Moon, Shield } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Toggles";
import { Reveal } from "@/components/motion/Reveal";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { DND_EXCEPTIONS, PRIORITY_CONFIG } from "@/lib/notification-categories";
import {
  describeQuietWindow,
  updateNotificationPreferences,
  useNotificationPreferences,
} from "@/lib/notification-preferences";

/**
 * Do Not Disturb.
 *
 * The window is stored as two times and evaluated at send time by
 * `evaluateDelivery`, which understands a window that crosses midnight. Nothing
 * here is cosmetic: a notification arriving inside the window is held back.
 */
export function DoNotDisturb() {
  const preferences = useNotificationPreferences();
  const { dnd } = preferences;

  const updateDnd = (patch: Partial<typeof dnd>) =>
    updateNotificationPreferences((current) => ({
      ...current,
      dnd: { ...current.dnd, ...patch },
    }));

  const toggleException = (id: string, value: boolean) =>
    updateDnd({ exceptions: { ...dnd.exceptions, [id]: value } });

  const allowedExceptions = DND_EXCEPTIONS.filter((exception) => dnd.exceptions[exception.id]);

  return (
    <Reveal variant="up" delay={160}>
      <section
        aria-labelledby="dnd-heading"
        className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 sm:p-6 shadow-card"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              id="dnd-heading"
              className="text-lg font-display font-bold text-ink-900 dark:text-white flex items-center gap-2"
            >
              <Icon icon={Moon} size={18} className="text-aurora-purple" />
              Do Not Disturb
            </h2>
            <p className="text-sm text-ink-500 dark:text-ink-300 mt-1.5 max-w-2xl">
              Set quiet hours. Held notifications are delivered when the window ends, and the
              exceptions below can still reach you while it is active.
            </p>
          </div>
          <Switch
            label={<span className="sr-only">Do Not Disturb</span>}
            checked={dnd.enabled}
            onChange={(value) => updateDnd({ enabled: value })}
          />
        </div>

        <div
          className={clsx(
            "mt-5 p-3.5 rounded-xl border text-[11px] flex items-start gap-2",
            dnd.enabled
              ? "bg-aurora-purple/5 border-aurora-purple/20 text-ink-700 dark:text-ink-200"
              : "bg-ink-50 dark:bg-ink-950 border-ink-100 dark:border-ink-800 text-ink-500 dark:text-ink-400"
          )}
        >
          <Icon
            icon={dnd.enabled ? Moon : BellOff}
            size={14}
            className={clsx("mt-0.5 flex-shrink-0", dnd.enabled ? "text-aurora-purple" : "text-ink-400")}
          />
          <span>
            {dnd.enabled ? (
              <>
                Quiet hours are on: <strong className="font-semibold">{describeQuietWindow(preferences)}</strong>.
                {allowedExceptions.length > 0
                  ? ` ${allowedExceptions.map((e) => e.label.toLowerCase()).join(", ")} will still get through.`
                  : " Nothing will get through until the window ends."}
              </>
            ) : (
              "Quiet hours are off. Every category you have switched on will notify you whenever it happens."
            )}
          </span>
        </div>

        {dnd.enabled && (
          <div className="space-y-5 mt-5 animate-rise">
            <FeatureGate featureKey="notifications.dnd">
              <div className="p-4 sm:p-5 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
                <p className="text-xs font-bold text-ink-900 dark:text-white mb-3 flex items-center gap-2">
                  <Icon icon={Clock} size={14} />
                  Quiet hours
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="From"
                    type="time"
                    value={dnd.start}
                    onChange={(e) => updateDnd({ start: e.target.value })}
                  />
                  <Input
                    label="Until"
                    type="time"
                    value={dnd.end}
                    onChange={(e) => updateDnd({ end: e.target.value })}
                  />
                </div>
                <p className="text-[10px] text-ink-500 dark:text-ink-400 mt-3">
                  Times are in {preferences.digest.timezone.replace("_", " ")}. A window that ends
                  earlier than it starts is treated as crossing midnight.
                </p>
              </div>
            </FeatureGate>

            <fieldset>
              <legend className="text-xs font-bold text-ink-900 dark:text-white mb-3 flex items-center gap-2">
                <Icon icon={Shield} size={14} />
                Allowed during quiet hours
              </legend>
              <div className="space-y-2.5">
                {DND_EXCEPTIONS.map((exception) => {
                  const priority = PRIORITY_CONFIG[exception.priority];
                  return (
                    <div
                      key={exception.id}
                      className="flex items-center gap-3 p-4 rounded-xl border border-ink-100 dark:border-ink-800"
                    >
                      <span
                        className={clsx(
                          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                          priority.bg,
                          priority.color
                        )}
                      >
                        <Icon icon={exception.icon} size={15} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-ink-900 dark:text-white">
                            {exception.label}
                          </p>
                          <Badge tone={exception.priority === "critical" ? "red" : "ink"}>
                            {priority.label}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-0.5">
                          {exception.description}
                        </p>
                      </div>
                      <Switch
                        label={<span className="sr-only">{exception.label}</span>}
                        checked={dnd.exceptions[exception.id] ?? false}
                        onChange={(value) => toggleException(exception.id, value)}
                      />
                    </div>
                  );
                })}
              </div>
            </fieldset>
          </div>
        )}
      </section>
    </Reveal>
  );
}
