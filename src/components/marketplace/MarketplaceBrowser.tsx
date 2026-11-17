"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { LayoutGrid, MainSlot, SidebarSlot, RightRailSlot } from "@/components/shell/LayoutGrid";
import { AdvancedFilterPanel } from "@/components/filters/AdvancedFilterPanel";
import { Sheet } from "@/components/ui/Sheet";
import { SmartButton } from "@/components/ui/SmartButton";
import { LiveActivityRail } from "@/components/marketplace/LiveActivityRail";
import { ViewToggle, type ViewMode } from "@/components/marketplace/ViewToggle";
import { SortDropdown, type SortOption } from "@/components/marketplace/SortDropdown";
import { ActiveFilters, type Filter } from "@/components/marketplace/ActiveFilters";
import { VehicleListItem } from "@/components/marketplace/VehicleListItem";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import type { DemoVehicle } from "@/lib/demo/vehicles";
import { localeTag } from "@/lib/i18n/locale";
import {
  filterVehicles,
  parseMarketplaceQuery,
  PRICE_MAX,
  PRICE_MIN,
  MILEAGE_MAX,
  MILEAGE_MIN,
  YEAR_MIN,
  type MarketplaceQuery,
} from "@/lib/marketplace-filter";
import { featureLabel } from "@/lib/vehicle-facets";

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
  const queryString = searchParams.toString();
  const query = useMemo(
    () => parseMarketplaceQuery(new URLSearchParams(queryString)),
    [queryString]
  );

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Filters live in the URL, so removing a chip rewrites it. Hiding the chip
  // alone would leave the results filtered and the two would disagree.
  const updateParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(queryString);
    mutate(params);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const results = useMemo(
    () => sortVehicles(filterVehicles(query), sortBy, query.q),
    [query, sortBy]
  );

  // Each chip knows the search param it controls, so removal is a one-liner.
  const filters = useMemo<Filter[]>(() => {
    const chips: Filter[] = [];
    if (query.q) chips.push({ id: "q", label: "Search", value: query.q });
    if (query.makes.length) chips.push({ id: "make", label: "Make", value: query.makes.join(", ") });
    if (query.bodies.length) chips.push({ id: "body", label: "Body type", value: query.bodies.join(", ") });
    if (query.provinces.length) {
      chips.push({ id: "province", label: "Province", value: query.provinces.join(", ") });
    }
    if (query.features.length) {
      chips.push({
        id: "features",
        label: "Features",
        value: query.features.map(featureLabel).join(", "),
      });
    }
    if (query.min > PRICE_MIN || query.max < PRICE_MAX) {
      chips.push({
        id: "price",
        label: "Price",
        value: `R ${query.min.toLocaleString(localeTag("en"))} - R ${query.max.toLocaleString(localeTag("en"))}`,
      });
    }
    if (query.minMileage > MILEAGE_MIN || query.maxMileage < MILEAGE_MAX) {
      chips.push({
        id: "mileage",
        label: "Mileage",
        value: `${query.minMileage.toLocaleString(localeTag("en"))} - ${query.maxMileage.toLocaleString(localeTag("en"))} km`,
      });
    }
    if (query.yearFrom > YEAR_MIN) {
      chips.push({ id: "yearFrom", label: "Year from", value: String(query.yearFrom) });
    }
    return chips;
  }, [query]);

  // The price chip spans two params, so it needs its own removal.
  const removeFilter = (id: string) => {
    if (id === "price") {
      updateParams((params) => {
        params.delete("min");
        params.delete("max");
      });
      return;
    }
    if (id === "mileage") {
      updateParams((params) => {
        params.delete("minMileage");
        params.delete("maxMileage");
      });
      return;
    }
    updateParams((params) => params.delete(id));
  };

  const visible = results.slice(0, PAGE_SIZE);

  const panel = <AdvancedFilterPanel onApplied={() => setIsFilterSheetOpen(false)} />;

  return (
    <LayoutGrid showSidebar showRightRail rightRailFeatureKey="ui.right_rail">
      <SidebarSlot>
        <div className="sticky top-[calc(var(--header-height)+var(--sat)+1.5rem)]">{panel}</div>
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
                  {query.q && (
                    <p className="text-xs text-ink-500 dark:text-ink-300 mt-0.5">
                      Matching &ldquo;{query.q}&rdquo;
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <SmartButton
                    featureKey="filters.mobile_trigger"
                    variant="secondary"
                    size="sm"
                    className="md:hidden"
                    leftIcon={SlidersHorizontal}
                    onClick={() => setIsFilterSheetOpen(true)}
                  >
                    Filters
                  </SmartButton>
                  <SortDropdown value={sortBy} onChange={setSortBy} />
                  <ViewToggle value={viewMode} onChange={setViewMode} />
                </div>
              </div>

              <ActiveFilters
                filters={filters}
                onRemove={removeFilter}
                onClearAll={() =>
                  updateParams((params) => {
                    ["q", "make", "body", "province", "features", "min", "max", "minMileage", "maxMileage", "yearFrom"].forEach(
                      (key) => params.delete(key)
                    );
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
              actionLabel="Clear all filters"
              actionFeatureKey="marketplace.clear_filters"
              // Snapshot the keys first: deleting while iterating skips entries.
              onAction={() => updateParams((params) => Array.from(params.keys()).forEach((key) => params.delete(key)))}
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

      <Sheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        title="Refine search"
        side="bottom"
      >
        {panel}
      </Sheet>
    </LayoutGrid>
  );
}
