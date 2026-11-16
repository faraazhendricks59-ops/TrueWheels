"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";

type Priority = "polite" | "assertive";

interface AnnouncerContextValue {
  /** Announce a message to assistive tech. Defaults to a polite interruption. */
  announce: (message: string, priority?: Priority) => void;
}

const AnnouncerContext = createContext<AnnouncerContextValue>({ announce: () => {} });

/** Read the announce function from the nearest AriaLiveAnnouncerProvider. */
export const useAnnounce = () => useContext(AnnouncerContext);

/**
 * Provides an `announce()` function and renders the two visually hidden live
 * regions it drives. Use for changes that happen without a focus move — a saved
 * listing, a copied link, a background result count.
 */
export function AriaLiveAnnouncerProvider({ children }: { children: ReactNode }) {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const announce = useCallback((message: string, priority: Priority = "polite") => {
    const setter = priority === "assertive" ? setAssertiveMessage : setPoliteMessage;
    // Clear first so repeating the same message still re-triggers an
    // announcement (screen readers ignore unchanged region content).
    setter("");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setter(message), 50);
  }, []);

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {politeMessage}
      </div>
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
}
