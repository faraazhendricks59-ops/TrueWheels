import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { AuctionRoom } from "@/components/auctions/AuctionRoom";
import { DEMO_VEHICLES } from "@/lib/demo/vehicles";

/**
 * The "auction room".
 *
 * The nav has linked to `/#auctions` since the header was built, and that anchor
 * has never existed — it was a dead link. This route gives the link somewhere real
 * to go, but the honest version of where it goes: there is no auction engine in
 * this project, so the page shows the listing with a calculator and an account of
 * what is missing, rather than a live-bidding room built on invented bids. See
 * `src/lib/auctions.ts`.
 *
 * Follows the vehicle route: only real catalogue ids resolve, and an unknown id is
 * a real 404 rather than a page that renders not-found with a 200 status.
 */
export function generateStaticParams() {
  return DEMO_VEHICLES.map((vehicle) => ({ id: vehicle.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const vehicle = DEMO_VEHICLES.find((row) => row.id === params.id);
  if (!vehicle) return { title: "Listing not found | TrueWheels" };
  return {
    title: `${vehicle.title} — no auction is running | TrueWheels`,
    description: `TrueWheels does not run auctions. This page shows the listing for the ${vehicle.title} and explains what is not available.`,
    // Nothing here should be indexed as an auction listing.
    robots: { index: false, follow: true },
  };
}

export default function AuctionRoomPage({ params }: { params: { id: string } }) {
  const vehicle = DEMO_VEHICLES.find((row) => row.id === params.id);
  if (!vehicle) notFound();
  return (
    <AppShell disablePadding hideFooter>
      <AuctionRoom vehicle={vehicle} />
    </AppShell>
  );
}
