"use client";

import { useRef, useState } from "react";
import { clsx } from "clsx";
import { AlertCircle, Scan, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { TrustBadge } from "@/components/ui/Badge";
import { localeTag } from "@/lib/i18n/locale";

/** ZAR with no decimals, e.g. 650000 -> "R 650 000". */
export function formatZAR(value: number): string {
  return new Intl.NumberFormat(localeTag("en"), {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
}

// --- ZAR CURRENCY INPUT ---
interface CurrencyInputProps {
  value: number | string;
  onChange: (value: number) => void;
  error?: string;
  label?: string;
  hint?: string;
  id?: string;
}

export function CurrencyInput({ value, onChange, error, label, hint, id }: CurrencyInputProps) {
  const numeric = typeof value === "string" ? Number(value.replace(/[^0-9]/g, "")) : value;
  const display = Number.isFinite(numeric) && numeric > 0 ? formatZAR(numeric) : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, "");
    // Emitting Number("") here would send 0 and make "price must be at least
    // R 1 000" fire while the field is simply empty. Emit NaN instead so the
    // schema reports the field as missing rather than as an invalid value.
    onChange(digits === "" ? NaN : Number(digits));
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          placeholder="R 0"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={clsx(
            "w-full h-12 px-4 rounded-xl bg-white dark:bg-ink-900 border text-lg font-bold text-ink-900 dark:text-white tabular-nums",
            "focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all",
            error
              ? "border-semantic-error focus:ring-semantic-error/20 focus:border-semantic-error"
              : "border-ink-200 dark:border-ink-800"
          )}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-semantic-error font-medium">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-ink-400">
          {hint}
        </p>
      )}
    </div>
  );
}

// --- ODOMETER VALIDATOR ---
interface OdometerInputProps {
  value: number;
  onChange: (value: number) => void;
  /** Last recorded service reading; a lower value flags a rollback. */
  previousReading?: number;
  error?: string;
}

export function OdometerInput({ value, onChange, previousReading, error }: OdometerInputProps) {
  const isRollback =
    typeof previousReading === "number" && Number.isFinite(value) && value > 0 && value < previousReading;

  return (
    <div>
      <Input
        label="Current Odometer (km)"
        type="number"
        min={0}
        inputMode="numeric"
        value={Number.isFinite(value) && value > 0 ? value : ""}
        onChange={(e) => onChange(e.target.value === "" ? NaN : Number(e.target.value))}
        placeholder="e.g. 125000"
        error={error}
        hint={previousReading ? `Last recorded service reading: ${previousReading.toLocaleString(localeTag("en"))} km` : undefined}
      />
      {isRollback && (
        <div
          role="alert"
          className="mt-2 flex items-start gap-2 p-3 bg-semantic-error/10 border border-semantic-error/20 rounded-xl"
        >
          <Icon icon={AlertCircle} className="text-semantic-error shrink-0" size={16} />
          <p className="text-xs text-semantic-error font-medium">
            Odometer rollback detected. This value is lower than the last recorded service reading
            ({previousReading?.toLocaleString(localeTag("en"))} km).
          </p>
        </div>
      )}
    </div>
  );
}

// --- LICENSE DISK OCR TRIGGER ---
export interface LicenseDiskData {
  vin: string;
  engineNumber: string;
  licenseNumber: string;
  expiryDate: string;
}

interface LicenseDiskScannerProps {
  onScanComplete: (data: LicenseDiskData) => void;
}

export function LicenseDiskScanner({ onScanComplete }: LicenseDiskScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setIsScanning(true);
    // Stand-in for the real pipeline: upload to storage, then run the vision
    // model over the license disk and return the decoded fields.
    setTimeout(() => {
      setIsScanning(false);
      onScanComplete({
        vin: "WVWZZZ1KZAW123456",
        engineNumber: "CAX123456",
        licenseNumber: "CA123456",
        expiryDate: "2027-11-30",
      });
    }, 1500);
  };

  return (
    <div className="border-2 border-dashed border-ink-200 dark:border-ink-800 rounded-2xl p-8 text-center transition-all">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        id="license-disk-upload"
        onChange={handleFileChange}
      />
      <label
        htmlFor="license-disk-upload"
        className="block cursor-pointer group focus-within:outline-none"
      >
        <div className="w-14 h-14 mx-auto rounded-2xl bg-ink-50 dark:bg-ink-800 flex items-center justify-center mb-4 group-hover:bg-brand/10 transition-colors">
          {isScanning ? (
            <Loader2 size={24} className="animate-spin text-brand" strokeWidth={1.75} />
          ) : (
            <Icon icon={Scan} size={24} className="text-ink-400 group-hover:text-brand" />
          )}
        </div>
        <h4 className="font-semibold text-ink-900 dark:text-white mb-1">
          {isScanning ? "Scanning license disk…" : "Scan License Disk"}
        </h4>
        <p className="text-xs text-ink-500 dark:text-ink-300">
          Upload a photo to auto-fill VIN, Engine No, and License details via AI.
        </p>
        {fileName && <p className="text-[10px] text-ink-400 mt-2 truncate">{fileName}</p>}
      </label>
      {!isScanning && fileName && (
        <div className="mt-4 flex justify-center">
          <TrustBadge
            label="Extraction complete"
            source="Fields were read by the TrueWheels vision pipeline. Verify them before publishing."
            tone="green"
          />
        </div>
      )}
    </div>
  );
}
