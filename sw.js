const CACHE_NAME = 'labcollect-pro-v1.3';

// Files to cache immediately on install
const INITIAL_CACHED_RESOURCES = [
    './'
];

// Install Event: Cache the main shell
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(INITIAL_CACHED_RESOURCES))
            .then(() => self.skipWaiting())
    );
});

// Activate Event: Clean up old caches if you update the CACHE_NAME version
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch Event: Dynamic Caching for CDNs, Fonts, and Scripts
self.addEventListener('fetch', event => {
    // We only want to cache GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            // Stale-while-revalidate strategy
            const fetchPromise = fetch(event.request).then(networkResponse => {
                // Only cache valid responses
                if (networkResponse && networkResponse.status === 200 && networkResponse.type !== 'opaque') {
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Fails silently if completely offline, relying on cachedResponse
            });

            // Return the cached response immediately if available, otherwise wait for the network
            return cachedResponse || fetchPromise;
        })
    );
});
