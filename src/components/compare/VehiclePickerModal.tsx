"use client";

import { useMemo, useState } from "react";
import { Gauge, MapPin, Plus, Search } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { SmartButton } from "@/components/ui/SmartButton";
import { Input } from "@/components/ui/Input";
import { DEMO_VEHICLES } from "@/lib/demo/vehicles";
import { COMPARE_MAX } from "@/lib/comparison-data";
import { localeTag } from "@/lib/i18n/locale";

interface VehiclePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onPick: (id: string) => void;
}

export function VehiclePickerModal({ isOpen, onClose, selectedIds, onPick }: VehiclePickerModalProps) {
  const [term, setTerm] = useState("");
  const atCapacity = selectedIds.length >= COMPARE_MAX;

  const options = useMemo(() => {
    const query = term.trim().toLowerCase();
    const pool = query
      ? DEMO_VEHICLES.filter((vehicle) => vehicle.title.toLowerCase().includes(query))
      : DEMO_VEHICLES;
    return pool.slice(0, 24);
  }, [term]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add a vehicle"
      description={
        atCapacity
          ? `You can compare up to ${COMPARE_MAX} vehicles. Remove one to add another.`
          : "Search the listings and add up to four vehicles to the comparison."
      }
      footer={
        <SmartButton featureKey="compare.close_export" variant="ghost" onClick={onClose}>
          Done
        </SmartButton>
      }
    >
      <div className="space-y-4">
        <Input
          label="Search listings"
          placeholder="Make, model or year"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
        />

        <div className="max-h-80 overflow-y-auto space-y-2">
          {options.map((vehicle) => {
            const selected = selectedIds.includes(vehicle.id);
            return (
              <button
                key={vehicle.id}
                type="button"
                disabled={selected || atCapacity}
                onClick={() => onPick(vehicle.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-ink-100 dark:border-ink-800 text-left hover:border-brand/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-700 flex items-center justify-center text-xs font-bold text-ink-400 flex-shrink-0">
                  {vehicle.year}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-ink-900 dark:text-white truncate">
                    {vehicle.title}
                  </span>
                  <span className="flex items-center gap-3 text-[10px] text-ink-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Icon icon={MapPin} size={10} /> {vehicle.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon icon={Gauge} size={10} /> {vehicle.mileage.toLocaleString(localeTag("en"))} km
                    </span>
                  </span>
                </span>
                <span className="text-sm font-display font-bold text-brand tabular-nums flex-shrink-0">
                  R {vehicle.price.toLocaleString(localeTag("en"))}
                </span>
                <Icon icon={selected ? Search : Plus} size={14} className="text-ink-400 flex-shrink-0" />
              </button>
            );
          })}
          {options.length === 0 && (
            <p className="text-sm text-ink-500 text-center py-8">No listings match that search.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
