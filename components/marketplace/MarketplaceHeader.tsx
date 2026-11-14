"use client";

import { ArrowUpDown, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function MarketplaceHeader({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "newest";
  const chips = ["make", "bodyType", "fuelType", "maxPrice"].filter((key) => searchParams.has(key));
  function updateSort(value: string) { const params = new URLSearchParams(searchParams.toString()); value === "newest" ? params.delete("sort") : params.set("sort", value); router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false }); }
  function removeFilter(key: string) { const params = new URLSearchParams(searchParams.toString()); params.delete(key); router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false }); }
  return <div className="mb-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="text-2xl font-bold text-brand-graphite">Marketplace</h1><p className="mt-1 text-sm text-gray-500">Showing <span className="font-semibold text-brand-graphite">{resultCount.toLocaleString("en-ZA")}</span> vehicles</p></div><div className="relative"><ArrowUpDown size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><select aria-label="Sort vehicles" value={sort} onChange={(event) => updateSort(event.target.value)} className="h-10 cursor-pointer appearance-none rounded-lg border border-brand-silver bg-surface-white pl-9 pr-8 text-sm font-medium text-brand-graphite focus:outline-none focus:ring-2 focus:ring-brand-red/20"><option value="newest">Newest Listed</option><option value="price_low">Price: Low to High</option><option value="price_high">Price: High to Low</option><option value="mileage_low">Lowest Mileage</option></select></div></div>{chips.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{chips.map((key) => <button key={key} type="button" onClick={() => removeFilter(key)} className="inline-flex items-center gap-1 rounded-full bg-brand-red/10 px-3 py-1 text-xs font-medium text-brand-red">{key === "maxPrice" ? "Max price" : key === "bodyType" ? "Body type" : key === "fuelType" ? "Fuel" : "Make"}<X size={12} /></button>)}</div>}</div>;
}
