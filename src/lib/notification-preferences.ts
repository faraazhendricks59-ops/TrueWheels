"use client";

import { useSyncExternalStore } from "react";
import {
  DND_EXCEPTIONS,
  NOTIFICATION_CATEGORIES,
  type DigestMode,
  type NotificationChannel,
} from "./notification-categories";
import type { NotificationType } from "./notifications";

/**
 * Notification preferences, persisted to localStorage and shared through a tiny
 * external store so every reader sees the same object.
 *
 * `useSyncExternalStore` is used rather than context state because the delivery
 * gate in NotificationProvider is not a React child of the settings screen: a
 * notification can arrive while Settings is unmounted, and the gate still has to
 * read the current preferences. A module-level store is reachable from anywhere.
 */

export interface SubcategoryPreference {
  enabled: boolean;
  push: boolean;
  email: boolean;
  sms: boolean;
}

export interface CategoryPreference {
  digest: DigestMode;
  subcategories: Record<string, SubcategoryPreference>;
}

export interface DigestPreference {
  dailyEnabled: boolean;
  /** 24-hour "HH:MM". */
  dailyTime: string;
  weeklyEnabled: boolean;
  weeklyDay: string;
  weeklyTime: string;
  timezone: string;
}

export interface DndPreference {
  enabled: boolean;
  /** 24-hour "HH:MM". The window may cross midnight (start > end). */
  start: string;
  end: string;
  /** Exception id (see DND_EXCEPTIONS) -> whether it may pass through. */
  exceptions: Record<string, boolean>;
}

export interface NotificationPreferences {
  categories: Record<string, CategoryPreference>;
  digest: DigestPreference;
  dnd: DndPreference;
}

export const STORAGE_KEY = "truewheels_notification_prefs";

/** The digest modes that actually batch. `off` and `instant` are handled separately. */
export const QUEUED_DIGEST_MODES: DigestMode[] = ["daily", "weekly"];

/** Builds a complete preference object at factory defaults. Exported for tests. */
export function createDefaultPreferences(): NotificationPreferences {
  return buildDefaults();
}

function buildDefaults(): NotificationPreferences {
  const categories: Record<string, CategoryPreference> = {};
  for (const category of NOTIFICATION_CATEGORIES) {
    const subcategories: Record<string, SubcategoryPreference> = {};
    for (const sub of category.subcategories) {
      subcategories[sub.id] = {
        enabled: sub.defaultEnabled,
        push: sub.channels.push,
        email: sub.channels.email,
        sms: sub.channels.sms,
      };
    }
    categories[category.id] = { digest: category.defaultDigest, subcategories };
  }

  return {
    categories,
    digest: {
      dailyEnabled: true,
      dailyTime: "08:00",
      weeklyEnabled: true,
      weeklyDay: "monday",
      weeklyTime: "08:00",
      // The platform is South African; SAST is the only sensible default.
      timezone: "Africa/Johannesburg",
    },
    dnd: {
      enabled: false,
      start: "22:00",
      end: "07:00",
      exceptions: { critical: true, mentions: true, bids: false },
    },
  };
}

/**
 * Merges a stored object over the defaults. Stored data is user-editable (and may
 * predate a category), so every field is validated rather than trusted: a missing
 * category is filled in, an unknown digest mode falls back, and a malformed value
 * can never leave the UI in a state the type system says is impossible.
 */
