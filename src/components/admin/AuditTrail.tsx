"use client";

import { FileWarning, ShieldAlert } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { WHAT_IS_MISSING } from "@/lib/god-mode-data";

/**
 * There is no audit trail, and saying so is the point.
 *
 * The brief's audit trail displayed entries attributed to named people — "Lerato
 * Khumalo", "Thabo Molefe", "Sarah Jacobs" — with their IP addresses, their browsers
 * and a reason for each change, under a badge reading "Chain integrity verified" and
 * a line reading "Every entry is cryptographically linked to the previous. Tampering
 * invalidates the chain."
 *
 * None of it happened. Nothing in this project writes an audit log, and no change to
 * a flag is possible, so there is nothing to record. A fabricated log is worse than
 * an empty one in two ways: it puts words and a location in the mouths of people who
 * never acted, and it tells an operator that a security control is in place. During an
 * incident the operator would trust a log that does not exist and could not answer
 * "what changed, and who changed it?" — the only question an audit trail is for.
 *
 * So this panel is an empty state that explains the absence, and lists what a real
 * audit trail requires. An empty log that is true is a usable fact; a full log that
 * is invented is a liability.
 */
export function AuditTrail() {
  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-400 mx-auto mb-4">
          <Icon icon={FileWarning} size={24} />
        </div>
        <h3 className="text-base font-display font-bold text-ink-900 dark:text-white mb-2">
          No audit entries
        </h3>
        <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed max-w-xl mx-auto">
          There is no audit log, because there is nothing that writes one. No flag can be
          changed at runtime, so no change has ever been recorded, and none of the
          entries a control room would show exist. This page will not invent any.
        </p>
      </div>

      <div className="p-4 bg-semantic-warning/5 border border-semantic-warning/25 rounded-2xl flex items-start gap-3">
        <Icon icon={ShieldAlert} size={16} className="text-semantic-warning mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-ink-900 dark:text-white">
            An audit trail is a control, not a screen
          </p>
          <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed mt-1">
            What makes a log trustworthy is that the system writes it when the change
            happens, and that the person who made the change cannot edit or delete the
            entry afterwards. A log that a page merely displays proves nothing about what
            happened. This project has neither the write nor the store.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-ink-900 dark:text-white mb-1">
          What a real control room would need
        </h3>
        <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mb-4">
          None of the following exists in this project. Each is a prerequisite for a
          console that an operator could rely on during an incident.
        </p>
        <div className="space-y-4">
          {WHAT_IS_MISSING.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ink-300 dark:bg-ink-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-ink-900 dark:text-white">{item.title}</p>
                <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-0.5">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
