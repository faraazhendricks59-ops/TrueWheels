"use client";

import Link from "next/link";
import { Heart, Trash2, ArrowRight, Scale } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Sheet } from "@/components/ui/Sheet";
import { usePersonalization } from "@/components/providers/PersonalizationProvider";
import { DEMO_VEHICLES } from "@/lib/demo/vehicles";
import { photoForVehicle } from "@/lib/vehicle-photos";
import { listingRef } from "@/lib/seller";

const zar = (value: number) => `R ${value.toLocaleString("en-ZA")}`;

/**
 * The saved vehicles for this browser.
 *
 * The brief shipped two hardcoded vehicles, one with an Unsplash image and a
 * "-R 15k price drop" badge, and a header tile reading "Total Price Drops -R 15k".
 * The list was used whenever the real saved list was empty, so a first-time
 * visitor would have been shown two cars they never saved, described as theirs.
 *
 * There is also no price history in this project, so a price drop cannot be
 * computed. A price that fell is a claim about the market, and showing a saving
 * that did not happen is a strong incentive to act on a false premise.
 *
 * So the drawer shows the vehicles that are actually saved, from the provider,
 * with the real photograph for the make and the real listing reference.
 */
export function DigitalGarageDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { savedVehicles, toggleSave, isHydrated } = usePersonalization();

  const saved = savedVehicles
    .map((id) => DEMO_VEHICLES.find((vehicle) => vehicle.id === id))
    .filter((vehicle): vehicle is (typeof DEMO_VEHICLES)[number] => Boolean(vehicle));

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Your garage" side="right">
      <div className="space-y-4">
        <div className="p-4 bg-ink-50 dark:bg-ink-950 rounded-xl border border-ink-100 dark:border-ink-800">
          <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1">
            Saved vehicles
          </p>
          <p className="text-2xl font-display font-bold text-ink-900 dark:text-white tabular-nums">
            {isHydrated ? saved.length : "—"}
          </p>
        </div>

        {!isHydrated ? (
          <p className="text-xs text-ink-500 dark:text-ink-400 py-6 text-center">
            Loading your garage…
          </p>
        ) : saved.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-xl bg-ink-50 dark:bg-ink-950 border border-dashed border-ink-200 dark:border-ink-800">
            <div className="w-12 h-12 mx-auto rounded-full bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 flex items-center justify-center text-ink-400 mb-3">
              <Icon icon={Heart} size={20} />
            </div>
            <p className="text-sm font-semibold text-ink-900 dark:text-white mb-1">
              Nothing saved yet
            </p>
            <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
              Save a vehicle from its page and it will appear here. Saved vehicles
              are kept in this browser on this device only.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {saved.map((vehicle) => {
              const photo = photoForVehicle(vehicle);
              return (
                <li
                  key={vehicle.id}
                  className="flex gap-3 p-3 rounded-xl border border-ink-100 dark:border-ink-800 hover:bg-ink-50 dark:hover:bg-ink-950 transition-colors"
                >
                  <Link
                    href={`/vehicles/${vehicle.id}`}
                    onClick={onClose}
                    className="w-20 h-16 rounded-lg overflow-hidden bg-ink-100 dark:bg-ink-800 flex-shrink-0"
                  >
                    {photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo.url}
                        alt={`${vehicle.title}, photograph`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/vehicles/${vehicle.id}`}
                        onClick={onClose}
                        className="text-sm font-bold text-ink-900 dark:text-white hover:text-brand transition-colors line-clamp-2"
                      >
                        {vehicle.title}
                      </Link>
                      <p className="text-sm font-display font-bold text-brand mt-0.5 tabular-nums">
                        {zar(vehicle.price)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] font-mono text-ink-400">
                        {listingRef(vehicle)}
                      </span>
                      <div className="flex gap-1">
                        <Link
                          href={`/compare?v=${vehicle.id}`}
                          onClick={onClose}
                          aria-label={`Compare the ${vehicle.title}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-400 hover:text-brand hover:bg-brand/10 transition-colors"
                        >
                          <Icon icon={Scale} size={13} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleSave(vehicle.id)}
                          aria-label={`Remove the ${vehicle.title} from your garage`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-400 hover:text-semantic-error hover:bg-semantic-error/10 transition-colors"
                        >
                          <Icon icon={Trash2} size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <p className="text-[10px] text-ink-400 leading-relaxed">
          Prices are the asking prices on each listing. TrueWheels does not track
          price history, so it cannot tell you whether a price has changed.
        </p>

        <div className="pt-4 border-t border-ink-100 dark:border-ink-800 space-y-2">
          <Link
            href="/marketplace"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full min-h-[44px] rounded-xl border border-ink-100 dark:border-ink-800 text-sm font-semibold text-ink-600 dark:text-ink-300 hover:border-brand/40 hover:text-brand transition-colors"
          >
            Browse the marketplace
            <Icon icon={ArrowRight} size={14} />
          </Link>
          <Link
            href="/compare"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full min-h-[44px] rounded-xl text-xs font-semibold text-ink-500 dark:text-ink-400 hover:text-brand transition-colors"
          >
            <Icon icon={Scale} size={13} />
            Compare vehicles
          </Link>
        </div>
      </div>
    </Sheet>
  );
}
