export type DocumentType = 'pdf' | 'image' | 'audio' | 'video' | 'other'

export interface DocumentItem {
  id: string
  title: string
  type: DocumentType
  previewUrl: string
  downloadUrl?: string
  ownerId: string | null
  mimeType: string
  sizeBytes?: number
  createdAt: number
  thumbnailUrl?: string
  tags?: string[]
  viewCount?: number
  downloadCount?: number
  category?: string
  description?: string
}

export interface AppUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
}

