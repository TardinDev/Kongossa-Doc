import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSettings } from 'react-icons/fi'
import { useNotifications } from '../hooks/useNotifications'
import { FocusTrap } from './FocusTrap'
import { useClickOutside } from '../hooks/useClickOutside'
import { NotificationBell } from './notification/NotificationBell'
import { SettingsPanel } from './notification/SettingsPanel'
import { NotificationsList } from './notification/NotificationsList'

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

  // icon/time utils moved to notification/utils

  if (!isSupported) {
    return null // Don't show if notifications aren't supported
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Notification Bell */}
      <NotificationBell unreadCount={unreadCount} onToggle={() => setIsOpen(!isOpen)} open={isOpen} />

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
                <SettingsPanel
                  permission={permission}
                  isSubscribed={isSubscribed}
                  onClose={() => setShowSettings(false)}
                  onRequestPermission={async () => { await handlePermissionRequest() }}
                  subscribe={subscribe}
                  unsubscribe={unsubscribe}
                  sendDemo={sendDemoNotification}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h3 className="font-semibold text-white">Notifications {unreadCount > 0 && `(${unreadCount})`}</h3>
                    <button onClick={() => setShowSettings(true)} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white" title="Paramètres">
                      <FiSettings className="w-4 h-4" />
                    </button>
                  </div>
                  <NotificationsList
                    items={notifications}
                    unreadCount={unreadCount}
                    onMarkAllRead={markAllAsRead}
                    onClearAll={clearAllNotifications}
                    onMarkRead={markAsRead}
                    onClear={clearNotification}
                  />
                </>
              )}
            </motion.div>
          </FocusTrap>
        )}
      </AnimatePresence>
    </div>
  )
}
