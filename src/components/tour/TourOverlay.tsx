"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SmartButton } from "@/components/ui/SmartButton";
import { useTour } from "@/components/providers/TourProvider";
import type { TourStep, TourPlacement } from "@/lib/tour/tour-steps";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TourOverlayProps {
  step: TourStep;
  stepIndex: number;
  total: number;
}

const SPOTLIGHT_PADDING = 8;
const TOOLTIP_GAP = 16;
const TOOLTIP_WIDTH = 320;
const TOOLTIP_ESTIMATED_HEIGHT = 220;

export function TourOverlay({ step, stepIndex, total }: TourOverlayProps) {
  const { nextStep, prevStep, endTour } = useTour();
  const [rect, setRect] = useState<Rect | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({
      top: r.top - SPOTLIGHT_PADDING,
      left: r.left - SPOTLIGHT_PADDING,
      width: r.width + SPOTLIGHT_PADDING * 2,
      height: r.height + SPOTLIGHT_PADDING * 2,
    });
  }, [step.target]);

  // Scroll the target into view once per step. Doing this inside the scroll
  // listener would re-trigger itself, because scrolling fires scroll events.
  useEffect(() => {
    setHasScrolled(false);
  }, [step.target]);

  useLayoutEffect(() => {
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) return;
    const inView = (() => {
      const r = el.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= window.innerHeight;
    })();
    if (!inView) el.scrollIntoView({ behavior: "smooth", block: "center" });
    setHasScrolled(true);
    measure();
  }, [step.target, measure]);

  // Reposition while scrolling. The listener is passive and only measures; it
  // never scrolls, so it cannot feed back into itself.
  useEffect(() => {
    if (!hasScrolled) return;
    const onScrollOrResize = () => measure();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [hasScrolled, measure]);

  // Keep the spotlight above page chrome without permanently mutating the
  // target's own styles.
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
    if (!el) return;
    const previous = el.style.zIndex;
    el.style.zIndex = "9998";
    return () => {
      el.style.zIndex = previous;
    };
  }, [step.target]);

  useEffect(() => {
    tooltipRef.current?.focus();
  }, [step.target]);

  if (!rect) return null;

  const tooltipStyle = (placement: TourPlacement): React.CSSProperties => {
    // Clamp to the viewport: a target near an edge would otherwise push the
    // card off screen, leaving the buttons unreachable.
    const maxLeft = Math.max(8, window.innerWidth - TOOLTIP_WIDTH - 8);
    const left = Math.min(Math.max(8, rect.left), maxLeft);
    const below = rect.top + rect.height + TOOLTIP_GAP;
    const fitsBelow = below + TOOLTIP_ESTIMATED_HEIGHT < window.innerHeight;

    switch (placement) {
      case "top":
        return { bottom: window.innerHeight - rect.top + TOOLTIP_GAP, left };
      case "left":
        return { top: Math.max(8, rect.top), left: Math.max(8, rect.left - TOOLTIP_WIDTH - TOOLTIP_GAP) };
      case "right":
        return { top: Math.max(8, rect.top), left: Math.min(maxLeft, rect.left + rect.width + TOOLTIP_GAP) };
      default:
        // Flip above the target when there is no room below.
        return fitsBelow ? { top: below, left } : { bottom: window.innerHeight - rect.top + TOOLTIP_GAP, left };
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div
        className="absolute rounded-2xl border-2 border-brand transition-all duration-500 ease-swift pointer-events-auto"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          boxShadow: "0 0 0 9999px rgba(7, 8, 10, 0.75)",
        }}
      />

      <div
        ref={tooltipRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Tour step ${stepIndex + 1} of ${total}: ${step.title}`}
        tabIndex={-1}
        className="absolute w-80 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl shadow-lift p-5 pointer-events-auto animate-scale-in z-[10000] outline-none"
        style={tooltipStyle(step.placement ?? "bottom")}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={
                  i === stepIndex
                    ? "h-1 w-6 rounded-full bg-brand transition-all duration-300"
                    : "h-1 w-1.5 rounded-full bg-ink-200 dark:bg-ink-700 transition-all duration-300"
                }
              />
            ))}
          </div>
          <button
            type="button"
            onClick={endTour}
            aria-label="Close tour"
            className="p-1 text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors"
          >
            <Icon icon={X} size={14} />
          </button>
        </div>

        <h2 className="text-base font-display font-bold text-ink-900 dark:text-white mb-1.5">{step.title}</h2>
        <p className="text-sm text-ink-500 dark:text-ink-300 leading-relaxed mb-5">{step.description}</p>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={endTour}
            className="text-xs font-semibold text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 transition-colors"
          >
            Skip tour
          </button>
          <div className="flex gap-2">
            {stepIndex > 0 && (
              <SmartButton
                featureKey="ui.tour_prev"
                variant="ghost"
                size="sm"
                aria-label="Previous step"
                onClick={prevStep}
                className="!h-8 !px-3"
              >
                <Icon icon={ArrowLeft} size={14} />
              </SmartButton>
            )}
            <SmartButton featureKey="ui.tour_next" size="sm" onClick={nextStep} className="!h-8 !px-4">
              {stepIndex === total - 1 ? "Finish" : "Next"}
              {stepIndex < total - 1 && <Icon icon={ArrowRight} size={14} className="ml-1" />}
            </SmartButton>
          </div>
        </div>
      </div>
    </div>
  );
}
