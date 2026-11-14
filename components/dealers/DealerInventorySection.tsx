"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { VehicleCard, VehicleCardProps } from "@/components/vehicles/VehicleCard";
import { ListingGrid } from "@/components/vehicles/ListingGrid";

interface DealerInventorySectionProps { vehicles: VehicleCardProps[]; }
type SortOption = "featured" | "price-low" | "price-high" | "mileage";

export function DealerInventorySection({ vehicles }: DealerInventorySectionProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const visibleVehicles = useMemo(() => {
    const filtered = vehicles.filter((vehicle) => vehicle.title.toLowerCase().includes(query.toLowerCase()) || vehicle.location.toLowerCase().includes(query.toLowerCase()));
    return [...filtered].sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : sort === "mileage" ? a.mileage - b.mileage : Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)));
  }, [query, sort, vehicles]);

  return (
    <section id="inventory" className="scroll-mt-24">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">Digital showroom</p><h2 className="text-2xl font-extrabold text-brand-graphite sm:text-3xl">Current inventory</h2><p className="mt-2 text-sm text-gray-500">Browse {visibleVehicles.length} quality vehicles available from this dealership.</p></div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block"><Search size={16} className="pointer-events-none absolute left-3 top-3 text-gray-400" /><span className="sr-only">Search inventory</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search inventory" className="h-10 w-full rounded-lg border border-brand-silver bg-surface-white pl-9 pr-3 text-sm outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 sm:w-56" /></label>
          <label className="relative block"><ArrowUpDown size={16} className="pointer-events-none absolute left-3 top-3 text-gray-400" /><span className="sr-only">Sort inventory</span><select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="h-10 w-full appearance-none rounded-lg border border-brand-silver bg-surface-white pl-9 pr-8 text-sm font-semibold text-brand-graphite outline-none focus:border-brand-red sm:w-48"><option value="featured">Featured first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="mileage">Lowest mileage</option></select></label>
        </div>
      </div>
      {visibleVehicles.length > 0 ? <ListingGrid>{visibleVehicles.map((vehicle) => <VehicleCard key={vehicle.id} {...vehicle} />)}</ListingGrid> : <div className="rounded-xl border border-dashed border-brand-silver bg-surface-white p-12 text-center text-sm text-gray-500">No vehicles matched your search.</div>}
    </section>
  );
}
