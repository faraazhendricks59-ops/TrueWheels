"use client";

import { useEffect } from "react";
import { initA11yAudit } from "@/lib/a11y/a11yAudit";

/**
 * Starts the dev-only accessibility auto-runner. Renders nothing.
 *
 * Mounted once from the root layout. In a production build `initA11yAudit` returns
 * a no-op immediately, so nothing is observed and nothing is logged.
 */
export function A11yAuditRegistrar() {
  useEffect(() => initA11yAudit(), []);
  return null;
}
