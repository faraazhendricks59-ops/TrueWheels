"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { SmartButton } from "@/components/ui/SmartButton";
import { Switch } from "@/components/ui/Toggles";
import { FeatureGate } from "@/components/feature/FeatureGate";
import {
  FREQUENCY_OPTIONS,
  frequencyOf,
  updateSavedSearch,
  type AlertFrequency,
  type SavedSearch,
} from "@/lib/saved-searches";

interface AlertFrequencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  search: SavedSearch | null;
  onSaved?: (updated: SavedSearch) => void;
}

export function AlertFrequencyModal({ isOpen, onClose, search, onSaved }: AlertFrequencyModalProps) {
  const [frequency, setFrequency] = useState<AlertFrequency>("instant");
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);

  // Seed from the saved search each time it opens, so the controls show what is
  // actually stored rather than whatever was picked last time.
  useEffect(() => {
    if (isOpen && search) {
      setFrequency(frequencyOf(search));
      setEmail(search.emailAlerts);
      setPush(search.pushAlerts);
    }
  }, [isOpen, search]);

  const save = () => {
    if (!search) return;
    const updated = updateSavedSearch(search.id, {
      frequency,
      emailAlerts: email,
      pushAlerts: push,
    });
    if (updated) onSaved?.(updated);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Alert frequency"
      description={search ? `How often we should notify you about “${search.name}”.` : undefined}
      footer={
        <>
          <SmartButton featureKey="saved_searches.edit" variant="ghost" onClick={onClose}>
            Cancel
          </SmartButton>
          <SmartButton featureKey="saved_searches.edit" onClick={save}>
            Save preferences
          </SmartButton>
        </>
      }
    >
      <FeatureGate featureKey="alerts.frequency">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Icon icon={Clock} size={12} /> Digest timing
            </p>
            <div className="space-y-2" role="radiogroup" aria-label="Alert frequency">
              {FREQUENCY_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={frequency === option.id}
                  onClick={() => setFrequency(option.id)}
                  className={clsx(
                    "w-full text-left p-3 rounded-xl border transition-colors",
                    frequency === option.id
                      ? "border-brand bg-brand/5"
                      : "border-ink-100 dark:border-ink-800 hover:border-brand/30"
                  )}
                >
                  <span className="block text-sm font-semibold text-ink-900 dark:text-white">
                    {option.label}
                  </span>
                  <span className="block text-xs text-ink-500 dark:text-ink-300 mt-0.5">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-ink-50 dark:bg-ink-950 rounded-xl border border-ink-100 dark:border-ink-800 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-ink-900 dark:text-white">Email alerts</span>
              <Switch
                label={<span className="sr-only">Email alerts</span>}
                checked={email}
                onChange={setEmail}
                disabled={frequency === "off"}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-ink-900 dark:text-white">Push alerts</span>
              <Switch
                label={<span className="sr-only">Push alerts</span>}
                checked={push}
                onChange={setPush}
                disabled={frequency === "off"}
              />
            </div>
          </div>
        </div>
      </FeatureGate>
    </Modal>
  );
}
