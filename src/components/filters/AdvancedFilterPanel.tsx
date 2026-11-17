"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Save, SlidersHorizontal } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { FilterFacet, FilterToggle } from "@/components/filters/FilterComponents";
import { SaveSearchModal } from "@/components/filters/SaveSearchModal";
import {
  EMPTY_QUERY,
  MILEAGE_MAX,
  MILEAGE_MIN,
  PRICE_MAX,
  PRICE_MIN,
  YEAR_MAX,
  YEAR_MIN,
  filterVehicles,
  parseMarketplaceQuery,
  type MarketplaceQuery,
} from "@/lib/marketplace-filter";
import {
  ALL_MAKES,
  ALL_PROVINCES,
  BODY_TYPES,
  FEATURES,
  vehicleBodyType,
  vehicleMake,
  vehicleProvince,
} from "@/lib/vehicle-facets";
import { localeTag } from "@/lib/i18n/locale";

const formatZAR = (value: number) =>
  value >= 1_000_000
    ? `R ${(value / 1_000_000).toFixed(1)}m`
    : `R ${Math.round(value / 1000)}k`;

const formatKM = (value: number) =>
  value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}m km` : `${Math.round(value / 1000)}k km`;

/** Builds a URL query string from a query, omitting values at their defaults. */
export function toQueryString(query: MarketplaceQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.makes.length) params.set("make", query.makes.join(","));
  if (query.bodies.length) params.set("body", query.bodies.join(","));
  if (query.provinces.length) params.set("province", query.provinces.join(","));
  if (query.features.length) params.set("features", query.features.join(","));
  if (query.min > PRICE_MIN) params.set("min", String(query.min));
  if (query.max < PRICE_MAX) params.set("max", String(query.max));
  if (query.minMileage > MILEAGE_MIN) params.set("minMileage", String(query.minMileage));
  if (query.maxMileage < MILEAGE_MAX) params.set("maxMileage", String(query.maxMileage));
  if (query.yearFrom > YEAR_MIN) params.set("yearFrom", String(query.yearFrom));
  return params.toString();
}

export function AdvancedFilterPanel({ onApplied }: { onApplied?: () => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const queryString = searchParams.toString();
  const applied = useMemo(
    () => parseMarketplaceQuery(new URLSearchParams(queryString)),
    [queryString]
  );

  // Edits are held as a draft and only committed on Apply, so the results are
  // not re-filtered on every slider tick.
  const [draft, setDraft] = useState<MarketplaceQuery>(applied);
  const [isSaveOpen, setIsSaveOpen] = useState(false);

  useEffect(() => setDraft(applied), [applied]);

  const count = useMemo(() => filterVehicles(draft).length, [draft]);
  const activeCount =
    draft.makes.length +
    draft.bodies.length +
    draft.provinces.length +
    draft.features.length +
    (draft.min > PRICE_MIN ? 1 : 0) +
    (draft.max < PRICE_MAX ? 1 : 0) +
    (draft.minMileage > MILEAGE_MIN ? 1 : 0) +
    (draft.maxMileage < MILEAGE_MAX ? 1 : 0) +
    (draft.yearFrom > YEAR_MIN ? 1 : 0) +
    (draft.q ? 1 : 0);

  // Counts ignore the facet's own selection so options stay reachable.
  const makeOptions = useMemo(() => {
    const base = filterVehicles(draft, "makes");
    return ALL_MAKES.map((make) => ({
      id: make,
      label: make,
      count: base.filter((vehicle) => vehicleMake(vehicle) === make).length,
    })).filter((option) => option.count > 0 || draft.makes.includes(option.id));
  }, [draft]);

  const bodyOptions = useMemo(() => {
    const base = filterVehicles(draft, "bodies");
    return BODY_TYPES.map((body) => ({
      id: body,
      label: body,
      count: base.filter((vehicle) => vehicleBodyType(vehicle) === body).length,
    })).filter((option) => option.count > 0 || draft.bodies.includes(option.id));
  }, [draft]);

  const provinceOptions = useMemo(() => {
    const base = filterVehicles(draft, "provinces");
    return ALL_PROVINCES.map((province) => ({
      id: province,
      label: province,
      count: base.filter((vehicle) => vehicleProvince(vehicle) === province).length,
    })).filter((option) => option.count > 0 || draft.provinces.includes(option.id));
  }, [draft]);

  const apply = () => {
    const next = toQueryString(draft);
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    onApplied?.();
  };

  // Reset clears the panel's own filters but keeps the search term, which the
  // panel does not own.
  const reset = () => {
    const cleared: MarketplaceQuery = { ...EMPTY_QUERY, q: draft.q };
    setDraft(cleared);
    const next = toQueryString(cleared);
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-lift overflow-hidden flex flex-col">
      <div className="p-5 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between gap-3">
        <h3 className="font-display font-bold text-ink-900 dark:text-white flex items-center gap-2">
          <Icon icon={SlidersHorizontal} size={16} />
          Filters
          {activeCount > 0 && (
            <span className="text-[10px] font-bold text-ink-400 bg-ink-50 dark:bg-ink-800 px-2 py-0.5 rounded-full">
              {activeCount} active
            </span>
          )}
        </h3>
        <button
          type="button"
          onClick={reset}
          disabled={activeCount === 0}
          className="text-xs font-semibold text-brand hover:underline flex items-center gap-1 disabled:opacity-40 disabled:no-underline"
        >
          <Icon icon={RotateCcw} size={12} /> Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <FeatureGate featureKey="filters.price_range">
          <RangeSlider
            label="Price range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={50_000}
            value={[draft.min, draft.max]}
            onChange={([min, max]) => setDraft((previous) => ({ ...previous, min, max }))}
            formatValue={formatZAR}
          />
        </FeatureGate>

        <FeatureGate featureKey="filters.mileage_range">
          <RangeSlider
            label="Mileage"
            min={MILEAGE_MIN}
            max={MILEAGE_MAX}
            step={10_000}
            value={[draft.minMileage, draft.maxMileage]}
            onChange={([minMileage, maxMileage]) =>
              setDraft((previous) => ({ ...previous, minMileage, maxMileage }))
            }
            formatValue={formatKM}
            maxLabel="Maximum"
          />
        </FeatureGate>

        <FeatureGate featureKey="filters.facets">
          <div className="pt-2">
            <RangeSlider
              label="Year from"
              min={YEAR_MIN}
              max={YEAR_MAX}
              step={1}
              value={[draft.yearFrom, YEAR_MAX]}
              onChange={([yearFrom]) => setDraft((previous) => ({ ...previous, yearFrom }))}
              formatValue={(value) => String(value)}
            />
          </div>

          <FilterFacet
            title="Make"
            defaultOpen
            options={makeOptions}
            selected={draft.makes}
            onChange={(makes) => setDraft((previous) => ({ ...previous, makes }))}
          />
          <FilterFacet
            title="Body type"
            options={bodyOptions}
            selected={draft.bodies}
            onChange={(bodies) => setDraft((previous) => ({ ...previous, bodies }))}
          />
          <FilterFacet
            title="Province"
            options={provinceOptions}
            selected={draft.provinces}
            onChange={(provinces) => setDraft((previous) => ({ ...previous, provinces }))}
          />
        </FeatureGate>

        <FeatureGate featureKey="filters.features">
          <div className="pt-2">
            <p className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-1">Features</p>
            {FEATURES.map((feature) =>
              feature.premium ? (
                <FeatureGate key={feature.id} featureKey="filters.ai_verified_only">
                  <FilterToggle
                    label={feature.label}
                    premium
                    checked={draft.features.includes(feature.id)}
                    onChange={(checked) =>
                      setDraft((previous) => ({
                        ...previous,
                        features: checked
                          ? [...previous.features, feature.id]
                          : previous.features.filter((id) => id !== feature.id),
                      }))
                    }
                  />
                </FeatureGate>
              ) : (
                <FilterToggle
                  key={feature.id}
                  label={feature.label}
                  checked={draft.features.includes(feature.id)}
                  onChange={(checked) =>
                    setDraft((previous) => ({
                      ...previous,
                      features: checked
                        ? [...previous.features, feature.id]
                        : previous.features.filter((id) => id !== feature.id),
                    }))
                  }
                />
              )
            )}
          </div>
        </FeatureGate>
      </div>

      <div className="p-5 border-t border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/50 space-y-3">
        <SmartButton featureKey="filters.apply" className="w-full" onClick={apply}>
          Show {count.toLocaleString(localeTag("en"))} {count === 1 ? "result" : "results"}
        </SmartButton>
        <SmartButton
          featureKey="filters.save_search"
          variant="secondary"
          className="w-full"
          leftIcon={Save}
          onClick={() => setIsSaveOpen(true)}
        >
          Save search
        </SmartButton>
      </div>

      <SaveSearchModal
        isOpen={isSaveOpen}
        onClose={() => setIsSaveOpen(false)}
        queryString={toQueryString(draft)}
      />
    </div>
  );
}
