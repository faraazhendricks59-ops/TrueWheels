"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { FocusTrap } from "@/components/a11y/FocusTrap";
import { useScrollLock } from "@/components/ui/overlay-hooks";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { GalleryNote } from "./GalleryBadge";
import { SpinViewer } from "./SpinViewer";
import { VideoPlayer } from "./VideoPlayer";
import type { GalleryMedia } from "@/lib/gallery-media";

const MAX_ZOOM = 3;
const ZOOM_STEP = 0.5;

export function Lightbox({
  isOpen,
  onClose,
  media,
  startIndex,
  vehicleId,
  year,
}: {
  isOpen: boolean;
  onClose: () => void;
  media: GalleryMedia[];
  startIndex: number;
  vehicleId: string;
  year: number;
}) {
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const stageRef = useRef<HTMLDivElement>(null);

  useScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) setIndex(startIndex);
  }, [isOpen, startIndex]);

  // Reset the zoom whenever the item changes, so a new item never opens
  // magnified on a point that belonged to the previous one.
  useEffect(() => {
    setZoom(1);
    setOrigin({ x: 50, y: 50 });
  }, [index]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setIndex((value) => (value + 1) % media.length);
      else if (event.key === "ArrowLeft") setIndex((value) => (value - 1 + media.length) % media.length);
      else if (event.key === "+" || event.key === "=") setZoom((value) => Math.min(value + ZOOM_STEP, MAX_ZOOM));
      else if (event.key === "-") setZoom((value) => Math.max(value - ZOOM_STEP, 1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, media.length]);

  const active = media[index];
  if (!isOpen || !active) return null;

  const isPhoto = active.type === "photo" && Boolean(active.src);

  const onStageMove = (event: React.MouseEvent) => {
    if (zoom === 1 || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    setOrigin({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Gallery for ${media.length} items`}
      className="fixed inset-0 z-[100] bg-ink-950/95 backdrop-blur-xl"
    >
      <FocusTrap active={isOpen} onEscape={onClose}>
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-50">
          <span className="text-white/80 text-xs font-mono tabular-nums">
            {index + 1} / {media.length} · {active.label}
          </span>
          <div className="flex items-center gap-2">
            {isPhoto && (
              <>
                <button
                  type="button"
                  onClick={() => setZoom((value) => Math.max(value - ZOOM_STEP, 1))}
                  aria-label="Zoom out"
                  className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Icon icon={ZoomOut} size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((value) => Math.min(value + ZOOM_STEP, MAX_ZOOM))}
                  aria-label="Zoom in"
                  className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Icon icon={ZoomIn} size={18} />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close the gallery"
              className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <Icon icon={X} size={18} />
            </button>
          </div>
        </div>

        <div
          ref={stageRef}
          className="absolute inset-0 flex items-center justify-center p-12 md:p-16"
          onMouseMove={onStageMove}
          onClick={() => isPhoto && setZoom((value) => (value === 1 ? 2 : 1))}
        >
          {active.type === "spin" && active.src && (
            <div className="w-full h-full">
              <SpinViewer vehicleId={vehicleId} frames={active.frames ?? 36} label={active.label} />
            </div>
          )}
          {active.type === "video" && active.src && (
            <div className="w-full max-w-3xl aspect-video">
              <VideoPlayer src={active.src} poster={active.poster} />
            </div>
          )}
          {active.type === "photo" &&
            (active.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.src}
                alt={active.label}
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: `${origin.x}% ${origin.y}%`,
                  cursor: zoom > 1 ? "zoom-out" : "zoom-in",
                }}
                className="max-w-full max-h-full object-contain rounded-xl transition-transform duration-200 ease-swift"
              />
            ) : (
              <div className="w-full max-w-2xl aspect-[16/10] rounded-xl overflow-hidden">
                <MediaPlaceholder label={active.label} year={year} />
              </div>
            ))}
        </div>

        <div className="absolute bottom-4 left-4 right-4 max-w-xl mx-auto">
          <GalleryNote media={active} />
        </div>

        <button
          type="button"
          onClick={() => setIndex((value) => (value - 1 + media.length) % media.length)}
          aria-label="Previous item"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-brand transition-colors"
        >
          <Icon icon={ChevronLeft} size={22} />
        </button>
        <button
          type="button"
          onClick={() => setIndex((value) => (value + 1) % media.length)}
          aria-label="Next item"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-brand transition-colors"
        >
          <Icon icon={ChevronRight} size={22} />
        </button>
      </FocusTrap>
    </div>
  );
}
