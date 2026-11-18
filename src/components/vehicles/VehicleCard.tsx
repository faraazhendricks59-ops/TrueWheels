import Link from "next/link";
import { clsx } from "clsx";
import { MapPin } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { photoForVehicle } from "@/lib/vehicle-photos";
import { vehicleBodyType } from "@/lib/vehicle-facets";
import { localeTag } from "@/lib/i18n/locale";
import type { DemoVehicle } from "@/lib/demo/vehicles";

/**
 * A listing card, built to read like a catalogue entry rather than a poster.
 *
 * What changed and why, against the version this replaces:
 *
 *  - It did not link anywhere. The whole card is now a link to the vehicle's page,
 *    which is the first thing anyone expects a listing card to do.
 *  - The price counted up on load (CountUp). An animated number on every card in a
 *    grid is a toy effect and it delays the one figure the buyer came for; it is now
 *    printed plainly.
 *  - The photograph carried a translucent "Photo: <author> · CC BY-SA 4.0" strip
 *    across the bottom of every image. The attribution must stay (the images are
 *    CC BY-SA), but it belongs in fine print, not stamped over the car. It now sits
 *    below the image at caption size, where it reads as a credit and not as a defect.
 *  - Year, mileage and location were spread across two rows with a pin and a gauge.
 *    They are now one muted specification line, the way a printed listing reads:
 *    "2019 · 62 000 km · Hatchback · Sandton, GP".
 *
 * Deliberately absent: any "Live", "Verified", "Featured" or countdown badge. None
 * of those signals has a system behind it (see src/lib/listing-activity.ts and
 * src/lib/seller.ts), and a badge that appears on every card carries no information.
 */
export function VehicleCard({ vehicle }: { vehicle: DemoVehicle }) {
  const photo = photoForVehicle(vehicle);
  const price = `R ${vehicle.price.toLocaleString(localeTag("en"))}`;

  return (
    <article className="group h-full">
      <Link
        href={`/vehicles/${vehicle.id}`}
        className={clsx(
          "flex h-full flex-col overflow-hidden rounded-xl border border-ink-200/70 bg-white",
          // A single, crisp elevation step on hover — the card lifts off the page a
          // couple of millimetres. Deliberately not a large blur: a big shadow reads
          // as a floating sticker, a small tight one as a physical card.
          "transition-[border-color,box-shadow,transform] duration-200 ease-swift",
          "hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-card",
          "dark:border-ink-800 dark:bg-ink-900 dark:hover:border-ink-700",
        )}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-100 dark:bg-ink-800">
          {photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photo.url}
              alt={`${vehicle.title}, shown as a ${photo.subject}`}
              loading="lazy"
              decoding="async"
              width={photo.width}
              height={photo.height}
              className="h-full w-full object-cover transition-transform duration-300 ease-swift group-hover:scale-[1.03]"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-ink-300 dark:text-ink-600">
              {vehicle.year}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-3.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 text-sm font-semibold leading-snug text-ink-900 group-hover:text-brand dark:text-white">
              {vehicle.title}
            </h3>
            <p className="flex-shrink-0 text-base font-bold tabular-nums text-ink-900 dark:text-white">
              {price}
            </p>
          </div>

          <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
            {vehicle.year} &middot; {vehicle.mileage.toLocaleString(localeTag("en"))} km &middot;{" "}
            {vehicleBodyType(vehicle)}
          </p>

          <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-500 dark:text-ink-400">
            <Icon icon={MapPin} size={12} />
            {vehicle.location}
          </p>

          {photo && (
            <p className="mt-auto pt-3 text-[10px] leading-tight text-ink-400 dark:text-ink-500">
              Photo: {photo.attribution}, {photo.licence}. Representative {photo.subject}, not this
              specific vehicle.
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
