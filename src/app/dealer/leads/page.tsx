import type { Metadata } from "next";
import { DealerLayout } from "@/components/dealer/DealerLayout";
import { LeadPipeline } from "@/components/dealer/LeadPipeline";

export const metadata: Metadata = { title: "Lead pipeline | TrueWheels" };

export default function DealerLeadsPage() {
  return (
    <DealerLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-display font-bold text-ink-900 dark:text-white">Lead pipeline</h1>
          <p className="text-ink-500 dark:text-ink-300 mt-1 text-sm">
            Enquiries from the marketplace, grouped by how far along they are.
          </p>
        </header>
        <LeadPipeline />
      </div>
    </DealerLayout>
  );
}
