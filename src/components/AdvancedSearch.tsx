import { useState, useCallback, useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SearchInput } from './advancedSearch/SearchInput'
import { FiltersPanel } from './advancedSearch/FiltersPanel'
import { hasActiveFilters } from './advancedSearch/utils'
import type { AdvancedSearchProps, SearchFilters } from './advancedSearch/types'

export { type SearchFilters } from './advancedSearch/types'

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

  return (
    <div ref={searchRef} className="relative">
      <SearchInput
        value={filters.query}
        onChange={(v) => updateFilter('query', v)}
        hasActive={hasActiveFilters(filters)}
        isOpen={isOpen}
        onToggleOpen={() => setIsOpen(!isOpen)}
        onEnter={handleSearch}
        onEscape={() => setIsOpen(false)}
        resultCount={resultCount}
      />

      {/* Advanced Filters Modal */}
      <AnimatePresence>
        {isOpen && (
          <FiltersPanel
            open={isOpen}
            filters={filters}
            updateFilter={updateFilter}
            onClear={clearFilters}
            onApply={handleSearch}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
