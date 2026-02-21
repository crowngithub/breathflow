/**
 * ??AI Service Worker - ??????
 * ?????????????????
 */
const CACHE_NAME = 'breathflow-ai-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png',
  './apple-touch-icon.png'
];

// ???????????????
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets...');
      return cache.addAll(ASSETS);
    })
  );
});

// ??????????????????
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// ?????????????????????
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});

