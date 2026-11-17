"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { stepsForViewport, type TourStep } from "@/lib/tour/tour-steps";
import { TourOverlay } from "@/components/tour/TourOverlay";
import { useFeatureFlags } from "@/lib/feature-flags";

interface TourContextValue {
  startTour: () => void;
  endTour: () => void;
  isActive: boolean;
  currentStep: TourStep | null;
  stepIndex: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
}

const TourContext = createContext<TourContextValue>({
  startTour: () => {},
  endTour: () => {},
  isActive: false,
  currentStep: null,
  stepIndex: 0,
  totalSteps: 0,
  nextStep: () => {},
  prevStep: () => {},
});

export const useTour = () => useContext(TourContext);

const STORAGE_KEY = "truewheels_tour_completed";
const ONBOARDING_KEY = "truewheels_onboarding_complete";

export function TourProvider({ children }: { children: ReactNode }) {
  const { isEnabled } = useFeatureFlags();
  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const steps = useMemo(() => stepsForViewport(isMobile), [isMobile]);
  const tourEnabled = isEnabled("ui.guided_tour");

  const endTour = useCallback(() => {
    setIsActive(false);
    setStepIndex(0);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Private mode: the tour simply offers itself again next visit.
    }
  }, []);

  const startTour = useCallback(() => {
    setStepIndex(0);
    setIsActive(true);
  }, []);

  // Offer the tour once, and only to someone who has already finished the
  // first-run flow. Starting it during onboarding would spotlight the splash
  // and intent screens, whose targets are not mounted yet.
  useEffect(() => {
    if (!tourEnabled) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
      if (localStorage.getItem(ONBOARDING_KEY) !== "true") return;
    } catch {
      return;
    }
    timer = setTimeout(() => setIsActive(true), 2000);
    return () => clearTimeout(timer);
  }, [tourEnabled]);

  // A step whose target is absent (flag off, viewport mismatch) must be skipped
  // rather than shown: the overlay renders nothing without a rect, which would
  // leave the user with a dimmed screen and no way forward.
  useEffect(() => {
    if (!isActive) return;
    if (steps.length === 0) {
      setIsActive(false);
      return;
    }
    if (stepIndex >= steps.length) {
      setStepIndex(steps.length - 1);
      return;
    }
    if (typeof document === "undefined") return;
    if (!document.querySelector(`[data-tour="${steps[stepIndex].target}"]`)) {
      if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
      else endTour();
    }
  }, [isActive, stepIndex, steps, endTour]);

  const nextStep = useCallback(() => {
    setStepIndex((current) => {
      if (current >= steps.length - 1) {
        endTour();
        return current;
      }
      return current + 1;
    });
  }, [steps.length, endTour]);

  const prevStep = useCallback(() => {
    setStepIndex((current) => Math.max(0, current - 1));
  }, []);

  // Escape ends the tour. Registered on the window so it fires regardless of
  // focus, but only while the tour is actually running.
  useEffect(() => {
    if (!isActive) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") endTour();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isActive, endTour]);

  const value = useMemo(
    () => ({
      startTour,
      endTour,
      isActive,
      currentStep: isActive ? steps[stepIndex] ?? null : null,
      stepIndex,
      totalSteps: steps.length,
      nextStep,
      prevStep,
    }),
    [startTour, endTour, isActive, steps, stepIndex, nextStep, prevStep]
  );

  return (
    <TourContext.Provider value={value}>
      {children}
      {isActive && value.currentStep && (
        <TourOverlay step={value.currentStep} stepIndex={stepIndex} total={steps.length} />
      )}
    </TourContext.Provider>
  );
}
