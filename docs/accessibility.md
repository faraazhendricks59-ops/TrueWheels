# Accessibility

TrueWheels targets **WCAG 2.1 level AA**. This document describes what is implemented,
how to check it, and — importantly — what the automated tooling does **not** prove.

## What is already in place

| Area | Where |
| --- | --- |
| Skip link to `#main-content` | `src/components/a11y/SkipLink.tsx` |
| Single `<main>` landmark | `src/app/layout.tsx` |
| Live-region announcements | `src/components/a11y/AriaLiveAnnouncer.tsx` |
| Focus trap for modals | `src/components/a11y/FocusTrap.tsx` |
| Accessibility preferences menu | `src/components/a11y/AccessibilityMenu.tsx` |
| Provider (reduced motion, contrast, text size) | `src/components/providers/AccessibilityProvider.tsx` |
| Focus ring, reduced motion, high contrast | `src/app/globals.css` |
| Roving tabindex primitive | `src/hooks/useRovingTabindex.ts` |

The global focus ring is `*:focus-visible` with a 3px outline — stricter than the 2px
WCAG asks for, and deliberately not reduced.

## The dev-only audit harness

Available at **`/dev/a11y`** in development only. In a production build the route
answers with a real **404** — enforced in `src/middleware.ts`, not just by a
`NODE_ENV` check in the component, so the client bundle is never served.

It contains six tools:

1. **Findings panel** — runs `src/lib/a11y/a11yAudit.ts` against the current route and
   lists violations by severity, each with its WCAG success criterion and a link.
2. **Keyboard matrix** — every shortcut that is actually wired up, and nothing else.
3. **Live region & focus log** — observes `aria-live` writes and focus moves.
4. **Contrast checker** — reads the *real* compiled token colours from rendered
   swatches and tests them against AA and AAA.
5. **Focus order debugger** — numbers the tab order and draws it over the page.
6. **Roving tabindex demo** — a live tab list using `useRovingTabindex`.

`A11yAuditRegistrar` (mounted in the root layout) also logs findings to the console as
the DOM changes during development. It is a no-op in production.

## What the audit does and does not prove

The audit is a **smoke detector**, not a conformance certificate. It catches mechanical
regressions — a missing `alt`, an unlabelled input, a lost accessible name, a contrast
token that slipped below AA. It cannot judge:

- whether alt text is **meaningful**;
- whether the focus order is **logical**;
- whether a live region is **timely**;
- anything about a real screen reader's computed output.

Those need a person, a keyboard, and a screen reader. Do not treat a clean run as
"accessible".

### Known limitations of the checker

- Contrast sampling is capped (80 text nodes per run) so a large page stays responsive.
  Findings are de-duplicated by colour pair, which is why one failing token produces
  one row rather than one row per element.
- **Overlays are skipped, not guessed.** When text sits over a floating header or a
  hero image layer, the nearest opaque ancestor is the light page body while the text
  visually sits on a dark image. The checker cannot sample those pixels, so it reports
  nothing rather than a false ~1:1. A clean run does not prove text over imagery is
  legible — check those by eye.
- **Logotypes are exempt** (WCAG 1.4.3). Anything inside a `[data-logotype]` element is
  skipped; `Logo` marks its wordmark.
- The accessible-name approximation covers `aria-label`, `aria-labelledby`, a
  `<label for>`, a wrapping `<label>`, and text content. It does not implement the full
  accessible name computation.

## Manual test checklist

Before calling a change done:

1. **Keyboard only** — Tab through the whole page. Every interactive element is
   reachable, the focus ring is always visible, and nothing traps you. Escape closes
   the top-most overlay.
2. **Screen reader** — VoiceOver (⌘F5), NVDA, or TalkBack. Every control is announced
   with a name and a role; live regions speak once, not twice.
3. **Zoom to 200%** — no content is lost and nothing scrolls in two directions.
4. **Reduced motion** — enable it at the OS level; looping animations stop, content
   still appears (one-shot reveals keep their end state).
5. **High contrast** — the Accessibility menu's contrast mode keeps all text legible.
6. **Contrast** — run the checker on the new colours; verify against AA for the text
   size in use.

## Adding a keyboard shortcut

The keyboard matrix lists **only shortcuts that exist**. If you add a handler, add its
row to `SHORTCUTS` in `src/components/a11y/KeyboardMatrix.tsx`. A chart that promises a
key which does nothing teaches a reader a habit that fails.
