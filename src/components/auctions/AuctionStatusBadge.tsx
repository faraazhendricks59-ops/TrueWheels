"use client";

import { clsx } from "clsx";
import { Clock, Sparkles, Tag, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

/**
 * The state of a listing, stated as a fact about the listing rather than a claim
 * about other people.
 *
 * The brief's version was a pulsing "LIVE AUCTION" badge, plus "STARTS SOON" and
 * "SOLD". A live badge says that an auction is running right now and that people
 * are bidding; a sold badge says a transaction completed at a price. Neither is
 * true here — there is no auction engine and no sales ledger (see
 * `src/lib/auctions.ts` and `src/lib/listing-activity.ts`). The pulse made it
 * worse: motion reads as activity, so a still image of a pulse is a stronger
 * false claim than the words alone.
 *
 * What is left are states that can be read off the listing itself. "Recently
 * added" is a comparison against the rest of the sample catalogue, which is
 * checkable, and "offers invited" / "at asking price" describe what the seller is
 * asking for, not what anyone has done.
 */
export type ListingState = "offers_invited" | "at_asking_price" | "recently_added";

interface AuctionStatusBadgeProps {
  state: ListingState;
  className?: string;
}

const STATE_CONFIG: Record<
  ListingState,
  { label: string; icon: LucideIcon; color: string; bg: string; border: string }
> = {
  offers_invited: {
    label: "OFFERS INVITED",
    icon: Tag,
    color: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/25",
  },
  at_asking_price: {
    label: "AT ASKING PRICE",
    icon: Clock,
    color: "text-ink-500 dark:text-ink-300",
    bg: "bg-ink-100 dark:bg-ink-800",
    border: "border-ink-200 dark:border-ink-700",
  },
  recently_added: {
    label: "RECENTLY ADDED",
    icon: Sparkles,
    color: "text-aurora-blue",
    bg: "bg-aurora-blue/10",
    border: "border-aurora-blue/20",
  },
};

export function AuctionStatusBadge({ state, className }: AuctionStatusBadgeProps) {
  const config = STATE_CONFIG[state];
  const IconComp = config.icon;

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-bold text-[10px] uppercase tracking-widest",
        config.bg,
        config.color,
        config.border,
        className
      )}
    >
      <Icon icon={IconComp} size={12} strokeWidth={2.5} />
      {config.label}
    </div>
  );
}
