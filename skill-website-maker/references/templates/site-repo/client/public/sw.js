/* global self */

// Simple runtime caching focused on large show assets.
// - No precache manifest required (works with any Vite build output).
// - Cache-first for /show/* assets so the episode can be rewatched without re-downloading.
// - Best-effort Range support for cached .mp3 (seeking/offline playback).

const CACHE_PREFIX = "swm-site";
const SHOW_CACHE = `${CACHE_PREFIX}:show:v1`;
const PAGES_CACHE = `${CACHE_PREFIX}:pages:v1`;

function isGet(request) {
  return request && request.method === "GET";
}

function sameOrigin(url) {
  return url.origin === self.location.origin;
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const res = await fetch(request);
  if (res && res.ok) {
    cache.put(request, res.clone()).catch(() => {});
  }
  return res;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(request);
    if (res && res.ok) {
      cache.put(request, res.clone()).catch(() => {});
    }
    return res;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}

function parseRange(rangeHeader, size) {
  const m = /^bytes=(\d+)-(\d*)$/i.exec(rangeHeader || "");
  if (!m) return null;
  const start = Number(m[1]);
  const endRaw = m[2] ? Number(m[2]) : null;
  if (!Number.isFinite(start) || start < 0) return null;
  const end = endRaw === null ? size - 1 : Math.min(endRaw, size - 1);
  if (end < start) return null;
  return { start, end };
}

async function serveRangeFromCachedFull(request, cacheName) {
  const rangeHeader = request.headers.get("range");
  if (!rangeHeader) return null;

  const cache = await caches.open(cacheName);
  // Match the full-resource request (no Range). Key by URL.
  const full = await cache.match(request.url);
  if (!full) return null;

  const buf = await full.arrayBuffer();
  const total = buf.byteLength;
  const range = parseRange(rangeHeader, total);
  if (!range) return null;

  const chunk = buf.slice(range.start, range.end + 1);
  const headers = new Headers(full.headers);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Range", `bytes ${range.start}-${range.end}/${total}`);
  headers.set("Content-Length", String(chunk.byteLength));
  // Keep a sane content-type.
  if (!headers.get("Content-Type")) headers.set("Content-Type", "audio/mpeg");
  return new Response(chunk, { status: 206, headers });
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => {
          if (!k.startsWith(CACHE_PREFIX + ":")) return Promise.resolve();
          if (k === SHOW_CACHE || k === PAGES_CACHE) return Promise.resolve();
          return caches.delete(k);
        }),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (!isGet(request)) return;

  const url = new URL(request.url);
  if (!sameOrigin(url)) return;

  // Allow service worker updates without interference.
  if (url.pathname === "/sw.js") return;

  // Show assets: cache-first.
  if (url.pathname.startsWith("/show/")) {
    if (url.pathname.endsWith(".mp3")) {
      // Best-effort Range support for offline seeking.
      const hasRange = !!request.headers.get("range");
      if (hasRange) {
        event.respondWith(
          (async () => {
            const ranged = await serveRangeFromCachedFull(request, SHOW_CACHE);
            if (ranged) return ranged;
            // Pass through the Range request, but also try to cache the full file in the background.
            const res = await fetch(request);
            // Background: fetch full resource and cache it for future offline playback.
            event.waitUntil(
              (async () => {
                try {
                  const cache = await caches.open(SHOW_CACHE);
                  const existing = await cache.match(url.pathname);
                  if (existing) return;
                  const fullRes = await fetch(url.pathname);
                  if (fullRes && fullRes.ok) await cache.put(url.pathname, fullRes);
                } catch {
                  // ignore
                }
              })(),
            );
            return res;
          })(),
        );
        return;
      }
    }

    event.respondWith(cacheFirst(request, SHOW_CACHE));
    return;
  }

  // Navigation: network-first so content updates normally.
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, PAGES_CACHE));
  }
});

