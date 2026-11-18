"use client";

import Link from "next/link";
import { Car, MapPin, Gauge } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { photoForVehicle } from "@/lib/vehicle-photos";
import { listingRef } from "@/lib/seller";
import { localeTag } from "@/lib/i18n/locale";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * A listing embedded in a post.
 *
 * The photograph is the make's reference photograph, not this vehicle, so the
 * alt text says which car it shows. Presenting a library image as the car for
 * sale is the kind of thing a buyer only discovers after travelling to see it.
 */
export function VehicleEmbed({ vehicle }: { vehicle: DemoVehicle }) {
  const photo = photoForVehicle(vehicle);
  const price = `R ${vehicle.price.toLocaleString(localeTag("en"))}`;

  return (
    <Link
      href={`/vehicles/${vehicle.id}`}
      className="group flex gap-3 p-3 rounded-xl border border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/50 hover:border-brand/30 transition-colors mt-3"
    >
      <div className="relative w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-ink-100 dark:bg-ink-800">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo.url}
            alt={`${photo.subject}, reference photograph`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-400">
            <Icon icon={Car} size={18} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Icon icon={Car} size={9} /> Listing {listingRef(vehicle)}
          </p>
          <h4 className="text-sm font-bold text-ink-900 dark:text-white leading-tight group-hover:text-brand transition-colors line-clamp-2">
            {vehicle.title}
          </h4>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-ink-500 dark:text-ink-400 mt-1">
            <span className="flex items-center gap-1">
              <Icon icon={Gauge} size={10} /> {vehicle.mileage.toLocaleString(localeTag("en"))} km
            </span>
            <span className="flex items-center gap-1">
              <Icon icon={MapPin} size={10} /> {vehicle.location}
            </span>
          </div>
        </div>
        <p className="text-base font-display font-bold text-ink-900 dark:text-white tabular-nums mt-1.5">
          {price}
        </p>
      </div>
    </Link>
  );
}
