const CACHE_NAME = "chamber-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/prescription.html",
  "/payment.html",
  "/patient.html",
  "/report.html",
  "/app.js"
];

// Install: cache all necessary files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches if needed
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

// Fetch: respond with cache first, then network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
