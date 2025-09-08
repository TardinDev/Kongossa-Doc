import { FiFilter, FiSearch } from 'react-icons/fi'

interface SearchInputProps {
  value: string
  onChange: (v: string) => void
  hasActive: boolean
  isOpen: boolean
  onToggleOpen: () => void
  onEnter: () => void
  onEscape: () => void
  resultCount?: number
}

export function SearchInput({ value, onChange, hasActive, isOpen, onToggleOpen, onEnter, onEscape, resultCount }: SearchInputProps) {
  return (
    <div className="relative">
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onEnter()
          if (e.key === 'Escape') onEscape()
        }}
        placeholder="Rechercher des documents..."
        className="w-full pl-10 pr-20 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)] focus:border-transparent transition-all"
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
        {hasActive && (
          <span className="text-xs bg-[var(--accent-orange)] text-black px-2 py-1 rounded-full font-medium">
            {resultCount !== undefined ? `${resultCount} résultat${resultCount !== 1 ? 's' : ''}` : 'Filtré'}
          </span>
        )}
        <button
          onClick={onToggleOpen}
          className={`${isOpen || hasActive ? 'bg-[var(--accent-orange)] text-black' : 'bg-white/10 text-gray-400 hover:bg-white/20'} p-2 rounded-lg transition-colors`}
          title="Filtres avancés"
        >
          <FiFilter className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

