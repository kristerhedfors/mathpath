/**
 * algebrain.dev Service Worker
 * Provides offline support and caching for the PWA
 */

const CACHE_NAME = 'algebrain-v1';
const CACHE_VERSION = 1;

// Core files to cache immediately on install
const CORE_CACHE_URLS = [
  '/',
  '/index.html',
  '/privacy.html',
  '/manifest.json',

  // Shared styles
  '/shared/styles/common.css',

  // Shared utilities
  '/shared/utils/storage.js',
  '/shared/utils/math.js',
  '/shared/utils/scoreboard.js',
  '/shared/utils/player-switcher.js',
  '/shared/utils/game-switcher.js',

  // Icons
  '/icons/icon-192.png',
  '/icons/icon-512.png',

  // Games - Memory Match
  '/games/memory-match/',
  '/games/memory-match/index.html',
  '/games/memory-match/game.js',
  '/games/memory-match/style.css',

  // Games - Math Blitz
  '/games/math-blitz/',
  '/games/math-blitz/index.html',
  '/games/math-blitz/game.js',
  '/games/math-blitz/style.css',

  // Games - Number Ninja
  '/games/number-ninja/',
  '/games/number-ninja/index.html',
  '/games/number-ninja/game.js',
  '/games/number-ninja/style.css',

  // Games - Multiplication Sprint
  '/games/multiplication-sprint/',
  '/games/multiplication-sprint/index.html',
  '/games/multiplication-sprint/game.js',
  '/games/multiplication-sprint/style.css'
];

// Install event - cache core files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching core files...');
        return cache.addAll(CORE_CACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Core files cached successfully');
        // Activate immediately without waiting for existing tabs to close
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache core files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('algebrain-') && name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirstWithCache(request)
    );
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(
    cacheFirstWithNetwork(request)
  );
});

/**
 * Network-first strategy with cache fallback
 * Best for HTML pages to ensure fresh content
 */
async function networkFirstWithCache(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache the fresh response
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, serving from cache:', request.url);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If no cache and network fails, serve offline page
    return caches.match('/index.html');
  }
}

/**
 * Cache-first strategy with network fallback
 * Best for static assets (CSS, JS, images)
 */
async function cacheFirstWithNetwork(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // Return cached version immediately
    // Optionally update cache in background
    updateCacheInBackground(request);
    return cachedResponse;
  }

  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Failed to fetch:', request.url, error);

    // Return a basic offline response for assets
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

/**
 * Update cache in background without blocking response
 */
function updateCacheInBackground(request) {
  fetch(request)
    .then((response) => {
      if (response.ok) {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response);
        });
      }
    })
    .catch(() => {
      // Silently fail background updates
    });
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }

  if (event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});
