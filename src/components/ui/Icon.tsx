import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

interface IconProps {
  icon: LucideIcon;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/** Thin wrapper that locks every icon to the house stroke weight. */
export function Icon({ icon: LucideIconComponent, size = 16, strokeWidth = 1.75, className }: IconProps) {
  return <LucideIconComponent size={size} strokeWidth={strokeWidth} className={clsx(className)} />;
}
