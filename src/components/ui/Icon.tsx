import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";
import { ICON_SIZE, type IconSizeToken } from "./icons";

interface IconProps {
  icon: LucideIcon;
  /** A step on the size scale, or an explicit pixel size for a one-off. */
  size?: IconSizeToken | number;
  strokeWidth?: number;
  className?: string;
  /**
   * Icons here are decorative by default: the adjacent text already carries the
   * meaning, so exposing the glyph would make a screen reader announce it twice.
   * Pass a title when the icon is the only label (an icon-only button), and the
   * wrapper switches to `role="img"` with that name.
   */
  title?: string;
}

/** Thin wrapper that locks every icon to the house stroke weight. */
export function Icon({
  icon: LucideIconComponent,
  size = "md",
  strokeWidth = 1.75,
  className,
  title,
}: IconProps) {
  const px = typeof size === "number" ? size : ICON_SIZE[size];

  if (title) {
    return (
      <LucideIconComponent
        size={px}
        strokeWidth={strokeWidth}
        className={clsx(className)}
        role="img"
        aria-label={title}
      />
    );
  }

  return (
    <LucideIconComponent
      size={px}
      strokeWidth={strokeWidth}
      className={clsx(className)}
      aria-hidden="true"
      focusable="false"
    />
  );
}
