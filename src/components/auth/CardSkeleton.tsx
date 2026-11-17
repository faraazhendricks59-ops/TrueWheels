export function CardSkeleton() {
  return (
    <div className="w-full max-w-md space-y-3" aria-hidden="true">
      <div className="h-6 w-1/3 rounded-lg bg-ink-100 dark:bg-ink-800 animate-pulse" />
      <div className="h-32 w-full rounded-2xl bg-ink-100 dark:bg-ink-800 animate-pulse" />
      <div className="h-4 w-2/3 rounded-lg bg-ink-100 dark:bg-ink-800 animate-pulse" />
    </div>
  );
}
