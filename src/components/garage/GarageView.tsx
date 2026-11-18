"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Car, Info } from "lucide-react";
import { useGarage } from "@/components/providers/GarageProvider";
import { GarageLayout } from "./GarageLayout";
import { GarageCard } from "./GarageCard";
import { BuildJournal } from "./BuildJournal";
import { ServiceLogPanel } from "./ServiceLogPanel";
import { AddVehicleModal, type NewVehicle } from "./AddVehicleModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { useToast } from "@/components/ui/Toast";
import {
  GARAGE_EMPTY,
  LOCAL_ONLY,
  NO_PAYMENT_CLAIM,
  NO_PREFILLED,
  PROGRESS_EXPLAINED,
  garageTotals,
  type GarageState,
} from "@/lib/garage";

const PANEL_ID = "garage-tabpanel";

/**
 * The garage.
 *
 * Composed from the user's own stored entries. The brief drove this from a
 * MOCK_GARAGE of four vehicles with Unsplash photographs and hardcoded stats, and
 * showed a build journal belonging to a car the user had never seen.
 *
 * The one structural difference worth noting: the brief rendered a single build
 * journal for whichever car happened to be a "Project Car". A garage can hold
 * more than one, so each current vehicle that has a journal or a service log gets
 * its own panel, and a vehicle with neither simply does not show one.
 */
export function GarageView() {
  const {
    garage,
    isHydrated,
    addVehicle,
    updateVehicle,
    removeVehicle,
    addJournalEntry,
    removeJournalEntry,
    addServiceEntry,
    removeServiceEntry,
  } = useGarage();
  const { toast } = useToast();
  const [activeState, setActiveState] = useState<GarageState>("current");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const totals = useMemo(() => garageTotals(garage), [garage]);

  const counts = useMemo(
    () => ({
      current: garage.vehicles.filter((v) => v.state === "current").length,
      past: garage.vehicles.filter((v) => v.state === "past").length,
      dream: garage.vehicles.filter((v) => v.state === "dream").length,
    }),
    [garage.vehicles]
  );

  const visible = garage.vehicles.filter((vehicle) => vehicle.state === activeState);

  const handleAdd = (vehicle: NewVehicle) => {
    addVehicle(vehicle);
    setActiveState(vehicle.state);
    toast({ variant: "success", title: "Added to your garage", description: vehicle.title });
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-ink-900 dark:text-white">
          Digital garage
        </h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 max-w-2xl">{NO_PREFILLED}</p>
      </header>

      {!isHydrated ? (
        <p className="text-sm text-ink-500 dark:text-ink-400 py-16 text-center">
          Loading your garage…
        </p>
      ) : (
        <GarageLayout
          activeState={activeState}
          onStateChange={setActiveState}
          totals={totals}
          panelId={PANEL_ID}
          onAdd={() => setIsAddOpen(true)}
          counts={counts}
        >
          {visible.length === 0 ? (
            <Reveal variant="up">
              <EmptyState
                icon={Car}
                title={`Nothing in ${activeState === "current" ? "your current garage" : activeState === "past" ? "past vehicles" : "dream cars"} yet`}
                description={
                  activeState === "current"
                    ? GARAGE_EMPTY
                    : "Add a vehicle and move it here, or switch it to this lifecycle stage from its card."
                }
                actionLabel="Add a vehicle"
                actionFeatureKey="garage.add_trigger"
                onAction={() => setIsAddOpen(true)}
              />
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((vehicle) => (
                <GarageCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onDelete={() => {
                    removeVehicle(vehicle.id);
                    toast({
                      variant: "info",
                      title: "Removed from your garage",
                      description: vehicle.title,
                    });
                  }}
                  onStateChange={(state) => updateVehicle(vehicle.id, { state })}
                />
              ))}
            </div>
          )}

          {/* Journals and service logs, per current vehicle that has one. */}
          {activeState === "current" && visible.length > 0 && (
            <div className="space-y-8 mt-10">
              {visible.map((vehicle) => {
                const journal = garage.journals[vehicle.id] ?? [];
                const services = garage.services[vehicle.id] ?? [];
                const isProject = vehicle.role === "project";
                if (!isProject && journal.length === 0 && services.length === 0) return null;

                return (
                  <div key={vehicle.id} className="space-y-6">
                    {isProject && (
                      <BuildJournal
                        vehicleTitle={vehicle.title}
                        entries={journal}
                        onAdd={(entry) => addJournalEntry(vehicle.id, entry)}
                        onRemove={(entryId) => removeJournalEntry(vehicle.id, entryId)}
                      />
                    )}
                    <ServiceLogPanel
                      vehicleTitle={vehicle.title}
                      entries={services}
                      onAdd={(entry) => addServiceEntry(vehicle.id, entry)}
                      onRemove={(entryId) => removeServiceEntry(vehicle.id, entryId)}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-10 space-y-3">
            <Disclosure icon={Info}>{LOCAL_ONLY}</Disclosure>
            <Disclosure icon={Info}>{NO_PAYMENT_CLAIM}</Disclosure>
            <Disclosure icon={Info}>{PROGRESS_EXPLAINED}</Disclosure>
            <div className="pt-2">
              <Link
                href="/marketplace"
                className="inline-block py-1.5 text-sm font-semibold text-brand hover:underline"
              >
                Find a vehicle in the marketplace
              </Link>
            </div>
          </div>
        </GarageLayout>
      )}

      <AddVehicleModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} />
    </div>
  );
}

function Disclosure({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: typeof Info;
}) {
  return (
    <p className="flex gap-2 rounded-xl border border-aurora-blue/20 bg-aurora-blue/5 px-3 py-2.5">
      <Icon icon={icon} size={13} className="text-aurora-blue flex-shrink-0 mt-0.5" />
      <span className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed">{children}</span>
    </p>
  );
}
