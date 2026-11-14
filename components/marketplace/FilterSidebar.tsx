"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FilterControls } from "./FilterControls";

export function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasActiveFilters = searchParams.size > 0;
  function clearAllFilters() { router.replace(pathname, { scroll: false }); }
  return <aside className="hidden w-72 flex-shrink-0 pr-6 md:block"><div className="sticky top-24 rounded-xl border border-brand-silver bg-surface-white p-5 shadow-sm"><div className="mb-6 flex items-center justify-between"><div className="flex items-center gap-2"><SlidersHorizontal size={18} className="text-brand-graphite" /><h2 className="font-bold text-brand-graphite">Filters</h2></div>{hasActiveFilters && <Button type="button" variant="ghost" size="sm" onClick={clearAllFilters} className="h-auto px-0 text-xs text-brand-red"><X size={12} /> Clear all</Button>}</div><FilterControls /></div></aside>;
}
