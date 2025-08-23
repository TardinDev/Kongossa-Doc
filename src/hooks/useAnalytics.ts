import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'

export interface DocumentAnalytics {
  documentId: string
  views: number
  downloads: number
  shares: number
  favorites: number
  comments: number
  uniqueVisitors: number
  viewsLastWeek: number
  viewsLastMonth: number
  topReferrers: Array<{ source: string; count: number }>
  viewsByDay: Array<{ date: string; views: number }>
}

export interface UserAnalytics {
  totalViews: number
  totalDownloads: number
  totalShares: number
  totalComments: number
  documentsUploaded: number
  favoriteDocuments: number
  collectionsCreated: number
  mostPopularDocument: string | null
  recentActivity: Array<{
    id: string
    type: 'view' | 'download' | 'upload' | 'comment' | 'share'
    documentId?: string
    documentTitle?: string
    timestamp: number
  }>
}

const ANALYTICS_KEY = 'kongossa_analytics'

export function useAnalytics() {
  const { userId } = useAuth()
  const [documentAnalytics, setDocumentAnalytics] = useState<Record<string, DocumentAnalytics>>({})
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null)

  useEffect(() => {
    if (!userId) return
    
    const key = `${ANALYTICS_KEY}_${userId}`
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setDocumentAnalytics(data.documents || {})
        setUserAnalytics(data.user || null)
      } catch (error) {
        console.error('Failed to parse analytics:', error)
      }
    }
  }, [userId])

  const saveAnalytics = useCallback((docs: Record<string, DocumentAnalytics>, user: UserAnalytics) => {
    if (!userId) return
    
    const key = `${ANALYTICS_KEY}_${userId}`
    localStorage.setItem(key, JSON.stringify({ documents: docs, user }))
    setDocumentAnalytics(docs)
    setUserAnalytics(user)
  }, [userId])

  const trackEvent = useCallback((
    type: 'view' | 'download' | 'share' | 'comment' | 'upload',
    documentId?: string,
    documentTitle?: string
  ) => {
    if (!userId) return

    const now = new Date()
    const today = now.toISOString().split('T')[0]
    
    const newDocumentAnalytics = { ...documentAnalytics }
    
    if (documentId) {
      if (!newDocumentAnalytics[documentId]) {
        newDocumentAnalytics[documentId] = {
          documentId,
          views: 0,
          downloads: 0,
          shares: 0,
          favorites: 0,
          comments: 0,
          uniqueVisitors: 0,
          viewsLastWeek: 0,
          viewsLastMonth: 0,
          topReferrers: [],
          viewsByDay: []
        }
      }

      const docAnalytics = newDocumentAnalytics[documentId]
      
      switch (type) {
        case 'view':
          docAnalytics.views++
          docAnalytics.uniqueVisitors++
          
          const existingDay = docAnalytics.viewsByDay.find(d => d.date === today)
          if (existingDay) {
            existingDay.views++
          } else {
            docAnalytics.viewsByDay.push({ date: today, views: 1 })
          }
          break
          
        case 'download':
          docAnalytics.downloads++
          break
          
        case 'share':
          docAnalytics.shares++
          break
          
        case 'comment':
          docAnalytics.comments++
          break
      }
    }

    const newUserAnalytics: UserAnalytics = userAnalytics || {
      totalViews: 0,
      totalDownloads: 0,
      totalShares: 0,
      totalComments: 0,
      documentsUploaded: 0,
      favoriteDocuments: 0,
      collectionsCreated: 0,
      mostPopularDocument: null,
      recentActivity: []
    }

    switch (type) {
      case 'view':
        newUserAnalytics.totalViews++
        break
      case 'download':
        newUserAnalytics.totalDownloads++
        break
      case 'share':
        newUserAnalytics.totalShares++
        break
      case 'comment':
        newUserAnalytics.totalComments++
        break
      case 'upload':
        newUserAnalytics.documentsUploaded++
        break
    }

    const newActivity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      documentId,
      documentTitle,
      timestamp: Date.now()
    }

    newUserAnalytics.recentActivity = [
      newActivity,
      ...newUserAnalytics.recentActivity.slice(0, 49)
    ]

    saveAnalytics(newDocumentAnalytics, newUserAnalytics)
  }, [userId, documentAnalytics, userAnalytics, saveAnalytics])

  const getDocumentAnalytics = useCallback((documentId: string): DocumentAnalytics | null => {
    return documentAnalytics[documentId] || null
  }, [documentAnalytics])

  const getTopDocuments = useCallback((limit = 5) => {
    return Object.values(documentAnalytics)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)
  }, [documentAnalytics])

  const getTotalStats = useCallback(() => {
    const stats = Object.values(documentAnalytics).reduce(
      (acc, doc) => ({
        views: acc.views + doc.views,
        downloads: acc.downloads + doc.downloads,
        shares: acc.shares + doc.shares,
        comments: acc.comments + doc.comments
      }),
      { views: 0, downloads: 0, shares: 0, comments: 0 }
    )
    return stats
  }, [documentAnalytics])

  return {
    documentAnalytics,
    userAnalytics,
    trackEvent,
    getDocumentAnalytics,
    getTopDocuments,
    getTotalStats,
    isAuthenticated: !!userId
  }
}