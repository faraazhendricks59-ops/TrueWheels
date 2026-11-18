"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/pwa";

/**
 * Registers the service worker on the client, once, after the page has loaded.
 *
 * Registration is deferred to `load` rather than run at mount, so the worker's install
 * and precache do not compete with the first page for bandwidth — which matters most
 * for exactly the readers this phase is for.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (document.readyState === "complete") {
      registerServiceWorker();
      return;
    }
    const onLoad = () => registerServiceWorker();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
