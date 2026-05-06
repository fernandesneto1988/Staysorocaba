const CACHE_NAME = 'stay-sorocaba-v3';
const FILES_TO_CACHE = [
  '/Staysorocaba/',
  '/Staysorocaba/index.html',
  '/Staysorocaba/manifest.json',
  '/Staysorocaba/icon-192.png',
  '/Staysorocaba/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Atualiza o cache com a versão mais recente
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => {
        // Só usa cache se estiver offline
        return caches.match(event.request);
      })
  );
});
