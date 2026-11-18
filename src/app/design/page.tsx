import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DesignSystem } from "@/components/design/DesignSystem";

/**
 * Internal design-system reference.
 *
 * Gated to admins: it is a working tool for building and checking components,
 * not a page for visitors, and it should not be indexed. Every token and
 * primitive renders in one place so a change can be seen in light and dark, at
 * each text size, with high contrast and with data saver — the four modes a
 * component has to survive.
 */
export const metadata: Metadata = {
  title: "Design system | TrueWheels",
  robots: { index: false, follow: false },
};

export default function DesignPage() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <AppShell>
        <div className="mx-auto max-w-5xl py-10">
          <DesignSystem />
        </div>
      </AppShell>
    </AuthGuard>
  );
}
