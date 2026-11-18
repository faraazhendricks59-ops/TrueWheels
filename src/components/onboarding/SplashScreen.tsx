"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Auto-dismiss after animation completes
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 600); // Wait for exit animation
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-ink-950 noise transition-all duration-700 ease-swift ${
        exiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Aurora Glow */}
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[120px]" />

      {/* Animated Logo */}
      <div className="relative z-10">
        <Logo variant="full" size="xl" animated />
      </div>

      {/* Loading Line */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-brand animate-shimmer w-full" />
    </div>
  );
}
