import type { Metadata } from "next";
import { MarketplaceBrowser } from "@/components/marketplace/MarketplaceBrowser";

export const metadata: Metadata = {
  title: "Marketplace | TrueWheels",
  description: "Browse verified vehicle listings across South Africa.",
};

export default function MarketplacePage() {
  return <MarketplaceBrowser />;
}
