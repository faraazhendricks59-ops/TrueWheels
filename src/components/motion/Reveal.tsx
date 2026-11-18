"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { clsx } from "clsx";

/**
 * `blur` and `focus` are the same motion at two strengths: the content resolves out
 * of a soft blur instead of sliding in. Because the eye is drawn to the thing that
 * just sharpened, it reads as clearer than a plain fade — which is why it is the
 * default for the surfaces that matter (search results, listing grids).
 */
type Variant = "up" | "down" | "left" | "right" | "fade" | "scale" | "blur" | "focus";

const HIDDEN: Record<Variant, string> = {
  up: "opacity-0 translate-y-6",
  down: "opacity-0 -translate-y-6",
  left: "opacity-0 -translate-x-6",
  right: "opacity-0 translate-x-6",
  fade: "opacity-0",
  scale: "opacity-0 scale-[0.97]",
  blur: "opacity-0 blur-[6px]",
  focus: "opacity-0 blur-[10px] translate-y-2",
};

interface RevealProps {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export function Reveal({
  children,
  variant = "focus",
  delay = 0,
  duration = 600,
  once = true,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Without this the content would stay blurred forever for a reader who never
    // scrolls it into view — and for anyone who has asked for reduced motion, a
    // blur resolving is exactly the kind of movement to avoid. Both cases simply
    // render the final state.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` }}
      className={clsx(
        "reveal-host transition-[opacity,transform,filter] ease-swift will-change-transform",
        visible
          ? "opacity-100 translate-x-0 translate-y-0 scale-100 blur-0"
          : HIDDEN[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
