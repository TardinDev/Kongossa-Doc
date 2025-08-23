import type { DocumentItem } from '../lib/types'

const now = Date.now()

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc_pdf_1',
    title: 'Brochure Entreprise 2024',
    type: 'pdf',
    previewUrl: 'https://picsum.photos/seed/pdf1/600/400',
    downloadUrl: '#',
    ownerId: 'user_1',
    mimeType: 'application/pdf',
    sizeBytes: 1_250_000,
    createdAt: now - 1000 * 60 * 60 * 24 * 2,
    thumbnailUrl: 'https://picsum.photos/seed/pdfthumb1/300/200',
    tags: ['entreprise', 'brochure'],
    viewCount: 245,
    downloadCount: 67,
    category: 'business'
  },
  {
    id: 'doc_img_1',
    title: 'Photo Chantier - Module A',
    type: 'image',
    previewUrl: 'https://picsum.photos/seed/image1/600/400',
    ownerId: 'user_2',
    mimeType: 'image/jpeg',
    sizeBytes: 2_450_000,
    createdAt: now - 1000 * 60 * 60 * 8,
    thumbnailUrl: 'https://picsum.photos/seed/imgthumb1/300/200',
    tags: ['chantier', 'photo', 'construction'],
    viewCount: 123,
    downloadCount: 34,
    category: 'construction'
  },
  {
    id: 'doc_audio_1',
    title: 'Compte-rendu vocal réunion',
    type: 'audio',
    previewUrl: 'https://filesamples.com/samples/audio/mp3/sample1.mp3',
    ownerId: 'user_3',
    mimeType: 'audio/mpeg',
    sizeBytes: 4_500_000,
    createdAt: now - 1000 * 60 * 60 * 48,
    tags: ['réunion', 'audio', 'compte-rendu'],
    viewCount: 89,
    downloadCount: 23,
    category: 'meeting'
  },
  {
    id: 'doc_video_1',
    title: 'Présentation projet (teaser)',
    type: 'video',
    previewUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    ownerId: 'user_1',
    mimeType: 'video/mp4',
    sizeBytes: 12_700_000,
    createdAt: now - 1000 * 60 * 30,
    tags: ['présentation', 'projet', 'teaser'],
    viewCount: 456,
    downloadCount: 78,
    category: 'presentation'
  },
  {
    id: 'doc_pdf_2',
    title: 'Manuel d\'utilisation v2.1',
    type: 'pdf',
    previewUrl: 'https://picsum.photos/seed/pdf2/600/400',
    downloadUrl: '#',
    ownerId: 'user_4',
    mimeType: 'application/pdf',
    sizeBytes: 3_400_000,
    createdAt: now - 1000 * 60 * 60 * 24 * 5,
    thumbnailUrl: 'https://picsum.photos/seed/pdfthumb2/300/200',
    tags: ['manuel', 'documentation', 'guide'],
    viewCount: 178,
    downloadCount: 92,
    category: 'documentation'
  },
  {
    id: 'doc_img_2',
    title: 'Schéma technique - Circuit électrique',
    type: 'image',
    previewUrl: 'https://picsum.photos/seed/image2/600/400',
    ownerId: 'user_2',
    mimeType: 'image/png',
    sizeBytes: 1_800_000,
    createdAt: now - 1000 * 60 * 60 * 12,
    thumbnailUrl: 'https://picsum.photos/seed/imgthumb2/300/200',
    tags: ['schéma', 'technique', 'électrique'],
    viewCount: 67,
    downloadCount: 45,
    category: 'technical'
  }
]

export interface PaginatedDocuments {
  data: DocumentItem[]
  total: number
  page: number
  pageSize: number
}

export async function fetchDocumentsMock({
  page = 1,
  pageSize = 8,
  query = '',
  sortBy = 'date',
  filterType = '',
}: { 
  page?: number; 
  pageSize?: number; 
  query?: string;
  sortBy?: 'date' | 'title' | 'type' | 'popularity';
  filterType?: string;
}): Promise<PaginatedDocuments> {
  await new Promise((r) => setTimeout(r, Math.random() * 400 + 200))
  
  const filtered = MOCK_DOCUMENTS.filter((d) => {
    const matchesQuery = d.title.toLowerCase().includes(query.toLowerCase().trim()) ||
                        (d.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase().trim())) ?? false)
    const matchesType = !filterType || d.type === filterType
    return matchesQuery && matchesType
  })

  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'type':
        return a.type.localeCompare(b.type)
      case 'popularity':
        return (b.viewCount ?? 0) - (a.viewCount ?? 0)
      case 'date':
      default:
        return b.createdAt - a.createdAt
    }
  })

  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)
  return { data, total: filtered.length, page, pageSize }
}

export async function fetchUserDocumentsMock(userId: string): Promise<DocumentItem[]> {
  await new Promise((r) => setTimeout(r, 400))
  return MOCK_DOCUMENTS.filter((d) => d.ownerId === userId)
}

export async function uploadDocumentMock(formData: FormData): Promise<DocumentItem> {
  await new Promise((r) => setTimeout(r, 800))
  const title = String(formData.get('title') ?? 'Document sans titre')
  const file = formData.get('file') as File | null
  const newDoc: DocumentItem = {
    id: `mock_${Math.random().toString(36).slice(2, 8)}`,
    title,
    type: 'other',
    previewUrl: file ? URL.createObjectURL(file) : 'https://picsum.photos/seed/new/600/400',
    ownerId: 'me',
    mimeType: file?.type ?? 'application/octet-stream',
    sizeBytes: file?.size,
    createdAt: Date.now(),
  }
  MOCK_DOCUMENTS.unshift(newDoc)
  return newDoc
}

export async function fetchDocumentByIdMock(id: string): Promise<DocumentItem | null> {
  await new Promise((r) => setTimeout(r, 300))
  return MOCK_DOCUMENTS.find((d) => d.id === id) ?? null
}

export async function deleteDocumentMock({ id, requesterId }: { id: string; requesterId: string }): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 300))
  const index = MOCK_DOCUMENTS.findIndex((d) => d.id === id)
  if (index === -1) return false
  const doc = MOCK_DOCUMENTS[index]
  if (doc.ownerId !== requesterId && requesterId !== 'me') return false
  MOCK_DOCUMENTS.splice(index, 1)
  return true
}

