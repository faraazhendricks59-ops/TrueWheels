"use client";

import { useMemo, useState } from "react";
import { Calendar, MapPin, AlertTriangle, Copy, Check, Info } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Sheet } from "@/components/ui/Sheet";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TEST_DRIVE_CHECKS, WAIVER_FACTS, testDriveMessage } from "@/lib/contact";
import type { DemoVehicle } from "@/lib/demo/vehicles";

interface TestDriveSheetProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: DemoVehicle;
}

const TIME_OPTIONS = [
  { value: "09:00", label: "09:00" },
  { value: "11:00", label: "11:00" },
  { value: "14:00", label: "14:00" },
  { value: "16:00", label: "16:00" },
];

/**
 * Prepares a test-drive request, and states what the law actually says about
 * liability.
 *
 * The brief for this sheet required the buyer to accept a "Mandatory Liability
 * Waiver" that made them drive "at your own risk" and indemnified the dealer
 * against "any traffic fines or damages", then reported "Test Drive Booked" with
 * "Liability waiver digitally signed" and a badge reading "Digitally signed via
 * TrueWheels Secure Sign. IP logged."
 *
 * There is no signing service, no booking service and no log of any kind, so all
 * of that would have been false. The waiver was also legally wrong. Section
 * 51(1)(c)(ii) of the Consumer Protection Act voids a consumer's assumption of
 * risk for loss caused by a supplier's gross negligence, and section 51(1)(c)(i)
 * voids a term exempting the supplier from it, so a blanket indemnity is not the
 * protection it pretends to be. Section 49 also requires any risk term to be
 * drawn to the buyer's attention conspicuously and in plain language.
 *
 * A buyer told they have signed away their rights when they have not is worse
 * off than one who was told nothing. This sheet therefore prepares the request
 * and explains the position accurately.
 */
export function TestDriveSheet({ isOpen, onClose, vehicle }: TestDriveSheetProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [copied, setCopied] = useState(false);

  const message = useMemo(
    () => testDriveMessage(vehicle, { date, time }),
    [vehicle, date, time],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Prepare a test drive request" side="bottom">
      <div className="space-y-6 pb-8">
        <div className="flex items-center gap-3 p-4 bg-ink-50 dark:bg-ink-950 rounded-xl border border-ink-100 dark:border-ink-800">
          <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand flex-shrink-0">
            <Icon icon={Calendar} size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-ink-900 dark:text-white truncate">
              {vehicle.title}
            </p>
            <p className="text-xs text-ink-500 dark:text-ink-400 flex items-center gap-1 mt-0.5">
              <Icon icon={MapPin} size={10} /> {vehicle.location}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-aurora-blue/5 border border-aurora-blue/20">
          <Icon icon={Info} size={14} className="text-aurora-blue flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-ink-600 dark:text-ink-300 leading-relaxed">
            This prepares a request for you to send. No booking is made and the
            seller is not contacted, because TrueWheels has no booking service and
            holds no seller contact details.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Preferred date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Select
            label="Preferred time"
            options={TIME_OPTIONS}
            value={time}
            onChange={setTime}
            placeholder="Select time"
          />
        </div>

        <div>
          <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">
            Agree before you drive
          </p>
          <ul className="space-y-1.5">
            {TEST_DRIVE_CHECKS.map((check) => (
              <li
                key={check}
                className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1 before:h-1 before:rounded-full before:bg-ink-300 dark:before:bg-ink-600"
              >
                {check}
              </li>
            ))}
          </ul>
        </div>

        {/* The accurate legal position, rather than a fake waiver. */}
        <div className="p-4 bg-semantic-warning/5 border border-semantic-warning/20 rounded-xl">
          <div className="flex items-start gap-2 mb-2">
            <Icon
              icon={AlertTriangle}
              size={14}
              className="text-semantic-warning mt-0.5 flex-shrink-0"
            />
            <p className="text-xs font-bold text-ink-900 dark:text-white">
              What a liability waiver can and cannot do
            </p>
          </div>
          <ul className="space-y-2">
            {WAIVER_FACTS.map((fact) => (
              <li
                key={fact}
                className="text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[0.45em] before:w-1 before:h-1 before:rounded-full before:bg-semantic-warning/60"
              >
                {fact}
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-ink-400 mt-3 leading-relaxed">
            This is general information about South African law, not legal advice.
            If a dispute arises over a test drive, speak to an attorney.
          </p>
        </div>

        <div className="pt-4 border-t border-ink-100 dark:border-ink-800">
          <div className="p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800 mb-3">
            <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1.5">
              Your request, ready to send
            </p>
            <pre className="text-[11px] text-ink-600 dark:text-ink-300 whitespace-pre-wrap font-sans leading-relaxed">
              {message}
            </pre>
          </div>
          <button
            type="button"
            onClick={copy}
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            <Icon icon={copied ? Check : Copy} size={14} />
            {copied ? "Request copied" : "Copy the request"}
          </button>
        </div>
      </div>
    </Sheet>
  );
}
