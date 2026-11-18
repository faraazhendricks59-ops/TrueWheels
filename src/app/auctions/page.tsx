import type { Metadata } from "next";
import Link from "next/link";
import { Gavel } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { VehicleThumb } from "@/components/vehicles/VehicleThumb";
import { AUCTION_DISCLOSURE, formatRand } from "@/lib/auctions";
import { DEMO_VEHICLES } from "@/lib/demo/vehicles";

export const metadata: Metadata = {
  title: "Auctions | TrueWheels",
  description:
    "TrueWheels does not run auctions. There is no bidding service, no auction clock and no payment system.",
  robots: { index: false, follow: true },
};

/**
 * The destination for the "Auctions" nav link.
 *
 * That link pointed at `/#auctions`, an anchor that has never existed, so it did
 * nothing when clicked. Rather than keep a dead link, this page states plainly that
 * there are no auctions and offers the sample listings, which are ordinary
 * listings at a stated asking price.
 *
 * It is deliberately not a "coming soon" page. A promise of a future auction is
 * still a claim about something that does not exist, and it invites a reader to
 * wait for it.
 */
export default function AuctionsPage() {
  const sample = DEMO_VEHICLES.slice(0, 8);

  return (
    <div className="mx-auto max-w-4xl py-10">
      <Reveal variant="up">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100 dark:bg-ink-800 text-ink-400">
            <Icon icon={Gavel} size={20} />
          </span>
          <h1 className="text-2xl font-display font-bold text-ink-900 dark:text-white">
            Auctions
          </h1>
        </div>

        <div className="rounded-xl border border-semantic-warning/30 bg-semantic-warning/5 p-4 mb-8">
          <p className="text-sm font-bold text-ink-900 dark:text-white">
            TrueWheels does not run auctions
          </p>
          <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed mt-1">
            {AUCTION_DISCLOSURE}
          </p>
        </div>

        <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed mb-6 max-w-2xl">
          The listings below are part of the sample catalogue. Each one has an
          asking price, and you can make an offer to the seller directly. To see
          what an offer would cost you, open a listing and use the calculator on
          its page.
        </p>
      </Reveal>

      <Reveal variant="up" delay={100}>
        <div className="card-grid">
          {sample.map((vehicle) => (
            <Link
              key={vehicle.id}
              href={`/auctions/${vehicle.id}`}
              className="group rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden hover:border-brand/30 transition-colors"
            >
              <div className="aspect-[16/10] bg-ink-100 dark:bg-ink-800">
                <VehicleThumb vehicle={vehicle} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-ink-900 dark:text-white truncate">
                  {vehicle.title}
                </p>
                <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
                  {vehicle.location}
                </p>
                <p className="text-sm font-mono font-bold text-ink-900 dark:text-white mt-1.5 tabular-nums">
                  {formatRand(vehicle.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>

      <Reveal variant="up" delay={200}>
        <div className="mt-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center rounded-lg bg-ink-100 dark:bg-ink-800 text-ink-900 dark:text-white px-4 h-10 text-sm font-semibold hover:bg-ink-200 dark:hover:bg-ink-700 transition-colors"
          >
            Browse the full catalogue
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
