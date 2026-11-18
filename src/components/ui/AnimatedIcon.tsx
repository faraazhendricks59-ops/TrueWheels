"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import { Icon } from "./Icon";
import type { IconSizeToken } from "./icons";

export type IconMotion = "bell" | "pop" | "spin" | "wiggle";

interface AnimatedIconProps {
  icon: LucideIcon;
  /**
   * `bell`   — shakes once, for a notification that just arrived.
   * `pop`    — springs up briefly, for a save/favourite that was toggled on.
   * `spin`   — continuous rotation, for a loading state.
   * `wiggle` — a small rotation back and forth, for an attention nudge.
   */
  motion: IconMotion;
  /**
   * A value that, when it changes, replays the one-shot motions (`bell`, `pop`,
   * `wiggle`). Pass the count of new items, or a boolean toggled from false to
   * true. `spin` ignores it and runs continuously.
   */
  trigger?: unknown;
  size?: IconSizeToken | number;
  strokeWidth?: number;
  className?: string;
  title?: string;
}

/**
 * The handful of icons that read better with motion than without.
 *
 * Kept as one component rather than four, and driven by CSS classes in
 * globals.css rather than a JS animation loop, so the whole thing costs one
 * keyframe replay and no per-frame work. The one-shot motions replay by
 * remounting the glyph, which is the only reliable way to restart a CSS
 * animation without a Web Animations API call.
 */
export function AnimatedIcon({
  icon,
  motion,
  trigger,
  size = "md",
  strokeWidth = 1.75,
  className,
  title,
}: AnimatedIconProps) {
  const isOneShot = motion !== "spin";
  // The key forces a remount so the animation restarts on each trigger change.
  const [playKey, setPlayKey] = useState(0);
  const firstRun = useRef(true);

  useEffect(() => {
    if (!isOneShot) return;
    // Do not animate on mount: an icon that shakes as the page loads reads as a
    // glitch. Only a change after the first render is a real event.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setPlayKey((k) => k + 1);
  }, [trigger, isOneShot]);

  return (
    <span className={clsx("inline-flex", motion === "spin" && "icon-spin")} aria-hidden="true">
      <Icon
        key={playKey}
        icon={icon}
        size={size}
        strokeWidth={strokeWidth}
        title={title}
        className={clsx(isOneShot && `icon-${motion}`, className)}
      />
    </span>
  );
}
