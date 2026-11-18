"use client";

import Link from "next/link";
import { Calendar, Fuel, Gauge, MapPin } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import type { DemoVehicle } from "@/lib/demo/vehicles";
import { localeTag } from "@/lib/i18n/locale";

interface VehicleListItemProps {
  vehicle: DemoVehicle;
  isFeatured?: boolean;
}

export function VehicleListItem({ vehicle, isFeatured }: VehicleListItemProps) {
  const price = `R ${vehicle.price.toLocaleString(localeTag("en"))}`;
  const mileage = `${vehicle.mileage.toLocaleString(localeTag("en"))} km`;

  return (
    <Link
      // No detail route exists yet, so this follows the same convention as the
      // search index: land on the marketplace filtered to this vehicle.
      href={`/marketplace?q=${encodeURIComponent(vehicle.title)}`}
      className={clsx(
        "block group rounded-2xl border transition-all ease-swift",
        "bg-white dark:bg-ink-900 border-ink-100 dark:border-ink-800 hover:border-brand/30 hover:shadow-lift",
        isFeatured && "border-brand/20"
      )}
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Placeholder media, matching VehicleCard: the demo set ships no photos. */}
        <div className="relative w-full sm:w-56 h-40 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-700 flex items-center justify-center">
          <span className="font-display font-bold text-ink-400 dark:text-ink-500 text-lg">{vehicle.year}</span>
          {isFeatured && (
            <span className="absolute top-2 left-2">
              <Badge variant="trust" tone="red">Featured</Badge>
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white truncate group-hover:text-brand transition-colors">
              {vehicle.title}
            </h3>

            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-3">
              <span className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-300">
                <Icon icon={Calendar} size={12} /> {vehicle.year}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-300">
                <Icon icon={Gauge} size={12} /> {mileage}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-300">
                <Icon icon={Fuel} size={12} /> Petrol
              </span>
              <span className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-300 truncate">
                <Icon icon={MapPin} size={12} /> {vehicle.location}
              </span>
            </div>

            {/* A "Verified dealer" badge sourced to "CIPC and FICA verified" used
                to sit here, shown on every third listing by list position. CIPC and
                FICA are real institutions and nothing in this project queries
                either. A badge that appears by index is decoration, not evidence. */}
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1 flex-shrink-0">
            <p className="text-xl font-display font-bold text-ink-900 dark:text-white tabular-nums">{price}</p>
            <span className="text-[10px] font-medium text-ink-400 uppercase tracking-wide">
              Excl. licence and reg
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
