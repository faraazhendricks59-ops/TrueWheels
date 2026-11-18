import type { Metadata } from "next";
import { DealerLayout } from "@/components/dealer/DealerLayout";
import { DealerSettingsEmpty } from "@/components/dealer/DealerSettingsEmpty";

export const metadata: Metadata = { title: "Showroom settings | TrueWheels" };

export default function DealerSettingsPage() {
  return (
    <DealerLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-display font-bold text-ink-900 dark:text-white">
            Showroom settings
          </h1>
          <p className="text-ink-500 dark:text-ink-300 mt-1 text-sm">
            Your dealership profile, trading hours and contact details.
          </p>
        </header>
        <DealerSettingsEmpty />
      </div>
    </DealerLayout>
  );
}
