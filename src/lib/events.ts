/**
 * Events, and the one part of this phase that is genuinely real.
 *
 * The brief asked for a discovery directory seeded with three events ("Kyalami
 * Track Day", "Cars & Coffee — Camps Bay", "JDM Show & Shine"), each carrying an
 * attendee count (124, 89, 342), a car count, a named organiser with a "Verified
 * Organizer" badge, and a list of attendees pulled from their digital garages.
 *
 * There is no events diary, and the repo already records why: src/lib/social.ts and
 * src/lib/groups.ts both say so, and Phase 46 removed a fabricated "Kyalami Track
 * Day — November, R 1 250" from the command palette for exactly this reason. So:
 *
 *  - The events are invented. "Kyalami Grand Circuit" is a real venue, but nothing
 *    here schedules anything there, and an event that names a real circuit and a
 *    real date is a false announcement: someone could plan a trip around it. The
 *    three events in the brief were not real, and neither were their dates.
 *  - Attendee and car counts are invented. There is no RSVP store that other people
 *    write to, so "124 going" is a number with nothing behind it.
 *  - A "Verified Organizer" badge asserts a check against an identity register that
 *    nothing performs (src/lib/profile.ts, NO_VERIFICATION).
 *  - Attendees "bringing their car from their Digital Garage" implies other people's
 *    garages. Garages are local to a device (src/lib/garage.ts), so nobody else's
 *    exists to read.
 *
 * What is real is a calendar file. An event the reader writes down, and an .ics
 * export that Google, Apple and Outlook all understand, is a genuine feature that
 * works entirely in the browser. So the reader can keep their own events and export
 * them, and the RSVP is their own answer about their own event. There is no
 * directory of other people's events to browse, and the UI says so.
 */

export const EVENTS_KEY = "truewheels_events_v1";
export const RSVP_KEY = "truewheels_event_rsvp_v1";

export const EVENT_TYPES = ["track_day", "meet", "show", "workshop", "other"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  track_day: "Track day",
  meet: "Meet",
  show: "Show",
  workshop: "Workshop",
  other: "Other",
};

export const RSVP_STATUSES = ["going", "interested", "not_going", "none"] as const;
export type RsvpStatus = (typeof RSVP_STATUSES)[number];

export const RSVP_LABELS: Record<RsvpStatus, string> = {
  going: "Going",
  interested: "Interested",
  not_going: "Not going",
  none: "Not answered",
};

export interface EventRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Local date, YYYY-MM-DD. */
  date: string;
  /** Local time, HH:MM. Empty when the reader did not set one. */
  startTime: string;
  /** Local end time, HH:MM. Optional. */
  endTime: string;
  venue: string;
  location: string;
  type: EventType;
  createdAt: string;
}

export const EMPTY_EVENTS: EventRecord[] = [];

export function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "event";
}

