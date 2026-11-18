import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { GodModeConsole } from "@/components/admin/GodModeConsole";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The admin flag console.
 *
 * The brief called it "God Mode" and gave it live toggles, kill switches, environment
 * switching and an immutable audit trail. None of that exists: the flags are
 * compile-time constants, so nothing here can be changed at runtime, and nothing writes
 * an audit log. The page is therefore read-only and says so. See
 * `src/lib/god-mode-data.ts`.
 *
 * Access is gated twice, as it already was for `/admin/users`: `src/middleware.ts`
 * rejects a non-admin at the edge before this page renders, and `AuthGuard` covers the
 * client render. The brief's step 8, adding `/admin` to the middleware, was already
 * done in an earlier phase.
 */
export const metadata: Metadata = {
  title: "Feature flags | TrueWheels",
  robots: { index: false, follow: false },
};

export default function GodModePage() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="max-w-[1600px] mx-auto py-8 px-4 space-y-8">
        <Reveal variant="up">
          <div>
            <h1 className="text-3xl font-display font-bold text-ink-900 dark:text-white">
              Feature flags
            </h1>
            <p className="text-ink-500 dark:text-ink-300 mt-1 max-w-3xl">
              Every flag the platform was built with, and the honest state of the controls
              around them. Nothing on this page changes the running application.
            </p>
          </div>
        </Reveal>

        <Reveal variant="up" delay={100}>
          <GodModeConsole />
        </Reveal>
      </div>
    </AuthGuard>
  );
}
