"use client";

import { useState } from "react";
import { DealerLayout } from "@/components/dealer/DealerLayout";
import { DealerAnalytics } from "@/components/dealer/DealerAnalytics";
import { InventoryTable } from "@/components/dealer/InventoryTable";
import { LeadPipeline } from "@/components/dealer/LeadPipeline";
import { SAMPLE_INVENTORY, SAMPLE_LEADS, type InventoryItem } from "@/lib/dealer/data";

export default function DealerDashboardPage() {
  // The analytics tiles are computed from the same array the table renders, so
  // pausing or selling a vehicle updates the KPI row immediately rather than
  // leaving the two disagreeing.
  const [inventory, setInventory] = useState<InventoryItem[]>(SAMPLE_INVENTORY);

  return (
    <DealerLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-display font-bold text-ink-900 dark:text-white">
            Dealer command centre
          </h1>
          <p className="text-ink-500 dark:text-ink-300 mt-1">
            Manage inventory, track enquiries and review performance.
          </p>
        </header>

        <DealerAnalytics inventory={inventory} leads={SAMPLE_LEADS} />
        <InventoryTable onInventoryChange={setInventory} />
        <LeadPipeline />
      </div>
    </DealerLayout>
  );
}
