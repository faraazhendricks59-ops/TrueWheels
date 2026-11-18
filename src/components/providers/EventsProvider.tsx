"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  EMPTY_EVENTS,
  EVENTS_KEY,
  RSVP_KEY,
  parseEvents,
  uniqueSlug,
  type EventRecord,
  type EventType,
  type RsvpStatus,
} from "@/lib/events";

interface EventsContextValue {
  events: EventRecord[];
  isHydrated: boolean;
  createEvent: (input: {
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: string;
    location: string;
    type: EventType;
  }) => string;
  removeEvent: (id: string) => void;
  /** The reader's own RSVP, per event. Absent means they have not answered. */
  rsvpFor: (eventId: string) => RsvpStatus;
  setRsvp: (eventId: string, status: RsvpStatus) => void;
}

const EventsContext = createContext<EventsContextValue>({
  events: [],
  isHydrated: false,
  createEvent: () => "",
  removeEvent: () => {},
  rsvpFor: () => "none",
  setRsvp: () => {},
});

export const useEvents = () => useContext(EventsContext);

function readRsvpMap(): Record<string, RsvpStatus> {
  try {
    const raw = window.localStorage.getItem(RSVP_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const out: Record<string, RsvpStatus> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (value === "going" || value === "interested" || value === "not_going" || value === "none") {
        out[key] = value;
      }
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * The reader's own events, and their own RSVP, kept on their device.
 *
 * Mirrors GarageProvider: first render is empty so server and client agree, then
 * the stores are read in an effect. There is no RSVP store that anyone else writes
 * to, so `rsvpFor` only ever reflects the reader's own answer, and the attendee
 * count shown anywhere is derived from that, not invented.
 */
export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventRecord[]>(EMPTY_EVENTS);
  const [rsvps, setRsvps] = useState<Record<string, RsvpStatus>>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const nextId = useRef(0);

  useEffect(() => {
    let stored: EventRecord[] = EMPTY_EVENTS;
    try {
      const raw = window.localStorage.getItem(EVENTS_KEY);
      stored = raw ? parseEvents(JSON.parse(raw)) : EMPTY_EVENTS;
    } catch {
      stored = EMPTY_EVENTS;
    }
    nextId.current = stored.length + 1;
    setEvents(stored);
    setRsvps(readRsvpMap());
    setIsHydrated(true);
  }, []);

  const persistEvents = useCallback((next: EventRecord[]) => {
    setEvents(next);
    try {
      window.localStorage.setItem(EVENTS_KEY, JSON.stringify(next));
    } catch {
      // Quota or private mode: the session keeps working, it just will not survive a reload.
    }
  }, []);

  const createEvent = useCallback<EventsContextValue["createEvent"]>(
    (input) => {
      const id = `evt-${nextId.current++}`;
      const slug = uniqueSlug(input.title, events);
      const record: EventRecord = {
        id,
        slug,
        title: input.title.trim(),
        description: input.description.trim(),
        date: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
        venue: input.venue.trim(),
        location: input.location.trim(),
        type: input.type,
        createdAt: new Date().toISOString(),
      };
      persistEvents([...events, record]);
      return slug;
    },
    [events, persistEvents],
  );

  const removeEvent = useCallback<EventsContextValue["removeEvent"]>(
    (id) => {
      persistEvents(events.filter((event) => event.id !== id));
      setRsvps((current) => {
        if (!(id in current)) return current;
        const next = { ...current };
        delete next[id];
        try {
          window.localStorage.setItem(RSVP_KEY, JSON.stringify(next));
        } catch {
          // Non-fatal: the stale key is harmless and is ignored on the next read.
        }
        return next;
      });
    },
    [events, persistEvents],
  );

  const rsvpFor = useCallback<EventsContextValue["rsvpFor"]>((eventId) => rsvps[eventId] ?? "none", [rsvps]);

  const setRsvp = useCallback<EventsContextValue["setRsvp"]>((eventId, status) => {
    setRsvps((current) => {
      const next = { ...current, [eventId]: status };
      try {
        window.localStorage.setItem(RSVP_KEY, JSON.stringify(next));
      } catch {
        // Storage refused: the in-memory value still reflects the choice for this session.
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ events, isHydrated, createEvent, removeEvent, rsvpFor, setRsvp }),
    [events, isHydrated, createEvent, removeEvent, rsvpFor, setRsvp],
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}
