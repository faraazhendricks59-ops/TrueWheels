"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";

interface SafeAreaProps {
  children: ReactNode;
  className?: string;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}

/** Pushes full-bleed content clear of notches, rounded corners and home bars. */
export function SafeArea({ children, className, top, bottom, left, right }: SafeAreaProps) {
  return (
    <div
      className={clsx(
        top && "pt-[var(--sat)]",
        bottom && "pb-[var(--sab)]",
        left && "pl-[var(--sal)]",
        right && "pr-[var(--sar)]",
        className
      )}
    >
      {children}
    </div>
  );
}
