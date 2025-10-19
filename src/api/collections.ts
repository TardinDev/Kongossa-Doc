// @ts-nocheck
import { supabase } from '../lib/supabase'
import type { Collection } from '../types/collections'
import type { DocumentItem } from '../lib/types'
import type { Database } from '../lib/database.types'

type DbCollection = Database['public']['Tables']['collections']['Row']
type DbDocument = Database['public']['Tables']['documents']['Row']

// Helper to convert DB collection to app collection
function dbCollectionToAppCollection(col: DbCollection, documentIds: string[] = []): Collection {
  return {
    id: col.id,
    name: col.name,
    description: col.description || undefined,
    documentIds,
    createdAt: new Date(col.created_at).getTime(),
    color: col.color
  }
}

// Helper to convert DB document to app document
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
 * Get all collections for a user
 */
export async function getCollections(userId: string): Promise<Collection[]> {
  const { data: collections, error: collectionsError } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (collectionsError) {
    console.error('Error fetching collections:', collectionsError)
    throw new Error(`Failed to fetch collections: ${collectionsError.message}`)
  }

  // Get document IDs for each collection
  const collectionsWithDocs = await Promise.all(
    (collections || []).map(async (col) => {
      const { data: collectionDocs } = await supabase
        .from('collection_documents')
        .select('document_id')
        .eq('collection_id', col.id)

      const documentIds = (collectionDocs || []).map(cd => cd.document_id)
      return dbCollectionToAppCollection(col, documentIds)
    })
  )

  return collectionsWithDocs
}

/**
 * Get a single collection by ID
 */
export async function getCollection(collectionId: string): Promise<Collection | null> {
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select('*')
    .eq('id', collectionId)
    .single()

  if (collectionError) {
    if (collectionError.code === 'PGRST116') {
      return null // Collection not found
    }
    console.error('Error fetching collection:', collectionError)
    throw new Error(`Failed to fetch collection: ${collectionError.message}`)
  }

  // Get document IDs for the collection
  const { data: collectionDocs } = await supabase
    .from('collection_documents')
    .select('document_id')
    .eq('collection_id', collection.id)

  const documentIds = (collectionDocs || []).map(cd => cd.document_id)

  return dbCollectionToAppCollection(collection, documentIds)
}

/**
 * Get documents in a collection
 */
export async function getCollectionDocuments(collectionId: string): Promise<DocumentItem[]> {
  const { data, error } = await supabase
    .from('collection_documents')
    .select(`
      document_id,
      documents (*)
    `)
    .eq('collection_id', collectionId)
    .order('added_at', { ascending: false })

  if (error) {
    console.error('Error fetching collection documents:', error)
    throw new Error(`Failed to fetch collection documents: ${error.message}`)
  }

  // Extract documents from the joined data
  const documents = (data || [])
    .map(item => item.documents)
    .filter((doc): doc is DbDocument => doc !== null)
    .map(dbDocumentToAppDocument)

  return documents
}

/**
 * Create a new collection
 */
export async function createCollection(params: {
  userId: string
  name: string
  description?: string
  color?: string
}): Promise<Collection> {
  const { data, error } = await supabase
    .from('collections')
    .insert({
      user_id: params.userId,
      name: params.name,
      description: params.description,
      color: params.color || '#3b82f6'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating collection:', error)
    throw new Error(`Failed to create collection: ${error.message}`)
  }

  return dbCollectionToAppCollection(data, [])
}

/**
 * Update a collection
 */
export async function updateCollection(
  collectionId: string,
  updates: {
    name?: string
    description?: string
    color?: string
  }
): Promise<Collection> {
  const { data, error } = await supabase
    .from('collections')
    .update(updates)
    .eq('id', collectionId)
    .select()
    .single()

  if (error) {
    console.error('Error updating collection:', error)
    throw new Error(`Failed to update collection: ${error.message}`)
  }

  // Get document IDs for the collection
  const { data: collectionDocs } = await supabase
    .from('collection_documents')
    .select('document_id')
    .eq('collection_id', data.id)

  const documentIds = (collectionDocs || []).map(cd => cd.document_id)

  return dbCollectionToAppCollection(data, documentIds)
}

/**
 * Delete a collection
 */
export async function deleteCollection(collectionId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', collectionId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting collection:', error)
    return false
  }

  return true
}

/**
 * Add a document to a collection
 */
export async function addDocumentToCollection(
  collectionId: string,
  documentId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('collection_documents')
    .insert({
      collection_id: collectionId,
      document_id: documentId
    })

  if (error) {
    // Handle unique constraint violation (already in collection)
    if (error.code === '23505') {
      return true // Already in collection, consider it a success
    }
    console.error('Error adding document to collection:', error)
    return false
  }

  return true
}

/**
 * Remove a document from a collection
 */
export async function removeDocumentFromCollection(
  collectionId: string,
  documentId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('collection_documents')
    .delete()
    .eq('collection_id', collectionId)
    .eq('document_id', documentId)

  if (error) {
    console.error('Error removing document from collection:', error)
    return false
  }

  return true
}

/**
 * Add multiple documents to a collection
 */
export async function addDocumentsToCollection(
  collectionId: string,
  documentIds: string[]
): Promise<boolean> {
  const inserts = documentIds.map(documentId => ({
    collection_id: collectionId,
    document_id: documentId
  }))

  const { error } = await supabase
    .from('collection_documents')
    .insert(inserts)

  if (error) {
    console.error('Error adding documents to collection:', error)
    return false
  }

  return true
}
