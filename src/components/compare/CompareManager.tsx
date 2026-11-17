"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Share2 } from "lucide-react";
import { SmartButton } from "@/components/ui/SmartButton";
import { Reveal } from "@/components/motion/Reveal";
import { ComparisonTable } from "./ComparisonTable";
import { ExportComparisonModal } from "./ExportComparisonModal";
import { VehiclePickerModal } from "./VehiclePickerModal";
import { COMPARE_MAX, resolveCompareVehicles } from "@/lib/comparison-data";

const DEFAULT_IDS = ["v-0", "v-24", "v-7"];

function CompareInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // The comparison lives in the address, so it can be shared, bookmarked and
  // restored by the back button rather than disappearing on reload.
  const idsParam = searchParams.get("v");
  const ids = useMemo(
    () => (idsParam === null ? DEFAULT_IDS : idsParam.split(",").filter(Boolean)),
    [idsParam]
  );
  const vehicles = useMemo(() => resolveCompareVehicles(ids), [ids]);

  const writeIds = useCallback(
    (next: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.length > 0) params.set("v", next.join(","));
      else params.delete("v");
      router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  const shareUrl = `/compare${vehicles.length > 0 ? `?v=${vehicles.map((v) => v.id).join(",")}` : ""}`;

  return (
    <div className="max-w-[1600px] mx-auto py-8 space-y-8">
      <Reveal variant="up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-ink-900 dark:text-white">
              Compare vehicles
            </h1>
            <p className="text-ink-500 dark:text-ink-300 mt-1">
              Side-by-side specifications, with the strongest figure in each row marked.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SmartButton
              featureKey="compare.add_vehicle"
              variant="secondary"
              leftIcon={Plus}
              onClick={() => setIsPickerOpen(true)}
            >
              Add vehicle
            </SmartButton>
            <SmartButton
              featureKey="compare.export"
              leftIcon={Share2}
              onClick={() => setIsExportOpen(true)}
              disabled={vehicles.length === 0}
            >
              Export
            </SmartButton>
          </div>
        </div>
      </Reveal>

      {vehicles.length > 0 ? (
        <Reveal variant="up" delay={100}>
          <ComparisonTable
            vehicles={vehicles}
            onRemove={(id) => writeIds(vehicles.filter((v) => v.id !== id).map((v) => v.id))}
            onAdd={() => setIsPickerOpen(true)}
          />
        </Reveal>
      ) : (
        <Reveal variant="up" delay={100}>
          <div className="text-center py-20 bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800">
            <p className="text-ink-500 dark:text-ink-300 mb-4">
              No vehicles to compare. Add at least two to see a side-by-side breakdown.
            </p>
            <SmartButton
              featureKey="compare.add_vehicle"
              leftIcon={Plus}
              onClick={() => setIsPickerOpen(true)}
            >
              Add vehicle
            </SmartButton>
          </div>
        </Reveal>
      )}

      <VehiclePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        selectedIds={vehicles.map((v) => v.id)}
        onPick={(id) => {
          if (vehicles.length >= COMPARE_MAX) return;
          writeIds([...vehicles.map((v) => v.id), id]);
        }}
      />

      <ExportComparisonModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        shareUrl={shareUrl}
      />
    </div>
  );
}

export function CompareManager() {
  // useSearchParams needs a Suspense boundary so the shell can prerender.
  return (
    <Suspense fallback={<div className="max-w-[1600px] mx-auto py-8" />}>
      <CompareInner />
    </Suspense>
  );
}
