//const currentCacheName = 'restaurant-reviews-app-4';

const appName = 'restaurant-reviews-app'
const staticCacheName = appName + '-v4.0';

const contentImgsCache = appName + "-images";

const allCaches = [
  staticCacheName,
  contentImgsCache
];



// Cache static assets //

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/', // this caches index.html //
        '/restaurant.html',
        '/css/styles.css',
        '/css/Responsive.css',
        '/js/dbhelper.js',
        '/js/main.js',
        '/js/restaurant_info.js',
        'sw-reg.js', 
        'data/restaurants.json'
      ]);
    })
  );
});

// At Service Worker Activation, Delete previous caches (if any) //

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith(appName) &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Fetch request //

self.addEventListener('fetch', function(event) {
  const requestUrl = new URL(event.request.url);

  // Request made to our app (not mapbox map)
  if (requestUrl.origin === location.origin) {

    // Url can't be used as the key to access the cache
    if (requestUrl.pathname.startsWith('/restaurant.html')) {
      event.respondWith(caches.match('/restaurant.html'));
      return;
    }

    // If the request name starts with image
    if (requestUrl.pathname.startsWith('/img')) {
      event.respondWith(serveImage(event.request));
      return; // Done handling request – exit early
    }
  }

  // Respond with cached elements – falling back to network 
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});