import { AnimatePresence, motion } from 'framer-motion'
import type { NotificationData } from '../../hooks/useNotifications'
import { getNotificationIcon, formatTime } from './utils'
import { FiCheck, FiX } from 'react-icons/fi'

interface NotificationsListProps {
  items: NotificationData[]
  unreadCount: number
  onMarkAllRead: () => void
  onClearAll: () => void
  onMarkRead: (id: string) => void
  onClear: (id: string) => void
}

export function NotificationsList({ items, unreadCount, onMarkAllRead, onClearAll, onMarkRead, onClear }: NotificationsListProps) {
  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="font-semibold text-white">Notifications {unreadCount > 0 && `(${unreadCount})`}</h3>
        <div className="flex items-center gap-1">
          {items.length > 0 && unreadCount > 0 && (
            <button onClick={onMarkAllRead} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white" title="Tout marquer comme lu">
              <FiCheck className="w-4 h-4" />
            </button>
          )}
          {items.length > 0 && (
            <button onClick={onClearAll} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-red-400" title="Effacer toutes les notifications">
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto scrollbar-thin">
        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <span className="w-12 h-12 mx-auto mb-3 opacity-30">🔔</span>
            <p>Aucune notification</p>
            <p className="text-xs mt-1">Vous êtes à jour !</p>
          </div>
        ) : (
          <AnimatePresence>
            {items.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-3 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.read ? 'bg-[var(--accent-orange)]/5 border-l-2 border-l-[var(--accent-orange)]' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-lg flex-shrink-0">{getNotificationIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-sm font-medium ${!n.read ? 'text-white' : 'text-[var(--text-silver)]'}`}>{n.title}</h4>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!n.read && (
                          <button onClick={() => onMarkRead(n.id)} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-green-400" title="Marquer comme lu">
                            <FiCheck className="w-3 h-3" />
                          </button>
                        )}
                        <button onClick={() => onClear(n.id)} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-red-400" title="Supprimer">
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{n.body}</p>
                    <div className="text-xs text-gray-500 mt-1">{formatTime(n.timestamp)}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </>
  )
}

