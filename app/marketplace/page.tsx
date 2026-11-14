"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { VehicleCard } from "@/components/cards/VehicleCard";

const listings = [
  { title: "2021 VW Golf 8 GTI", price: 549000, mileage: 34000, location: "Sandton, Gauteng", imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80", make: "Volkswagen", fuel: "Petrol", boosted: true },
  { title: "2020 BMW M340i", price: 719000, mileage: 42000, location: "Cape Town, Western Cape", imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80", make: "BMW", fuel: "Petrol", boosted: true },
  { title: "2022 Toyota Hilux Legend", price: 639000, mileage: 28000, location: "Pretoria, Gauteng", imageUrl: "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=80", make: "Toyota", fuel: "Diesel", boosted: false },
  { title: "2019 Ford Mustang GT", price: 899000, mileage: 51000, location: "Cape Town, Western Cape", imageUrl: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80", make: "Ford", fuel: "Petrol", boosted: false },
];

export default function MarketplacePage() {
  const [query, setQuery] = useState("");
  const [make, setMake] = useState("All makes");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [sort, setSort] = useState("featured");

  const results = useMemo(() => listings.filter((listing) => {
    const matchesQuery = `${listing.title} ${listing.location}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (make === "All makes" || listing.make === make) && listing.price <= maxPrice;
  }).sort((a, b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : Number(b.boosted) - Number(a.boosted)), [query, make, maxPrice, sort]);

  return <main className="min-h-screen bg-surface-grey"><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-wider text-brand-red">Structured discovery</p><h1 className="mt-2 text-4xl font-extrabold tracking-tight">Find your next vehicle</h1><p className="mt-2 text-gray-600">Search trusted listings across Gauteng and the Western Cape.</p></div><div className="grid gap-8 lg:grid-cols-[260px_1fr]"><aside className="h-fit rounded-xl border border-brand-silver bg-white p-5 shadow-card"><div className="mb-5 flex items-center gap-2 font-bold"><SlidersHorizontal size={18} /> Filters</div><label className="mb-2 block text-sm font-semibold" htmlFor="search">Search</label><div className="mb-5 flex items-center rounded-lg border border-brand-silver px-3"><Search size={16} className="text-gray-400" /><input id="search" value={query} onChange={(event) => setQuery(event.target.value)} className="w-full border-0 px-2 py-2.5 text-sm outline-none" placeholder="Golf, BMW, Cape Town" /></div><label className="mb-2 block text-sm font-semibold" htmlFor="make">Make</label><select id="make" value={make} onChange={(event) => setMake(event.target.value)} className="mb-5 w-full rounded-lg border border-brand-silver px-3 py-2.5 text-sm"><option>All makes</option><option>BMW</option><option>Ford</option><option>Toyota</option><option>Volkswagen</option></select><label className="mb-2 block text-sm font-semibold" htmlFor="price">Maximum price: R {maxPrice.toLocaleString("en-ZA")}</label><input id="price" type="range" min="100000" max="1000000" step="25000" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="w-full accent-brand-red" /><button type="button" onClick={() => { setQuery(""); setMake("All makes"); setMaxPrice(1000000); }} className="mt-6 flex items-center gap-2 text-sm font-semibold text-brand-red"><Filter size={15} /> Clear filters</button></aside><section><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="font-semibold">{results.length} vehicles found</p><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort listings" className="rounded-lg border border-brand-silver bg-white px-3 py-2 text-sm"><option value="featured">Featured first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></div>{results.length ? <div className="grid gap-5 sm:grid-cols-2">{results.map((listing) => <Link key={listing.title} href={`/marketplace/${encodeURIComponent(listing.title.toLowerCase().replaceAll(" ", "-"))}`}><VehicleCard title={listing.title} price={listing.price} mileage={listing.mileage} location={listing.location} imageUrl={listing.imageUrl} isBoosted={listing.boosted} /></Link>)}</div> : <div className="rounded-xl border border-brand-silver bg-white p-10 text-center"><p className="font-bold">No matching vehicles</p><p className="mt-2 text-sm text-gray-500">Try broadening your filters.</p></div>}</section></div></div></main>;
}
