import type { Metadata } from "next";
import { OfflineMode } from "@/components/pwa/OfflineMode";

/**
 * The page the service worker serves when a navigation fails offline. It reads the
 * reader's own device storage, so it is a client component.
 */
export const metadata: Metadata = {
  title: "Offline | TrueWheels",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return <OfflineMode />;
}