export function uniqueSlug(name: string, existing: EventRecord[], ignoreId?: string): string {
  const base = slugify(name);
  const taken = new Set(existing.filter((e) => e.id !== ignoreId).map((e) => e.slug));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

function isEventType(value: unknown): value is EventType {
  return typeof value === "string" && (EVENT_TYPES as readonly string[]).includes(value);
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

export function isValidDate(value: unknown): value is string {
  return typeof value === "string" && DATE_RE.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

export function isValidTime(value: unknown): value is string {
  return typeof value === "string" && TIME_RE.test(value);
}

/** Reads a stored value defensively; anything malformed is dropped, not trusted. */
export function parseEvents(raw: unknown): EventRecord[] {
  if (!Array.isArray(raw)) return [];
  const out: EventRecord[] = [];
  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) continue;
    const record = entry as Record<string, unknown>;
    const { id, slug, title, description, date, startTime, endTime, venue, location, type, createdAt } = record;
    if (typeof id !== "string" || !id) continue;
    if (typeof slug !== "string" || !slug) continue;
    if (typeof title !== "string" || !title) continue;
    if (!isValidDate(date)) continue;
    if (!isEventType(type)) continue;
    out.push({
      id,
      slug,
      title,
      description: typeof description === "string" ? description : "",
      date,
      startTime: isValidTime(startTime) ? startTime : "",
      endTime: isValidTime(endTime) ? endTime : "",
      venue: typeof venue === "string" ? venue : "",
      location: typeof location === "string" ? location : "",
      type,
      createdAt: typeof createdAt === "string" ? createdAt : new Date(0).toISOString(),
    });
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Calendar export — the real feature.
 *
 * The brief's AddToCalendar pointed Apple Calendar at the Google URL, and
 * generated an .ics nowhere. Both are fixed here: Apple and any desktop client get
 * a real .ics file built to RFC 5545, and Google and Outlook get their documented
 * deeplink formats.
 * ------------------------------------------------------------------ */

/** Local date + time as the compact UTC stamp an .ics DTSTART wants, or all-day. */
function toIcsDateTime(date: string, time: string): { value: string; allDay: boolean } {
  if (!isValidTime(time)) {
    return { value: date.replace(/-/g, ""), allDay: true };
  }
  const [y, m, d] = date.split("-");
  const [hh, mm] = time.split(":");
  // A floating time (no Z) is interpreted in the reader's own zone, which is what
  // a locally-entered event means. Converting to UTC would shift the wall clock.
  return { value: `${y}${m}${d}T${hh}${mm}00`, allDay: false };
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Folds a content line at 75 octets, as RFC 5545 requires. */
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 0) {
    parts.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  return parts.join("\r\n");
}

/**
 * Builds an iCalendar document for one event. Returns a string the caller turns
 * into a file; this function has no side effects so it can be tested directly.
 */
export function buildIcs(event: EventRecord, now: Date = new Date()): string {
  const start = toIcsDateTime(event.date, event.startTime);
  // With no end time, an all-day event spans the one day; a timed event gets a
  // default hour so calendars show a block rather than a zero-length marker.
  const end = event.endTime
    ? toIcsDateTime(event.date, event.endTime)
    : start.allDay
      ? { value: start.value, allDay: true }
      : toIcsDateTime(event.date, addHour(event.startTime));

  const dtStamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const location = [event.venue, event.location].filter(Boolean).join(", ");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TrueWheels//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}@truewheels.local`,
    `DTSTAMP:${dtStamp}`,
    start.allDay ? `DTSTART;VALUE=DATE:${start.value}` : `DTSTART:${start.value}`,
    end.allDay ? `DTEND;VALUE=DATE:${addDays(event.date, 1).replace(/-/g, "")}` : `DTEND:${end.value}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
  ];
  if (event.description) lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
  if (location) lines.push(`LOCATION:${escapeIcsText(location)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");

  return lines.map(foldLine).join("\r\n") + "\r\n";
}

/** Turns a filename into something safe to save. */
export function icsFilename(event: EventRecord): string {
  return `${event.slug || "event"}.ics`;
}

function addHour(time: string): string {
  const [hh, mm] = time.split(":").map(Number);
  const next = (hh + 1) % 24;
  return `${String(next).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Google's compact date form: YYYYMMDDTHHMMSS with no punctuation. */
function toGoogleStamp(date: string, time: string): string {
  const [y, m, d] = date.split("-");
  if (!isValidTime(time)) return `${y}${m}${d}`;
  const [hh, mm] = time.split(":");
  return `${y}${m}${d}T${hh}${mm}00`;
}

export function googleCalendarUrl(event: EventRecord): string {
  const start = toGoogleStamp(event.date, event.startTime);
  const end = event.endTime
    ? toGoogleStamp(event.date, event.endTime)
    : isValidTime(event.startTime)
      ? toGoogleStamp(event.date, addHour(event.startTime))
      : toGoogleStamp(event.date, "");
  const location = [event.venue, event.location].filter(Boolean).join(", ");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
  });
  if (event.description) params.set("details", event.description);
  if (location) params.set("location", location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(event: EventRecord): string {
  const start = toIcsDateTime(event.date, event.startTime);
  const end = event.endTime
    ? toIcsDateTime(event.date, event.endTime)
    : start.allDay
      ? { value: start.value, allDay: true }
      : toIcsDateTime(event.date, addHour(event.startTime));
  const location = [event.venue, event.location].filter(Boolean).join(", ");
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: start.allDay ? event.date : `${event.date}T${event.startTime}:00`,
    enddt: end.allDay ? event.date : `${event.date}T${(event.endTime || addHour(event.startTime))}:00`,
  });
  if (event.description) params.set("body", event.description);
  if (location) params.set("location", location);
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/** A plain Google Maps search link — no embedded map, no API key, just a real URL. */
export function mapsUrl(event: EventRecord): string | null {
  const query = [event.venue, event.location].filter(Boolean).join(", ");
  if (!query) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Downloads the .ics for an event through a temporary object URL. */
export function downloadIcs(event: EventRecord): void {
  const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = icsFilename(event);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  // Revoke on the next tick so the click has taken the URL.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export const EVENTS_DISCLOSURE =
  "TrueWheels has no events diary and no organiser accounts, so there are no public events to browse and nothing to RSVP to that anyone else would see. The events here are ones you write down yourself, kept in this browser. Calendar export is real and works: the .ics file opens in Apple Calendar, Google Calendar, Outlook and any other client.";

export const NO_PUBLIC_EVENTS =
  "There are no events to discover. A directory would need organisers publishing events and a server to hold them, and this project has neither, so every event here is one you added. For real meets and track days, the organiser's own channel is the only source that can confirm a date, a price and a venue.";

export const EVENT_LOCAL_ONLY =
  "Kept in this browser only. Clearing site data removes it, and it is not shared with anyone.";

export const NO_OTHER_ATTENDEES =
  "You are the only attendee. There are no accounts to RSVP, so nobody else can be going, and no count here would mean anything.";

export const RSVP_LOCAL_ONLY =
  "Your answer is saved on this device and shown to no one. TrueWheels cannot send a reminder, because it has no notification service and does not know who you are.";
