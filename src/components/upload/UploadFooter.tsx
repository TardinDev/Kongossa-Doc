interface UploadFooterProps {
  onCancel: () => void
  submitLabel?: string
  disabled?: boolean
}

export function UploadFooter({ onCancel, submitLabel = 'Téléverser', disabled }: UploadFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
      <button
        type="button"
        onClick={onCancel}
        disabled={disabled}
        className="px-4 py-2 text-[var(--text-silver)] hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
      >
        Annuler
      </button>
      <button
        type="submit"
        disabled={disabled}
        className="px-6 py-2 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitLabel}
      </button>
    </div>
  )
}

