import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
  circle?: boolean;
}

export function Skeleton({ className, circle = false }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx("skeleton", circle ? "rounded-full" : "rounded-lg", className)}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4 shadow-lift">
      <Skeleton className="aspect-[16/10] w-full mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-6 w-1/2 mb-4" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
