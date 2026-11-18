"use client";

import { ExternalLink, Scale } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { DISPUTE_FORUMS } from "@/lib/disputes-data";

/**
 * Where a dispute is actually decided.
 *
 * The brief's panel was an admin console that could issue a "binding ruling" and
 * split funds, with a modal warning that it "moves real funds and cannot be
 * reversed", under a badge reading "R649 000 secured in TrueWheels Escrow (Pty) Ltd."
 * There is no escrow, no funds and no adjudicator, so the console would move nothing
 * while telling both parties their dispute had been decided. A buyer who believed a
 * "binding ruling" had settled the matter would stop pursuing it, and the forums
 * that could have helped them have time limits.
 *
 * So this panel does not adjudicate. It names the four bodies that can, in the order
 * a buyer is most likely to need them, and says what each one handles.
 */
export function AdminResolutionPanel() {
  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-ink-100 dark:border-ink-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-500">
          <Icon icon={Scale} size={16} />
        </div>
        <div>
          <h3 className="text-sm font-display font-bold text-ink-900 dark:text-white">
            Where a dispute is decided
          </h3>
          <p className="text-[10px] text-ink-500 dark:text-ink-400">
            These bodies have the authority TrueWheels does not.
          </p>
        </div>
      </div>

      <div className="divide-y divide-ink-100 dark:divide-ink-800">
        {DISPUTE_FORUMS.map((forum) => (
          <a
            key={forum.label}
            href={forum.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 hover:bg-ink-50 dark:hover:bg-ink-950 transition-colors"
          >
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-bold text-ink-900 dark:text-white">
                {forum.label}
              </span>
              <span className="block text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-0.5">
                {forum.body}
              </span>
            </span>
            <Icon icon={ExternalLink} size={14} className="text-ink-400 mt-1 flex-shrink-0" />
          </a>
        ))}
      </div>

      <p className="px-5 py-4 text-[10px] text-ink-400 leading-relaxed border-t border-ink-100 dark:border-ink-800">
        TrueWheels is not affiliated with any of these bodies, does not receive
        anything if you use them, and has no role in the outcome. Approaching a forum
        is free or low-cost, and it is where a matter is decided if the seller will not
        put it right.
      </p>
    </div>
  );
}