function hydrate(stored: unknown): NotificationPreferences {
  const defaults = buildDefaults();
  if (!stored || typeof stored !== "object") return defaults;
  const raw = stored as Partial<NotificationPreferences>;

  const categories: Record<string, CategoryPreference> = {};
  for (const category of NOTIFICATION_CATEGORIES) {
    const storedCategory = raw.categories?.[category.id];
    const storedSubs = storedCategory?.subcategories ?? {};
    const subcategories: Record<string, SubcategoryPreference> = {};
    for (const sub of category.subcategories) {
      const base = defaults.categories[category.id].subcategories[sub.id];
      const value = storedSubs[sub.id];
      subcategories[sub.id] = {
        enabled: typeof value?.enabled === "boolean" ? value.enabled : base.enabled,
        push: typeof value?.push === "boolean" ? value.push : base.push,
        email: typeof value?.email === "boolean" ? value.email : base.email,
        sms: typeof value?.sms === "boolean" ? value.sms : base.sms,
      };
    }
    const digest = storedCategory?.digest;
    categories[category.id] = {
      digest: digest && digest in DIGEST_LOOKUP ? digest : defaults.categories[category.id].digest,
      subcategories,
    };
  }

  const d: Partial<DigestPreference> = raw.digest ?? {};
  const q: Partial<DndPreference> = raw.dnd ?? {};

  return {
    categories,
    digest: {
      dailyEnabled: typeof d.dailyEnabled === "boolean" ? d.dailyEnabled : defaults.digest.dailyEnabled,
      dailyTime: typeof d.dailyTime === "string" ? d.dailyTime : defaults.digest.dailyTime,
      weeklyEnabled: typeof d.weeklyEnabled === "boolean" ? d.weeklyEnabled : defaults.digest.weeklyEnabled,
      weeklyDay: typeof d.weeklyDay === "string" ? d.weeklyDay : defaults.digest.weeklyDay,
      weeklyTime: typeof d.weeklyTime === "string" ? d.weeklyTime : defaults.digest.weeklyTime,
      timezone: typeof d.timezone === "string" ? d.timezone : defaults.digest.timezone,
    },
    dnd: {
      enabled: typeof q.enabled === "boolean" ? q.enabled : defaults.dnd.enabled,
      start: typeof q.start === "string" ? q.start : defaults.dnd.start,
      end: typeof q.end === "string" ? q.end : defaults.dnd.end,
      exceptions: {
        critical:
          typeof q.exceptions?.critical === "boolean" ? q.exceptions.critical : defaults.dnd.exceptions.critical,
        mentions:
          typeof q.exceptions?.mentions === "boolean" ? q.exceptions.mentions : defaults.dnd.exceptions.mentions,
        bids: typeof q.exceptions?.bids === "boolean" ? q.exceptions.bids : defaults.dnd.exceptions.bids,
      },
    },
  };
}

const DIGEST_LOOKUP: Record<string, true> = { instant: true, daily: true, weekly: true, off: true };

const DEFAULT_PREFERENCES = buildDefaults();

// The store starts at the defaults so the server snapshot and the first client
// render agree; the stored value is read in `subscribe` on mount.
let snapshot: NotificationPreferences = DEFAULT_PREFERENCES;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  // forEach rather than for..of: the project targets es5, where a Set is not
  // iterable without downlevelIteration.
  listeners.forEach((listener) => listener());
}

function readStored(): NotificationPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? hydrate(JSON.parse(raw)) : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  // First subscriber pulls the persisted value. Doing it here (rather than at
  // module load) keeps the server render on the defaults.
  if (!hydrated) {
    hydrated = true;
    const stored = readStored();
    if (stored !== DEFAULT_PREFERENCES) {
      snapshot = stored;
      // Deferred so the update is not applied during render.
      queueMicrotask(emit);
    }
  }

  return () => listeners.delete(listener);
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => DEFAULT_PREFERENCES;

export function getNotificationPreferences(): NotificationPreferences {
  return snapshot;
}

export function saveNotificationPreferences(next: NotificationPreferences): void {
  snapshot = next;
  hydrated = true;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* Storage full or blocked (private mode). The in-memory value still applies. */
    }
  }
  emit();
}

/** Resets to factory defaults and clears the stored copy. */
export function resetNotificationPreferences(): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  snapshot = buildDefaults();
  hydrated = true;
  emit();
}

/** Immutable update helper used by the components. */
export function updateNotificationPreferences(
  updater: (current: NotificationPreferences) => NotificationPreferences
): void {
  saveNotificationPreferences(updater(snapshot));
}

