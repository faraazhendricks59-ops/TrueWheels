"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const makes = ["BMW", "Volkswagen", "Toyota", "Ford", "Mercedes-Benz"];
const bodyTypes = ["Sedan", "SUV", "Hatchback", "Bakkie", "Coupe"];
const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];

function FilterSelect({ label, queryKey, options }: { label: string; queryKey: string; options: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get(queryKey) ?? "";

  function update(nextValue: string) {
    const params = new URLSearchParams(searchParams.toString());
    nextValue ? params.set(queryKey, nextValue) : params.delete(queryKey);
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  }

  return <div><label htmlFor={`filter-${queryKey}`} className="mb-3 block text-sm font-semibold text-brand-graphite">{label}</label><select id={`filter-${queryKey}`} value={value} onChange={(event) => update(event.target.value)} className="h-10 w-full rounded-lg border border-brand-silver bg-surface-grey px-3 text-sm focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"><option value="">{label === "Max Price" ? "No Limit" : `Any ${label}`}</option>{options.map((option) => <option key={option} value={option}>{label === "Max Price" ? `R ${Number(option).toLocaleString("en-ZA")}` : option}</option>)}</select></div>;
}

function FilterCheckboxes({ label, queryKey, options }: { label: string; queryKey: string; options: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = searchParams.get(queryKey) ?? "";

  function update(option: string, checked: boolean) {
    const params = new URLSearchParams(searchParams.toString());
    checked ? params.set(queryKey, option) : params.delete(queryKey);
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  }

  return <fieldset><legend className="mb-3 block text-sm font-semibold text-brand-graphite">{label}</legend><div className="space-y-2">{options.map((option) => <label key={option} className="group flex cursor-pointer items-center gap-3"><input type="checkbox" checked={selected === option} onChange={(event) => update(option, event.target.checked)} className="h-4 w-4 rounded border-brand-silver text-brand-red focus:ring-brand-red/20" /><span className="text-sm text-gray-600 transition-colors group-hover:text-brand-graphite">{option}</span></label>)}</div></fieldset>;
}

export function FilterControls() {
  return <div className="space-y-6"><FilterSelect label="Max Price" queryKey="maxPrice" options={["200000", "500000", "1000000", "2000000"]} /><FilterSelect label="Make" queryKey="make" options={makes} /><FilterCheckboxes label="Body Type" queryKey="bodyType" options={bodyTypes} /><FilterCheckboxes label="Fuel Type" queryKey="fuelType" options={fuelTypes} /></div>;
}
