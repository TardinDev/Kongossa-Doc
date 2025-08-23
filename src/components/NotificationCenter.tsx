import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBell, FiX, FiCheck, FiTrash2, FiSettings, FiPlay } from 'react-icons/fi'
import { useNotifications, type NotificationData } from '../hooks/useNotifications'
import { FocusTrap } from './FocusTrap'
import { useClickOutside } from '../hooks/useClickOutside'

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const {
    isSupported,
    permission,
    isSubscribed,
    notifications,
    unreadCount,
    requestPermission,
    subscribe,
    unsubscribe,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    sendDemoNotification
  } = useNotifications()

  useClickOutside(containerRef, () => {
    setIsOpen(false)
    setShowSettings(false)
  })

  const handlePermissionRequest = async () => {
    const granted = await requestPermission()
    if (granted) {
      await subscribe()
    }
  }

  const getNotificationIcon = (type: NotificationData['type']) => {
    switch (type) {
      case 'document': return '📄'
      case 'comment': return '💬'
      case 'user': return '👤'
      case 'system': return '⚡'
      default: return '🔔'
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'À l\'instant'
    if (minutes < 60) return `Il y a ${minutes}min`
    if (hours < 24) return `Il y a ${hours}h`
    return `Il y a ${days}j`
  }

  if (!isSupported) {
    return null // Don't show if notifications aren't supported
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[var(--text-silver)] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
      >
        <FiBell className="w-5 h-5" />
        
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <FocusTrap active={isOpen}>
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 bg-[var(--color-bg)] border border-white/10 rounded-xl shadow-2xl backdrop-blur z-50"
            >
              {showSettings ? (
                // Settings Panel
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Paramètres de notification</h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="p-1 hover:bg-white/10 rounded text-gray-400"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--text-silver)]">
                        Statut: {permission === 'granted' ? 'Autorisées' : permission === 'denied' ? 'Bloquées' : 'Non configurées'}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${
                        permission === 'granted' ? 'bg-green-500' : 
                        permission === 'denied' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                    </div>

                    {permission !== 'granted' && (
                      <button
                        onClick={handlePermissionRequest}
                        className="w-full py-2 px-4 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors"
                      >
                        Activer les notifications
                      </button>
                    )}

                    {permission === 'granted' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--text-silver)]">
                            Push: {isSubscribed ? 'Activé' : 'Désactivé'}
                          </span>
                          {isSubscribed ? (
                            <button
                              onClick={unsubscribe}
                              className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                            >
                              Désactiver
                            </button>
                          ) : (
                            <button
                              onClick={subscribe}
                              className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                            >
                              Activer
                            </button>
                          )}
                        </div>
                        
                        <button
                          onClick={sendDemoNotification}
                          className="w-full py-2 px-4 border border-white/20 text-[var(--text-silver)] rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                        >
                          <FiPlay className="w-4 h-4" />
                          Tester une notification
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Notifications List
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h3 className="font-semibold text-white">
                      Notifications {unreadCount > 0 && `(${unreadCount})`}
                    </h3>
                    <div className="flex items-center gap-1">
                      {notifications.length > 0 && unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                          title="Tout marquer comme lu"
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-red-400"
                          title="Effacer toutes les notifications"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setShowSettings(true)}
                        className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                        title="Paramètres"
                      >
                        <FiSettings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="max-h-96 overflow-y-auto scrollbar-thin">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        <FiBell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Aucune notification</p>
                        <p className="text-xs mt-1">Vous êtes à jour !</p>
                      </div>
                    ) : (
                      <AnimatePresence>
                        {notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`p-3 border-b border-white/5 hover:bg-white/5 transition-colors ${
                              !notification.read ? 'bg-[var(--accent-orange)]/5 border-l-2 border-l-[var(--accent-orange)]' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-lg flex-shrink-0">
                                {getNotificationIcon(notification.type)}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className={`text-sm font-medium ${
                                    !notification.read ? 'text-white' : 'text-[var(--text-silver)]'
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    {!notification.read && (
                                      <button
                                        onClick={() => markAsRead(notification.id)}
                                        className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-green-400"
                                        title="Marquer comme lu"
                                      >
                                        <FiCheck className="w-3 h-3" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => clearNotification(notification.id)}
                                      className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-red-400"
                                      title="Supprimer"
                                    >
                                      <FiX className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                                
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                  {notification.body}
                                </p>
                                
                                <div className="text-xs text-gray-500 mt-1">
                                  {formatTime(notification.timestamp)}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </FocusTrap>
        )}
      </AnimatePresence>
    </div>
  )
}