export function useNotificationPreferences(): NotificationPreferences {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------

/** Finds the category that owns a subcategory. */
export function categoryForSubcategory(subcategoryId: string) {
  return NOTIFICATION_CATEGORIES.find((c) => c.subcategories.some((s) => s.id === subcategoryId));
}

/**
 * Maps an in-app notification type to the subcategory that governs it.
 *
 * A type can back more than one subcategory (saved searches feed both price drops
 * and new listings). In that case the type is allowed when *any* of them is on:
 * muting "price drops" should not also mute "new listings".
 */
export function subcategoriesForType(type: NotificationType): { categoryId: string; subcategoryId: string }[] {
  const matches: { categoryId: string; subcategoryId: string }[] = [];
  for (const category of NOTIFICATION_CATEGORIES) {
    for (const sub of category.subcategories) {
      if (sub.type === type) matches.push({ categoryId: category.id, subcategoryId: sub.id });
    }
  }
  return matches;
}

export interface DeliveryDecision {
  /** Whether the notification should be surfaced in the in-app list at all. */
  deliver: boolean;
  /** True when it should be held back until the quiet window ends. */
  queue: boolean;
  /** The digest mode of the governing category, when one applies. */
  digest: DigestMode | null;
  /** Why it was held or dropped, for the UI to explain honestly. */
  reason: "ok" | "muted" | "quiet_hours";
}

/**
 * Decides what happens to an incoming notification, given the current
 * preferences. This is what makes the settings real: NotificationProvider calls
 * it before adding anything to the list.
 */
export function evaluateDelivery(
  type: NotificationType,
  preferences: NotificationPreferences,
  now: Date = new Date()
): DeliveryDecision {
  const owners = subcategoriesForType(type);

  // A type with no mapped subcategory has no user-facing switch yet, so it is
  // delivered rather than silently swallowed.
  if (owners.length === 0) {
    return { deliver: true, queue: false, digest: null, reason: "ok" };
  }

  const enabledOwners = owners.filter(
    (owner) => preferences.categories[owner.categoryId]?.subcategories[owner.subcategoryId]?.enabled
  );

  if (enabledOwners.length === 0) {
    return { deliver: false, queue: false, digest: null, reason: "muted" };
  }

  const digest = preferences.categories[enabledOwners[0].categoryId]?.digest ?? "instant";

  if (digest === "off") {
    return { deliver: false, queue: false, digest, reason: "muted" };
  }

  // Quiet hours: the category is held unless an enabled exception covers it.
  // The exception id ("critical", "mentions", "bids") is not a category id, so it
  // must be resolved through DND_EXCEPTIONS; comparing the two directly silently
  // matched nothing and made every exception a no-op.
  if (isQuietNow(preferences, now)) {
    const excepted = DND_EXCEPTIONS.some(
      (exception) =>
        preferences.dnd.exceptions[exception.id] &&
        enabledOwners.some((owner) => owner.categoryId === exception.categoryId)
    );
    if (!excepted) {
      return { deliver: true, queue: true, digest, reason: "quiet_hours" };
    }
  }

  return { deliver: true, queue: QUEUED_DIGEST_MODES.includes(digest), digest, reason: "ok" };
}

function toMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/**
 * Whether `now` falls inside the quiet window. Handles a window that crosses
 * midnight (the common case: 22:00 to 07:00), which is where a naive
 * `start <= now <= end` check gets it backwards.
 */
export function isQuietNow(preferences: NotificationPreferences, now: Date = new Date()): boolean {
  const { enabled, start, end } = preferences.dnd;
  if (!enabled) return false;

  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);
  if (startMinutes === null || endMinutes === null) return false;
  if (startMinutes === endMinutes) return false; // zero-length window

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (startMinutes < endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  }
  // Crosses midnight: inside if after the start OR before the end.
  return nowMinutes >= startMinutes || nowMinutes < endMinutes;
}

/** Human summary of the quiet window, e.g. "22:00 to 07:00 (next day)". */
export function describeQuietWindow(preferences: NotificationPreferences): string {
  const { start, end } = preferences.dnd;
  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);
  const wraps = startMinutes !== null && endMinutes !== null && startMinutes >= endMinutes;
  return wraps ? `${start} to ${end} the next morning` : `${start} to ${end}`;
}

/** Counts how many subcategories are switched on in a category. */
export function enabledCount(preferences: NotificationPreferences, categoryId: string): number {
  const category = preferences.categories[categoryId];
  if (!category) return 0;
  return Object.values(category.subcategories).filter((sub) => sub.enabled).length;
}

/** Total channels switched on for a subcategory, for the collapsed summary. */
export function channelSummary(sub: SubcategoryPreference): string {
  const on = NOTIFICATION_CHANNELS_ON.filter((channel) => sub[channel]);
  if (on.length === 0) return "No channels";
  return on.map((c) => CHANNEL_SHORT[c]).join(" · ");
}

const NOTIFICATION_CHANNELS_ON: NotificationChannel[] = ["push", "email", "sms"];
const CHANNEL_SHORT: Record<NotificationChannel, string> = {
  push: "Push",
  email: "Email",
  sms: "SMS",
};
