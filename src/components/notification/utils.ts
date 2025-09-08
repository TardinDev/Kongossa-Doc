import type { NotificationData } from '../../hooks/useNotifications'

export function getNotificationIcon(type: NotificationData['type']) {
  switch (type) {
    case 'document': return '📄'
    case 'comment': return '💬'
    case 'user': return '👤'
    case 'system': return '⚡'
    default: return '🔔'
  }
}

export function formatTime(timestamp: number) {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (minutes < 1) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes}min`
  if (hours < 24) return `Il y a ${hours}h`
  return `Il y a ${days}j`
}

