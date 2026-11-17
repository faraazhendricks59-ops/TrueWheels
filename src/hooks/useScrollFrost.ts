"use client";

import { useEffect, useState } from "react";

/**
 * True once the page is scrolled past `threshold`.
 *
 * Scroll events are coalesced through requestAnimationFrame so a fast scroll
 * triggers at most one state write per frame, and the listener is passive so it
 * never blocks scrolling.
 */
export function useScrollFrost(threshold = 20) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > threshold);
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // The page may already be scrolled on mount (refresh mid-page, back nav).
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}
