// Self-destructing service worker.
//
// Served at /sw.js and /service-worker.js — paths the current app does NOT
// register. Its only job is to heal browsers that still carry a stale caching
// service worker from the old Vercel deployment (which was serving a blank
// cached shell). When the browser re-checks the worker script it installs this
// one, which wipes all caches, unregisters itself, and reloads open tabs so the
// next load comes straight from the network.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch (_) {
        // ignore — best effort
      }
      try {
        await self.registration.unregister();
      } catch (_) {
        // ignore
      }
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) {
        try {
          client.navigate(client.url);
        } catch (_) {
          // ignore
        }
      }
    })()
  );
});
