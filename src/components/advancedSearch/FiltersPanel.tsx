import { motion } from 'framer-motion'
import { FiCalendar, FiFileText, FiSliders, FiTag, FiUser, FiX } from 'react-icons/fi'
import { FocusTrap } from '../FocusTrap'
import type { SearchFilters } from './types'
import { CATEGORIES, FILE_TYPES, SIZE_PRESETS } from './constants'
import { formatFileSize, toggleArrayValue } from './utils'
import { useState } from 'react'

interface FiltersPanelProps {
  open: boolean
  filters: SearchFilters
  updateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void
  onClear: () => void
  onApply: () => void
  onClose: () => void
}

export function FiltersPanel({ open, filters, updateFilter, onClear, onApply, onClose }: FiltersPanelProps) {
  const [newTag, setNewTag] = useState('')

  const addTag = () => {
    const value = newTag.trim()
    if (value && !filters.tags.includes(value)) {
      updateFilter('tags', [...filters.tags, value])
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    updateFilter('tags', filters.tags.filter(t => t !== tag))
  }

  if (!open) return null

  return (
    <FocusTrap active={open}>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-bg)] border border-white/10 rounded-xl shadow-2xl backdrop-blur z-50 max-h-96 overflow-y-auto scrollbar-thin"
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FiSliders className="w-5 h-5" />
              Recherche avancée
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded text-gray-400">
              <FiX className="w-4 h-4" />
            </button>
          </div>

          <section>
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
          </section>

          <section>
            <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">Catégories</label>
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
                  style={{ backgroundColor: filters.category.includes(category.value) ? category.color : undefined }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </section>

          <section>
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
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  placeholder="Ajouter un tag..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--accent-orange)]"
                />
                <button onClick={addTag} className="px-3 py-2 bg-[var(--accent-orange)] text-black rounded-lg hover:bg-orange-500/90 transition-colors">Ajouter</button>
              </div>
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {filters.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] rounded-full text-xs">
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="hover:bg-[var(--accent-orange)]/20 rounded-full p-0.5">
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
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
          </section>

          <section>
            <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">Taille de fichier</label>
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
          </section>

          <section>
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
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">Trier par</label>
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
              <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">Ordre</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => updateFilter('sortOrder', e.target.value as SearchFilters['sortOrder'])}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-orange)]"
              >
                <option value="desc">Décroissant</option>
                <option value="asc">Croissant</option>
              </select>
            </div>
          </section>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button onClick={onClear} className="px-4 py-2 text-[var(--text-silver)] hover:text-white hover:bg-white/5 rounded-lg transition-colors">Effacer tout</button>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-4 py-2 text-[var(--text-silver)] hover:text-white hover:bg-white/5 rounded-lg transition-colors">Annuler</button>
              <button onClick={onApply} className="px-4 py-2 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors">Appliquer</button>
            </div>
          </div>
        </div>
      </motion.div>
    </FocusTrap>
  )
}

