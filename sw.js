const CACHE_NAME = 'museum-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/Index.html',
  '/posters.html',
  '/Artworks.html',
  '/clothing.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});