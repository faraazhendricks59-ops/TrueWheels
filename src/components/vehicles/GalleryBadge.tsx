"use client";

import { Camera, Info, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import type { GalleryMedia } from "@/lib/gallery-media";

/**
 * States what the item is. The brief called for badges reading "AI Enhanced"
 * and "Damage Detected"; nothing here analyses the images, so a badge claiming
 * either would be an invented assurance about the vehicle's condition.
 */
export function GalleryBadge({ media }: { media: GalleryMedia }) {
  const icon = media.type === "spin" ? RotateCcw : media.kind === "placeholder" ? Info : Camera;

  return (
    <Badge variant="trust" tone={media.kind === "placeholder" ? "ink" : "blue"}>
      <Icon icon={icon} size={10} />
      {media.kind === "illustration"
        ? "Illustration"
        : media.kind === "placeholder"
          ? "Placeholder"
          : "Photo"}
    </Badge>
  );
}

export function GalleryNote({ media }: { media: GalleryMedia }) {
  return (
    <p className="flex items-start gap-2 text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">
      <Icon icon={Info} size={12} className="mt-0.5 flex-shrink-0" />
      {media.note}
    </p>
  );
}
