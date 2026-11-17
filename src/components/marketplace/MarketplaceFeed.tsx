"use client";

import { useState, useEffect } from "react";
import { SearchX, RefreshCw } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LoadingGrid } from "@/components/ui/Skeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { VirtualList } from "@/components/ui/VirtualList";
import { SmartButton } from "@/components/ui/SmartButton";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { DEMO_VEHICLES, type DemoVehicle } from "@/lib/demo/vehicles";

const ITEMS_PER_PAGE = 20;

export function MarketplaceFeed() {
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<DemoVehicle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setVehicles(DEMO_VEHICLES);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filtered = search
    ? vehicles.filter((v) => v.title.toLowerCase().includes(search.toLowerCase()))
    : vehicles;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const page = Math.min(currentPage, Math.max(1, totalPages));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <section className="w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-display font-bold text-ink-900 dark:text-white">Marketplace</h2>
        <div className="flex items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search listings"
            aria-label="Search listings"
            className="h-10 px-3.5 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
          <SmartButton
            featureKey="marketplace.view_all"
            variant={viewAll ? "primary" : "outline"}
            onClick={() => setViewAll((v) => !v)}
          >
            {viewAll ? "Paged view" : "View all"}
          </SmartButton>
        </div>
      </div>

      <ErrorBoundary resetKeys={[search, viewAll, page]}>
        {isLoading && (
          <LoadingGrid count={8} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" />
        )}

        {!isLoading && filtered.length === 0 && (
          <EmptyState
            icon={SearchX}
            title="No vehicles found"
            description="Try adjusting your filters or search terms to find what you're looking for."
            actionLabel="Clear Filters"
            actionFeatureKey="marketplace.clear_filters"
            onAction={() => setSearch("")}
          />
        )}

        {!isLoading && filtered.length > 0 && !viewAll && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginated.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}

        {!isLoading && filtered.length > 0 && viewAll && (
          <div className="rounded-2xl border border-ink-100 dark:border-ink-800 overflow-hidden">
            <VirtualList
              items={filtered}
              itemHeight={300}
              label={`${filtered.length} vehicle listings`}
              getKey={(v) => v.id}
              className="h-[600px] p-4"
              renderItem={(vehicle) => <VehicleCard vehicle={vehicle} />}
            />
          </div>
        )}
      </ErrorBoundary>

      {!isLoading && filtered.length > 0 && (
        <p className="mt-6 text-xs text-ink-400 flex items-center gap-2">
          <RefreshCw size={12} strokeWidth={1.75} />
          {filtered.length.toLocaleString("en-ZA")} listings loaded
        </p>
      )}
    </section>
  );
}
