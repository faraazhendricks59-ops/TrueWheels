"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Play, RotateCcw } from "lucide-react";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { Lightbox } from "./Lightbox";
import { GalleryBadge, GalleryNote } from "./GalleryBadge";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { SpinViewer } from "./SpinViewer";
import { VideoPlayer } from "./VideoPlayer";
import type { GalleryMedia } from "@/lib/gallery-media";
import type { DemoVehicle } from "@/lib/demo/vehicles";

export function VehicleGallery({
  vehicle,
  media,
}: {
  vehicle: DemoVehicle;
  media: GalleryMedia[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const goNext = () => setActiveIndex((index) => (index + 1) % media.length);
  const goPrev = () => setActiveIndex((index) => (index - 1 + media.length) % media.length);

  const swipeRef = useSwipeGesture({ onSwipeLeft: goNext, onSwipeRight: goPrev, threshold: 60 });
  const active = media[activeIndex];
  if (!active) return null;

  return (
    <div className="relative">
      <div
        ref={swipeRef}
        className="relative aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden bg-ink-900 border border-ink-100 dark:border-ink-800 shadow-lift"
      >
        {active.type === "spin" && active.src && (
          <SpinViewer
            vehicleId={vehicle.id}
            frames={active.frames ?? 36}
            label={active.label}
          />
        )}
        {active.type === "video" && active.src && (
          <VideoPlayer src={active.src} poster={active.poster} />
        )}
        {active.type === "photo" &&
          (active.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={active.src} alt={active.label} className="w-full h-full object-cover" />
          ) : (
            <MediaPlaceholder label={active.label} year={vehicle.year} />
          ))}

        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          <GalleryBadge media={active} />
        </div>

        <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-ink-950/80 border border-white/10 text-white text-xs font-mono font-bold tabular-nums">
          {activeIndex + 1} / {media.length}
        </span>

        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="Open the gallery full screen"
          className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-ink-950/80 border border-white/10 text-white flex items-center justify-center hover:bg-brand transition-colors z-10"
        >
          <Icon icon={Maximize2} size={16} />
        </button>

        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous item"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink-950/60 text-white items-center justify-center hover:bg-brand transition-colors z-10"
        >
          <Icon icon={ChevronLeft} size={18} />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next item"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink-950/60 text-white items-center justify-center hover:bg-brand transition-colors z-10"
        >
          <Icon icon={ChevronRight} size={18} />
        </button>
      </div>

      <div className="mt-3">
        <GalleryNote media={active} />
      </div>

      <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar pb-2">
        {media.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${item.label}`}
            aria-current={index === activeIndex}
            className={clsx(
              "relative flex-shrink-0 w-24 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ease-swift",
              index === activeIndex ? "border-brand" : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            {item.type === "photo" && item.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.src} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full flex items-center justify-center bg-ink-100 dark:bg-ink-800 text-ink-400">
                <Icon icon={item.type === "spin" ? RotateCcw : item.type === "video" ? Play : Maximize2} size={16} />
              </span>
            )}
            <span className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-white bg-ink-950/70 rounded px-1 py-0.5 truncate">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        media={media}
        startIndex={activeIndex}
        vehicleId={vehicle.id}
        year={vehicle.year}
      />
    </div>
  );
}
