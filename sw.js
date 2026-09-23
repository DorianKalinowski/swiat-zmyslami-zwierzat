/* ============================================================
   Service Worker — Świat zmysłami zwierząt (Offline & PWA)
   Author: Dorian Kalinowski
   ============================================================ */

const CACHE_NAME = 'swiat-zmyslami-zwierzat-v10';

// Core assets to pre-cache (both clean URLs and .html paths for 100% compatibility)
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/pies',
  '/pies.html',
  '/kot',
  '/kot.html',
  '/dzik',
  '/dzik.html',
  '/wilk',
  '/wilk.html',
  '/css/style.css',
  '/js/app.js',
  '/js/dog-simulators.js',
  '/js/cat-simulators.js',
  '/js/boar-simulators.js',
  '/js/wolf-simulators.js',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/img/dorian-kalinowski.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Robust individual fetching to prevent a single failure from aborting install
      for (const asset of ASSETS_TO_CACHE) {
        try {
          const response = await fetch(asset, { cache: 'no-cache' });
          if (response && (response.ok || response.status === 200)) {
            await cache.put(asset, response.clone());
            // Also cache with relative dot-slash notation for file-relative matching
            if (asset.startsWith('/')) {
              const rel = '.' + asset;
              await cache.put(rel, response);
            }
          }
        } catch (err) {
          console.warn('SW pre-cache skip for:', asset, err);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. PAGE NAVIGATION HANDLING (HTML documents)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const pathname = url.pathname.replace(/\/$/, '') || '/';
        const htmlPath = pathname.endsWith('.html') ? pathname : `${pathname}.html`;
        const cleanPath = pathname.replace(/\.html$/, '') || '/';

        // Try network first when online
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && (networkResponse.ok || networkResponse.status === 200)) {
            let responseToReturn = networkResponse;

            // In mobile browsers (iOS WebKit / Chrome Mobile), returning a redirected response
            // to a navigation request triggers a strict network error (ERR_UNSAFE_REDIRECT).
            // Re-constructing the Response strips the redirected flag safely.
            if (networkResponse.redirected) {
              const bodyBlob = await networkResponse.blob();
              responseToReturn = new Response(bodyBlob, {
                status: 200,
                statusText: 'OK',
                headers: networkResponse.headers
              });
            }

            // Save in cache under both requested and normalized paths
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, responseToReturn.clone());
            cache.put(pathname, responseToReturn.clone());
            cache.put(htmlPath, responseToReturn.clone());
            if (cleanPath !== '/') cache.put(cleanPath, responseToReturn.clone());

            return responseToReturn;
          }
        } catch (err) {
          // Network failed or offline, fall through to cache
        }

        // Cache fallback: match any variant of the URL
        const cached = await caches.match(event.request) ||
                       await caches.match(pathname) ||
                       await caches.match(htmlPath) ||
                       await caches.match(cleanPath) ||
                       await caches.match('.' + htmlPath) ||
                       await caches.match('.' + cleanPath) ||
                       await caches.match('/index.html') ||
                       await caches.match('./index.html') ||
                       await caches.match('/');

        if (cached) return cached;

        // Last resort offline fallback
        return caches.match('/index.html') || caches.match('./index.html');
      })()
    );
    return;
  }

  // 2. STATIC ASSETS HANDLING (CSS, JS, Images, Icons, Audio, Fonts)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Revalidate in background to keep assets fresh
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        return networkResponse;
      }).catch(() => {
        // If an image or asset is missing offline, handle gracefully
        return new Response('', { status: 408, statusText: 'Offline Asset Unavailable' });
      });
    })
  );
});
