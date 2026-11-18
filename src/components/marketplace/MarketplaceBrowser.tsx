"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { LayoutGrid, MainSlot, SidebarSlot, RightRailSlot } from "@/components/shell/LayoutGrid";
import { AdvancedFilterPanel } from "@/components/filters/AdvancedFilterPanel";
import { Sheet } from "@/components/ui/Sheet";
import { MapView } from "@/components/map/MapView";
import { withinRadius } from "@/lib/geo";
import { SmartButton } from "@/components/ui/SmartButton";
import { LiveActivityRail } from "@/components/marketplace/LiveActivityRail";
import { ViewToggle, type ViewMode } from "@/components/marketplace/ViewToggle";
import { SortDropdown, type SortOption } from "@/components/marketplace/SortDropdown";
import { ActiveFilters, type Filter } from "@/components/marketplace/ActiveFilters";
import { VehicleListItem } from "@/components/marketplace/VehicleListItem";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { DidYouMean } from "@/components/search/DidYouMean";
import { RelevanceBadge } from "@/components/search/RelevanceBadge";
import { SearchZeroState, type RecoveryAction } from "@/components/search/SearchZeroState";
import { SearchFeedback } from "@/components/search/SearchFeedback";
import { SaveSearchModal } from "@/components/filters/SaveSearchModal";
import { explainTopMatch, resolveSearch, scoreVehicle } from "@/lib/search-relevance";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { DEMO_VEHICLES, type DemoVehicle } from "@/lib/demo/vehicles";
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

const DEMO_TOTAL = DEMO_VEHICLES.length;

