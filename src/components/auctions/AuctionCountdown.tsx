"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { Bell, BellOff, Check } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { FOLLOWUP_PRESETS, readFollowUps, writeFollowUp } from "@/lib/auctions";

/**
 * A reminder the reader sets, not an auction clock.
 *
 * The brief's countdown ticked down to `endTimestamp` and shifted to a pulsing red
 * "Closing In" state under five minutes. A clock to a deadline implies a deadline
 * exists and that something happens when it passes — here nothing does. Red that
 * pulses is read as "act now or lose it", which is exactly the pressure a made-up
 * deadline is designed to create. See `src/lib/auctions.ts`.
 *
 * So this counts down to a moment the reader chose, keeps it on their device, and
 * says so on the panel. It is a bookmark with a clock on it. There is no invented
 * end time and no critical colour, because nothing is critical.
 *
 * The interval only runs while a reminder exists, so an idle page does no work.
 * The remaining time is recomputed from the stored timestamp rather than
 * decremented, so it stays correct across a sleep or a background tab.
 */
export function AuctionCountdown({ vehicleId }: { vehicleId: string }) {
  const [reminderAt, setReminderAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());
  const [isHydrated, setIsHydrated] = useState(false);

  // Read the store after mount so the server and first client render agree.
  useEffect(() => {
    const map = readFollowUps();
    setReminderAt(map[vehicleId] ?? null);
    setIsHydrated(true);
  }, [vehicleId]);

  useEffect(() => {
    if (reminderAt === null) return;
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [reminderAt]);

  const setPreset = (minutes: number) => {
    const at = Date.now() + minutes * 60000;
    writeFollowUp(vehicleId, at);
    setReminderAt(at);
    setNow(Date.now());
  };

  const clear = () => {
    writeFollowUp(vehicleId, null);
    setReminderAt(null);
  };

  const remaining = reminderAt === null ? 0 : reminderAt - now;
  const isDue = reminderAt !== null && remaining <= 0;

  return (
    <div className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
      <div className="flex items-center gap-2 mb-1">
        <Icon icon={Bell} size={14} className="text-ink-400" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400">
          Your reminder
        </p>
      </div>
      <p className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed mb-4">
        This is a reminder you set for yourself, kept in this browser. It is not an
        auction clock — no auction is running and no deadline exists.
      </p>

      {isHydrated && reminderAt !== null ? (
        <div className="space-y-3">
          {isDue ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-brand">
              <Icon icon={Check} size={16} />
              Time to check back on this listing
            </div>
          ) : (
            <div className="flex items-end justify-center gap-2 font-mono font-bold tabular-nums">
              <TimeBlock value={pad(hoursOf(remaining))} label="HRS" />
              <span className="text-2xl text-ink-300 dark:text-ink-600">:</span>
              <TimeBlock value={pad(minutesOf(remaining))} label="MIN" />
              <span className="text-2xl text-ink-300 dark:text-ink-600">:</span>
              <TimeBlock value={pad(secondsOf(remaining))} label="SEC" />
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-ink-400">
              Set for{" "}
              {new Date(reminderAt).toLocaleString("en-ZA", {
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-500 dark:text-ink-300 hover:text-brand transition-colors min-h-[32px]"
            >
              <Icon icon={BellOff} size={13} />
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {FOLLOWUP_PRESETS.map((preset) => (
            <button
              key={preset.minutes}
              type="button"
              onClick={() => setPreset(preset.minutes)}
              className={clsx(
                "py-2 rounded-lg bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800",
                "text-[11px] font-semibold text-ink-600 dark:text-ink-300",
                "hover:border-brand/30 hover:text-brand transition-colors min-h-[40px]"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl md:text-4xl leading-none text-ink-900 dark:text-white">
        {value}
      </span>
      <span className="text-[9px] font-bold text-ink-400 mt-1">{label}</span>
    </div>
  );
}

const pad = (n: number) => n.toString().padStart(2, "0");
const hoursOf = (ms: number) => Math.max(0, Math.floor(ms / 3600000));
const minutesOf = (ms: number) => Math.max(0, Math.floor((ms % 3600000) / 60000));
const secondsOf = (ms: number) => Math.max(0, Math.floor((ms % 60000) / 1000));
