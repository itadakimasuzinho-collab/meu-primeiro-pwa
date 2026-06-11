const CACHE_NAME = 'pwa-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instalação e skipWaiting (Atividade item 2)
self.addEventListener('install', event => {
  console.log('Service Worker instalando.');
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Fazendo cache dos arquivos estáticos.');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Ativação e Limpeza de caches antigos (Atividade item 2)
self.addEventListener('activate', event => {
  console.log('Service Worker ativado.');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Apagando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Logs de Fetch (Atividade item 4)
self.addEventListener('fetch', function(event) {
  console.log('Requisição de fetch para:', event.request.url);
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Logs de Push (Atividade item 4)
self.addEventListener('push', function(event) {
  console.log('Notificação push recebida:', event);
  const title = 'Notificação de Teste';
  const options = {
    body: 'O Service Worker e os eventos push estão funcionando!',
    icon: 'https://cdn-icons-png.flaticon.com/512/1250/1250925.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});