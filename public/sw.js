const CACHE_NAME = 'apracademy-v4'
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.svg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)
  const isNavigation = event.request.mode === 'navigate'
  const isAuthPath =
    url.pathname.startsWith('/signin') ||
    url.pathname.startsWith('/check-email') ||
    url.pathname.startsWith('/api/auth/') ||
    url.pathname.startsWith('/api/auth')

  // Never cache auth-related pages/routes. They need fresh responses.
  if (isAuthPath) {
    event.respondWith(fetch(event.request))
    return
  }

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response(
        JSON.stringify({ error: 'offline' }),
        { headers: { 'Content-Type': 'application/json' }, status: 503 }
      ))
    )
    return
  }

  if (url.pathname.startsWith('/_next/static/') || url.pathname.match(/\.(js|css|woff2?|png|svg|ico)$/)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached
        return fetch(event.request).then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          return response
        })
      })
    )
    return
  }

  // For page navigations, use network-first to avoid stale HTML/chunk mismatches
  // after frequent deployments. Fall back to cached root when offline.
  if (isNavigation) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/'))
    )
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        return response
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/')))
  )
})
