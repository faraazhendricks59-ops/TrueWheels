import { redirect } from "next/navigation";

/**
 * Settings moved to /settings in Phase 20. The dashboard shell kept a stub so
 * the sidebar link and any bookmark still land somewhere sensible.
 */
export default function Page() {
  redirect("/settings");
}
