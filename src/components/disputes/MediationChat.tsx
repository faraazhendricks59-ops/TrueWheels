"use client";

import { MessageSquare, ShieldAlert, PenLine } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SCAM_RED_FLAGS } from "@/lib/disputes-data";

/**
 * How to put your side in writing, and the patterns to watch for.
 *
 * The brief's mediation chat was a three-party thread with role-tagged messages and
 * an "internal note" mode for staff. There is no mediator, no staff and no server,
 * so the thread would hold a conversation with nobody. The internal-note mode is
 * worse than useless: it tells a reader that staff are privately recording findings
 * about their case, which would matter a great deal if it were true and misleads
 * them about what is happening if it is not.
 *
 * What a buyer in a dispute genuinely needs is a clear record and an idea of what a
 * bad actor looks like. So this panel is a short guide to writing a complaint that a
 * forum will act on, followed by the scam patterns that a fake "resolution centre"
 * would be used to hide.
 */
export function MediationChat() {
  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-ink-100 dark:border-ink-800 flex items-center gap-2">
        <Icon icon={MessageSquare} size={15} className="text-ink-400" />
        <h3 className="text-sm font-bold text-ink-900 dark:text-white">
          Resolving it with the seller
        </h3>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <Icon icon={PenLine} size={15} className="text-brand mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-ink-900 dark:text-white">
              Write to the seller, in a way that can be used later
            </p>
            <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-1">
              Send it in writing and keep a copy. Say what you bought, the date, what
              was wrong, what the listing or agreement said, and exactly what you want
              done — a repair, a refund, or the vehicle taken back. Give a date for a
              reply. A clear, dated letter is the first thing every forum asks for.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
          <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-2">
            A complaint that gets acted on says
          </p>
          <ul className="space-y-1.5">
            {[
              "What was advertised, and what was actually delivered, with dates.",
              "What it cost you to have the fault assessed, if you did.",
              "What you have already asked the seller to do, and what they answered.",
              "What outcome you are asking for, and by when.",
            ].map((line) => (
              <li
                key={line}
                className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1 before:h-1 before:rounded-full before:bg-ink-300 dark:before:bg-ink-600"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The red flags. A fake resolution centre is what a scam hides behind. */}
      <div className="border-t border-ink-100 dark:border-ink-800 p-5 bg-semantic-error/5">
        <div className="flex items-center gap-2 mb-3">
          <Icon icon={ShieldAlert} size={15} className="text-semantic-error" />
          <h4 className="text-sm font-bold text-ink-900 dark:text-white">
            If someone offers to help you get your money back
          </h4>
        </div>
        <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed mb-3">
          People who have already been defrauded are targeted again, by someone
          offering to recover the money for a fee. Treat any of these as a warning:
        </p>
        <ul className="space-y-2">
          {SCAM_RED_FLAGS.map((flag) => (
            <li
              key={flag}
              className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1 before:h-1 before:rounded-full before:bg-semantic-error/60"
            >
              {flag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
