"use client";

import { useState } from "react";
import { BellRing } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { PushPermissionFlow } from "@/components/pwa/PushPermissionFlow";

/**
 * The entry point to the notification-permission explainer, from Settings.
 *
 * It is a button rather than a switch because there is nothing to switch on: the app
 * has no push service. See `PushPermissionFlow` for why the browser prompt is not
 * shown.
 */
export function DeviceNotificationInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-500 flex-shrink-0">
          <Icon icon={BellRing} size={18} />
        </span>
        <div>
          <p className="text-sm font-bold text-ink-900 dark:text-white">Notifications on your device</p>
          <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-0.5">
            Alerts appear in the app while you are using it. Nothing reaches you when it is
            closed — there is no push service connected yet.
          </p>
        </div>
      </div>
      <SmartButton
        featureKey="pwa.push_info"
        variant="ghost"
        className="!h-10 flex-shrink-0"
        onClick={() => setIsOpen(true)}
      >
        What this means
      </SmartButton>
      <PushPermissionFlow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
