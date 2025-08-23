const CACHE_NAME = 'kongossadoc-v1'
const OFFLINE_URL = '/offline.html'

const STATIC_CACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  // Add your critical CSS and JS files here
]

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event - Network first, then cache strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Handle API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone response for cache
          const responseClone = response.clone()
          if (response.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse
              }
              // Return offline page for navigation requests
              if (event.request.mode === 'navigate') {
                return caches.match(OFFLINE_URL)
              }
            })
        })
    )
    return
  }

  // Handle navigation requests (pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL)
        })
    )
    return
  }

  // Handle static assets - Cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(event.request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone)
              })
            }
            return response
          })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-documents') {
    event.waitUntil(syncDocuments())
  }
})

async function syncDocuments() {
  try {
    // Get pending uploads from IndexedDB
    const pendingUploads = await getPendingUploads()
    
    for (const upload of pendingUploads) {
      try {
        await fetch('/api/documents', {
          method: 'POST',
          body: upload.formData
        })
        // Remove from pending uploads on success
        await removePendingUpload(upload.id)
      } catch (error) {
        console.error('Failed to sync upload:', error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  if (!event.data) {
    return
  }

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    image: data.image,
    data: data.data,
    actions: [
      {
        action: 'open',
        title: 'Ouvrir',
        icon: '/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Fermer'
      }
    ],
    tag: data.tag || 'default',
    requireInteraction: true
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'KongossaDoc', options)
  )
})

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'close') {
    return
  }

  const urlToOpen = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        // Open new window if app not open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Helper functions for IndexedDB operations
async function getPendingUploads() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('KongossaDocDB', 1)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['pendingUploads'], 'readonly')
      const store = transaction.objectStore('pendingUploads')
      const getAllRequest = store.getAll()
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result)
      }
      
      getAllRequest.onerror = () => {
        reject(getAllRequest.error)
      }
    }
    
    request.onerror = () => {
      reject(request.error)
    }
  })
}

async function removePendingUpload(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('KongossaDocDB', 1)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['pendingUploads'], 'readwrite')
      const store = transaction.objectStore('pendingUploads')
      const deleteRequest = store.delete(id)
      
      deleteRequest.onsuccess = () => {
        resolve()
      }
      
      deleteRequest.onerror = () => {
        reject(deleteRequest.error)
      }
    }
    
    request.onerror = () => {
      reject(request.error)
    }
  })
}