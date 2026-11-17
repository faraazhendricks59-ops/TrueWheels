"use client";

import { Fragment } from "react";
import { Plus, X } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { SpecRow, type SpecRowData } from "./SpecRow";
import {
  METRIC_DIRECTIONS,
  SPEC_CATEGORIES,
  bestOverall,
  specValues,
  specsFor,
  type SpecCategory,
} from "@/lib/comparison-data";
import type { DemoVehicle } from "@/lib/demo/vehicles";
import { localeTag } from "@/lib/i18n/locale";

interface ComparisonTableProps {
  vehicles: DemoVehicle[];
  onRemove: (id: string) => void;
  onAdd: () => void;
}

export function ComparisonTable({ vehicles, onRemove, onAdd }: ComparisonTableProps) {
  const best = bestOverall(vehicles);

  const rowsFor = (category: SpecCategory): SpecRowData[] => {
    const keys = Object.keys(specValues(vehicles[0], category));
    return keys.map((key) => ({
      key,
      label: key,
      direction: METRIC_DIRECTIONS[key] ?? "higher",
      values: vehicles.map((vehicle) => specValues(vehicle, category)[key]),
    }));
  };

  return (
    <div className="w-full overflow-x-auto hide-scrollbar rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-lift">
      <table className="w-full border-collapse min-w-[720px]">
        <caption className="sr-only">
          Side-by-side specification comparison of {vehicles.length} vehicles. The best value in
          each row is marked.
        </caption>

        <thead>
          <tr>
            <th
              scope="col"
              className="sticky top-0 left-0 z-30 bg-ink-50 dark:bg-ink-950 border-b border-r border-ink-100 dark:border-ink-800 p-4 w-44 text-left"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-ink-400 uppercase tracking-wider">
                  Specifications
                </span>
                <FeatureGate featureKey="compare.add_vehicle">
                  <button
                    type="button"
                    onClick={onAdd}
                    aria-label="Add a vehicle to the comparison"
                    className="w-7 h-7 rounded-lg bg-brand text-white flex items-center justify-center hover:bg-brand-red-dark transition-colors"
                  >
                    <Icon icon={Plus} size={14} />
                  </button>
                </FeatureGate>
              </span>
            </th>

            {vehicles.map((vehicle) => {
              const isBest = best?.vehicle.id === vehicle.id;
              return (
                <th
                  key={vehicle.id}
                  scope="col"
                  className="sticky top-0 z-20 bg-ink-50 dark:bg-ink-950 border-b border-ink-100 dark:border-ink-800 p-4 min-w-[220px] align-top"
                >
                  <span className="flex flex-col items-center text-center">
                    <span className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-700 flex items-center justify-center mb-3">
                      <span className="font-display font-bold text-ink-400 dark:text-ink-500 text-lg">
                        {vehicle.year}
                      </span>
                      <FeatureGate featureKey="compare.remove_vehicle">
                        <button
                          type="button"
                          onClick={() => onRemove(vehicle.id)}
                          aria-label={`Remove ${vehicle.title} from the comparison`}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-ink-950/50 backdrop-blur text-white flex items-center justify-center hover:bg-semantic-error transition-colors"
                        >
                          <Icon icon={X} size={12} />
                        </button>
                      </FeatureGate>
                    </span>
                    <span className="text-sm font-bold text-ink-900 dark:text-white leading-tight mb-1 line-clamp-2">
                      {vehicle.title}
                    </span>
                    <span className="text-lg font-display font-bold text-brand tabular-nums">
                      R {vehicle.price.toLocaleString(localeTag("en"))}
                    </span>
                    {isBest && (
                      <span className="mt-1.5">
                        <Badge variant="live" tone="red" dot pulse>
                          Best overall
                        </Badge>
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {/* Key figures the listings actually hold, before the derived specs. */}
          <SpecRow
            row={{
              key: "price",
              label: "Price",
              direction: "lower",
              values: vehicles.map((vehicle) => vehicle.price),
              format: (value) => `R ${value.toLocaleString(localeTag("en"))}`,
            }}
          />
          <SpecRow
            row={{
              key: "year",
              label: "Year",
              direction: "higher",
              values: vehicles.map((vehicle) => vehicle.year),
              format: (value) => String(value),
            }}
          />
          <SpecRow
            row={{
              key: "mileage",
              label: "Mileage",
              direction: "lower",
              values: vehicles.map((vehicle) => vehicle.mileage),
              format: (value) => `${value.toLocaleString(localeTag("en"))} km`,
            }}
          />

          {SPEC_CATEGORIES.map((category) => (
            <Fragment key={category.id}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={vehicles.length + 1}
                  className="bg-ink-50/50 dark:bg-ink-950/50 text-left px-4 py-3 border-b border-ink-100 dark:border-ink-800"
                >
                  <span className="text-xs font-bold text-ink-400 uppercase tracking-wider">
                    {category.label}
                  </span>
                </th>
              </tr>
              {rowsFor(category.id).map((row) => (
                <SpecRow key={`${category.id}-${row.key}`} row={row} />
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>

      {best && (
        <div className="p-4 border-t border-ink-100 dark:border-ink-800 bg-semantic-success/5">
          <p className="text-xs font-bold text-ink-900 dark:text-white mb-1">
            Best overall: {best.vehicle.title}
          </p>
          <p className="text-xs text-ink-500 dark:text-ink-300">
            {best.reasons.join(" · ")}. Scored on price (40%), mileage (30%), age (15%) and power
            (15%), each measured against the vehicles shown.
          </p>
        </div>
      )}
    </div>
  );
}
