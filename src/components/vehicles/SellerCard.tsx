"use client";

import { MapPin, Store, User, AlertTriangle, Phone, ShieldQuestion } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { SmartButton } from "@/components/ui/SmartButton";
import { Reveal } from "@/components/motion/Reveal";
import { UNVERIFIED_CLAIMS, type SellerIdentity } from "@/lib/seller";

interface SellerCardProps {
  seller: SellerIdentity;
}

/**
 * Who is selling the car, and what is known about them.
 *
 * The brief for this card asked for a "Verified Dealer" badge backed by
 * "CIPC & FICA verified", a "Verified Private Seller" badge backed by "ID &
 * Phone verified via OTP", a listing count, a response time and a "98%
 * Response" chat rate, all rendered unconditionally.
 *
 * None of those checks can be performed here. There is no company registry
 * lookup, no identity verification and no messaging system, so a response time
 * or a reply rate cannot be measured either. A badge that says a seller is
 * verified when nothing was verified is the most damaging thing this card could
 * carry, because a buyer would rely on it to decide whether to hand over money.
 *
 * So the card states plainly that no check has been performed, lists what is
 * unverified, and explains what the buyer should check themselves. The private
 * and trade states are kept distinct because they carry different legal
 * protection, which is genuinely useful information rather than decoration.
 */
export function SellerCard({ seller }: SellerCardProps) {
  const isDealer = seller.type === "dealer";
  const verified = seller.verification === "verified";

  return (
    <Reveal variant="up">
      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift">
        <div className="flex items-start gap-4 mb-5">
          <div
            className={clsx(
              "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border",
              isDealer
                ? "bg-ink-950 text-white border-ink-800"
                : "bg-ink-100 dark:bg-ink-800 text-ink-500 border-ink-200 dark:border-ink-700",
            )}
          >
            <Icon icon={isDealer ? Store : User} size={24} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white truncate">
                {seller.displayName}
              </h3>
              <Badge variant="status" tone={isDealer ? "ink" : "blue"}>
                {isDealer ? "Trade" : "Private"}
              </Badge>
            </div>

            <p className="text-xs text-ink-500 dark:text-ink-400 flex items-center gap-1.5">
              <Icon icon={MapPin} size={10} /> {seller.location}
            </p>

            {seller.tradingAs && (
              <p className="text-[10px] text-ink-400 mt-0.5">{seller.tradingAs}</p>
            )}
          </div>
        </div>

        {/* The verification state, stated rather than implied. */}
        <div
          className={clsx(
            "flex items-start gap-2.5 p-3.5 rounded-xl border mb-4",
            verified
              ? "bg-semantic-success/5 border-semantic-success/20"
              : "bg-semantic-warning/5 border-semantic-warning/20",
          )}
        >
          <Icon
            icon={verified ? ShieldQuestion : AlertTriangle}
            size={14}
            className={clsx(
              "flex-shrink-0 mt-0.5",
              verified ? "text-semantic-success" : "text-semantic-warning",
            )}
          />
          <div>
            <p className="text-[11px] font-bold text-ink-900 dark:text-white">
              {verified ? "Identity verified" : "Not verified"}
            </p>
            <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mt-0.5">
              {seller.verificationSource}
            </p>
          </div>
        </div>

        {/* What has not been checked. */}
        {!verified && (
          <details className="mb-4 group">
            <summary className="text-xs font-semibold text-ink-600 dark:text-ink-300 cursor-pointer list-none flex items-center justify-between min-h-[44px]">
              What we have not checked
              <span className="text-ink-400 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <ul className="mt-2 space-y-1.5">
              {UNVERIFIED_CLAIMS.map((claim) => (
                <li
                  key={claim}
                  className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1 before:h-1 before:rounded-full before:bg-ink-300 dark:before:bg-ink-600"
                >
                  {claim}
                </li>
              ))}
            </ul>
          </details>
        )}

        {/* The legal difference between the two seller types. */}
        <div className="p-3.5 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800 mb-5">
          <p className="text-[11px] font-bold text-ink-900 dark:text-white mb-1">
            {isDealer ? "Buying from a trade seller" : "Buying from a private seller"}
          </p>
          <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
            {seller.buyerNote}
          </p>
        </div>

        {/* No messaging system exists, so the action says so rather than
            pretending to open a conversation. */}
        <SmartButton
          featureKey="seller.contact"
          className="w-full min-h-[44px]"
          leftIcon={Phone}
          variant="secondary"
        >
          {isDealer ? "How to contact the dealership" : "How to contact the seller"}
        </SmartButton>
        <p className="text-[10px] text-ink-400 mt-2 text-center leading-relaxed">
          TrueWheels cannot send a message to this seller. Contact details are not
          held, and no enquiry will reach anybody.
        </p>
      </div>
    </Reveal>
  );
}
