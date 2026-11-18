import type { Metadata } from "next";
import { DealerLayout } from "@/components/dealer/DealerLayout";
import { DealerAnalytics } from "@/components/dealer/DealerAnalytics";
import { SAMPLE_INVENTORY, SAMPLE_LEADS } from "@/lib/dealer/data";

export const metadata: Metadata = { title: "Analytics | TrueWheels" };

export default function DealerAnalyticsPage() {
  return (
    <DealerLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-display font-bold text-ink-900 dark:text-white">Analytics</h1>
          <p className="text-ink-500 dark:text-ink-300 mt-1 text-sm">
            Performance across your stock and enquiries.
          </p>
        </header>
        <DealerAnalytics inventory={SAMPLE_INVENTORY} leads={SAMPLE_LEADS} />
      </div>
    </DealerLayout>
  );
}
