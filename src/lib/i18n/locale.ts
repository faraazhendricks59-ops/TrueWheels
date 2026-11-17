export type Locale = "en" | "af" | "zu";

export const LOCALES: Locale[] = ["en", "af", "zu"];

export const DEFAULT_LOCALE: Locale = "en";

/**
 * Maps a bare app locale to a BCP-47 tag for Intl. The app stores "en"/"af"/"zu";
 * Intl needs the region so it picks ZA conventions (e.g. the space thousands
 * separator) rather than US ones.
 */
export function localeTag(locale: Locale = DEFAULT_LOCALE): string {
  return `${locale}-ZA`;
}
