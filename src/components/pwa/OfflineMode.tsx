"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Car, Check, Heart, RefreshCw, Search, WifiOff, X } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { SmartButton } from "@/components/ui/SmartButton";
import { VehicleThumb } from "@/components/vehicles/VehicleThumb";
import { DataSaverToggle } from "@/components/pwa/DataSaverMode";
import { OFFLINE_CAPABILITIES, byDemoId, formatRand } from "@/lib/pwa";
import { readSavedSearches, type SavedSearch } from "@/lib/saved-searches";
import { type DemoVehicle } from "@/lib/demo/vehicles";

/**
 * The offline page.
 *
 * The brief's version showed a hard-coded "CACHED_GARAGE" of two vehicles with
 * invented prices and Unsplash images, a hard-coded list of three saved searches, and
 * a claim that "your saved vehicles and garage are still available". None of that data
 * was the reader's, and the two cars belonged to nobody.
 *
 * What is real: this project keeps the garage, the saved searches and the recently
 * viewed list on the device, so those genuinely survive a lost connection. This page
 * reads them. If the reader has none, it says so rather than inventing some.
 *
 * It also states plainly what will not work offline, because the honest failure is more
 * useful than a hopeful screen: search, a new vehicle, and messaging all need the
 * network.
 */
export function OfflineMode() {
  const [garage, setGarage] = useState<DemoVehicle[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [viewed, setViewed] = useState<DemoVehicle[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // These reads are synchronous and local; a failure just leaves the lists empty.
    try {
      const rawGarage = window.localStorage.getItem("truewheels_garage_v1");
      if (rawGarage) {
        const parsed = JSON.parse(rawGarage) as { vehicles?: { vehicleId?: string }[] };
        const ids = (parsed.vehicles ?? [])
          .map((entry) => entry.vehicleId)
          .filter((id): id is string => typeof id === "string");
        setGarage(ids.map(byDemoId).filter((v): v is DemoVehicle => Boolean(v)).slice(0, 4));
      }

      const rawViewed = window.localStorage.getItem("truewheels_viewed_vehicles");
      if (rawViewed) {
        const ids = JSON.parse(rawViewed) as unknown;
        if (Array.isArray(ids)) {
          setViewed(
            ids
              .filter((id): id is string => typeof id === "string")
              .map(byDemoId)
              .filter((v): v is DemoVehicle => Boolean(v))
              .slice(0, 3)
          );
        }
      }
    } catch {
      // Corrupt local data must not break the offline page.
    }

    setSavedSearches(readSavedSearches().slice(0, 4));
    setIsHydrated(true);
  }, []);

  const hasAnything = garage.length > 0 || viewed.length > 0 || savedSearches.length > 0;

  return (
    <div className="min-h-screen bg-surface-paper dark:bg-ink-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-ink-100 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 flex items-center justify-center mx-auto mb-6">
            <Icon icon={WifiOff} size={32} className="text-ink-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-ink-900 dark:text-white mb-2">
            You are offline
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-300 max-w-md mx-auto leading-relaxed">
            Some of TrueWheels still works without a connection, because parts of it are
            stored on this device. Here is exactly what does.
          </p>
        </div>

        {/* What works, and what does not. */}
        <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-bold text-ink-900 dark:text-white mb-3">
            With no connection
          </h2>
          <ul className="space-y-2">
            {OFFLINE_CAPABILITIES.map((item) => (
              <li key={item.text} className="flex items-start gap-2.5">
                <span
                  className={
                    item.works
                      ? "mt-0.5 text-semantic-success flex-shrink-0"
                      : "mt-0.5 text-ink-400 flex-shrink-0"
                  }
                >
                  <Icon icon={item.works ? Check : X} size={14} strokeWidth={2.5} />
                </span>
                <span className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {isHydrated && !hasAnything && (
          <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-8 text-center mb-6">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Nothing is saved on this device yet, so there is nothing to show offline.
              Anything you save — a vehicle, a search, your garage — will be here next
              time.
            </p>
          </div>
        )}

        {garage.length > 0 && (
          <section className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon icon={Car} size={16} className="text-brand" />
                <h2 className="text-sm font-bold text-ink-900 dark:text-white">Your garage</h2>
              </div>
              <Badge variant="status" tone="ink">On this device</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {garage.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="rounded-xl overflow-hidden border border-ink-100 dark:border-ink-800"
                >
                  <div className="aspect-[16/10] bg-ink-100 dark:bg-ink-800">
                    <VehicleThumb vehicle={vehicle} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-ink-900 dark:text-white truncate">
                      {vehicle.title}
                    </p>
                    <p className="text-xs font-display font-bold text-brand mt-0.5 tabular-nums">
                      {formatRand(vehicle.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {savedSearches.length > 0 && (
          <section className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon={Search} size={16} className="text-aurora-blue" />
              <h2 className="text-sm font-bold text-ink-900 dark:text-white">Saved searches</h2>
            </div>
            <div className="space-y-2">
              {savedSearches.map((search) => (
                <div
                  key={search.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800"
                >
                  <span className="text-xs font-semibold text-ink-700 dark:text-ink-200 truncate">
                    {search.name}
                  </span>
                  <span className="text-[10px] text-ink-400 flex-shrink-0">
                    Opens when you are back online
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {viewed.length > 0 && (
          <section className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon={Heart} size={16} className="text-semantic-error" />
              <h2 className="text-sm font-bold text-ink-900 dark:text-white">Recently viewed</h2>
            </div>
            <div className="space-y-2">
              {viewed.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  href={`/vehicles/${vehicle.id}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800"
                >
                  <span className="text-xs font-semibold text-ink-700 dark:text-ink-200 truncate">
                    {vehicle.title}
                  </span>
                  <span className="text-[10px] font-mono text-ink-400 flex-shrink-0 tabular-nums">
                    {formatRand(vehicle.price)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="text-center">
          <SmartButton
            featureKey="pwa.retry_connection"
            onClick={() => window.location.reload()}
            leftIcon={RefreshCw}
            className="!h-12 !px-8"
          >
            Try again
          </SmartButton>
        </div>

        {/* The one setting worth offering from here: a reader who has just lost a
            connection is the most likely to want the heavy assets switched off. */}
        <DataSaverToggle className="mt-6 text-left" />
      </div>
    </div>
  );
}
