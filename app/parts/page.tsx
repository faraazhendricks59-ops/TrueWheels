import type { Metadata } from "next";
import { PartsMarketplaceLayout } from "@/components/parts/PartsMarketplaceLayout";

export const metadata: Metadata = { title: "Parts & Accessories | TrueWheels", description: "Buy OEM, aftermarket, and quality used car parts in South Africa. Verify fitment before you buy." };
export default function PartsPage() { return <div className="min-h-screen bg-surface-grey"><PartsMarketplaceLayout /></div>; }
