const CACHE_NAME = "chamber-cache-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./patient.html",
  "./remedy.html",
  "./prescription.html",
  "./report.html",
  "./app.js",
  "./style.css"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
