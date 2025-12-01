const CACHE_NAME = 'livrebet-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './assets/redondo.png',
  './assets/capa-ebook.jpg'
  // Adicione aqui outros arquivos da pasta assets se necessário
];

// Instalação do Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Interceptar requisições (Cache First Strategy)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
