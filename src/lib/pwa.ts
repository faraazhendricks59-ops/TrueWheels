/**
 * Progressive Web App plumbing.
 *
 * A service worker and a manifest are real, testable features: the browser installs
 * the worker, serves cached pages when the network is gone, and can install the app.
 * So unlike the previous phases, most of this phase is honest by construction. What
 * still needs care is the copy around it, because a PWA page is where a project is
 * most tempted to promise things it cannot do.
 *
 * Three claims in the phase brief were false and are not repeated here:
 *  - "Zero app store download • Under 2MB". The bundle is far larger than 2 MB once
 *    the app and its images load, and an install still downloads them on first open.
 *  - "Instant price-drop alerts" / "Outbid notifications" as a reason to install.
 *    There is no push service. Notifications in this project are in-app and marked
 *    simulated (see `src/lib/notifications.ts`); nothing can reach a device that is
 *    closed. Asking for the notification permission would be asking for a capability
 *    the app does not use.
 *  - "Reduce data usage by up to 70%" / "~15MB per session". Data Saver here does one
 *    measurable thing: it stops the hero video, which is the single largest download
 *    in the project. Everything else is already lazy-loaded by the browser.
 */

import { DEMO_VEHICLES, type DemoVehicle } from "@/lib/demo/vehicles";
import { localeTag } from "@/lib/i18n/locale";

export const PWA_CACHES = {
  static: "tw-static-v1",
  images: "tw-images-v1",
  pages: "tw-pages-v1",
} as const;

export const OFFLINE_URL = "/offline";

/** The hero video is the largest single asset; Data Saver skips it entirely. */
export const HERO_VIDEO_BYTES = 1_754_296;

export const PWA_DISCLOSURE =
  "Installing TrueWheels adds it to your home screen and lets pages you have already opened load without a connection. It is the same site, not a separate app, and it still needs a connection for anything new — searching, messaging, and loading a vehicle you have not opened before.";

/** What genuinely works offline, and what does not. */
export const OFFLINE_CAPABILITIES: readonly { works: boolean; text: string }[] = [
  { works: true, text: "Pages you have already opened, including a vehicle you viewed" },
  { works: true, text: "Your garage, saved searches and recently viewed, which are stored on this device" },
  { works: false, text: "Searching, or opening a vehicle you have not viewed before" },
  { works: false, text: "Messages, and anything that needs the seller to respond" },
];

export function isServiceWorkerSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | undefined> {
  if (!isServiceWorkerSupported()) return undefined;
  try {
    return await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  } catch {
    // Registration fails on http origins and in some private modes. That is not an
    // error worth surfacing: the app works without a service worker, it just does
    // not work offline.
    return undefined;
  }
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** The subset of the BeforeInstallPromptEvent the app uses. */
export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Formats a byte count for the data-saver copy, so the figure is never hard-coded. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Resolves a stored vehicle id to its listing, so the offline page shows real cars. */
export function byDemoId(id: string): DemoVehicle | undefined {
  return DEMO_VEHICLES.find((vehicle) => vehicle.id === id);
}

export function formatRand(value: number): string {
  return `R ${Math.round(value).toLocaleString(localeTag())}`;
}
