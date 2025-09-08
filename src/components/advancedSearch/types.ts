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

export interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  initialFilters?: Partial<SearchFilters>
  resultCount?: number
}

