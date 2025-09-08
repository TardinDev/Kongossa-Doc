import { motion } from 'framer-motion'
import { FiBell } from 'react-icons/fi'

interface NotificationBellProps {
  unreadCount: number
  onToggle: () => void
  open: boolean
}

export function NotificationBell({ unreadCount, onToggle, open }: NotificationBellProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative p-2 rounded-lg transition-colors ${open ? 'bg-white/10 text-white' : 'text-[var(--text-silver)] hover:text-white hover:bg-white/10'}`}
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
    >
      <FiBell className="w-5 h-5" />
      {unreadCount > 0 && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold">
          {unreadCount > 99 ? '99+' : unreadCount}
        </motion.span>
      )}
    </button>
  )
}

