"use client";

import { Gauge, MapPin, Sparkles, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Magnetic } from "@/components/motion/Magnetic";
import { ROLE_LABELS, type GarageVehicle } from "@/lib/garage";

const zar = (value: number) => `R ${value.toLocaleString("en-ZA")}`;

/**
 * One vehicle in the garage, styled by lifecycle state.
 *
 * The brief's card carried an `isVerifiedPurchase` flag rendering a "Verified"
 * trust badge sourced to "Purchased via TrueWheels Secure Pay." There is no
 * payment system, so that badge would have asserted a transaction that could not
 * have occurred. It is gone; what the user records is presented as their record.
 *
 * The card is not a link. The brief wrapped the whole card in an anchor to
 * `/garage/${id}`, which would 404: no such route exists, and the journal and
 * service log for a vehicle are shown inline instead. A delete control sits
 * outside any link, so it cannot be triggered by someone aiming at the card.
 */
export function GarageCard({
  vehicle,
  onDelete,
  onStateChange,
}: {
  vehicle: GarageVehicle;
  onDelete: () => void;
  onStateChange?: (state: GarageVehicle["state"]) => void;
}) {
  const isPast = vehicle.state === "past";
  const isDream = vehicle.state === "dream";

  return (
    <Magnetic strength={0.03}>
      <article
        className={clsx(
          "group relative bg-white dark:bg-ink-900 border rounded-2xl overflow-hidden transition-all ease-swift",
          !isPast && !isDream && "border-ink-100 dark:border-ink-800 hover:border-brand/30 hover:shadow-lift",
          isPast && "border-ink-100 dark:border-ink-800 opacity-80 hover:opacity-100",
          isDream && "border-aurora-purple/30 hover:border-aurora-purple/60 hover:shadow-glow"
        )}
      >
        {/* A generated plate rather than a photograph. The brief used Unsplash
            images of specific cars the user never owned. */}
        <div
          className={clsx(
            "relative aspect-[16/10] overflow-hidden flex items-center justify-center",
            "bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-700",
            isPast && "grayscale"
          )}
          aria-hidden="true"
        >
          <span className="font-display font-black text-4xl text-ink-400/50 dark:text-ink-600">
            {vehicle.year}
          </span>

          <div className="absolute top-3 left-3">
            {isDream ? (
              <Badge variant="ai" tone="aurora">
                <Icon icon={Sparkles} size={8} />
                Dream target
              </Badge>
            ) : isPast ? (
              <Badge variant="status" tone="ink">
                {vehicle.soldOn ? `Sold ${vehicle.soldOn}` : "Past vehicle"}
              </Badge>
            ) : (
              <Badge variant="status" tone="red">
                {ROLE_LABELS[vehicle.role]}
              </Badge>
            )}
          </div>

          {vehicle.state === "current" &&
            vehicle.role === "project" &&
            vehicle.projectProgress !== undefined && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-ink-950/20">
                <div
                  className="h-full bg-brand transition-all duration-500"
                  style={{ width: `${vehicle.projectProgress}%` }}
                  role="progressbar"
                  aria-valuenow={vehicle.projectProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Build progress, ${vehicle.projectProgress} percent`}
                />
              </div>
            )}
        </div>

        <div className="p-4">
          <h3
            className={clsx(
              "font-display font-bold truncate mb-1",
              isPast ? "text-ink-500 dark:text-ink-400" : "text-ink-900 dark:text-white"
            )}
          >
            {vehicle.year} {vehicle.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-ink-500 dark:text-ink-400 mb-3 flex-wrap">
            {vehicle.mileage !== undefined && (
              <span className="flex items-center gap-1">
                <Icon icon={Gauge} size={10} /> {vehicle.mileage.toLocaleString("en-ZA")} km
              </span>
            )}
            {vehicle.location && (
              <span className="flex items-center gap-1">
                <Icon icon={MapPin} size={10} /> {vehicle.location}
              </span>
            )}
          </div>

          <div className="flex items-end justify-between gap-3 pt-3 border-t border-ink-100 dark:border-ink-800">
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider">
                {isDream ? "Target price" : isPast ? "Sold for" : "Your value"}
              </p>
              <p
                className={clsx(
                  "text-sm font-display font-bold tabular-nums",
                  isDream ? "text-aurora-purple" : "text-ink-900 dark:text-white"
                )}
              >
                {vehicle.value !== undefined ? zar(vehicle.value) : "Not entered"}
              </p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {onStateChange && (
                <button
                  type="button"
                  onClick={() => onStateChange(nextState(vehicle.state))}
                  className="inline-flex items-center h-8 px-2.5 rounded-lg text-[11px] font-semibold text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                  aria-label={`Move ${vehicle.title} to ${nextState(vehicle.state)}`}
                >
                  Move
                </button>
              )}
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-ink-400 hover:bg-semantic-error/10 hover:text-semantic-error transition-colors"
                aria-label={`Remove ${vehicle.title} from the garage`}
              >
                <Icon icon={Trash2} size={14} />
              </button>
            </div>
          </div>
        </div>
      </article>
    </Magnetic>
  );
}

const ORDER: GarageVehicle["state"][] = ["current", "past", "dream"];

function nextState(state: GarageVehicle["state"]): GarageVehicle["state"] {
  return ORDER[(ORDER.indexOf(state) + 1) % ORDER.length];
}
