"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface MotionContextType {
  prefersReducedMotion: boolean;
  isLowData: boolean;
  /** True when animation should be suppressed for this user. */
  isStatic: boolean;
}

const MotionContext = createContext<MotionContextType>({
  prefersReducedMotion: false,
  isLowData: false,
  isStatic: false,
});

export const useMotion = () => useContext(MotionContext);

export function MotionProvider({ children }: { children: ReactNode }) {
  // State, not refs: refs do not trigger a re-render, so consumers would be
  // stuck on the initial `false` and reduced-motion would never be honoured.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLowData, setIsLowData] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener("change", onMotionChange);

    const root = document.documentElement;
    const syncLowData = () => setIsLowData(root.classList.contains("low-data"));
    syncLowData();

    // The low-data toggle flips a class on <html> at runtime.
    const observer = new MutationObserver(syncLowData);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      observer.disconnect();
    };
  }, []);

  const isStatic = prefersReducedMotion || isLowData;

  // Global cursor tracking: writes two CSS variables per frame instead of
  // re-rendering React, which is what keeps the glow from thrashing layout.
  useEffect(() => {
    if (isStatic) return;

    let rafId = 0;
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const updateGlow = () => {
      const style = document.documentElement.style;
      style.setProperty("--mouse-x", `${mouseX}px`);
      style.setProperty("--mouse-y", `${mouseY}px`);
      rafId = requestAnimationFrame(updateGlow);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateGlow);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [isStatic]);

  return (
    <MotionContext.Provider value={{ prefersReducedMotion, isLowData, isStatic }}>
      {children}
    </MotionContext.Provider>
  );
}
