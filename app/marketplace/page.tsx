import type { Metadata } from "next";
import { MarketplaceBrowser } from "@/components/marketplace/MarketplaceBrowser";
import { SITE_NAME } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: `Marketplace | ${SITE_NAME}`,
  description:
    "Browse verified used cars, bakkies and SUVs for sale across South Africa. Filter by make, price and mileage.",
  alternates: { canonical: "/marketplace" },
  openGraph: {
    title: `Marketplace | ${SITE_NAME}`,
    description:
      "Browse verified used cars, bakkies and SUVs for sale across South Africa. Filter by make, price and mileage.",
    url: "/marketplace",
  },
};

export default function MarketplacePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <MarketplaceBrowser />
    </main>
  );
}
