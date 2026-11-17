"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import { LayoutGrid, MainSlot, SidebarSlot, RightRailSlot } from "@/components/shell/LayoutGrid";
import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { LiveActivityRail } from "@/components/marketplace/LiveActivityRail";
import { ViewToggle, type ViewMode } from "@/components/marketplace/ViewToggle";
import { SortDropdown, type SortOption } from "@/components/marketplace/SortDropdown";
import { ActiveFilters, type Filter } from "@/components/marketplace/ActiveFilters";
import { VehicleListItem } from "@/components/marketplace/VehicleListItem";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { DEMO_VEHICLES, type DemoVehicle } from "@/lib/demo/vehicles";
import { localeTag } from "@/lib/i18n/locale";

const PAGE_SIZE = 24;

function sortVehicles(vehicles: DemoVehicle[], sort: SortOption, query: string): DemoVehicle[] {
  const list = [...vehicles];
  switch (sort) {
    case "price_asc":
      return list.sort((a, b) => a.price - b.price);
    case "price_desc":
      return list.sort((a, b) => b.price - a.price);
    case "newest":
      return list.sort((a, b) => b.year - a.year);
    case "mileage_asc":
      return list.sort((a, b) => a.mileage - b.mileage);
    case "relevance":
    default: {
      // No ranking model yet: exact title matches float, then title proximity.
      // Deterministic, so it does not reshuffle between renders.
      if (!query) return list;
      const q = query.toLowerCase();
      return list.sort((a, b) => {
        const aExact = a.title.toLowerCase() === q ? 0 : 1;
        const bExact = b.title.toLowerCase() === q ? 0 : 1;
        return aExact - bExact;
      });
    }
  }
}

export function MarketplaceBrowser() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = searchParams.get("q")?.trim() ?? "";
  const maxPrice = Number(searchParams.get("max") ?? "") || 0;

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  // Filters live in the URL, so removing a chip has to rewrite it. Hiding the
  // chip alone would leave the results filtered and the two would disagree.
  const updateParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const results = useMemo(() => {
    let list = DEMO_VEHICLES;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (vehicle) =>
          vehicle.title.toLowerCase().includes(q) || vehicle.location.toLowerCase().includes(q)
      );
    }
    if (maxPrice > 0) list = list.filter((vehicle) => vehicle.price <= maxPrice);
    return sortVehicles(list, sortBy, query);
  }, [query, maxPrice, sortBy]);

  // Each chip's id is the search param it controls, so removal is a one-liner.
  const filters = useMemo<Filter[]>(() => {
    const active: Filter[] = [];
    if (query) active.push({ id: "q", label: "Search", value: query });
    if (maxPrice > 0) {
      active.push({
        id: "max",
        label: "Max price",
        value: `R ${maxPrice.toLocaleString(localeTag("en"))}`,
      });
    }
    return active;
  }, [query, maxPrice]);

  const visible = results.slice(0, PAGE_SIZE);

  return (
    <LayoutGrid showSidebar showRightRail rightRailFeatureKey="ui.right_rail">
      <SidebarSlot>
        <div className="sticky top-[calc(var(--header-height)+var(--sat)+1.5rem)]">
          <FilterPanel />
        </div>
      </SidebarSlot>

      <MainSlot>
        <div className="space-y-6">
          <Reveal variant="up">
            <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4 shadow-lift">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-lg font-display font-bold text-ink-900 dark:text-white">
                    <CountUp end={results.length} duration={1000} /> vehicles found
                  </h1>
                  {query && (
                    <p className="text-xs text-ink-500 dark:text-ink-300 mt-0.5">
                      Matching &ldquo;{query}&rdquo;
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <SortDropdown value={sortBy} onChange={setSortBy} />
                  <ViewToggle value={viewMode} onChange={setViewMode} />
                </div>
              </div>

              <ActiveFilters
                filters={filters}
                onRemove={(id) => updateParams((params) => params.delete(id))}
                onClearAll={() =>
                  updateParams((params) => {
                    params.delete("q");
                    params.delete("max");
                  })
                }
              />
            </div>
          </Reveal>

          {visible.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No vehicles match your search"
              description="Try a different make, model or city, or clear the filters."
            />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {visible.map((vehicle, index) => (
                <Reveal key={vehicle.id} variant="up" delay={Math.min(index, 8) * 40}>
                  <VehicleCard vehicle={vehicle} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {visible.map((vehicle, index) => (
                <Reveal key={vehicle.id} variant="up" delay={Math.min(index, 8) * 40}>
                  <VehicleListItem
                    vehicle={vehicle}
                    isFeatured={index % 5 === 0}
                    isVerified={index % 3 === 0}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </MainSlot>

      <RightRailSlot>
        <div className="sticky top-[calc(var(--header-height)+var(--sat)+1.5rem)] space-y-6">
          <LiveActivityRail />
        </div>
      </RightRailSlot>
    </LayoutGrid>
  );
}
