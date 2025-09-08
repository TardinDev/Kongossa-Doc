import { FiPlay, FiX } from 'react-icons/fi'

interface SettingsPanelProps {
  permission: NotificationPermission | null
  isSubscribed: boolean
  onClose: () => void
  onRequestPermission: () => Promise<void>
  subscribe: () => Promise<unknown>
  unsubscribe: () => Promise<unknown> | void
  sendDemo: () => void
}

export function SettingsPanel({ permission, isSubscribed, onClose, onRequestPermission, subscribe, unsubscribe, sendDemo }: SettingsPanelProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Paramètres de notification</h3>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded text-gray-400">
          <FiX className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-silver)]">
            Statut: {permission === 'granted' ? 'Autorisées' : permission === 'denied' ? 'Bloquées' : 'Non configurées'}
          </span>
          <div className={`w-2 h-2 rounded-full ${permission === 'granted' ? 'bg-green-500' : permission === 'denied' ? 'bg-red-500' : 'bg-yellow-500'}`} />
        </div>

        {permission !== 'granted' && (
          <button onClick={onRequestPermission} className="w-full py-2 px-4 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors">
            Activer les notifications
          </button>
        )}

        {permission === 'granted' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-[var(--text-silver)]">
              <span>Abonnement push</span>
              <span className={`px-2 py-0.5 rounded ${isSubscribed ? 'bg-green-500/20 text-green-300' : 'bg-white/10'}`}>{isSubscribed ? 'Actif' : 'Inactif'}</span>
            </div>
            <div className="flex gap-2">
              {!isSubscribed ? (
                <button onClick={subscribe} className="flex-1 py-2 px-4 bg-white/10 hover:bg-white/15 rounded-lg text-[var(--text-silver)]">S'abonner</button>
              ) : (
                <button onClick={unsubscribe} className="flex-1 py-2 px-4 bg-white/10 hover:bg-white/15 rounded-lg text-[var(--text-silver)]">Se désabonner</button>
              )}
              <button onClick={sendDemo} className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-4 bg-white/10 hover:bg-white/15 rounded-lg text-[var(--text-silver)]">
                <FiPlay className="w-4 h-4" />
                Tester une notification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
