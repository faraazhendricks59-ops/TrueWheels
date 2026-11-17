import { Gauge, MapPin } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { CountUp } from "@/components/motion/CountUp";
import type { DemoVehicle } from "@/lib/demo/vehicles";

export function VehicleCard({ vehicle }: { vehicle: DemoVehicle }) {
  return (
    <article className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4 shadow-lift overflow-hidden transition-shadow hover:shadow-lift">
      {/* Aspect-locked media box, matching VehicleCardSkeleton so the loading
          swap causes no layout shift. */}
      <div className="aspect-[16/10] w-full mb-4 rounded-xl bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-700 flex items-center justify-center">
        <span className="font-display font-bold text-ink-400 dark:text-ink-500 text-lg">
          {vehicle.year}
        </span>
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
