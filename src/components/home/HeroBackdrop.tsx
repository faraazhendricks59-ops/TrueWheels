"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

/**
 * The looping video behind the home hero.
 *
 * It plays muted and loops forever, which is what was asked for. Autoplay only
 * works when the video is muted, so the audio track was removed rather than
 * muted: a muted attribute can be toggled, and an unmuted 14-second loop behind
 * a page is not something a visitor should have to discover.
 *
 * Three things stop it from being a liability:
 *
 *  - It does not run for anyone who has asked for reduced motion, or who has
 *    turned on the low-data mode this project already has. A looping video is
 *    exactly what those settings exist for, and it is the heaviest thing on the
 *    page.
 *  - A poster frame is shown first, so the band is never empty while the file
 *    downloads.
 *  - The source is H.264. The file supplied was HEVC, which Firefox cannot play
 *    at all and Chrome only sometimes, so the loop would have been a black
 *    rectangle for a large share of visitors.
 *
 * The clip wrapper carries its own `overflow-hidden` and sits at `z-0`, with the
 * hero content lifted to `z-10` above it. A negative z-index here would not work:
 * the wrapper would escape to the root stacking context and paint *behind* the
 * shell's opaque page background, so the video would decode and never be seen.
 * The band itself is not clipped, because the search results dropdown hangs
 * below the band and would be cut off.
 */
export function HeroBackdrop() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStatic, setIsStatic] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const lowData = document.documentElement.classList.contains("low-data");
      setIsStatic(motionQuery.matches || lowData);
    };

    sync();
    motionQuery.addEventListener("change", sync);

    // The low-data class is flipped on <html> at runtime by the settings toggle.
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      motionQuery.removeEventListener("change", sync);
      observer.disconnect();
    };
  }, []);

  // Belt and braces: if a browser blocks autoplay anyway, try once on mount.
  useEffect(() => {
    if (isStatic) return;
    videoRef.current?.play().catch(() => {
      /* Autoplay refused; the poster remains, which is fine. */
    });
  }, [isStatic]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {!isStatic && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/hero-loop.mp4"
          poster="/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        />
      )}

      {isStatic && (
        <img
          src="/hero-poster.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Keeps the header, the heading and the search bar readable over whatever
          frame is showing. The video is dark, so this is a floor rather than a
          heavy wash. */}
      <div
        className={clsx(
          "absolute inset-0",
          "bg-gradient-to-b from-ink-950/80 via-ink-950/60 to-ink-950/85",
        )}
      />
    </div>
  );
}
