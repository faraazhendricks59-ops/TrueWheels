"use client";

import { useState } from "react";
import { Bell, BellOff, Mail, Smartphone } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Switch } from "@/components/ui/Toggles";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { NOTIFICATION_CONFIG, NOTIFICATION_TYPES, type NotificationType } from "@/lib/notifications";

type Channel = "push" | "email";
type Prefs = Record<NotificationType, { push: boolean; email: boolean }>;

function initialPrefs(): Prefs {
  return Object.fromEntries(
    NOTIFICATION_TYPES.map((type) => [type, { push: true, email: type === "verification" }])
  ) as Prefs;
}

export function NotificationPreferences() {
  const [prefs, setPrefs] = useState<Prefs>(initialPrefs);

  const update = (type: NotificationType, channel: Channel, value: boolean) => {
    setPrefs((prev) => ({ ...prev, [type]: { ...prev[type], [channel]: value } }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <p className="flex items-center gap-2 text-xs text-ink-500">
        <Icon icon={Smartphone} size={14} />
        Choose how each category reaches you.
      </p>

      {NOTIFICATION_TYPES.map((type) => {
        const config = NOTIFICATION_CONFIG[type];
        return (
          <FeatureGate key={type} featureKey={`notifications.${type}` as never}>
            <div className="p-4 bg-ink-50/50 dark:bg-ink-950/50 border border-ink-100 dark:border-ink-800 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg} ${config.color}`}>
                  <Icon icon={config.icon} size={14} />
                </span>
                <span className="text-sm font-semibold text-ink-900 dark:text-white">{config.label}</span>
              </div>
              <div className="space-y-2">
                <Switch
                  label={
                    <span className="flex items-center gap-1.5">
                      <Icon icon={Bell} size={12} /> Push
                    </span>
                  }
                  checked={prefs[type].push}
                  onChange={(value) => update(type, "push", value)}
                />
                <Switch
                  label={
                    <span className="flex items-center gap-1.5">
                      <Icon icon={Mail} size={12} /> Email
                    </span>
                  }
                  checked={prefs[type].email}
                  onChange={(value) => update(type, "email", value)}
                />
              </div>
            </div>
          </FeatureGate>
        );
      })}

      <div className="pt-4 border-t border-ink-100 dark:border-ink-800">
        <p className="flex items-center gap-2 text-xs text-ink-400">
          <Icon icon={BellOff} size={14} />
          Preferences are saved on this device until accounts are wired up.
        </p>
      </div>
    </div>
  );
}
