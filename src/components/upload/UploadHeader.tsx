import { FiX } from 'react-icons/fi'

interface UploadHeaderProps {
  title?: string
  onClose: () => void
  disabled?: boolean
}

export function UploadHeader({ title = 'Téléverser un document', onClose, disabled }: UploadHeaderProps) {
  return (
    <div className="sticky top-0 bg-[var(--color-bg)]/90 backdrop-blur border-b border-white/10 p-6 flex items-center justify-between">
      <h2 id="upload-modal-title" className="text-xl font-semibold text-white">
        {title}
      </h2>
      <button
        onClick={onClose}
        disabled={disabled}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
        aria-label="Fermer"
      >
        <FiX className="w-5 h-5" />
      </button>
    </div>
  )
}

