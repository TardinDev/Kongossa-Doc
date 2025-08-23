import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiFilter, FiX, FiCalendar, FiUser, FiTag, FiFileText, FiSliders } from 'react-icons/fi'
import { FocusTrap } from './FocusTrap'

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  initialFilters?: Partial<SearchFilters>
  resultCount?: number
}

export interface SearchFilters {
  query: string
  type: string[]
  dateRange: {
    start: string
    end: string
  }
  sizeRange: {
    min: number
    max: number
  }
  tags: string[]
  category: string[]
  sortBy: 'date' | 'title' | 'type' | 'popularity' | 'size'
  sortOrder: 'asc' | 'desc'
  owner: string
}

const FILE_TYPES = [
  { value: 'pdf', label: 'PDF', icon: '📄' },
  { value: 'image', label: 'Images', icon: '🖼️' },
  { value: 'video', label: 'Vidéos', icon: '🎬' },
  { value: 'audio', label: 'Audio', icon: '🎧' },
  { value: 'document', label: 'Documents', icon: '📝' },
  { value: 'archive', label: 'Archives', icon: '📦' },
]

const CATEGORIES = [
  { value: 'business', label: 'Business', color: '#3b82f6' },
  { value: 'education', label: 'Éducation', color: '#10b981' },
  { value: 'entertainment', label: 'Divertissement', color: '#f59e0b' },
  { value: 'technology', label: 'Technologie', color: '#8b5cf6' },
  { value: 'health', label: 'Santé', color: '#ef4444' },
  { value: 'finance', label: 'Finance', color: '#06b6d4' },
  { value: 'legal', label: 'Juridique', color: '#64748b' },
  { value: 'other', label: 'Autre', color: '#6b7280' },
]

const SIZE_PRESETS = [
  { label: 'Petit (< 1 MB)', min: 0, max: 1024 * 1024 },
  { label: 'Moyen (1-10 MB)', min: 1024 * 1024, max: 10 * 1024 * 1024 },
  { label: 'Grand (10-100 MB)', min: 10 * 1024 * 1024, max: 100 * 1024 * 1024 },
  { label: 'Très grand (> 100 MB)', min: 100 * 1024 * 1024, max: Infinity },
]

