"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

interface VehicleGalleryProps { images: string[]; }

export function VehicleGallery({ images }: VehicleGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const safeImages = images.filter(Boolean);
  const count = safeImages.length;
  const activeImage = safeImages[activeIndex] ?? safeImages[0];

  useEffect(() => { if (!isLightboxOpen) return; const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setIsLightboxOpen(false); if (event.key === "ArrowRight") setActiveIndex((index) => (index + 1) % count); if (event.key === "ArrowLeft") setActiveIndex((index) => (index - 1 + count) % count); }; document.addEventListener("keydown", onKeyDown); return () => document.removeEventListener("keydown", onKeyDown); }, [count, isLightboxOpen]);

  if (!activeImage || count === 0) return <div className="flex aspect-[16/10] items-center justify-center rounded-xl border border-brand-silver bg-gray-100 text-sm text-gray-500">No vehicle images available</div>;
  const previous = () => setActiveIndex((index) => (index - 1 + count) % count);
  const next = () => setActiveIndex((index) => (index + 1) % count);
  return <div className="w-full space-y-3"><div className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-brand-silver bg-gray-100"><Image src={activeImage} alt={`Vehicle view ${activeIndex + 1} of ${count}`} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />{count > 1 && <><button type="button" aria-label="Previous image" onClick={previous} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-surface-white/90 p-2 text-brand-graphite opacity-100 shadow-sm transition-opacity hover:bg-surface-white md:opacity-0 md:group-hover:opacity-100"><ChevronLeft size={20} /></button><button type="button" aria-label="Next image" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-surface-white/90 p-2 text-brand-graphite opacity-100 shadow-sm transition-opacity hover:bg-surface-white md:opacity-0 md:group-hover:opacity-100"><ChevronRight size={20} /></button></>}<button type="button" aria-label="Open image gallery" onClick={() => setIsLightboxOpen(true)} className="absolute bottom-3 right-3 rounded-full bg-surface-white/90 p-2 text-brand-graphite shadow-sm hover:bg-surface-white"><Expand size={18} /></button><span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white">{activeIndex + 1} / {count}</span></div>{count > 1 && <div className="flex gap-2 overflow-x-auto pb-2">{safeImages.map((image, index) => <button key={`${image}-${index}`} type="button" aria-label={`Show vehicle image ${index + 1}`} aria-current={activeIndex === index} onClick={() => setActiveIndex(index)} className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${activeIndex === index ? "border-brand-red" : "border-transparent opacity-60 hover:opacity-100"}`}><Image src={image} alt="" fill sizes="80px" className="object-cover" /></button>)}</div>}{isLightboxOpen && <div role="dialog" aria-modal="true" aria-label="Vehicle image gallery" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" onClick={() => setIsLightboxOpen(false)}><div className="relative h-full w-full max-w-6xl" onClick={(event) => event.stopPropagation()}><Image src={activeImage} alt={`Vehicle view ${activeIndex + 1} of ${count}`} fill className="object-contain" sizes="100vw" /><button type="button" aria-label="Close image gallery" onClick={() => setIsLightboxOpen(false)} className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-brand-graphite"><X size={20} /></button>{count > 1 && <><button type="button" aria-label="Previous image" onClick={previous} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-brand-graphite"><ChevronLeft size={24} /></button><button type="button" aria-label="Next image" onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-brand-graphite"><ChevronRight size={24} /></button></>}</div></div>}</div>;
}
