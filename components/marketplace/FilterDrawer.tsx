"use client";

import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FilterControls } from "./FilterControls";

export function FilterDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (!isOpen) return; closeButtonRef.current?.focus(); const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setIsOpen(false); }; document.addEventListener("keydown", onKeyDown); return () => document.removeEventListener("keydown", onKeyDown); }, [isOpen]);
  return <><Button type="button" variant="outline" size="sm" className="md:hidden" onClick={() => setIsOpen(true)}><SlidersHorizontal size={16} /> Filters</Button>{isOpen && <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-labelledby="filter-drawer-title"><button type="button" aria-label="Close filters" className="absolute inset-0 h-full w-full bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} /><div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-surface-white"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-silver bg-surface-white p-4"><h2 id="filter-drawer-title" className="text-lg font-bold text-brand-graphite">Filter Vehicles</h2><button ref={closeButtonRef} type="button" aria-label="Close filters" onClick={() => setIsOpen(false)} className="rounded-full p-2 hover:bg-surface-grey"><X size={20} /></button></div><div className="p-4 pb-24"><FilterControls /></div><div className="sticky bottom-0 flex gap-3 border-t border-brand-silver bg-surface-white p-4"><Button type="button" variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>Cancel</Button><Button type="button" className="flex-1" onClick={() => setIsOpen(false)}>Show Results</Button></div></div></div>}</>;
}
