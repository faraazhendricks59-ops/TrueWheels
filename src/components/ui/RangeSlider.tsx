"use client";

import { useId } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
  label: string;
  /** Named so the two handles are distinguishable to screen readers. */
  minLabel?: string;
  maxLabel?: string;
}

/**
 * Dual-thumb range. The track and thumbs are decorative; the controls are two
 * transparent native range inputs stacked over them, which is what makes the
 * slider keyboard operable and announced correctly. A pointer-dragged div
 * would look the same and be unusable without a mouse.
 */
export function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue,
  label,
  minLabel = "Minimum",
  maxLabel = "Maximum",
}: RangeSliderProps) {
  const id = useId();
  const format = formatValue ?? ((v: number) => v.toLocaleString());

  const percent = (v: number) => ((v - min) / (max - min)) * 100;
  const minPercent = percent(value[0]);
  const maxPercent = percent(value[1]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span
          id={`${id}-label`}
          className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wide"
        >
          {label}
        </span>
        <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-ink-900 dark:text-white tabular-nums">
          <span>{format(value[0])}</span>
          <span className="text-ink-300" aria-hidden="true">–</span>
          <span>{format(value[1])}</span>
        </span>
      </div>

      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-1.5 bg-ink-100 dark:bg-ink-800 rounded-full" aria-hidden="true" />
        <div
          className="absolute h-1.5 bg-brand rounded-full"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
          aria-hidden="true"
        />

        <input
          type="range"
          className="range-thumb absolute w-full h-6 m-0"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          aria-label={`${label} ${minLabel}`}
          aria-valuetext={format(value[0])}
          onChange={(event) => {
            const next = Number(event.target.value);
            // Clamp below the upper handle so they cannot cross.
            onChange([Math.min(next, value[1] - step), value[1]]);
          }}
        />
        <input
          type="range"
          className="range-thumb absolute w-full h-6 m-0"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          aria-label={`${label} ${maxLabel}`}
          aria-valuetext={format(value[1])}
          onChange={(event) => {
            const next = Number(event.target.value);
            onChange([value[0], Math.max(next, value[0] + step)]);
          }}
        />
      </div>
    </div>
  );
}
