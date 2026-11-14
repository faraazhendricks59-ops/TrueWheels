"use client";

import { FormEvent, useState } from "react";
import { Car, MapPin, Search } from "lucide-react";

export function SearchBar() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("Johannesburg, Gauteng");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams({ ...(make && { make }), ...(model && { model }), ...(maxPrice && { maxPrice }), ...(location && { location }) });
    window.location.assign(`/marketplace?${params.toString()}`);
  }

  return <div className="mx-auto w-full max-w-5xl rounded-xl border border-brand-silver bg-surface-white p-4 shadow-card"><form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-5"><label className="relative"><span className="sr-only">Make</span><Car className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><select value={make} onChange={(event) => setMake(event.target.value)} className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-brand-silver bg-surface-grey pl-9 pr-4 text-sm text-brand-graphite focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"><option value="">Any Make</option><option value="bmw">BMW</option><option value="vw">Volkswagen</option><option value="toyota">Toyota</option><option value="ford">Ford</option></select></label><label><span className="sr-only">Model</span><select value={model} onChange={(event) => setModel(event.target.value)} className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-brand-silver bg-surface-grey px-4 text-sm text-brand-graphite focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"><option value="">Any Model</option><option value="m3">M3</option><option value="gti">GTI</option><option value="hilux">Hilux</option></select></label><label><span className="sr-only">Maximum price</span><select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-brand-silver bg-surface-grey px-4 text-sm text-brand-graphite focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"><option value="">Max Price</option><option value="200000">R 200,000</option><option value="500000">R 500,000</option><option value="1000000">R 1,000,000</option><option value="2000000">R 2,000,000+</option></select></label><label className="relative"><span className="sr-only">Location</span><MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location" className="h-11 w-full rounded-lg border border-brand-silver bg-surface-grey pl-9 pr-4 text-sm text-brand-graphite placeholder:text-gray-400 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20" /></label><button type="submit" className="flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-red text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-red-dark"><Search size={16} />Search Cars</button></form><div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500"><MapPin size={12} /><span>Searching near: <button type="button" onClick={() => setLocation("Johannesburg, Gauteng")} className="font-medium text-brand-red hover:underline">{location || "Choose a location"}</button></span></div></div>;
}
