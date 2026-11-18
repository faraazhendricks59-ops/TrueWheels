"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { photoForVehicle } from "@/lib/vehicle-photos";
import { vehicleBodyType, vehicleMake } from "@/lib/vehicle-facets";
import { localeTag } from "@/lib/i18n/locale";
import type { DemoVehicle } from "@/lib/demo/vehicles";

interface VehicleListItemProps {
  vehicle: DemoVehicle;
}

/**
 * The row layout for the listing list, for scanning many results at once.
 *
 * The shape follows the classified-listing convention AutoTrader uses: the
 * photograph holds the left, the title and a row of specification pills sit in
 * the middle, and the price is the largest text in the row, right-aligned so a
 * column of prices can be compared down the page. That is the whole point of a
 * list view — price and mileage line up so the eye can scan them.
 *
 * Two things were wrong here. The link pointed at
 * `/marketplace?q=<title>`, a search for the vehicle's own name, rather than its
 * page — so opening a listing dropped the buyer into a one-result search. And the
 * media box was a grey gradient with the year in it, while the grid card beside it
 * showed a photograph, so the same vehicle looked like two different products
 * depending on the view. Both now match the grid card: a real link, and the same
 * representative photo, at the same size, with the credit as fine print.
 *
 * The "Featured" badge that appeared on every fifth row by list position is gone.
 * Nothing marks a listing as featured; it was decoration assigned by index.
 */
export function VehicleListItem({ vehicle }: VehicleListItemProps) {
  const photo = photoForVehicle(vehicle);
  const price = `R ${vehicle.price.toLocaleString(localeTag("en"))}`;
  const mileage = `${vehicle.mileage.toLocaleString(localeTag("en"))} km`;

  return (
    <Link
      href={`/vehicles/${vehicle.id}`}
      className="group block rounded-xl border border-ink-200/70 bg-white transition-colors hover:border-ink-300 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-ink-700"
    >
      <div className="flex gap-4 p-3">
        <div className="relative h-32 w-44 flex-shrink-0 overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-800">
          {photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photo.url}
              alt={`${vehicle.title}, shown as a ${photo.subject}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 ease-swift group-hover:scale-[1.03]"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-ink-300 dark:text-ink-600">
              {vehicle.year}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-bold text-ink-900 group-hover:text-brand dark:text-white">
                {vehicle.title}
              </h3>
              <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-ink-500 dark:text-ink-300">
                <span className="rounded-full bg-ink-100 px-2 py-0.5 font-medium dark:bg-ink-800">
                  {vehicle.year}
                </span>
                <span className="rounded-full bg-ink-100 px-2 py-0.5 font-medium tabular-nums dark:bg-ink-800">
                  {mileage}
                </span>
                <span className="rounded-full bg-ink-100 px-2 py-0.5 font-medium dark:bg-ink-800">
                  {vehicleBodyType(vehicle)}
                </span>
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="font-display text-xl font-bold tabular-nums leading-none text-ink-900 dark:text-white">
                {price}
              </p>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500 dark:text-ink-300">
            <span className="flex items-center gap-1">
              <Icon icon={MapPin} size={12} />
              {vehicle.location}
            </span>
            <span>{vehicleMake(vehicle)}</span>
          </div>

          {photo && (
            <p className="mt-1 text-[10px] leading-tight text-ink-400 dark:text-ink-300">
              Photo: {photo.attribution}, {photo.licence}. Representative {photo.subject}.
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
