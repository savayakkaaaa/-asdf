// Минимальный service worker для установки PWA и офлайн-старта.
// Кэширует оболочку приложения; демо-данные всё равно хранятся в localStorage.
// Пути относительны области действия SW (scope), поэтому работают и на / и на /<repo>/.
const CACHE = 'kaspi-demo-v1'
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  if (request.method !== 'GET') return
  // Навигационные запросы: сеть, затем кэш (офлайн-фоллбэк на оболочку)
  if (request.mode === 'navigate') {
    e.respondWith(fetch(request).catch(() => caches.match('./index.html')))
    return
  }
  // Остальное: кэш, затем сеть с дозаписью в кэш
  e.respondWith(
    caches.match(request).then((hit) =>
      hit || fetch(request).then((res) => {
        const copy = res.clone()
        caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {})
        return res
      }).catch(() => hit)
    )
  )
})
