import type { Metadata } from "next";
import { GarageView } from "@/components/garage/GarageView";

/**
 * The Digital Garage route.
 *
 * This did not exist. The only garage in the app was a drawer listing saved
 * vehicles, reachable from the header, and the lifecycle, journal and service
 * features the brief describes had no route at all.
 *
 * It does not render AppShell: the root layout already provides it.
 */
export const metadata: Metadata = {
  title: "Digital Garage | TrueWheels",
  description:
    "Track the vehicles you own, have owned, or want. Every entry, modification and service here is one you recorded yourself, stored in this browser.",
};

export default function GaragePage() {
  return <GarageView />;
}
