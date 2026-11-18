"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useEvents } from "@/components/providers/EventsProvider";
import { EventDetail } from "@/components/events/EventDetail";

/**
 * Resolves an event slug against the reader's own store.
 *
 * Events live only in this browser, so the lookup happens on the client. An unknown
 * slug — a stale link, or an event cleared with site data — gets an explicit
 * not-found state rather than falling back to a different event, which is what the
 * brief's constant-driven page would have done.
 */
export function EventDetailRoute({ slug }: { slug: string }) {
  const { events, isHydrated } = useEvents();

  if (!isHydrated) return null;

  const event = events.find((entry) => entry.slug === slug);

  if (!event) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <EmptyState
          icon={Calendar}
          title="Event not found"
          description={`No event with the address "${slug}" exists on this device. Events are stored in this browser, so one you added elsewhere or after clearing site data will not be here.`}
        />
        <p className="text-center mt-6">
          <Link href="/events" className="text-sm font-semibold text-brand hover:underline">
            Back to events
          </Link>
        </p>
      </div>
    );
  }

  return <EventDetail event={event} />;
}
