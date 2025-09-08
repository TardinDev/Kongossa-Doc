import type { SearchFilters } from './types'

export function toggleArrayValue<T>(array: T[], value: T): T[] {
  return array.includes(value)
    ? array.filter(item => item !== value)
    : [...array, value]
}

export function hasActiveFilters(filters: SearchFilters): boolean {
  return Boolean(
    filters.query ||
    filters.type.length ||
    filters.tags.length ||
    filters.category.length ||
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.owner ||
    filters.sizeRange.min > 0 ||
    filters.sizeRange.max < Infinity
  )
}

export function formatFileSize(bytes: number): string {
  if (bytes === Infinity) return '∞'
  if (bytes === 0) return '0'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

