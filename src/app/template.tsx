import type { ReactNode } from "react";

/**
 * A route fader.
 *
 * `template.tsx` is re-mounted by Next on every navigation (unlike `layout.tsx`,
 * which persists), so a CSS animation here replays on each route change and the new
 * page fades in rather than cutting. The animation is opacity-only, which is the one
 * property that can be animated on a full-page wrapper without breaking the fixed
 * elements a page may render inside it (see the note in globals.css).
 *
 * It is a server component: no state, no effects, so it adds no client JavaScript.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="route-fade">{children}</div>;
}
