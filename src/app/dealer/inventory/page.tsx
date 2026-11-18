import type { Metadata } from "next";
import { DealerLayout } from "@/components/dealer/DealerLayout";
import { InventoryTable } from "@/components/dealer/InventoryTable";

export const metadata: Metadata = { title: "Inventory | TrueWheels" };

export default function DealerInventoryPage() {
  return (
    <DealerLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-display font-bold text-ink-900 dark:text-white">Inventory</h1>
          <p className="text-ink-500 dark:text-ink-300 mt-1 text-sm">
            Every vehicle on your forecourt, with the activity it has drawn.
          </p>
        </header>
        <InventoryTable />
      </div>
    </DealerLayout>
  );
}
