const CACHE_NAME = 'airis-v1';

// GitHub Pages serves from subpath, detect it
const BASE = self.location.pathname.replace(/\/sw\.js$/, '') || '';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        `${BASE}/`,
        `${BASE}/manifest.json`,
        `${BASE}/icons/icon-192x192.png`,
        `${BASE}/icons/icon-512x512.png`,
        `${BASE}/icons/airis-icon.svg`,
        `${BASE}/offline`,
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match(`${BASE}/offline`);
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
