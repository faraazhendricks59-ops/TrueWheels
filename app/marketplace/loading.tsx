import { VehicleGridSkeleton } from '@/components/vehicles/VehicleCardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';

export default function MarketplaceLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      {/* Filters Bar Skeleton */}
      <div className="flex gap-2 mb-6 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Grid Skeleton */}
      <VehicleGridSkeleton count={8} />
    </div>
  );
}
