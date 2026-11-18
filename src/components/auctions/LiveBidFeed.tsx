"use client";

import { Gavel, Info } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { BIDDING_CHECKS, BIDDING_DISCLOSURE } from "@/lib/auctions";

/**
 * The bid feed: there are no bids, and this says so.
 *
 * The brief's version ran a `setInterval` that invented a bid from "Anonymous
 * Buyer" every few seconds, promoted it to highest, and showed an "You have been
 * outbid!" warning if the reader had been leading. It also drew a pulsing green dot
 * beside "Live Bid Activity" and a count of bids.
 *
 * Every part of that is a fabrication with a real effect. An invented bid at an
 * invented price is the strongest evidence a marketplace can show, which is why
 * Phase 45 removed exactly this from the home page and the dashboard. "Anonymous
 * Buyer" is worse than a named one, because it reads as a deliberate privacy
 * measure rather than as a missing person. The green pulse asserts that activity
 * is happening at this moment. The outbid warning tells a signed-in reader that
 * something happened to them and that they have lost it, which is the single
 * strongest lever on the page.
 *
 * There is no bidding service, so the feed is empty and explains why. A panel that
 * is visibly empty is honest in a way a panel full of invented rows can never be.
 * The disclosure is collapsed, quiet and below the fold of the card, not styled as
 * a badge, so it does not draw the eye the way a false one would.
 */
export function LiveBidFeed() {
  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink-900 dark:text-white flex items-center gap-2">
          <Icon icon={Gavel} size={15} className="text-ink-400" />
          Offers
        </h3>
        {/* No count: a number here would be invented. */}
        <span className="text-[10px] font-mono font-bold text-ink-400">No bids</span>
      </div>

      <div className="p-5 text-center">
        <div className="w-10 h-10 mx-auto rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-400 mb-3">
          <Icon icon={Gavel} size={18} />
        </div>
        <p className="text-sm font-semibold text-ink-900 dark:text-white">
          No offers have been made
        </p>
        <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-1.5 max-w-sm mx-auto">
          {BIDDING_DISCLOSURE}
        </p>
      </div>

      <div className="border-t border-ink-100 dark:border-ink-800 bg-ink-50/60 dark:bg-ink-950/60 p-4">
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-400 mb-2">
          <Icon icon={Info} size={12} />
          What you can ask instead
        </p>
        <ul className="space-y-2">
          {BIDDING_CHECKS.map((check) => (
            <li
              key={check}
              className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1 before:h-1 before:rounded-full before:bg-ink-300 dark:before:bg-ink-600"
            >
              {check}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
