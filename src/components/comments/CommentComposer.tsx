import { FiSend } from 'react-icons/fi'

interface CommentComposerProps {
  value: string
  onChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading?: boolean
  replyTo?: string | null
  onCancelReply?: () => void
  userInitial?: string
  maxLength?: number
}

export function CommentComposer({ value, onChange, onSubmit, isLoading, replyTo, onCancelReply, userInitial = 'U', maxLength = 500 }: CommentComposerProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {replyTo && (
        <div className="text-sm text-[var(--accent-orange)] flex items-center gap-2">
          <FiSend className="w-4 h-4" />
          Réponse en cours...
          <button type="button" onClick={onCancelReply} className="text-gray-400 hover:text-white">
            Annuler
          </button>
        </div>
      )}
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--accent-orange)] flex items-center justify-center text-black font-semibold text-sm flex-shrink-0">
          {userInitial}
        </div>
        <div className="flex-1">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={replyTo ? 'Écrire une réponse...' : 'Ajouter un commentaire...'}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
            rows={3}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{value.length}/{maxLength}</span>
            <button
              type="submit"
              disabled={!value.trim() || isLoading || value.length > maxLength}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-orange)] text-black rounded-lg hover:bg-orange-500/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiSend className="w-4 h-4" />
              {isLoading ? 'Envoi...' : 'Publier'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

