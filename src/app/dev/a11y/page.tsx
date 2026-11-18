import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { A11yAuditPanel } from "@/components/a11y/A11yAuditPanel";

/**
 * Internal accessibility audit harness.
 *
 * Hard-gated at the server: in a production build this route calls `notFound()`, so
 * it 404s and the tools never ship. A `NODE_ENV` check inside a client component
 * would not be enough — the bundle would still be sent to every reader, and the
 * panel would merely hide itself.
 */
export const metadata: Metadata = {
  title: "Accessibility audit | TrueWheels",
  robots: { index: false, follow: false },
};

/**
 * Rendered per request rather than prerendered.
 *
 * A prerendered page has its `notFound()` evaluated once at build time, and the
 * static result is then served with a 200 status — a "not found" body under a
 * success code. Forcing dynamic rendering means the check below runs on the request
 * and answers with a real 404.
 */
export const dynamic = "force-dynamic";

export default function A11yAuditPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <A11yAuditPanel />
  );
}
