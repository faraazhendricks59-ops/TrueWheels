"use client";

import { useRef, useEffect, ReactNode } from "react";
import { clsx } from "clsx";
import { useMotion } from "./MotionProvider";

interface MagneticProps {
  children: ReactNode;
  /** Fraction of the cursor's offset from centre that the element travels. */
  strength?: number;
  className?: string;
}

export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isStatic } = useMotion();

  useEffect(() => {
    if (isStatic) return;

    const el = ref.current;
    if (!el) return;

    // Transform is written straight to the node: routing every pointer event
    // through setState would re-render the subtree on each mousemove.
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const distanceX = e.clientX - (left + width / 2);
      const distanceY = e.clientY - (top + height / 2);
      el.style.transform = `translate3d(${distanceX * strength}px, ${distanceY * strength}px, 0)`;
    };

    const reset = () => {
      el.style.transform = "translate3d(0, 0, 0)";
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", reset);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", reset);
      reset();
    };
  }, [strength, isStatic]);

  return (
    <div
      ref={ref}
      className={clsx("inline-block transition-transform duration-300 ease-out will-change-transform", className)}
    >
      {children}
    </div>
  );
}
