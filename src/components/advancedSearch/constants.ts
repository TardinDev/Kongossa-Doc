export const FILE_TYPES = [
  { value: 'pdf', label: 'PDF', icon: '📄' },
  { value: 'image', label: 'Images', icon: '🖼️' },
  { value: 'video', label: 'Vidéos', icon: '🎬' },
  { value: 'audio', label: 'Audio', icon: '🎧' },
  { value: 'document', label: 'Documents', icon: '📝' },
  { value: 'archive', label: 'Archives', icon: '📦' },
]

export const CATEGORIES = [
  { value: 'business', label: 'Business', color: '#3b82f6' },
  { value: 'education', label: 'Éducation', color: '#10b981' },
  { value: 'entertainment', label: 'Divertissement', color: '#f59e0b' },
  { value: 'technology', label: 'Technologie', color: '#8b5cf6' },
  { value: 'health', label: 'Santé', color: '#ef4444' },
  { value: 'finance', label: 'Finance', color: '#06b6d4' },
  { value: 'legal', label: 'Juridique', color: '#64748b' },
  { value: 'other', label: 'Autre', color: '#6b7280' },
]

export const SIZE_PRESETS = [
  { label: 'Petit (< 1 MB)', min: 0, max: 1024 * 1024 },
  { label: 'Moyen (1-10 MB)', min: 1024 * 1024, max: 10 * 1024 * 1024 },
  { label: 'Grand (10-100 MB)', min: 10 * 1024 * 1024, max: 100 * 1024 * 1024 },
  { label: 'Très grand (> 100 MB)', min: 100 * 1024 * 1024, max: Infinity },
]

