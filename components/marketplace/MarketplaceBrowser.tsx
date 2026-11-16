"use client";

import { useMemo, useState } from "react";
import { CarFront, Search, SlidersHorizontal, X } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { useTranslation } from "@/components/providers/LanguageProvider";
import { VEHICLE_MAKES, DEMO_VEHICLES, type Vehicle } from "@/lib/vehicles/demo-vehicles";

type SortKey = "newest" | "priceAsc" | "priceDesc" | "mileageAsc";

const SORT_LABEL_KEYS = {
  newest: "marketplace.sortNewest",
  priceAsc: "marketplace.sortPriceAsc",
  priceDesc: "marketplace.sortPriceDesc",
  mileageAsc: "marketplace.sortMileageAsc",
} as const;

function matches(vehicle: Vehicle, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [vehicle.make, vehicle.model, vehicle.variant, vehicle.city, vehicle.province, vehicle.title]
    .filter((field): field is string => Boolean(field))
    .some((field) => field.toLowerCase().includes(q));
}

function sortListings(list: Vehicle[], sort: SortKey): Vehicle[] {
  const sorted = [...list];
  switch (sort) {
    case "priceAsc":
      return sorted.sort((a, b) => a.price - b.price);
    case "priceDesc":
      return sorted.sort((a, b) => b.price - a.price);
    case "mileageAsc":
      return sorted.sort((a, b) => a.mileage - b.mileage);
    default:
      // ISO dates compare correctly as strings; ties fall back to id so the
      // order stays stable across renders.
      return sorted.sort(
        (a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id),
      );
  }
}

export function MarketplaceBrowser() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [make, setMake] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  const hasFilters = query.trim().length > 0 || make.length > 0;

  const results = useMemo(
    () =>
      sortListings(
        DEMO_VEHICLES.filter((v) => matches(v, query) && (!make || v.make === make)),
        sort,
      ),
    [query, make, sort],
  );

  // The featured rail is a curated subset, so it only makes sense unfiltered.
  const featured = useMemo(
    () => (hasFilters ? [] : sortListings(DEMO_VEHICLES.filter((v) => v.featured), "newest")),
    [hasFilters],
  );

  const clearFilters = () => {
    setQuery("");
    setMake("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-graphite">
            {t("marketplace.title")}
          </h1>
          <p className="text-sm text-neutral-muted">{t("marketplace.subtitle")}</p>
        </div>
        <p className="text-sm text-neutral-muted" aria-live="polite">
          <span className="font-bold text-brand-graphite">{results.length}</span>{" "}
          {t("marketplace.results")}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-3 rounded-xl border border-brand-silver bg-surface-white p-4 shadow-card sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-subtle"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("marketplace.searchPlaceholder")}
            aria-label={t("marketplace.searchPlaceholder")}
            className="h-10 w-full rounded-lg border border-brand-silver bg-surface-white pl-9 pr-3 text-sm text-brand-graphite placeholder:text-neutral-subtle focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SlidersHorizontal
            size={16}
            className="hidden text-neutral-subtle sm:block"
            aria-hidden="true"
          />

          <label className="sr-only" htmlFor="marketplace-make">
            {t("marketplace.filterMake")}
          </label>
          <select
            id="marketplace-make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="h-10 rounded-lg border border-brand-silver bg-surface-white px-3 text-sm text-brand-graphite focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
          >
            <option value="">{t("marketplace.filterAllMakes")}</option>
            {VEHICLE_MAKES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="marketplace-sort">
            {t("marketplace.sortBy")}
          </label>
          <select
            id="marketplace-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-10 rounded-lg border border-brand-silver bg-surface-white px-3 text-sm text-brand-graphite focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
          >
            {(Object.keys(SORT_LABEL_KEYS) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {t(SORT_LABEL_KEYS[key])}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-brand-silver px-3 text-sm font-medium text-brand-graphite transition hover:bg-neutral-hover"
            >
              <X size={14} aria-hidden="true" />
              {t("marketplace.clearFilters")}
            </button>
          )}
        </div>
      </div>

      {/* Featured rail */}
      {featured.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold tracking-tight text-brand-graphite">
            {t("marketplace.featuredSection")}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((vehicle, i) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                priority={i < 4}
                featuredLabel={t("marketplace.featured")}
                verifiedLabel={t("marketplace.verified")}
              />
            ))}
          </div>
        </section>
      )}

      {/* All listings */}
      {results.length > 0 ? (
        <section>
          <h2 className="mb-4 text-lg font-bold tracking-tight text-brand-graphite">
            {hasFilters ? t("marketplace.title") : t("marketplace.allListings")}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                featuredLabel={t("marketplace.featured")}
                verifiedLabel={t("marketplace.verified")}
              />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          icon={CarFront}
          title={t("marketplace.emptyTitle")}
          description={t("marketplace.emptyDescription")}
          actionLabel={t("marketplace.clearFilters")}
          onAction={clearFilters}
          actionVariant="outline"
        />
      )}
    </div>
  );
}
