import { Gauge, MapPin } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { CountUp } from "@/components/motion/CountUp";
import { photoForVehicle } from "@/lib/vehicle-photos";
import type { DemoVehicle } from "@/lib/demo/vehicles";

export function VehicleCard({ vehicle }: { vehicle: DemoVehicle }) {
  const photo = photoForVehicle(vehicle);

  return (
    <article className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4 shadow-lift overflow-hidden transition-shadow hover:shadow-lift">
      {/* Aspect-locked media box, matching VehicleCardSkeleton so the loading
          swap causes no layout shift. A plain img is used because the source
          dimensions are already small; next/image would add no value here. */}
      <div className="aspect-[16/10] w-full mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-700 relative">
        {photo ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={`${vehicle.title}, shown as a ${photo.subject}`}
              loading="lazy"
              decoding="async"
              width={photo.width}
              height={photo.height}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 left-0 right-0 px-2 py-1 text-[9px] leading-tight text-white/90 bg-black/45 backdrop-blur-[2px] truncate">
              Photo: {photo.attribution} · {photo.licence}
            </span>
          </>
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-ink-400 dark:text-ink-500 text-lg">
            {vehicle.year}
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-ink-900 dark:text-white truncate mb-1">
        {vehicle.title}
      </h3>
      <p className="text-xl font-display font-bold text-ink-900 dark:text-white mb-3 tabular-nums">
        R <CountUp end={vehicle.price} duration={900} />
      </p>

      <div className="flex items-center justify-between gap-2 text-ink-500 dark:text-ink-400">
        <span className="flex items-center gap-1 text-xs">
          <Icon icon={Gauge} size={12} />
          {vehicle.mileage.toLocaleString("en-ZA")} km
        </span>
        <span className="flex items-center gap-1 text-xs truncate">
          <Icon icon={MapPin} size={12} />
          {vehicle.location}
        </span>
        <Badge variant="live" tone="red" dot pulse>
          Live
        </Badge>
      </div>
    </article>
  );
}
