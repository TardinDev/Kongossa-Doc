// @ts-nocheck
import { supabase } from '../lib/supabase'
import type { DocumentItem } from '../lib/types'
import type { Database } from '../lib/database.types'

type DbDocument = Database['public']['Tables']['documents']['Row']
type DbFavorite = Database['public']['Tables']['favorites']['Row']

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

/**
 * Get all favorite documents for a user
 */
export async function getFavoriteDocuments(userId: string): Promise<DocumentItem[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      document_id,
      documents (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorites:', error)
    throw new Error(`Failed to fetch favorites: ${error.message}`)
  }

  // Extract documents from the joined data
  const documents = (data || [])
    .map(item => item.documents)
    .filter((doc): doc is DbDocument => doc !== null)
    .map(dbDocumentToAppDocument)

  return documents
}

/**
 * Check if a document is favorited by a user
 */
export async function isFavorite(userId: string, documentId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('document_id', documentId)
    .maybeSingle()

  if (error) {
    console.error('Error checking favorite status:', error)
    return false
  }

  return data !== null
}

/**
 * Add a document to favorites
 */
export async function addToFavorites(userId: string, documentId: string): Promise<boolean> {
  const { error } = await supabase
    .from('favorites')
    .insert({
      user_id: userId,
      document_id: documentId
    })

  if (error) {
    // Handle unique constraint violation (already favorited)
    if (error.code === '23505') {
      return true // Already favorited, consider it a success
    }
    console.error('Error adding to favorites:', error)
    return false
  }

  return true
}

/**
 * Remove a document from favorites
 */
export async function removeFromFavorites(userId: string, documentId: string): Promise<boolean> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('document_id', documentId)

  if (error) {
    console.error('Error removing from favorites:', error)
    return false
  }

  return true
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(userId: string, documentId: string): Promise<boolean> {
  const favorited = await isFavorite(userId, documentId)

  if (favorited) {
    return await removeFromFavorites(userId, documentId)
  } else {
    return await addToFavorites(userId, documentId)
  }
}

/**
 * Get favorite count for a document
 */
export async function getFavoriteCount(documentId: string): Promise<number> {
  const { count, error } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('document_id', documentId)

  if (error) {
    console.error('Error counting favorites:', error)
    return 0
  }

  return count || 0
}

/**
 * Get all favorite IDs for a user (useful for batch checking)
 */
export async function getFavoriteIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('document_id')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching favorite IDs:', error)
    return []
  }

  return (data || []).map(item => item.document_id)
}
