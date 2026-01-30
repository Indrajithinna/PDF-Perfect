const CACHE_NAME = 'pdf-perfect-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Basic pass-through fetch handler to satisfy PWA requirements
    // For a full offline experience, a more complex caching strategy or vite-plugin-pwa is recommended
    event.respondWith(
        fetch(event.request).catch(() => {
            // If offline, try to match from cache (if we implemented full caching)
            return caches.match(event.request);
        })
    );
});
