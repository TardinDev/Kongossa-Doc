import { useEffect, useState } from 'react'

interface ServiceWorkerState {
  isSupported: boolean
  isInstalled: boolean
  isOnline: boolean
  updateAvailable: boolean
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isInstalled: false,
    isOnline: navigator.onLine,
    updateAvailable: false
  })

  useEffect(() => {
    if (!state.isSupported) return

    // Register service worker
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        
        setState(prev => ({ ...prev, isInstalled: true }))

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, updateAvailable: true }))
              }
            })
          }
        })

        console.log('Service Worker registered successfully')
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }

    registerSW()

    // Listen for online/offline events
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [state.isSupported])

  const updateServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        window.location.reload()
      }
    }
  }

  return {
    ...state,
    updateServiceWorker
  }
}