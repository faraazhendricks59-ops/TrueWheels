"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { clsx } from "clsx";

type Variant = "up" | "down" | "left" | "right" | "fade" | "scale" | "blur";
const HIDDEN: Record<Variant, string> = {
  up: "opacity-0 translate-y-8",
  down: "opacity-0 -translate-y-8",
  left: "opacity-0 -translate-x-8",
  right: "opacity-0 translate-x-8",
  fade: "opacity-0",
  scale: "opacity-0 scale-95",
  blur: "opacity-0 blur-md",
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
  variant = "up",
  delay = 0,
  duration = 700,
  once = true,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` }}
      className={clsx(
        "transition-all ease-swift will-change-transform",
        visible ? "opacity-100 translate-x-0 translate-y-0 scale-100 blur-0" : HIDDEN[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
