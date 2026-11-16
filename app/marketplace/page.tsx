import { Suspense } from 'react';
import { CarFront } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { VehicleGridSkeleton } from '@/components/vehicles/VehicleCardSkeleton';

// Placeholder until the marketplace data layer lands in a later phase.
async function fetchListings() {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return [] as unknown[];
}

async function Listings() {
  const listings = await fetchListings();

  if (listings.length === 0) {
    return (
      <EmptyState
        icon={CarFront}
        title="No vehicles found"
        description="Try adjusting your filters or check back soon — new listings are added every day."
        actionLabel="Clear filters"
        actionVariant="outline"
      />
    );
  }

  return null;
}

export default function MarketplacePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-graphite">Marketplace</h1>
          <p className="text-sm text-gray-500">Browse trusted vehicles from verified sellers.</p>
        </div>
      </div>

      <Suspense fallback={<VehicleGridSkeleton count={8} />}>
        <Listings />
      </Suspense>
    </main>
  );
}
