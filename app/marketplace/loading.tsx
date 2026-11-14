import { Skeleton } from "@/components/ui/Skeleton";
import { VehicleGridSkeleton } from "@/components/vehicles/VehicleCardSkeleton";

export default function MarketplaceLoading() {
  return <div className="mx-auto max-w-7xl px-4 py-8" aria-busy="true"><div className="mb-6 flex items-center justify-between"><div><Skeleton className="mb-2 h-7 w-40" /><Skeleton className="h-4 w-56" /></div><div className="flex gap-3"><Skeleton className="h-10 w-24" /><Skeleton className="h-10 w-40" /></div></div><div className="mb-6 flex gap-2 overflow-hidden">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-9 w-28 flex-shrink-0 rounded-full" />)}</div><VehicleGridSkeleton count={8} /></div>;
}
