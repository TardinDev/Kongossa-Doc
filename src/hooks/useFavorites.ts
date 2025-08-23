import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'

const FAVORITES_KEY = 'kongossa_favorites'

export function useFavorites() {
  const { userId } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    if (!userId) return
    
    const key = `${FAVORITES_KEY}_${userId}`
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to parse favorites:', error)
        setFavorites([])
      }
    }
  }, [userId])

  const saveFavorites = useCallback((newFavorites: string[]) => {
    if (!userId) return
    
    const key = `${FAVORITES_KEY}_${userId}`
    localStorage.setItem(key, JSON.stringify(newFavorites))
    setFavorites(newFavorites)
  }, [userId])

  const toggleFavorite = useCallback((documentId: string) => {
    if (!userId) return false
    
    const newFavorites = favorites.includes(documentId)
      ? favorites.filter(id => id !== documentId)
      : [...favorites, documentId]
    
    saveFavorites(newFavorites)
    return newFavorites.includes(documentId)
  }, [favorites, saveFavorites, userId])

  const isFavorite = useCallback((documentId: string) => {
    return favorites.includes(documentId)
  }, [favorites])

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isAuthenticated: !!userId
  }
}