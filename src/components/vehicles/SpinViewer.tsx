"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { spinFrameUrl } from "@/lib/gallery-media";

const PX_PER_FRAME = 10;

/**
 * Drag to rotate. The frames come from the generated endpoint, so the rotation
 * is a real sequence rather than a single image that appears to move.
 */
export function SpinViewer({
  vehicleId,
  frames,
  label,
  onFirstDrag,
}: {
  vehicleId: string;
  frames: number;
  label: string;
  onFirstDrag?: () => void;
}) {
  const [frame, setFrame] = useState(1);
  const [hasDragged, setHasDragged] = useState(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startFrame = useRef(1);

  const wrap = (value: number) => ((value % frames) + frames) % frames || frames;

  const handleMove = useCallback(
    (clientX: number) => {
      if (!dragging.current) return;
      const delta = Math.round((clientX - startX.current) / PX_PER_FRAME);
      setFrame(wrap(startFrame.current + delta));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [frames]
  );

  const end = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => handleMove(event.clientX);
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches[0]) handleMove(event.touches[0].clientX);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", end);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", end);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", end);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", end);
    };
  }, [handleMove, end]);

  // Preload the frames so the rotation does not stutter on first drag.
  useEffect(() => {
    for (let index = 1; index <= frames; index++) {
      const image = new window.Image();
      image.src = spinFrameUrl(vehicleId, index);
    }
  }, [vehicleId, frames]);

  const start = (clientX: number) => {
    dragging.current = true;
    startX.current = clientX;
    startFrame.current = frame;
    if (!hasDragged) {
      setHasDragged(true);
      onFirstDrag?.();
    }
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none"
      onMouseDown={(event) => start(event.clientX)}
      onTouchStart={(event) => start(event.touches[0].clientX)}
      role="img"
      aria-label={`${label}. Drag to rotate.`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={spinFrameUrl(vehicleId, frame)}
        alt={`${label}, shown from ${Math.round((frame / frames) * 360)} degrees`}
        className="max-w-full max-h-full object-contain pointer-events-none"
        draggable={false}
      />

      {!hasDragged && (
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-ink-950/80 border border-white/10 text-white text-xs font-semibold">
          <Icon icon={RotateCcw} size={14} />
          Drag to rotate
        </span>
      )}

      <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-ink-950/80 border border-white/10 text-white text-xs font-mono tabular-nums">
        {Math.round((frame / frames) * 360)}°
      </span>
    </div>
  );
}
