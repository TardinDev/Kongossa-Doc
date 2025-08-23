import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import type { Collection } from '../types/collections'

export type { Collection }

const COLLECTIONS_KEY = 'kongossa_collections'

const DEFAULT_COLORS = [
  '#f97316', // orange
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ef4444', // red
  '#06b6d4', // cyan
  '#84cc16', // lime
]

export function useCollections() {
  const { userId } = useAuth()
  const [collections, setCollections] = useState<Collection[]>([])

  useEffect(() => {
    if (!userId) return
    
    const key = `${COLLECTIONS_KEY}_${userId}`
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        setCollections(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to parse collections:', error)
        setCollections([])
      }
    }
  }, [userId])

  const saveCollections = useCallback((newCollections: Collection[]) => {
    if (!userId) return
    
    const key = `${COLLECTIONS_KEY}_${userId}`
    localStorage.setItem(key, JSON.stringify(newCollections))
    setCollections(newCollections)
  }, [userId])

  const createCollection = useCallback((name: string, description?: string) => {
    if (!userId) return null
    
    const newCollection: Collection = {
      id: `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description?.trim(),
      documentIds: [],
      createdAt: Date.now(),
      color: DEFAULT_COLORS[collections.length % DEFAULT_COLORS.length]
    }
    
    const newCollections = [...collections, newCollection]
    saveCollections(newCollections)
    return newCollection
  }, [collections, saveCollections, userId])

  const updateCollection = useCallback((id: string, updates: Partial<Collection>) => {
    if (!userId) return false
    
    const newCollections = collections.map(collection =>
      collection.id === id ? { ...collection, ...updates } : collection
    )
    
    saveCollections(newCollections)
    return true
  }, [collections, saveCollections, userId])

  const deleteCollection = useCallback((id: string) => {
    if (!userId) return false
    
    const newCollections = collections.filter(collection => collection.id !== id)
    saveCollections(newCollections)
    return true
  }, [collections, saveCollections, userId])

  const addDocumentToCollection = useCallback((collectionId: string, documentId: string) => {
    if (!userId) return false
    
    const newCollections = collections.map(collection =>
      collection.id === collectionId && !collection.documentIds.includes(documentId)
        ? { ...collection, documentIds: [...collection.documentIds, documentId] }
        : collection
    )
    
    saveCollections(newCollections)
    return true
  }, [collections, saveCollections, userId])

  const removeDocumentFromCollection = useCallback((collectionId: string, documentId: string) => {
    if (!userId) return false
    
    const newCollections = collections.map(collection =>
      collection.id === collectionId
        ? { ...collection, documentIds: collection.documentIds.filter(id => id !== documentId) }
        : collection
    )
    
    saveCollections(newCollections)
    return true
  }, [collections, saveCollections, userId])

  const getCollectionsForDocument = useCallback((documentId: string) => {
    return collections.filter(collection => collection.documentIds.includes(documentId))
  }, [collections])

  return {
    collections,
    createCollection,
    updateCollection,
    deleteCollection,
    addDocumentToCollection,
    removeDocumentFromCollection,
    getCollectionsForDocument,
    isAuthenticated: !!userId
  }
}