"use client";

import { useState } from "react";
import { ClipboardList, Gauge, Plus, Trash2 } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Reveal } from "@/components/motion/Reveal";
import { SmartButton } from "@/components/ui/SmartButton";
import { SERVICE_EXPLAINED, formatEntryDate, isIsoDate, type ServiceEntry } from "@/lib/garage";
import { localeTag } from "@/lib/i18n/dictionaries";

const zar = (value: number) => `R ${value.toLocaleString("en-ZA")}`;

/**
 * The user's own service log for one vehicle.
 *
 * The vehicle page already refuses to invent a service history (see
 * ServiceLog.tsx), because a maintenance record is the thing a buyer pays more
 * for. This is the same principle from the owner's side: what is here is what the
 * user typed, and it is labelled as their own record rather than a dealer history
 * or a verified one.
 */
export function ServiceLogPanel({
  vehicleTitle,
  entries,
  onAdd,
  onRemove,
}: {
  vehicleTitle: string;
  entries: ServiceEntry[];
  onAdd: (entry: Omit<ServiceEntry, "id">) => void;
  onRemove: (entryId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [mileage, setMileage] = useState("");
  const [cost, setCost] = useState("");
  const [errors, setErrors] = useState<{ date?: string; description?: string; cost?: string }>({});

  const sorted = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1));

  const submit = () => {
    const next: typeof errors = {};
    if (!isIsoDate(date)) next.date = "Use a date in YYYY-MM-DD form";
    if (!description.trim()) next.description = "Describe the work";
    if (cost.trim() && (!/^\d+$/.test(cost.trim()) || Number(cost) < 0)) {
      next.cost = "Cost must be a whole number of rand";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    onAdd({
      date,
      description: description.trim().slice(0, 300),
      mileage: mileage.trim() ? Number(mileage) : undefined,
      cost: cost.trim() ? Number(cost) : undefined,
    });
    setDate("");
    setDescription("");
    setMileage("");
    setCost("");
    setIsOpen(false);
  };

  return (
    <Reveal variant="up" delay={150}>
      <section
        aria-labelledby="service-heading"
        className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift"
      >
        <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
          <div>
            <h3
              id="service-heading"
              className="text-lg font-display font-bold text-ink-900 dark:text-white flex items-center gap-2"
            >
              <Icon icon={ClipboardList} size={18} className="text-aurora-blue" />
              Service log: {vehicleTitle}
            </h3>
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">{SERVICE_EXPLAINED}</p>
          </div>
          <p className="text-[11px] text-ink-400">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </p>
        </div>

        {sorted.length === 0 ? (
          <p className="text-sm text-ink-500 dark:text-ink-400 py-6 text-center rounded-xl border border-dashed border-ink-200 dark:border-ink-800">
            No services logged yet.
          </p>
        ) : (
          <ul className="divide-y divide-ink-100 dark:divide-ink-800">
            {sorted.map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-900 dark:text-white">
                    {entry.description}
                  </p>
                  <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5 flex items-center gap-3 flex-wrap">
                    <span>{formatEntryDate(entry.date, localeTag("en"))}</span>
                    {entry.mileage !== undefined && (
                      <span className="flex items-center gap-1">
                        <Icon icon={Gauge} size={10} /> {entry.mileage.toLocaleString("en-ZA")} km
                      </span>
                    )}
                    {entry.cost !== undefined && <span>{zar(entry.cost)}</span>}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(entry.id)}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-ink-400 hover:bg-semantic-error/10 hover:text-semantic-error transition-colors flex-shrink-0"
                  aria-label={`Remove service entry ${entry.description}`}
                >
                  <Icon icon={Trash2} size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 pt-5 border-t border-ink-100 dark:border-ink-800">
          {!isOpen ? (
            <div className="flex justify-center">
              <SmartButton
                featureKey="garage.add_service_entry"
                variant="secondary"
                leftIcon={Plus}
                onClick={() => setIsOpen(true)}
              >
                Log a service
              </SmartButton>
            </div>
          ) : (
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  error={errors.date}
                />
                <Input
                  label="Odometer at service (optional)"
                  inputMode="numeric"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                />
              </div>
              <Input
                label="What was done?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={errors.description}
                maxLength={300}
              />
              <Input
                label="Cost in rand (optional)"
                inputMode="numeric"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                error={errors.cost}
              />
              <div className="flex items-center gap-2 pt-1">
                <SmartButton featureKey="garage.add_service_entry" type="submit" leftIcon={Plus}>
                  Save entry
                </SmartButton>
                <SmartButton
                  featureKey="garage.add_service_entry"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </SmartButton>
              </div>
            </form>
          )}
        </div>
      </section>
    </Reveal>
  );
}
