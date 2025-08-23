import { motion } from 'framer-motion'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import { useState } from 'react'

interface SearchAndFiltersProps {
  query: string
  onQueryChange: (query: string) => void
  sortBy: 'date' | 'title' | 'type' | 'popularity'
  onSortChange: (sort: 'date' | 'title' | 'type' | 'popularity') => void
  filterType: string
  onFilterTypeChange: (type: string) => void
  resultCount: number
}

const documentTypes: { value: string; label: string; emoji: string }[] = [
  { value: '', label: 'Tous les types', emoji: '📁' },
  { value: 'pdf', label: 'PDF', emoji: '📄' },
  { value: 'image', label: 'Images', emoji: '🖼️' },
  { value: 'audio', label: 'Audio', emoji: '🎧' },
  { value: 'video', label: 'Vidéos', emoji: '🎬' },
]

const sortOptions = [
  { value: 'date', label: 'Plus récent' },
  { value: 'title', label: 'Titre A-Z' },
  { value: 'type', label: 'Type' },
  { value: 'popularity', label: 'Popularité' },
]

export function SearchAndFilters({
  query,
  onQueryChange,
  sortBy,
  onSortChange,
  filterType,
  onFilterTypeChange,
  resultCount
}: SearchAndFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters = filterType !== '' || sortBy !== 'date'
  const hasQuery = query.trim() !== ''

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-2xl font-bold text-white">
            Documents publics
          </h1>
          {(hasQuery || hasActiveFilters) && (
            <p className="text-sm text-[var(--text-silver)] mt-1">
              {resultCount} résultat{resultCount !== 1 ? 's' : ''} trouvé{resultCount !== 1 ? 's' : ''}
              {hasQuery && ` pour "${query}"`}
            </p>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <div className="relative flex-1 sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-10 py-2 rounded-md border border-white/10 bg-white/5 text-[var(--text-silver)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
            />
            {hasQuery && (
              <button
                onClick={() => onQueryChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label="Effacer la recherche"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 transition-colors ${
              hasActiveFilters || showFilters
                ? 'bg-[var(--accent-orange)] text-black'
                : 'bg-white/5 text-[var(--text-silver)] hover:bg-white/10'
            }`}
            aria-label="Filtres"
          >
            <FiFilter className="w-4 h-4" />
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-current rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                Type de document
              </label>
              <select
                value={filterType}
                onChange={(e) => onFilterTypeChange(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-white/10 bg-white/5 text-[var(--text-silver)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
              >
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value} className="bg-[var(--color-bg)]">
                    {type.emoji} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                Trier par
              </label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as 'date' | 'title' | 'type' | 'popularity')}
                className="w-full px-3 py-2 rounded-md border border-white/10 bg-white/5 text-[var(--text-silver)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-[var(--color-bg)]">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-sm text-[var(--text-silver)]">
                Filtres actifs
              </span>
              <button
                onClick={() => {
                  onFilterTypeChange('')
                  onSortChange('date')
                }}
                className="text-sm text-[var(--accent-orange)] hover:text-orange-400"
              >
                Réinitialiser
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}