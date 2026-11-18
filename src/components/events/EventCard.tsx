"use client";

import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Magnetic } from "@/components/motion/Magnetic";
import { EVENT_TYPE_LABELS, RSVP_LABELS, type EventRecord, type RsvpStatus } from "@/lib/events";
import { localeTag } from "@/lib/i18n/locale";

const TYPE_TONE: Record<EventRecord["type"], "red" | "blue" | "aurora" | "green" | "ink"> = {
  track_day: "red",
  meet: "blue",
  show: "aurora",
  workshop: "green",
  other: "ink",
};

/**
 * The discovery primitive.
 *
 * The brief's card showed an attendee count, a car count, an organiser avatar and a
 * "Verified" organiser. There is no events service and no accounts, so all of those
 * would be invented; a "124 going" on an event nobody else can see is a number with
 * nothing behind it. This card shows what the reader's own event actually has: its
 * date, its venue and the type they chose. The RSVP badge reflects only their own
 * answer, stored on this device.
 */
export function EventCard({ event, rsvp }: { event: EventRecord; rsvp: RsvpStatus }) {
  const date = new Date(`${event.date}T00:00:00`);
  const day = new Intl.DateTimeFormat(localeTag("en"), { day: "2-digit" }).format(date);
  const month = new Intl.DateTimeFormat(localeTag("en"), { month: "short" }).format(date).toUpperCase();
  const weekday = new Intl.DateTimeFormat(localeTag("en"), { weekday: "short" }).format(date);

  return (
    <Magnetic strength={0.03}>
      <Link
        href={`/events/${event.slug}`}
        className="block group bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl overflow-hidden hover:border-brand/30 hover:shadow-lift transition-all ease-swift"
      >
        <div className="relative h-32 bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-700">
          <div className="absolute top-3 left-3 bg-white dark:bg-ink-900 rounded-xl px-2.5 py-1.5 text-center shadow-lift border border-ink-100 dark:border-ink-800">
            <p className="text-[9px] font-bold text-ink-400 uppercase leading-none">{month}</p>
            <p className="text-xl font-display font-bold text-ink-900 dark:text-white leading-tight">{day}</p>
            <p className="text-[9px] font-bold text-ink-400 uppercase leading-none">{weekday}</p>
          </div>

          <div className="absolute top-3 right-3">
            <Badge variant="status" tone={TYPE_TONE[event.type]}>
              {EVENT_TYPE_LABELS[event.type]}
            </Badge>
          </div>

          {rsvp !== "none" && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="status" tone={rsvp === "going" ? "green" : rsvp === "interested" ? "amber" : "ink"}>
                {RSVP_LABELS[rsvp]}
              </Badge>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-base font-display font-bold text-ink-900 dark:text-white mb-2 line-clamp-2 group-hover:text-brand transition-colors">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed line-clamp-2 mb-4">
              {event.description}
            </p>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-ink-600 dark:text-ink-300">
              <Icon icon={Calendar} size={12} className="text-ink-400" />
              <span>{event.startTime ? `${event.startTime}${event.endTime ? ` – ${event.endTime}` : ""}` : "All day"}</span>
            </div>
            {(event.venue || event.location) && (
              <div className="flex items-center gap-2 text-xs text-ink-600 dark:text-ink-300">
                <Icon icon={MapPin} size={12} className="text-ink-400" />
                <span className="truncate">{[event.venue, event.location].filter(Boolean).join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </Magnetic>
  );
}
