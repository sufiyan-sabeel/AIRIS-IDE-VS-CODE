self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('airis-v1').then(c => c.addAll(['/', '/manifest.json', '/icons/icon-192x192.png', '/icons/icon-512x512.png', '/icons/airis-icon.svg', '/offline']))); self.skipWaiting();
});
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== 'airis-v1').map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(() => e.request.mode === 'navigate' ? caches.match('/offline') : new Response('Offline', { status: 503 }))));
});
