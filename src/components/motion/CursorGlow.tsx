"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";

interface CursorGlowProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps content in a surface that carries the ambient cursor illumination.
 * The gradient itself lives in `.cursor-glow` (globals.css) and reads the
 * `--mouse-x` / `--mouse-y` variables written by MotionProvider.
 */
export function CursorGlow({ children, className }: CursorGlowProps) {
  return <div className={clsx("cursor-glow", className)}>{children}</div>;
}
