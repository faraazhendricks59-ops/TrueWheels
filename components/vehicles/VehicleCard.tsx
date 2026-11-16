import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Calendar, Gauge, MapPin, Sparkles } from "lucide-react";
import {
  formatMileage,
  formatPrice,
  vehicleTitle,
  type Vehicle,
} from "@/lib/vehicles/demo-vehicles";

interface VehicleCardProps {
  vehicle: Vehicle;
  /** Above-the-fold cards should not lazy-load their hero image. */
  priority?: boolean;
  /**
   * Badge copy is passed in rather than read from a hook so the card stays
   * presentational and can render from a server component.
   */
  featuredLabel: string;
  verifiedLabel: string;
}

/**
 * Marketplace listing card.
 *
 * The markup deliberately mirrors VehicleCardSkeleton — same aspect ratio, same
 * three-line footer — so swapping the skeleton for real data causes no layout
 * shift.
 */
export function VehicleCard({
  vehicle,
  priority = false,
  featuredLabel,
  verifiedLabel,
}: VehicleCardProps) {
  const title = vehicleTitle(vehicle);
  const href = `/vehicles/${vehicle.id}`;

  return (
    <article className="group overflow-hidden rounded-xl border border-brand-silver bg-surface-white shadow-card transition hover:shadow-card-hover">
      <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red">
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-grey">
          <Image
            src={vehicle.images[0]}
            alt={title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />

          {vehicle.featured && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-red px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-card">
              <Sparkles size={11} aria-hidden="true" />
              {featuredLabel}
            </span>
          )}

          {vehicle.dealer.verified && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-surface-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-graphite shadow-card">
              <BadgeCheck size={11} className="text-brand-red" aria-hidden="true" />
              {verifiedLabel}
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="truncate text-sm font-semibold leading-snug text-brand-graphite" title={title}>
            {title}
          </h3>

          <p className="mt-1 truncate text-lg font-extrabold tracking-tight text-brand-graphite">
            {formatPrice(vehicle.price)}
          </p>

          <div className="mt-3 flex items-center justify-between border-t border-brand-silver pt-3 text-xs text-neutral-muted">
            <span className="inline-flex items-center gap-1">
              <Gauge size={13} aria-hidden="true" />
              {formatMileage(vehicle.mileage)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={13} aria-hidden="true" />
              {vehicle.year}
            </span>
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin size={13} className="flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{vehicle.city}</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
