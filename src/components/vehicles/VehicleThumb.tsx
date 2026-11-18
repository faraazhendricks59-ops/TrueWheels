import { photoForVehicle } from "@/lib/vehicle-photos";
import { clsx } from "clsx";

/**
 * The representative photograph for a listing, at thumbnail size.
 *
 * The marketplace grid showed a real photograph while the home rails and the
 * "similar cars" widget showed a grey gradient with the year in it, so the same
 * vehicle looked finished in one place and unfinished in another. This renders the
 * photo wherever a listing is shown in miniature, and falls back to the year only
 * when no photograph exists for the make.
 *
 * The image is decorative here: the card it sits in already names the vehicle, so
 * the alt text is empty rather than a second copy of the title.
 */
export function VehicleThumb({
  vehicle,
  className,
  sizes,
}: {
  vehicle: { id: string; title: string; year: number };
  className?: string;
  sizes?: string;
}) {
  const photo = photoForVehicle(vehicle);

  return (
    <span
      className={clsx(
        "relative flex items-center justify-center overflow-hidden bg-ink-100 dark:bg-ink-800",
        className,
      )}
    >
      {photo ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={photo.url}
          alt=""
          loading="lazy"
          decoding="async"
          sizes={sizes}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-display font-semibold text-ink-400 dark:text-ink-500">
          {vehicle.year}
        </span>
      )}
    </span>
  );
}
