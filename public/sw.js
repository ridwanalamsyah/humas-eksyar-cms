/**
 * Humas Eksyar — Service Worker
 *
 * Strategy:
 *  - Pre-cache app shell assets on install (manifest, icons, offline page)
 *  - Network-first for navigation requests with offline fallback
 *  - Cache-first for static assets (images, fonts, scripts)
 *  - Skip waiting on update so users get fresh content asap
 */

const VERSION = "v1.0.0-phase06";
const APP_SHELL = `eksyar-shell-${VERSION}`;
const RUNTIME = `eksyar-runtime-${VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/offline.html",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== APP_SHELL && k !== RUNTIME)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  // Don't intercept dev HMR / Next internals beyond static
  if (url.pathname.startsWith("/_next/webpack-hmr")) return;
  if (url.pathname.startsWith("/api/")) return;

  // Navigation requests: network-first, fallback to cache, then offline page
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME).then((c) => c.put(request, copy)).catch(() => {});
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached ?? caches.match("/offline.html")),
        ),
    );
    return;
  }

  // Static asset: cache-first
  if (
    /\.(?:png|jpg|jpeg|gif|webp|svg|woff2?|ico|css|js)$/.test(url.pathname) ||
    url.pathname.startsWith("/icon")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME).then((c) => c.put(request, copy)).catch(() => {});
          }
          return response;
        });
      }),
    );
  }
});
