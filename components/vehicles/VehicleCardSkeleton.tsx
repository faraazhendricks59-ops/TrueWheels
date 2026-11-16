import { Skeleton, SkeletonImage } from '@/components/ui/Skeleton';

export function VehicleCardSkeleton() {
  return (
    <div className="bg-surface-white border border-brand-silver rounded-xl overflow-hidden shadow-card">
      {/* Image */}
      <SkeletonImage className="aspect-[16/10] rounded-none" />

      {/* Content */}
      <div className="p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-4" />

        <div className="flex items-center justify-between pt-3 border-t border-brand-silver">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

/** Grid of skeletons matching the marketplace layout */
export function VehicleGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}
