interface PaginationProps {
  currentPage: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
  onPrev: () => void
  onNext: () => void
}

export function Pagination({ currentPage, totalPages, hasPrev, hasNext, onPrev, onNext }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-3 pt-6">
      <button
        className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        onClick={onPrev}
        disabled={!hasPrev}
      >
        Précédent
      </button>
      <span className="text-sm text-gray-300 px-4">
        Page {currentPage} / {totalPages}
      </span>
      <button
        className="px-4 py-2 rounded-lg bg-[var(--accent-orange)] text-black font-semibold hover:bg-orange-500/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        onClick={onNext}
        disabled={!hasNext}
      >
        Suivant
      </button>
    </div>
  )
}

