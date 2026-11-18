/**
 * The handle the profile route resolves to.
 *
 * There is no user directory, so every handle renders the same page. Exporting it
 * in one place keeps the route, the static params and the page's own description
 * of itself from drifting apart.
 */
export const PROFILE_HANDLE = "you";
