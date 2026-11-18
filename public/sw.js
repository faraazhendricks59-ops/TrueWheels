/*
 * TrueWheels service worker.
 *
 * What this does, and nothing more: it keeps a copy of pages and assets the reader
 * has already loaded, so that a page they have visited still opens when the
 * connection drops, and it serves a plain offline page for anything it has not seen.
 *
 * What it deliberately does NOT do:
 *  - It does not cache API responses. The only API routes in this project are the
 *    session endpoints, and serving a cached session would be a security bug, not a
 *    feature. There is no data API to cache.
 *  - It does not run background sync. Nothing in the app queues work to replay, and
 *    a `sync` handler that logs a message would be a claim with no behaviour behind
 *    it.
 *  - It does not compress images or "save data" beyond choosing the cache. The Data
 *    Saver toggle in the app stops the large hero video from loading, which is a real
 *    saving; this file has no part in it.
 *
 * Caching a page the reader has seen is safe to do honestly. Caching a claim about
 * what the app can do offline is not, so the offline page says what will and will not
 * work rather than promising a full experience.
 */

const VERSION = "v2";
const STATIC_CACHE = `tw-static-${VERSION}`;
const IMAGE_CACHE = `tw-images-${VERSION}`;
const PAGE_CACHE = `tw-pages-${VERSION}`;

const PRECACHE = ["/manifest.webmanifest", "/icons/icon-192x192.png"];

/**
 * Precache the offline page *and the build assets it needs to run*.
 *
 * Caching the /offline HTML alone is not enough: it is a React page, so without its
 * chunks it boots to nothing when the connection is gone — exactly the moment it
 * exists for. The chunk filenames are content-hashed, so they cannot be written down
 * here; instead we fetch the page once, read the asset URLs out of its own HTML, and
 * cache those. That keeps this file correct across builds without a build step.
 */
async function precacheOfflinePage(cache) {
  let response;
  try {
    response = await fetch("/offline", { cache: "no-store" });
  } catch {
    return;
  }
  if (!response.ok) return;

  await cache.put("/offline", response.clone());

  const html = await response.text();
  const urls = new Set();
  const pattern = /\/_next\/static\/[^"'\\\s)]+/g;
  let match;
  while ((match = pattern.exec(html)) !== null) urls.add(match[0]);
  await Promise.all([...urls].map((url) => cache.add(url).catch(() => undefined)));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      Promise.all([
        // addAll rejects the whole install if one URL fails, so each is added alone.
        ...PRECACHE.map((url) => cache.add(url).catch(() => undefined)),
        precacheOfflinePage(cache),
      ])
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("tw-") && ![STATIC_CACHE, IMAGE_CACHE, PAGE_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never touch the session or any other API route.
  if (url.pathname.startsWith("/api/")) return;

  // Content-hashed build assets and icons: safe to serve from cache first.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
    return;
  }

  // Images: cache first, then network.
  if (request.destination === "image") {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(IMAGE_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
    return;
  }

  // Navigations: network first, so a reader with a connection always gets the
  // current page; fall back to the cached copy, then to the offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match("/offline"))
            .then((fallback) => fallback || Response.error())
        )
    );
  }
});
