import { Skeleton, SkeletonImage } from "@/components/ui/Skeleton";

export function VehicleCardSkeleton() {
  return <div aria-hidden="true" className="overflow-hidden rounded-xl border border-brand-silver bg-surface-white shadow-card"><SkeletonImage className="aspect-[16/10] rounded-none" /><div className="p-4"><Skeleton className="mb-2 h-4 w-3/4" /><Skeleton className="mb-4 h-6 w-1/2" /><div className="flex items-center justify-between border-t border-brand-silver pt-3"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-14" /><Skeleton className="h-3 w-20" /></div></div></div>;
}

export function VehicleGridSkeleton({ count = 8 }: { count?: number }) {
  const safeCount = Number.isInteger(count) && count > 0 ? Math.min(count, 24) : 8;
  return <div aria-label="Loading vehicles" role="status" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: safeCount }, (_, index) => <VehicleCardSkeleton key={index} />)}</div>;
}
