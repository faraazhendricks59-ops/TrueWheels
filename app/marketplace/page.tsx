"use client";

import { useEffect, useState } from "react";
import { CarFront } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { VehicleGridSkeleton } from "@/components/vehicles/VehicleCardSkeleton";
import { useTranslation } from "@/components/providers/LanguageProvider";

export default function MarketplacePage() {
  const { t } = useTranslation();
  // Placeholder until the marketplace data layer lands in a later phase.
  const [loading, setLoading] = useState(true);
  const [listings] = useState<unknown[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-graphite">{t("marketplace.title")}</h1>
          <p className="text-sm text-neutral-muted">{t("marketplace.subtitle")}</p>
        </div>
      </div>

      {loading ? (
        <VehicleGridSkeleton count={8} />
      ) : listings.length === 0 ? (
        <EmptyState
          icon={CarFront}
          title={t("marketplace.emptyTitle")}
          description={t("marketplace.emptyDescription")}
          actionLabel={t("marketplace.clearFilters")}
          actionVariant="outline"
        />
      ) : null}
    </main>
  );
}
