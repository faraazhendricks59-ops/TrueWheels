export interface CookiePreferences {
  essential: true;
  analytics: boolean;
  marketing: boolean;
}

export interface StoredConsent extends CookiePreferences {
  /** Schema version — bump to re-prompt everyone after a policy change. */
  version: number;
  /** ISO timestamp of when consent was recorded (POPIA accountability). */
  decidedAt: string;
}

export const CONSENT_VERSION = 1;
const STORAGE_KEY = "truewheels-cookie-consent";

/** Fired by any UI that wants to reopen the preferences panel. */
export const OPEN_CONSENT_EVENT = "truewheels:open-cookie-preferences";

export const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

export function readConsent(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (typeof parsed !== "object" || parsed === null) return null;
    return {
      essential: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      version: typeof parsed.version === "number" ? parsed.version : 0,
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : "",
    };
  } catch {
    // Corrupt JSON or storage unavailable (private mode) — treat as undecided.
    return null;
  }
}

export function writeConsent(prefs: CookiePreferences): StoredConsent {
  const stored: StoredConsent = {
    essential: true,
    analytics: prefs.analytics,
    marketing: prefs.marketing,
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Consent still applies for this session even if it cannot be persisted.
  }
  return stored;
}

/** True when the user has no valid, current-version decision on record. */
export function needsConsent(): boolean {
  const stored = readConsent();
  return !stored || stored.version !== CONSENT_VERSION;
}

export function openConsentPreferences() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
  }
}
