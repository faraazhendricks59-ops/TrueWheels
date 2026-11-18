"use client";

import { useState } from "react";
import { AlertTriangle, Check, MapPin, ShieldQuestion } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { listingChecks, listingReference } from "@/lib/vehicle-trust";
import type { DemoVehicle } from "@/lib/demo/vehicles";

export function TrustHeader({ vehicle }: { vehicle: DemoVehicle }) {
  const [isOpen, setIsOpen] = useState(false);
  const checks = listingChecks(vehicle);
  const passed = checks.filter((check) => check.state === "passed").length;

  return (
    <FeatureGate featureKey="vdp.trust_badges">
      <div className="rounded-2xl border border-ink-100 dark:border-ink-800 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-ink-50 dark:bg-ink-950">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-semantic-warning/10 flex items-center justify-center text-semantic-warning flex-shrink-0">
              <Icon icon={AlertTriangle} size={16} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink-900 dark:text-white">
                Not independently inspected
              </p>
              <p className="text-[11px] text-ink-500 dark:text-ink-400">
                {passed} of {checks.length} checks passed. Reference {listingReference(vehicle)}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            aria-expanded={isOpen}
            className="inline-block py-2 text-[11px] font-bold text-brand hover:underline"
          >
            {isOpen ? "Hide the checks" : "See what was checked"}
          </button>
        </div>

        {isOpen && (
          <ul className="divide-y divide-ink-100 dark:divide-ink-800">
            {checks.map((check) => {
              const ok = check.state === "passed";
              return (
                <li key={check.id} className="flex items-start gap-3 p-4 bg-white dark:bg-ink-900">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      ok
                        ? "bg-semantic-success/10 text-semantic-success"
                        : "bg-ink-100 dark:bg-ink-800 text-ink-400"
                    }`}
                  >
                    <Icon icon={ok ? Check : ShieldQuestion} size={12} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold text-ink-900 dark:text-white">
                      {check.label}
                    </span>
                    <span className="block text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
                      {check.detail}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </FeatureGate>
  );
}

export function VehicleTitle({ vehicle }: { vehicle: DemoVehicle }) {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-display font-bold text-ink-900 dark:text-white tracking-tight">
        {vehicle.title}
      </h1>
      <p className="text-sm text-ink-500 dark:text-ink-300 mt-1 flex items-center gap-2">
        <Icon icon={MapPin} size={14} /> {vehicle.location}
      </p>
    </div>
  );
}
