"use client";

import { Trophy } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { formatMetric } from "@/lib/comparison-data";

export interface SpecRowData {
  key: string;
  label: string;
  direction: "lower" | "higher";
  values: number[];
  /** Rendered instead of a number, for metrics with no unit figure. */
  format?: (value: number) => string;
}

interface SpecRowProps {
  row: SpecRowData;
}

export function SpecRow({ row }: SpecRowProps) {
  const { label, direction, values, format } = row;
  const present = values.filter((value) => Number.isFinite(value));

  let bestIndex = -1;
  if (present.length > 0) {
    const target = direction === "lower" ? Math.min(...present) : Math.max(...present);
    bestIndex = values.indexOf(target);
  }

  const bestValue = bestIndex >= 0 ? values[bestIndex] : null;
  // A tie means no single column wins, so nothing is highlighted.
  const isTie = bestValue !== null && values.filter((value) => value === bestValue).length > 1;
  const render = format ?? ((value: number) => formatMetric(label, value));

  return (
    <tr className="group hover:bg-ink-50/30 dark:hover:bg-ink-950/30 transition-colors">
      <th
        scope="row"
        className="sticky left-0 z-10 bg-white dark:bg-ink-900 border-b border-r border-ink-100 dark:border-ink-800 px-4 py-3.5 text-left font-medium"
      >
        <span className="text-sm text-ink-600 dark:text-ink-300">{label}</span>
      </th>

      {values.map((value, index) => {
        const isBest = index === bestIndex && !isTie;
        return (
          <td
            key={index}
            className={clsx(
              "border-b border-ink-100 dark:border-ink-800 px-4 py-3.5 text-center transition-colors",
              isBest && "bg-semantic-success/5 dark:bg-semantic-success/10"
            )}
          >
            <span className="flex flex-col items-center gap-1.5">
              <span
                className={clsx(
                  "text-sm font-mono font-bold tabular-nums",
                  isBest ? "text-semantic-success" : "text-ink-900 dark:text-white"
                )}
              >
                {render(value)}
              </span>
              {isBest && (
                <Badge variant="trust" tone="green">
                  <Icon icon={Trophy} size={8} />
                  Best
                </Badge>
              )}
            </span>
          </td>
        );
      })}
    </tr>
  );
}