function sortVehicles(
  vehicles: DemoVehicle[],
  sort: SortOption,
  terms: string[]
): DemoVehicle[] {
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
      // Score by how well each listing matches the search terms, then fall back
      // to price so the order is stable rather than arbitrary.
      if (terms.length === 0) return list.sort((a, b) => a.price - b.price);
      return list.sort((a, b) => {
        const diff = scoreVehicle(b, terms) - scoreVehicle(a, terms);
        return diff !== 0 ? diff : a.price - b.price;
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
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Radius lives in the URL alongside the other filters, so a map search is
  // shareable and the chip bar can remove it like anything else.
  const radiusCenter = useMemo<[number, number] | null>(() => {
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    return Number.isFinite(lat) && Number.isFinite(lng) && searchParams.get("lat") !== null
      ? [lat, lng]
      : null;
  }, [searchParams]);
  const radiusKm = Number(searchParams.get("radius")) || 10;

  const setRadius = (next: [number, number] | null, km?: number) => {
    updateParams((params) => {
      if (next) {
        params.set("lat", String(next[0]));
        params.set("lng", String(next[1]));
        params.set("radius", String(km ?? radiusKm));
      } else {
        params.delete("lat");
        params.delete("lng");
        params.delete("radius");
      }
    });
  };

  // Filters live in the URL, so removing a chip rewrites it. Hiding the chip
  // alone would leave the results filtered and the two would disagree.
  const updateParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(queryString);
    mutate(params);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Text resolution is computed once and shared, so the correction banner, the
  // facet counts and the results all describe the same match.
  const resolution = useMemo(() => resolveSearch(query.q), [query.q]);

  const results = useMemo(() => {
    const filtered = filterVehicles(query);
    const geoFiltered = radiusCenter
      ? filtered.filter((vehicle) => withinRadius(vehicle, radiusCenter, radiusKm))
      : filtered;
    return sortVehicles(geoFiltered, sortBy, resolution.matches.map((match) => match.corrected));
  }, [query, sortBy, radiusCenter, radiusKm, resolution.matches]);

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
    if (radiusCenter) {
      chips.push({
        id: "radius",
        label: "Radius",
        value: `${radiusKm} km of ${radiusCenter[0].toFixed(2)}, ${radiusCenter[1].toFixed(2)}`,
      });
    }
    return chips;
  }, [query, radiusCenter, radiusKm]);

  // The price chip spans two params, so it needs its own removal.
  const removeFilter = (id: string) => {
    if (id === "price") {
      updateParams((params) => {
        params.delete("min");
        params.delete("max");
      });
      return;
    }
    if (id === "radius") {
      updateParams((params) => {
        params.delete("lat");
        params.delete("lng");
        params.delete("radius");
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

  // Every recovery action reports the count it would actually bring back.
  const recoveryActions = useMemo<RecoveryAction[]>(() => {
    const actions: RecoveryAction[] = [];
    const hasFacets =
      query.makes.length +
        query.bodies.length +
        query.provinces.length +
        query.features.length +
        (query.min > PRICE_MIN ? 1 : 0) +
        (query.max < PRICE_MAX ? 1 : 0) +
        (query.minMileage > 0 ? 1 : 0) +
        (query.maxMileage < MILEAGE_MAX ? 1 : 0) +
        (query.yearFrom > YEAR_MIN ? 1 : 0) >
      0;
    if (hasFacets) {
      actions.push({
        id: "filters",
        label: "Relax filters",
        description: query.q
          ? `Remove your filters to see ${resolution.results.length.toLocaleString(localeTag("en"))} results for this search.`
          : `Remove your filters to see all ${DEMO_TOTAL.toLocaleString(localeTag("en"))} listings.`,
        recovered: query.q ? resolution.results.length : DEMO_TOTAL,
      });
    }
    if (radiusCenter) {
      const withoutRadius = filterVehicles(query).length;
      actions.push({
        id: "radius",
        label: "Expand radius",
        description: `Widen the search area to include ${withoutRadius.toLocaleString(localeTag("en"))} vehicles outside the current radius.`,
        recovered: withoutRadius,
      });
    }
    actions.push({
      id: "alert",
      label: "Set up alert",
      description: query.q
        ? `Get notified when a new match for “${query.q}” is listed.`
        : "Get notified when a new match for these filters is listed.",
    });
    return actions;
  }, [query, radiusCenter, resolution.results.length]);

  const handleRecovery = (id: string) => {
    if (id === "filters") {
      updateParams((params) => {
        ["make", "body", "province", "features", "min", "max", "minMileage", "maxMileage", "yearFrom"].forEach(
          (key) => params.delete(key)
        );
      });
      return;
    }
    if (id === "radius") {
      updateParams((params) => {
        params.delete("lat");
        params.delete("lng");
        params.delete("radius");
      });
      return;
    }
    if (id === "alert") {
      setIsAlertOpen(true);
      return;
    }
    updateParams((params) => Array.from(params.keys()).forEach((key) => params.delete(key)));
  };

  const topReasons = useMemo(
    () =>
      sortBy === "relevance" && results.length > 0
        ? explainTopMatch(results[0], results, resolution.matches.map((match) => match.corrected))
        : [],
    [results, resolution.matches, sortBy]
  );

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
                {/* Wraps because the sort control and the layout toggle together
                    are wider than a 320px screen allows on one line. */}
                <div className="flex flex-wrap items-center gap-3">
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
                    ["q", "make", "body", "province", "features", "min", "max", "minMileage", "maxMileage", "yearFrom", "lat", "lng", "radius"].forEach(
                      (key) => params.delete(key)
                    );
                  })
                }
              />
            </div>
          </Reveal>

          {resolution.correction && (
            <DidYouMean
              type="typo"
              originalQuery={resolution.correction.original}
              suggestedQuery={resolution.correction.corrected}
              resultCount={resolution.correction.count}
              onApplySuggestion={(next) =>
                updateParams((params) => params.set("q", next))
              }
            />
          )}
          {!resolution.correction && results.length === 0 && resolution.broaden && (
            <DidYouMean
              type="broaden"
              originalQuery={query.q}
              suggestedQuery={resolution.broaden.query}
              resultCount={resolution.broaden.count}
              onApplySuggestion={(next) => updateParams((params) => params.set("q", next))}
            />
          )}

          {/* The map is checked before the empty state so that a radius which
              excludes everything still shows the map and its circle, rather
              than replacing it with a message about the result count. */}
          {viewMode === "map" ? (
            <Reveal variant="up" delay={60}>
              <MapView
                vehicles={results}
                center={radiusCenter}
                radiusKm={radiusKm}
                onRadiusChange={setRadius}
              />
            </Reveal>
          ) : visible.length === 0 ? (
            <SearchZeroState query={query.q} actions={recoveryActions} onAction={handleRecovery} />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {visible.map((vehicle, index) => (
                <Reveal key={vehicle.id} variant="up" delay={Math.min(index, 8) * 40}>
                  <div className="relative">
                    {index === 0 && topReasons.length > 0 && (
                      <div className="absolute top-3 right-3 z-10">
                        <RelevanceBadge reasons={topReasons} />
                      </div>
                    )}
                    <VehicleCard vehicle={vehicle} />
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {visible.map((vehicle, index) => (
                <Reveal key={vehicle.id} variant="up" delay={Math.min(index, 8) * 40}>
                  <div className="relative">
                    {index === 0 && topReasons.length > 0 && (
                      <div className="absolute top-4 right-4 z-10">
                        <RelevanceBadge reasons={topReasons} />
                      </div>
                    )}
                    <VehicleListItem
                      vehicle={vehicle}
                      isFeatured={index % 5 === 0}
                      isVerified={index % 3 === 0}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {viewMode !== "map" && visible.length > 0 && <SearchFeedback query={query.q} />}
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

      <SaveSearchModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        queryString={queryString}
      />
    </LayoutGrid>
  );
}
