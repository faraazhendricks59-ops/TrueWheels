"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";

type Priority = "polite" | "assertive";

interface AnnouncerContextValue {
  announce: (message: string, priority?: Priority) => void;
}

const AnnouncerContext = createContext<AnnouncerContextValue | undefined>(undefined);

export function useAnnounce() {
  const context = useContext(AnnouncerContext);
  if (!context) throw new Error("useAnnounce must be used inside an AriaLiveAnnouncerProvider");
  return context;
}

/**
 * Screen-reader bridge for state changes that have no visible counterpart
 * (result counts, background saves, live updates).
 *
 * Do NOT announce the same event that also raises a Toast: the Toast already
 * writes to its own live region, so calling both reads the message out twice.
 */
export function AriaLiveAnnouncerProvider({ children }: { children: ReactNode }) {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");
  const timers = useRef<{ polite?: number; assertive?: number }>({});

  // Clear the region before setting it so an identical message repeated twice is
  // still re-announced by the screen reader.
  const announce = useCallback((message: string, priority: Priority = "polite") => {
    const setter = priority === "assertive" ? setAssertiveMessage : setPoliteMessage;
    setter("");
    window.clearTimeout(timers.current[priority]);
    timers.current[priority] = window.setTimeout(() => setter(message), 50);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      window.clearTimeout(pending.polite);
      window.clearTimeout(pending.assertive);
    };
  }, []);

  const value = useMemo(() => ({ announce }), [announce]);

  return (
    <AnnouncerContext.Provider value={value}>
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
