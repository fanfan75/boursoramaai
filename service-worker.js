const CACHE_NAME = "bourse-ai-cache-v1";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./tf-model.js",
  "./manifest.json",
  "./icon.png",
  "./icon-512.png"
];

// Installation
self.addEventListener("install", e => {
  console.log("[SW] Installation...");
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});

// Activation + suppression anciens caches
self.addEventListener("activate", e => {
  console.log("[SW] Activation...");
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Réponse cache → réseau
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(resp => resp || fetch(e.request)));
});
