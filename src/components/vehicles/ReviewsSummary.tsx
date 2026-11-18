"use client";

import { Star, MessageSquare, Info, ShieldQuestion } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { reviewFacts, REVIEW_REQUIREMENTS, type SellerIdentity } from "@/lib/seller";
import type { DemoVehicle } from "@/lib/demo/vehicles";

interface ReviewsSummaryProps {
  vehicle: DemoVehicle;
  seller: SellerIdentity;
  onWriteReview: () => void;
}

/**
 * Reviews for this listing, of which there are none.
 *
 * The brief supplied a complete reviews widget: a 4.8 average over 142
 * "verified transactions", a five-bar breakdown (120/15/4/2/1), and two reviews
 * attributed to named people with dates and comments, one praising the Sandton
 * showroom handover and one praising the dealer's transparency. Each carried a
 * "Verified Buyer" badge citing payment through "TrueWheels Secure Pay".
 *
 * None of that exists. No sale has taken place through this platform, there is
 * no payment system, and the named reviewers are invented. Fabricated
 * testimonials are not a placeholder to be filled in later: they are false
 * statements about real-sounding people, and a rating published on a page can
 * be read as structured data by search engines and surfaced as if it were
 * genuine. On a page where someone may spend hundreds of thousands of rand,
 * invented social proof is the most harmful thing that could be added.
 *
 * So this renders the empty state, says why it is empty, and describes the
 * conditions under which a review could be trusted. The rating widget is not
 * shown at all, because there is no rating.
 */
export function ReviewsSummary({ vehicle, seller, onWriteReview }: ReviewsSummaryProps) {
  const facts = reviewFacts(vehicle);

  return (
    <Reveal variant="up" delay={100}>
      <section
        aria-labelledby="reviews-heading"
        className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift"
      >
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-500">
              <Icon icon={Star} size={16} />
            </div>
            <div>
              <h2
                id="reviews-heading"
                className="text-lg font-display font-bold text-ink-900 dark:text-white"
              >
                Reviews
              </h2>
              <p className="text-[11px] text-ink-500 dark:text-ink-400">
                {seller.displayName} &middot; {seller.location}
              </p>
            </div>
          </div>
          <Badge variant="status" tone="ink">
            No reviews yet
          </Badge>
        </div>

        {/* The empty state, and why. */}
        <div className="text-center py-8 px-4 rounded-xl bg-ink-50 dark:bg-ink-950 border border-dashed border-ink-200 dark:border-ink-800 mb-5">
          <div className="w-12 h-12 mx-auto rounded-full bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 flex items-center justify-center text-ink-400 mb-3">
            <Icon icon={MessageSquare} size={20} />
          </div>
          <p className="text-sm font-semibold text-ink-900 dark:text-white mb-1">
            No reviews for this seller
          </p>
          <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed max-w-md mx-auto">
            Nobody has bought a vehicle through TrueWheels yet, so there is nothing
            to review. There is no average rating to show and no star breakdown,
            because a rating with no reviews behind it would be a number we made up.
          </p>
        </div>

        {/* The absence of data, stated as facts. */}
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {facts.map((fact) => (
            <div
              key={fact.id}
              className="p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800"
            >
              <dt className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-0.5">
                {fact.label}
              </dt>
              <dd
                className={
                  fact.state === "measured"
                    ? "text-xs font-mono font-bold text-ink-900 dark:text-white"
                    : "text-xs font-bold text-ink-400"
                }
              >
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* What would make a review trustworthy here. */}
        <details className="mb-5 group">
          <summary className="text-xs font-semibold text-ink-600 dark:text-ink-300 cursor-pointer list-none flex items-center justify-between min-h-[44px]">
            What would make a review trustworthy here
            <span className="text-ink-400 group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <ul className="mt-2 space-y-1.5">
            {REVIEW_REQUIREMENTS.map((requirement) => (
              <li
                key={requirement}
                className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1 before:h-1 before:rounded-full before:bg-ink-300 dark:before:bg-ink-600"
              >
                {requirement}
              </li>
            ))}
          </ul>
        </details>

        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-aurora-blue/5 border border-aurora-blue/20">
          <Icon icon={Info} size={14} className="text-aurora-blue flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed">
            A review can only be trusted if the platform knows a sale happened. It
            does not, so it does not claim one did. If you have dealt with this
            seller elsewhere, check their reviews on the platform you used.
          </p>
        </div>

        <button
          type="button"
          onClick={onWriteReview}
          className="mt-4 w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg border border-ink-200 dark:border-ink-700 text-sm font-semibold text-ink-600 dark:text-ink-300 hover:border-brand/40 hover:text-brand transition-colors"
        >
          <Icon icon={ShieldQuestion} size={15} />
          Why can I not leave a review?
        </button>
      </section>
    </Reveal>
  );
}
