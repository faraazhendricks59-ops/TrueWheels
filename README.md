# TrueWheels

The Automotive Operating System.

Search, buy, sell, bid and connect — South Africa's automotive ecosystem.

## Stack

- Next.js 14 (App Router, `src/` directory)
- TypeScript (strict)
- Tailwind CSS with the Velocity Design System (`tailwind.config.ts`)
- Firebase, framer-motion, zod

## Scripts

- `npm run dev -- -p 12000` — dev server
- `npm run build` — production build (also type-checks; use as the verification gate)
- `npm start` — serve the production build

## Design system

Tokens live in `tailwind.config.ts` (ink / brand / aurora / surface / semantic scales,
4px spacing grid, `swift`/`snap`/`glide` easings). Surface utilities (`.glass`,
`.aurora-bg`, `.aurora-text`, `.noise`, `.grid-bg`, `.low-data`) and the logo geometry
(`.tw-mark`, `.tw-slash`) are defined in `src/app/globals.css`.

## Feature flags (God Mode)

`src/lib/feature-flags.tsx` exports `FEATURE_KEYS`, `FeatureProvider` and
`useFeatureFlags`. Every interactive control goes through `SmartButton`, which locks
itself when its `featureKey` is off. Phase 1 ships local defaults; a later phase wires
the Firestore `feature_flags` listener.

## Accessibility

TrueWheels targets WCAG 2.1 AA. The dev-only audit harness lives at `/dev/a11y`
(404 in production), and the keyboard matrix, screen reader log, contrast checker and
focus order debugger are documented in [`docs/accessibility.md`](docs/accessibility.md).

## Environment

Copy `.env.example` to `.env.local` and fill in the keys. `.env.local` is gitignored.
