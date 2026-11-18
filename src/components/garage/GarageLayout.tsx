"use client";

import { useRef, type ReactNode } from "react";
import { Car, Gauge, History, Plus, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { Reveal } from "@/components/motion/Reveal";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { GARAGE_STATES, STATE_LABELS, type GarageState, type GarageTotals } from "@/lib/garage";

const STATE_ICONS: Record<GarageState, typeof Car> = {
  current: Car,
  past: History,
  dream: Sparkles,
};

const zar = (value: number) => `R ${value.toLocaleString("en-ZA")}`;

/**
 * The garage shell: totals, the lifecycle switch, and the content area.
 *
 * The brief's segmented control was three bare buttons with no `role`, no
 * `aria-selected` and no keyboard handling, so it announced as three unrelated
 * buttons. This is a real tablist, following the same pattern as the profile tabs.
 *
 * The stat cards are the part that had to change most. The brief passed in
 * `{ totalValue: 1369000, totalMiles: 47000, dreamCount: 1 }` as literals, so the
 * page would have displayed a fleet value and a mileage that belonged to nobody.
 * Every figure here is computed from entries the user made, and each one carries
 * the count of entries behind it, so an empty garage cannot look like a valuable
 * one.
 */
export function GarageLayout({
  children,
  activeState,
  onStateChange,
  totals,
  panelId,
  onAdd,
  counts,
}: {
  children: ReactNode;
  activeState: GarageState;
  onStateChange: (state: GarageState) => void;
  totals: GarageTotals;
  panelId: string;
  onAdd: () => void;
  counts: Record<GarageState, number>;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  const select = (state: GarageState) => {
    onStateChange(state);
    listRef.current?.querySelector<HTMLButtonElement>(`#garage-tab-${state}`)?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = GARAGE_STATES.indexOf(activeState);
    if (event.key === "ArrowRight") {
      event.preventDefault();
      select(GARAGE_STATES[(index + 1) % GARAGE_STATES.length]);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      select(GARAGE_STATES[(index - 1 + GARAGE_STATES.length) % GARAGE_STATES.length]);
    } else if (event.key === "Home") {
      event.preventDefault();
      select(GARAGE_STATES[0]);
    } else if (event.key === "End") {
      event.preventDefault();
      select(GARAGE_STATES[GARAGE_STATES.length - 1]);
    }
  };

  return (
    <div className="space-y-8">
      <Reveal variant="up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Recorded value"
            value={zar(totals.recordedValue)}
            note={
              totals.valueCount === 0
                ? "No values entered yet"
                : `Across ${totals.valueCount} of ${totals.currentCount} current ${
                    totals.currentCount === 1 ? "vehicle" : "vehicles"
                  }`
            }
            icon={Gauge}
            color="text-semantic-success"
            bg="bg-semantic-success/10"
          />
          <StatCard
            label="Modification spend"
            value={zar(totals.journalSpend)}
            note={totals.journalSpend === 0 ? "No entries logged yet" : "Your own logged costs"}
            icon={Sparkles}
            color="text-aurora-blue"
            bg="bg-aurora-blue/10"
          />
          <StatCard
            label="Service spend"
            value={zar(totals.serviceSpend)}
            note={
              totals.serviceCount === 0
                ? "No services logged yet"
                : `Across ${totals.serviceCount} logged ${
                    totals.serviceCount === 1 ? "service" : "services"
                  }`
            }
            icon={Car}
            color="text-aurora-purple"
            bg="bg-aurora-purple/10"
          />
        </div>
      </Reveal>

      <div className="sticky top-[calc(var(--header-height)+var(--sat))] z-30 bg-surface-paper/90 dark:bg-ink-950/90 backdrop-blur-lg border-b border-ink-100 dark:border-ink-800 -mx-4 px-4 md:mx-0 md:px-0 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div
          ref={listRef}
          role="tablist"
          aria-label="Garage lifecycle"
          onKeyDown={onKeyDown}
          className="flex items-center p-1 bg-ink-100 dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 overflow-x-auto hide-scrollbar"
        >
          {GARAGE_STATES.map((state) => {
            const isActive = activeState === state;
            return (
              <button
                key={state}
                id={`garage-tab-${state}`}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onStateChange(state)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ease-swift whitespace-nowrap",
                  isActive
                    ? "bg-white dark:bg-ink-800 text-ink-900 dark:text-white shadow-sm"
                    : "text-ink-500 hover:text-ink-700 dark:hover:text-ink-300"
                )}
              >
                <Icon icon={STATE_ICONS[state]} size={14} strokeWidth={isActive ? 2.5 : 1.75} />
                {STATE_LABELS[state]}
                <span className="tabular-nums text-ink-400">({counts[state]})</span>
              </button>
            );
          })}
        </div>

        <FeatureGate featureKey="garage.add_vehicle">
          <SmartButton
            featureKey="garage.add_trigger"
            size="sm"
            leftIcon={Plus}
            onClick={onAdd}
          >
            Add vehicle
          </SmartButton>
        </FeatureGate>
      </div>

      <div id={panelId} role="tabpanel" aria-labelledby={`garage-tab-${activeState}`} tabIndex={0} className="min-h-[400px] focus:outline-none">
        {children}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  note,
  icon,
  color,
  bg,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof Car;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-5 shadow-lift flex items-center gap-4">
      <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", bg, color)}>
        <Icon icon={icon} size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-xl font-display font-bold text-ink-900 dark:text-white tabular-nums">{value}</p>
        <p className="text-[11px] text-ink-400 mt-0.5">{note}</p>
      </div>
    </div>
  );
}
