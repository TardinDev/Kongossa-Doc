// @ts-nocheck
import { supabase } from '../lib/supabase'
import type { DocumentItem } from '../lib/types'
import type { Database } from '../lib/database.types'

type DbDocument = Database['public']['Tables']['documents']['Row']

// Helper function to convert DB document to app document
function dbDocumentToAppDocument(doc: DbDocument): DocumentItem {
  return {
    id: doc.id,
    title: doc.title,
    type: doc.type,
    previewUrl: doc.preview_url || '',
    downloadUrl: doc.download_url || undefined,
    ownerId: doc.owner_id,
    mimeType: doc.mime_type,
    sizeBytes: doc.size_bytes || undefined,
    createdAt: new Date(doc.created_at).getTime(),
    thumbnailUrl: doc.thumbnail_url || undefined,
    tags: doc.tags || [],
    viewCount: doc.view_count || 0,
    downloadCount: doc.download_count || 0,
    category: doc.category || undefined,
    description: doc.description || undefined
  }
}

export interface PaginatedDocuments {
  data: DocumentItem[]
  total: number
  page: number
  pageSize: number
}

export interface FetchDocumentsParams {
  page?: number
  pageSize?: number
  query?: string
  sortBy?: 'date' | 'title' | 'type' | 'popularity'
  filterType?: string
  userId?: string
}

/**
 * Fetch documents with pagination, search, and filtering
 */
export async function fetchDocuments(params: FetchDocumentsParams = {}): Promise<PaginatedDocuments> {
  const {
    page = 1,
    pageSize = 8,
    query = '',
    sortBy = 'date',
    filterType = '',
    userId
  } = params

  let queryBuilder = supabase
    .from('documents')
    .select('*', { count: 'exact' })

  // Filter by user if userId provided
  if (userId) {
    queryBuilder = queryBuilder.eq('owner_id', userId)
  }

  // Search filter
  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,tags.cs.{${query}}`)
  }

  // Type filter
  if (filterType) {
    queryBuilder = queryBuilder.eq('type', filterType)
  }

  // Sorting
  switch (sortBy) {
    case 'title':
      queryBuilder = queryBuilder.order('title', { ascending: true })
      break
    case 'type':
      queryBuilder = queryBuilder.order('type', { ascending: true })
      break
    case 'popularity':
      queryBuilder = queryBuilder.order('view_count', { ascending: false })
      break
    case 'date':
    default:
      queryBuilder = queryBuilder.order('created_at', { ascending: false })
  }

  // Pagination
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1
  queryBuilder = queryBuilder.range(start, end)

  const { data, error, count } = await queryBuilder

  if (error) {
    console.error('Error fetching documents:', error)
    throw new Error(`Failed to fetch documents: ${error.message}`)
  }

  return {
    data: (data || []).map(dbDocumentToAppDocument),
    total: count || 0,
    page,
    pageSize
  }
}

/**
 * Fetch a single document by ID
 */
export async function fetchDocumentById(id: string): Promise<DocumentItem | null> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Document not found
    }
    console.error('Error fetching document:', error)
    throw new Error(`Failed to fetch document: ${error.message}`)
  }

  // Increment view count
  await supabase.rpc('increment_view_count', { document_uuid: id })

  return dbDocumentToAppDocument(data)
}

/**
 * Upload a new document
 */
export async function uploadDocument(
  file: File,
  metadata: {
    title: string
    ownerId: string
    category?: string
    tags?: string[]
    description?: string
  }
): Promise<DocumentItem> {
  // Upload file to Supabase Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${metadata.ownerId}/${fileName}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    console.error('Error uploading file:', uploadError)
    throw new Error(`Failed to upload file: ${uploadError.message}`)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(uploadData.path)

  // Determine document type
  let type: DocumentItem['type'] = 'other'
  if (file.type.startsWith('image/')) type = 'image'
  else if (file.type.startsWith('video/')) type = 'video'
  else if (file.type.startsWith('audio/')) type = 'audio'
  else if (file.type === 'application/pdf') type = 'pdf'

  // Insert document record
  const { data, error } = await supabase
    .from('documents')
    .insert({
      title: metadata.title,
      type,
      file_path: filePath,
      preview_url: publicUrl,
      download_url: publicUrl,
      owner_id: metadata.ownerId,
      mime_type: file.type,
      size_bytes: file.size,
      category: metadata.category,
      tags: metadata.tags || [],
      description: metadata.description
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating document record:', error)
    // Clean up uploaded file
    await supabase.storage.from('documents').remove([filePath])
    throw new Error(`Failed to create document: ${error.message}`)
  }

  return dbDocumentToAppDocument(data)
}

/**
 * Update document metadata
 */
export async function updateDocument(
  id: string,
  updates: {
    title?: string
    category?: string
    tags?: string[]
    description?: string
  }
): Promise<DocumentItem> {
  const { data, error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating document:', error)
    throw new Error(`Failed to update document: ${error.message}`)
  }

  return dbDocumentToAppDocument(data)
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string, requesterId: string): Promise<boolean> {
  // Get document to check ownership and file path
  const { data: doc, error: fetchError } = await supabase
    .from('documents')
    .select('owner_id, file_path')
    .eq('id', id)
    .single()

  if (fetchError || !doc) {
    console.error('Error fetching document for deletion:', fetchError)
    return false
  }

  // Check ownership
  if (doc.owner_id !== requesterId) {
    console.error('User does not own this document')
    return false
  }

  // Delete file from storage if it exists
  if (doc.file_path) {
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([doc.file_path])

    if (storageError) {
      console.error('Error deleting file from storage:', storageError)
      // Continue with deletion even if storage deletion fails
    }
  }

  // Delete document record (this will cascade to comments, favorites, etc.)
  const { error: deleteError } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)

  if (deleteError) {
    console.error('Error deleting document:', deleteError)
    return false
  }

  return true
}

/**
 * Increment download count
 */
export async function incrementDownloadCount(id: string): Promise<void> {
  await supabase.rpc('increment_download_count', { document_uuid: id })
}

/**
 * Fetch user's documents
 */
export async function fetchUserDocuments(userId: string): Promise<DocumentItem[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user documents:', error)
    throw new Error(`Failed to fetch user documents: ${error.message}`)
  }

  return (data || []).map(dbDocumentToAppDocument)
}
