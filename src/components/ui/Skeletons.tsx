import { clsx } from "clsx";
import { Skeleton } from "./Skeleton";

/**
 * Composite loading states. Each mirrors the real component's box model so the
 * swap to loaded content does not shift layout.
 */

export function VehicleCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4 shadow-lift overflow-hidden",
        className
      )}
    >
      <Skeleton className="aspect-[16/10] w-full mb-4 rounded-xl" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-6 w-1/2 mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      aria-hidden="true"
      className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl overflow-hidden shadow-lift"
    >
      <div className="flex gap-4 p-4 border-b border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/50">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-12 ml-auto" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b border-ink-100 dark:border-ink-800 last:border-0">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-6 w-24 ml-auto" />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-6 shadow-lift"
    >
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

/** Announced once for the whole group so assistive tech is not spammed. */
export function LoadingGrid({
  count = 8,
  className,
  label = "Loading listings",
}: {
  count?: number;
  className?: string;
  label?: string;
}) {
  return (
    <div className={className} role="status" aria-busy="true" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}