export function AdvancedSearch({ onSearch, initialFilters = {}, resultCount }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: [],
    dateRange: { start: '', end: '' },
    sizeRange: { min: 0, max: Infinity },
    tags: [],
    category: [],
    sortBy: 'date',
    sortOrder: 'desc',
    owner: '',
    ...initialFilters,
  })
  const [newTag, setNewTag] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const updateFilter = useCallback(<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggleArrayValue = useCallback(<T>(array: T[], value: T) => {
    return array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value]
  }, [])

  const handleSearch = useCallback(() => {
    onSearch(filters)
    setIsOpen(false)
  }, [filters, onSearch])

  const clearFilters = useCallback(() => {
    const clearedFilters: SearchFilters = {
      query: '',
      type: [],
      dateRange: { start: '', end: '' },
      sizeRange: { min: 0, max: Infinity },
      tags: [],
      category: [],
      sortBy: 'date',
      sortOrder: 'desc',
      owner: '',
    }
    setFilters(clearedFilters)
    onSearch(clearedFilters)
  }, [onSearch])

  const addTag = useCallback(() => {
    if (newTag.trim() && !filters.tags.includes(newTag.trim())) {
      updateFilter('tags', [...filters.tags, newTag.trim()])
      setNewTag('')
    }
  }, [newTag, filters.tags, updateFilter])

  const removeTag = useCallback((tag: string) => {
    updateFilter('tags', filters.tags.filter(t => t !== tag))
  }, [filters.tags, updateFilter])

  const hasActiveFilters = filters.query || filters.type.length > 0 || filters.tags.length > 0 || 
                          filters.category.length > 0 || filters.dateRange.start || filters.dateRange.end ||
                          filters.owner || filters.sizeRange.min > 0 || filters.sizeRange.max < Infinity

  const formatFileSize = (bytes: number) => {
    if (bytes === Infinity) return '∞'
    if (bytes === 0) return '0'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div ref={searchRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={filters.query}
          onChange={(e) => updateFilter('query', e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch()
            if (e.key === 'Escape') setIsOpen(false)
          }}
          placeholder="Rechercher des documents..."
          className="w-full pl-10 pr-20 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)] focus:border-transparent transition-all"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {hasActiveFilters && (
            <span className="text-xs bg-[var(--accent-orange)] text-black px-2 py-1 rounded-full font-medium">
              {resultCount !== undefined ? `${resultCount} résultat${resultCount !== 1 ? 's' : ''}` : 'Filtré'}
            </span>
          )}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isOpen || hasActiveFilters 
                ? 'bg-[var(--accent-orange)] text-black' 
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
            title="Filtres avancés"
          >
            <FiFilter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filters Modal */}
      <AnimatePresence>
        {isOpen && (
          <FocusTrap active={isOpen}>
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-bg)] border border-white/10 rounded-xl shadow-2xl backdrop-blur z-50 max-h-96 overflow-y-auto scrollbar-thin"
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FiSliders className="w-5 h-5" />
                    Recherche avancée
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded text-gray-400"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>

                {/* File Types */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                    <FiFileText className="w-4 h-4 inline mr-1" />
                    Types de fichier
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {FILE_TYPES.map(type => (
                      <button
                        key={type.value}
                        onClick={() => updateFilter('type', toggleArrayValue(filters.type, type.value))}
                        className={`p-2 rounded-lg border text-sm flex items-center gap-2 transition-colors ${
                          filters.type.includes(type.value)
                            ? 'border-[var(--accent-orange)] bg-[var(--accent-orange)]/10 text-[var(--accent-orange)]'
                            : 'border-white/20 hover:border-white/40 text-[var(--text-silver)]'
                        }`}
                      >
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                    Catégories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(category => (
                      <button
                        key={category.value}
                        onClick={() => updateFilter('category', toggleArrayValue(filters.category, category.value))}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          filters.category.includes(category.value)
                            ? 'text-black font-medium'
                            : 'border border-white/20 text-[var(--text-silver)] hover:border-white/40'
                        }`}
                        style={{
                          backgroundColor: filters.category.includes(category.value) ? category.color : undefined
                        }}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                    <FiTag className="w-4 h-4 inline mr-1" />
                    Tags
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addTag()
                          }
                        }}
                        placeholder="Ajouter un tag..."
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--accent-orange)]"
                      />
                      <button
                        onClick={addTag}
                        className="px-3 py-2 bg-[var(--accent-orange)] text-black rounded-lg hover:bg-orange-500/90 transition-colors"
                      >
                        Ajouter
                      </button>
                    </div>
                    {filters.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {filters.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] rounded-full text-xs"
                          >
                            #{tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="hover:bg-[var(--accent-orange)]/20 rounded-full p-0.5"
                            >
                              <FiX className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                    <FiCalendar className="w-4 h-4 inline mr-1" />
                    Période
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-orange)]"
                    />
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-orange)]"
                    />
                  </div>
                </div>

                {/* File Size */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                    Taille de fichier
                  </label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      {SIZE_PRESETS.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => updateFilter('sizeRange', { min: preset.min, max: preset.max })}
                          className={`p-2 rounded-lg border text-sm transition-colors ${
                            filters.sizeRange.min === preset.min && filters.sizeRange.max === preset.max
                              ? 'border-[var(--accent-orange)] bg-[var(--accent-orange)]/10 text-[var(--accent-orange)]'
                              : 'border-white/20 hover:border-white/40 text-[var(--text-silver)]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400 text-center">
                      Actuel: {formatFileSize(filters.sizeRange.min)} - {formatFileSize(filters.sizeRange.max)}
                    </div>
                  </div>
                </div>

                {/* Owner */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                    <FiUser className="w-4 h-4 inline mr-1" />
                    Propriétaire
                  </label>
                  <input
                    type="text"
                    value={filters.owner}
                    onChange={(e) => updateFilter('owner', e.target.value)}
                    placeholder="Nom d'utilisateur..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--accent-orange)]"
                  />
                </div>

                {/* Sort */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                      Trier par
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => updateFilter('sortBy', e.target.value as SearchFilters['sortBy'])}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-orange)]"
                    >
                      <option value="date">Date</option>
                      <option value="title">Titre</option>
                      <option value="type">Type</option>
                      <option value="popularity">Popularité</option>
                      <option value="size">Taille</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                      Ordre
                    </label>
                    <select
                      value={filters.sortOrder}
                      onChange={(e) => updateFilter('sortOrder', e.target.value as SearchFilters['sortOrder'])}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-orange)]"
                    >
                      <option value="desc">Décroissant</option>
                      <option value="asc">Croissant</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-[var(--text-silver)] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Effacer tout
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 text-[var(--text-silver)] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSearch}
                      className="px-4 py-2 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </FocusTrap>
        )}
      </AnimatePresence>
    </div>
  )
}