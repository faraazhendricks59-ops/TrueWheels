"use client";

import { AlertTriangle, Power, ShieldAlert } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { FEATURE_KEYS } from "@/lib/feature-flags";
import { GLOBAL_FLAGS } from "@/lib/god-mode-data";

/**
 * The platform-wide switches, shown as what they are.
 *
 * The brief's panel was a set of emergency kill switches with a typed "KILL"
 * confirmation and a 30-minute cooldown. There is nothing for them to switch: these
 * three flags are read from a constant when the app is built, so "activating" one
 * would change a card on this page and nothing else. That is the opposite of what an
 * emergency control must be — an operator reaching for a kill switch during an
 * incident needs it to stop the thing, now.
 *
 * So the panel shows the three flags that exist, their current value, and plainly
 * what it would take to change one. The one honest statement worth making is the
 * absence of an emergency control, because assuming one exists is the dangerous part.
 */
export function KillSwitchPanel() {
  return (
    <div className="space-y-5">
      <div className="p-5 bg-semantic-error/5 border-2 border-semantic-error/30 rounded-2xl flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-semantic-error/10 flex items-center justify-center text-semantic-error flex-shrink-0">
          <Icon icon={AlertTriangle} size={22} />
        </div>
        <div>
          <h3 className="text-base font-display font-bold text-ink-900 dark:text-white mb-1">
            There is no emergency kill switch
          </h3>
          <p className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed">
            This platform has no way to disable a feature while it is running. Every flag
            is fixed when the application is built, so a feature can only be turned off
            by changing the code and deploying again. If a payment flow or a live feature
            had to be stopped right now, this console could not do it, and nothing on
            this page would.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-ink-100 dark:border-ink-800 flex items-center gap-2">
          <Icon icon={Power} size={15} className="text-ink-400" />
          <h3 className="text-sm font-bold text-ink-900 dark:text-white">
            Platform-wide flags in this build
          </h3>
        </div>
        <div className="divide-y divide-ink-100 dark:divide-ink-800">
          {GLOBAL_FLAGS.map((key) => {
            const enabled = FEATURE_KEYS[key];
            return (
              <div key={key} className="p-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <code className="text-xs font-mono font-bold text-ink-900 dark:text-white">
                    {key}
                  </code>
                  <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-1">
                    {KEY_NOTES[key]}
                  </p>
                </div>
                <Badge variant="status" tone={enabled ? "green" : "ink"} dot>
                  {enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-start gap-2 p-3.5 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
        <Icon icon={ShieldAlert} size={13} className="text-ink-400 mt-0.5 flex-shrink-0" />
        <p className="text-[10px] text-ink-500 dark:text-ink-400 leading-relaxed">
          A real kill switch needs a value the running server reads on each request, so
          that turning it off takes effect everywhere within seconds. That does not exist
          here. Building one is a change to the platform, not to this page.
        </p>
      </div>
    </div>
  );
}

const KEY_NOTES: Record<string, string> = {
  "global.maintenance":
    "Would put the platform into maintenance mode. Read once at build time, so it cannot be turned on or off at runtime.",
  "global.disable_payments":
    "Would stop payment flows. TrueWheels takes no payments (see the Secure Pay phase), so there is nothing behind this flag.",
  "global.retry_action":
    "Governs whether a failed action offers a retry. A UI behaviour, not an emergency control.",
};
