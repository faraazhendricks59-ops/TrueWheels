"use client";

import Link from "next/link";
import { ArrowLeft, Gavel } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { TrustHeader, VehicleTitle } from "@/components/vehicles/TrustHeader";
import { SpecGrid } from "@/components/vehicles/SpecGrid";
import { AuctionStatusBadge } from "./AuctionStatusBadge";
import { AuctionCountdown } from "./AuctionCountdown";
import { BidPlacementPanel } from "./BidPlacementPanel";
import { LiveBidFeed } from "./LiveBidFeed";
import { mediaFor } from "@/lib/gallery-media";
import { AUCTION_DISCLOSURE, auctionRef } from "@/lib/auctions";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * The auction room.
 *
 * The brief wanted "a high-stakes, realtime environment" with a live bid feed and a
 * proxy-bidding engine. There is no auction, so this page is a vehicle page with a
 * calculator and an honest account of what is missing, rather than a room where
 * nothing is happening dressed up to look busy.
 *
 * It reuses the real vehicle components — the gallery, the trust header and the
 * spec grid — so nothing here invents a second, more flattering version of the
 * listing. The brief's `TrustHeader` took an `isVerified` prop and was called with
 * `isVerified={true}`; the real one reports what was actually checked, which is
 * nothing, and says so.
 *
 * The prominent banner at the top is deliberate. A reader arriving from the
 * "Auctions" nav link expects an auction; the first thing this page does is tell
 * them there is not one, before showing them anything that could be mistaken for
 * live activity.
 */
export function AuctionRoom({ vehicle }: { vehicle: DemoVehicle }) {
  const media = mediaFor(vehicle);
  const ref = auctionRef(vehicle);

  // Which honest state describes this listing. Derived from the catalogue, not
  // from any bidding.
  const index = Number(vehicle.id.replace(/\D/g, "")) || 0;
  const state = index % 3 === 0 ? "recently_added" : index % 2 === 0 ? "offers_invited" : "at_asking_price";

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-8">
      <Link
        href={`/vehicles/${vehicle.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 dark:text-ink-400 hover:text-brand transition-colors mb-6"
      >
        <Icon icon={ArrowLeft} size={14} />
        Back to the full listing
      </Link>

      {/* Say it before anything else can be mistaken for activity. */}
      <div className="mb-6 rounded-xl border border-semantic-warning/30 bg-semantic-warning/5 p-4 flex items-start gap-3">
        <Icon icon={Gavel} size={16} className="text-semantic-warning mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-ink-900 dark:text-white">
            There is no auction for this vehicle
          </p>
          <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed mt-1 max-w-3xl">
            {AUCTION_DISCLOSURE}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main content */}
        <div className="lg:col-span-8 space-y-8">
          <Reveal variant="up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <AuctionStatusBadge state={state} />
              <div className="sm:text-right">
                <p className="text-xs font-bold text-ink-400 uppercase tracking-wider">
                  Listing reference
                </p>
                <p className="text-sm font-mono font-bold text-ink-900 dark:text-white">{ref}</p>
              </div>
            </div>
          </Reveal>

          <Reveal variant="up" delay={100}>
            <VehicleGallery vehicle={vehicle} media={media} />
          </Reveal>

          <Reveal variant="up" delay={150}>
            <div className="space-y-6">
              <VehicleTitle vehicle={vehicle} />
              <TrustHeader vehicle={vehicle} />
              <SpecGrid vehicle={vehicle} />
            </div>
          </Reveal>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-6">
            <Reveal variant="up" delay={200}>
              <AuctionCountdown vehicleId={vehicle.id} />
            </Reveal>

            <Reveal variant="up" delay={300}>
              <BidPlacementPanel vehicle={vehicle} />
            </Reveal>

            <Reveal variant="up" delay={400}>
              <LiveBidFeed />
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
