import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SecurePayDashboard } from "@/components/transactions/SecurePayDashboard";
import { DEMO_VEHICLES } from "@/lib/demo/vehicles";

/**
 * The transaction page.
 *
 * The brief called it "Secure Pay" and built it around an escrow that holds funds.
 * There is no escrow and no payment system, so the page is a safety guide for a
 * private sale rather than a payment flow. See `src/lib/secure-pay.ts`.
 *
 * Follows the vehicle route: only real catalogue ids resolve, and an unknown id is a
 * real 404 rather than a page that renders not-found with a 200 status.
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
    title: `Buying the ${vehicle.title} safely | TrueWheels`,
    description:
      "TrueWheels does not hold money and does not run an escrow. How to pay safely in a private vehicle sale in South Africa.",
    // A page about payment must never be indexed as a payment page.
    robots: { index: false, follow: false },
  };
}

export default function TransactionPage({ params }: { params: { id: string } }) {
  const vehicle = DEMO_VEHICLES.find((row) => row.id === params.id);
  if (!vehicle) notFound();
  return (
    <div className="py-8">
      <SecurePayDashboard vehicle={vehicle} />
    </div>
  );
}
