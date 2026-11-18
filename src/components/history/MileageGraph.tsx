"use client";

import { Info, TrendingUp, TriangleAlert } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import type { HistoryReport } from "@/lib/history-report";

const W = 600;
const H = 200;
const PAD = { top: 18, right: 16, bottom: 28, left: 52 };

/**
 * Odometer readings over time. The chart draws whatever readings exist; it does
 * not invent a series. With a single reading there is nothing to plot against,
 * so it says that the odometer cannot be assessed yet rather than showing a
 * line that implies a history.
 */
export function MileageGraph({ report }: { report: HistoryReport }) {
  const { readings, anomalies, canAssessMileage } = report;

  if (!canAssessMileage) {
    const only = readings[0];
    return (
      <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
        <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white">
          Odometer history
        </h3>
        <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800">
          <span className="w-8 h-8 rounded-lg bg-ink-200 dark:bg-ink-800 flex items-center justify-center text-ink-500 flex-shrink-0">
            <Icon icon={Info} size={14} />
          </span>
          <div>
            <p className="text-sm font-bold text-ink-900 dark:text-white">
              Cannot be assessed from one reading
            </p>
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 leading-relaxed">
              {only
                ? `The only reading available is ${only.mileage.toLocaleString("en-ZA")} km, from the listing itself. A rollback shows up as a reading that is lower than an earlier one, so at least two readings taken at different times are needed before anything can be said.`
                : "No odometer readings are available for this listing."}
            </p>
          </div>
        </div>
        <p className="flex items-start gap-2 text-[11px] text-ink-500 dark:text-ink-400 mt-4 leading-relaxed">
          <Icon icon={TrendingUp} size={12} className="mt-0.5 flex-shrink-0" />
          Service invoices and licensing records are the usual sources of a second reading. Ask the
          seller for them and compare the figures yourself.
        </p>
      </div>
    );
  }

  // Sorted here to match detectMileageAnomalies, whose atIndex refers to the
  // sorted order. Plotting the unsorted array would highlight the wrong point.
  const ordered = [...readings].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const times = ordered.map((reading) => new Date(reading.date).getTime());
  const miles = ordered.map((reading) => reading.mileage);
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const maxMileage = Math.max(...miles);
  const timeSpan = maxTime - minTime || 1;
  const mileageSpan = maxMileage || 1;

  const x = (time: number) => PAD.left + ((time - minTime) / timeSpan) * (W - PAD.left - PAD.right);
  const y = (mileage: number) => H - PAD.bottom - (mileage / mileageSpan) * (H - PAD.top - PAD.bottom);

  const points = ordered.map((reading) => ({
    ...reading,
    cx: x(new Date(reading.date).getTime()),
    cy: y(reading.mileage),
  }));
  const flagged = new Set(anomalies.map((anomaly) => anomaly.atIndex));
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.cx} ${point.cy}`).join(" ");

  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h3 className="text-lg font-display font-bold text-ink-900 dark:text-white">
          Odometer history
        </h3>
        {anomalies.length > 0 ? (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-semantic-error/10 text-semantic-error text-xs font-bold">
            <Icon icon={TriangleAlert} size={14} />
            {anomalies.length} reading{anomalies.length === 1 ? "" : "s"} need explaining
          </span>
        ) : (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-semantic-success/10 text-semantic-success text-xs font-bold">
            <Icon icon={TrendingUp} size={14} />
            Readings rise consistently
          </span>
        )}
      </div>

      <div className="w-full">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-48" role="img" aria-label="Odometer readings over time">
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const gridY = PAD.top + fraction * (H - PAD.top - PAD.bottom);
            return (
              <line
                key={fraction}
                x1={PAD.left}
                y1={gridY}
                x2={W - PAD.right}
                y2={gridY}
                stroke="currentColor"
                className="text-ink-100 dark:text-ink-800"
                strokeWidth="1"
              />
            );
          })}

          <path d={path} fill="none" stroke="#E10600" strokeWidth="2" strokeLinejoin="round" />

          {points.map((point, index) => (
            <circle
              key={`${point.date}-${index}`}
              cx={point.cx}
              cy={point.cy}
              r={flagged.has(index) ? 5 : 4}
              fill={flagged.has(index) ? "#FF4438" : "#FFFFFF"}
              stroke={flagged.has(index) ? "#FF4438" : "#E10600"}
              strokeWidth="2"
            />
          ))}

          <text x={PAD.left - 8} y={PAD.top + 4} textAnchor="end" fontSize="11" className="fill-ink-400">
            {maxMileage.toLocaleString("en-ZA")}
          </text>
          <text x={PAD.left - 8} y={H - PAD.bottom + 4} textAnchor="end" fontSize="11" className="fill-ink-400">
            0
          </text>
        </svg>
      </div>

      <div className="mt-4 space-y-2">
        {points.map((point, index) => (
          <div
            key={`${point.date}-${index}`}
            className={`flex items-center justify-between gap-4 p-3 rounded-lg border ${
              flagged.has(index)
                ? "bg-semantic-error/5 border-semantic-error/20"
                : "bg-ink-50/50 dark:bg-ink-950/50 border-ink-100 dark:border-ink-800"
            }`}
          >
            <span className="text-xs text-ink-500 dark:text-ink-400 truncate">{point.source}</span>
            <span className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm font-bold text-ink-900 dark:text-white tabular-nums">
                {point.mileage.toLocaleString("en-ZA")} km
              </span>
              {flagged.has(index) && <Icon icon={TriangleAlert} size={14} className="text-semantic-error" />}
            </span>
          </div>
        ))}
      </div>

      {anomalies.length > 0 && (
        <ul className="mt-4 space-y-2">
          {anomalies.map((anomaly, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-ink-600 dark:text-ink-300 leading-relaxed">
              <Icon icon={TriangleAlert} size={12} className="mt-0.5 flex-shrink-0 text-semantic-error" />
              {anomaly.detail}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
