"use client";

import { useEffect, useRef, ReactNode } from "react";
import { clsx } from "clsx";
import { useMotion } from "./MotionProvider";

interface ParallaxProps {
  children: ReactNode;
  /** 0 = pinned, 0.5 = drifts half as far as the scroll. */
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
  // The measuring node is separate from the transformed node. Applying the
  // transform to the element we then measure would feed the offset back into
  // getBoundingClientRect() and make the element drift.
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const { isStatic } = useMotion();

  useEffect(() => {
    if (isStatic) return;

    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner) return;

    let rafId = 0;

    const update = () => {
      const rect = frame.getBoundingClientRect();
      // Progress of the element through the viewport: 1 when its top sits at
      // the bottom edge, 0 when its top reaches the top edge. Bounded, so the
      // offset can never run away as the element scrolls past.
      const progress = Math.min(Math.max((window.innerHeight - rect.top) / window.innerHeight, 0), 1);
      const offset = (progress - 0.5) * speed * window.innerHeight;
      inner.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed, isStatic]);

  return (
    <div ref={frameRef} className={clsx("relative", className)}>
      <div ref={innerRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
