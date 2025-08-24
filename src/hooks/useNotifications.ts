import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useToast } from './useToast'

interface NotificationState {
  permission: NotificationPermission | null
  subscription: PushSubscription | null
  isSupported: boolean
}

export interface NotificationData {
  id: string
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
  tag?: string
  timestamp: number
  read: boolean
  type: 'document' | 'comment' | 'system' | 'user'
}

const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY' // À remplacer par votre clé VAPID

export function useNotifications() {
  const { userId } = useAuth()
  const { toast } = useToast()
  
  const [state, setState] = useState<NotificationState>({
    permission: null,
    subscription: null,
    isSupported: 'Notification' in window && 'serviceWorker' in navigator
  })
  
  const [notifications, setNotifications] = useState<NotificationData[]>([])

  // Initialize notifications
  useEffect(() => {
    if (!state.isSupported) return

    // Get current permission
    setState(prev => ({ ...prev, permission: Notification.permission }))

    // Load stored notifications
    loadStoredNotifications()

    // Get existing subscription
    getExistingSubscription()
  }, [state.isSupported])

  const loadStoredNotifications = useCallback(() => {
    if (!userId) return
    
    try {
      const stored = localStorage.getItem(`notifications_${userId}`)
      if (stored) {
        setNotifications(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load stored notifications:', error)
    }
  }, [userId])

  const saveNotifications = useCallback((newNotifications: NotificationData[]) => {
    if (!userId) return
    
    try {
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(newNotifications))
      setNotifications(newNotifications)
    } catch (error) {
      console.error('Failed to save notifications:', error)
    }
  }, [userId])

  const getExistingSubscription = useCallback(async () => {
    if (!state.isSupported) return

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setState(prev => ({ ...prev, subscription }))
    } catch (error) {
      console.error('Failed to get existing subscription:', error)
    }
  }, [state.isSupported])

  const requestPermission = useCallback(async () => {
    if (!state.isSupported) {
      toast.error('Non supporté', 'Les notifications ne sont pas supportées sur ce navigateur')
      return false
    }

    if (state.permission === 'granted' as NotificationPermission) {
      return true
    }

    try {
      const permission = await Notification.requestPermission()
      setState(prev => ({ ...prev, permission }))
      
      if (permission === 'granted') {
        // toast.success('Notifications activées', 'Vous recevrez désormais les notifications')
        return true
      } else if (permission === 'denied') {
        // toast.error('Permission refusée', 'Les notifications ont été bloquées')
        return false
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      // toast.error('Erreur', 'Impossible de demander la permission pour les notifications')
      return false
    }
    
    return false
  }, [state.isSupported, state.permission, toast])

  const subscribe = useCallback(async () => {
    if (!state.isSupported || state.permission !== ('granted' as NotificationPermission)) {
      return null
    }

    try {
      const registration = await navigator.serviceWorker.ready
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      })

      setState(prev => ({ ...prev, subscription }))
      
      // TODO: Send subscription to your backend
      console.log('Push subscription:', subscription)
      
      // toast.success('Abonnement créé', 'Vous êtes maintenant abonné aux notifications')
      return subscription
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      // toast.error('Erreur d\'abonnement', 'Impossible de s\'abonner aux notifications')
      return null
    }
  }, [state.isSupported, state.permission, toast])

  const unsubscribe = useCallback(async () => {
    if (!state.subscription) return

    try {
      await state.subscription.unsubscribe()
      setState(prev => ({ ...prev, subscription: null }))
      // toast.success('Désabonnement', 'Vous ne recevrez plus de notifications')
    } catch (error) {
      console.error('Failed to unsubscribe:', error)
      // toast.error('Erreur', 'Impossible de se désabonner')
    }
  }, [state.subscription, toast])

  const showNotification = useCallback((data: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => {
    if (!state.isSupported || state.permission !== ('granted' as NotificationPermission)) {
      // Fallback to toast
      // toast.info(data.title, data.body)
      return
    }

    const notification: NotificationData = {
      ...data,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false
    }

    // Show browser notification
    const browserNotification = new Notification(data.title, {
      body: data.body,
      icon: data.icon || '/icon-192x192.png',
      badge: data.badge || '/icon-72x72.png',
      data: data.data,
      tag: data.tag,
      requireInteraction: data.type === 'system'
    })

    browserNotification.onclick = () => {
      window.focus()
      browserNotification.close()
      
      // Handle click based on notification type
      if (data.data?.url) {
        window.location.href = data.data.url
      }
    }

    // Store notification
    const updatedNotifications = [notification, ...notifications.slice(0, 49)] // Keep last 50
    saveNotifications(updatedNotifications)
  }, [state.isSupported, state.permission, toast, notifications, saveNotifications])

  const markAsRead = useCallback((notificationId: string) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    )
    saveNotifications(updatedNotifications)
  }, [notifications, saveNotifications])

  const markAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }))
    saveNotifications(updatedNotifications)
  }, [notifications, saveNotifications])

  const clearNotification = useCallback((notificationId: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notificationId)
    saveNotifications(updatedNotifications)
  }, [notifications, saveNotifications])

  const clearAllNotifications = useCallback(() => {
    saveNotifications([])
  }, [saveNotifications])

  // Demo notifications
  const sendDemoNotification = useCallback(() => {
    const demoTypes = [
      {
        title: '📄 Nouveau document',
        body: 'Un nouveau document "Rapport Q4 2024" a été partagé',
        type: 'document' as const,
        data: { url: '/dashboard' }
      },
      {
        title: '💬 Nouveau commentaire',
        body: 'Jean Dupont a commenté votre document',
        type: 'comment' as const,
        data: { url: '/d/123' }
      },
      {
        title: '⚡ Mise à jour système',
        body: 'Nouvelles fonctionnalités disponibles !',
        type: 'system' as const,
        data: { url: '/' }
      }
    ]

    const randomDemo = demoTypes[Math.floor(Math.random() * demoTypes.length)]
    showNotification(randomDemo)
  }, [showNotification])

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    // State
    isSupported: state.isSupported,
    permission: state.permission,
    isSubscribed: !!state.subscription,
    notifications,
    unreadCount,
    
    // Actions
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    sendDemoNotification
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}