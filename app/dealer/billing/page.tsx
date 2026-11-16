import type { Metadata } from "next";
import { BillingContent } from "@/components/billing/BillingContent";

export const metadata: Metadata = {
  title: "Subscription & Billing | TrueWheels",
  description: "Manage your dealer plan, monitor usage against limits, and download VAT invoices.",
  // Billing is account-specific; keep it out of search results.
  robots: { index: false, follow: false },
};

export default function DealerBillingPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-surface-grey">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <BillingContent />
      </div>
    </main>
  );
}
