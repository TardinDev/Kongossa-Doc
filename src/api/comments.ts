// @ts-nocheck
import { supabase } from '../lib/supabase'
import type { Comment } from '../types/comments'
import type { Database } from '../lib/database.types'

type DbComment = Database['public']['Tables']['comments']['Row']

// Helper function to convert DB comment to app comment
function dbCommentToAppComment(comment: DbComment): Comment {
  return {
    id: comment.id,
    documentId: comment.document_id,
    userId: comment.user_id,
    userName: comment.user_name,
    userAvatar: comment.user_avatar || undefined,
    content: comment.content,
    createdAt: new Date(comment.created_at).getTime(),
    updatedAt: comment.updated_at ? new Date(comment.updated_at).getTime() : undefined,
    parentId: comment.parent_id || undefined,
    replies: []
  }
}

/**
 * Fetch all comments for a document with nested replies
 */
export async function fetchComments(documentId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('document_id', documentId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    throw new Error(`Failed to fetch comments: ${error.message}`)
  }

  // Convert to app comments
  const comments = (data || []).map(dbCommentToAppComment)

  // Build nested structure
  const commentMap = new Map<string, Comment>()
  const topLevelComments: Comment[] = []

  // First pass: create map of all comments
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] })
  })

  // Second pass: build hierarchy
  comments.forEach(comment => {
    const mappedComment = commentMap.get(comment.id)!

    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId)
      if (parent) {
        parent.replies = parent.replies || []
        parent.replies.push(mappedComment)
      }
    } else {
      topLevelComments.push(mappedComment)
    }
  })

  return topLevelComments
}

/**
 * Create a new comment
 */
export async function createComment(params: {
  documentId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  parentId?: string
}): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      document_id: params.documentId,
      user_id: params.userId,
      user_name: params.userName,
      user_avatar: params.userAvatar,
      content: params.content,
      parent_id: params.parentId
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating comment:', error)
    throw new Error(`Failed to create comment: ${error.message}`)
  }

  return dbCommentToAppComment(data)
}

/**
 * Update a comment
 */
export async function updateComment(
  commentId: string,
  userId: string,
  newContent: string
): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .update({
      content: newContent,
      updated_at: new Date().toISOString()
    })
    .eq('id', commentId)
    .eq('user_id', userId) // Ensure user owns the comment
    .select()
    .single()

  if (error) {
    console.error('Error updating comment:', error)
    throw new Error(`Failed to update comment: ${error.message}`)
  }

  return dbCommentToAppComment(data)
}

/**
 * Delete a comment (and all its replies due to CASCADE)
 */
export async function deleteComment(commentId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId) // Ensure user owns the comment

  if (error) {
    console.error('Error deleting comment:', error)
    return false
  }

  return true
}

/**
 * Get comment count for a document
 */
export async function getCommentCount(documentId: string): Promise<number> {
  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('document_id', documentId)

  if (error) {
    console.error('Error counting comments:', error)
    return 0
  }

  return count || 0
}
