self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("chamber").then(c =>
      c.addAll([
        "/",
        "/index.html",
        "/dashboard.html",
        "/prescription.html",
        "/payment.html"
      ])
    )
  );
});
