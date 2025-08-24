import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'

export interface Comment {
  id: string
  documentId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: number
  updatedAt?: number
  parentId?: string
  replies?: Comment[]
}

const COMMENTS_KEY = 'kongossa_comments'

export function useComments(documentId: string) {
  const { userId } = useAuth()
  const user = { id: userId }
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const key = `${COMMENTS_KEY}_${documentId}`
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const parsedComments = JSON.parse(stored)
        setComments(parsedComments)
      } catch (error) {
        console.error('Failed to parse comments:', error)
        setComments([])
      }
    }
  }, [documentId])

  const saveComments = useCallback((newComments: Comment[]) => {
    const key = `${COMMENTS_KEY}_${documentId}`
    localStorage.setItem(key, JSON.stringify(newComments))
    setComments(newComments)
  }, [documentId])

  const addComment = useCallback(async (content: string, parentId?: string) => {
    if (!user || !content.trim()) return null

    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newComment: Comment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        documentId,
        userId: userId || 'anonymous',
        userName: 'Utilisateur',
        userAvatar: undefined,
        content: content.trim(),
        createdAt: Date.now(),
        parentId
      }

      let newComments
      if (parentId) {
        newComments = comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment]
            }
          }
          return comment
        })
      } else {
        newComments = [...comments, newComment]
      }
      
      saveComments(newComments)
      return newComment
    } catch (error) {
      console.error('Failed to add comment:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [user, comments, documentId, saveComments])

  const updateComment = useCallback((commentId: string, content: string) => {
    if (!user) return false

    const updateCommentRecursively = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId && comment.userId === user.id) {
          return {
            ...comment,
            content: content.trim(),
            updatedAt: Date.now()
          }
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateCommentRecursively(comment.replies)
          }
        }
        return comment
      })
    }

    const newComments = updateCommentRecursively(comments)
    saveComments(newComments)
    return true
  }, [user, comments, saveComments])

  const deleteComment = useCallback((commentId: string) => {
    if (!user) return false

    const deleteCommentRecursively = (comments: Comment[]): Comment[] => {
      return comments.filter(comment => {
        if (comment.id === commentId && comment.userId === user.id) {
          return false
        }
        if (comment.replies) {
          comment.replies = deleteCommentRecursively(comment.replies)
        }
        return true
      })
    }

    const newComments = deleteCommentRecursively(comments)
    saveComments(newComments)
    return true
  }, [user, comments, saveComments])

  const getCommentCount = useCallback(() => {
    const countCommentsRecursively = (comments: Comment[]): number => {
      return comments.reduce((count, comment) => {
        return count + 1 + (comment.replies ? countCommentsRecursively(comment.replies) : 0)
      }, 0)
    }
    return countCommentsRecursively(comments)
  }, [comments])

  return {
    comments,
    isLoading,
    addComment,
    updateComment,
    deleteComment,
    getCommentCount,
    isAuthenticated: !!user
  }
}