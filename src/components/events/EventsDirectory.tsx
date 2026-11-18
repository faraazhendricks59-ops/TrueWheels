"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, Search, Calendar } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import { CreateEventModal } from "@/components/events/CreateEventModal";
import { SmartButton } from "@/components/ui/SmartButton";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { FeatureGate } from "@/components/feature/FeatureGate";
import { useEvents } from "@/components/providers/EventsProvider";
import { EVENTS_DISCLOSURE, NO_PUBLIC_EVENTS } from "@/lib/events";

/**
 * The events directory.
 *
 * The brief seeded three invented events with attendee counts and "Verified
 * Organizer" badges. There is no events diary, so the directory lists only events the
 * reader has added on this device, and says so before the list. Sorting is by date,
 * soonest first, because that is the only ordering that means anything for a list of
 * dates.
 */
export function EventsDirectory() {
  const { events, isHydrated, rsvpFor } = useEvents();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = term
      ? events.filter(
          (event) =>
            event.title.toLowerCase().includes(term) ||
            event.venue.toLowerCase().includes(term) ||
            event.location.toLowerCase().includes(term),
        )
      : events;
    return [...list].sort((a, b) => a.date.localeCompare(b.date));
  }, [events, query]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Reveal variant="up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-ink-900 dark:text-white">Events</h1>
            <p className="text-ink-500 dark:text-ink-300 mt-1">
              Keep track of meets and track days. Events live on your device.
            </p>
          </div>
          <FeatureGate featureKey="events.create">
            <SmartButton featureKey="events.create_trigger" leftIcon={CalendarPlus} onClick={() => setIsCreateOpen(true)}>
              Add event
            </SmartButton>
          </FeatureGate>
        </div>
      </Reveal>

      <Reveal variant="up">
        <div className="mb-8 rounded-2xl border border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-900/50 p-5">
          <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed max-w-3xl">{EVENTS_DISCLOSURE}</p>
        </div>
      </Reveal>

      {events.length > 0 && (
        <Reveal variant="up" delay={100}>
          <div className="mb-6">
            <Input
              placeholder="Search your events…"
              leftIcon={Search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search your events"
            />
          </div>
        </Reveal>
      )}

      {!isHydrated ? null : events.length === 0 ? (
        <Reveal variant="up" delay={150}>
          <EmptyState
            icon={Calendar}
            title="No events yet"
            description={NO_PUBLIC_EVENTS}
            actionLabel="Add an event"
            actionFeatureKey="events.create_trigger"
            onAction={() => setIsCreateOpen(true)}
          />
        </Reveal>
      ) : filtered.length === 0 ? (
        <Reveal variant="up" delay={150}>
          <EmptyState
            icon={Search}
            title="No events match that"
            description={`Nothing in your events matches "${query.trim()}".`}
          />
        </Reveal>
      ) : (
        <Reveal variant="up" delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} rsvp={rsvpFor(event.id)} />
            ))}
          </div>
        </Reveal>
      )}

      <CreateEventModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
