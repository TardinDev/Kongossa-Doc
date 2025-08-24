import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageSquare, FiSend, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useComments, type Comment } from '../hooks/useComments'
import { useToast } from '../hooks/useToast'
import { useAuth } from '@clerk/clerk-react'

interface CommentSectionProps {
  documentId: string
}

interface CommentItemProps {
  comment: Comment
  onReply: (parentId: string) => void
  onEdit: (commentId: string, content: string) => void
  onDelete: (commentId: string) => void
  currentUserId?: string
  level?: number
}

function CommentItem({ comment, onReply, onEdit, onDelete, currentUserId, level = 0 }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [showReplies, setShowReplies] = useState(true)

  const handleEdit = () => {
    if (editContent.trim() !== comment.content) {
      onEdit(comment.id, editContent.trim())
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditContent(comment.content)
    setIsEditing(false)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'À l\'instant'
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-3 ${level > 0 ? 'ml-8 border-l border-white/10 pl-4' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--accent-orange)] flex items-center justify-center text-black font-semibold text-sm flex-shrink-0">
          {comment.userAvatar ? (
            <img 
              src={comment.userAvatar} 
              alt={comment.userName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            comment.userName.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white text-sm">{comment.userName}</span>
            <span className="text-xs text-gray-400">
              {formatDate(comment.createdAt)}
              {comment.updatedAt && comment.updatedAt !== comment.createdAt && ' • modifié'}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
                rows={2}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEdit}
                  disabled={!editContent.trim()}
                  className="px-3 py-1 text-xs bg-[var(--accent-orange)] text-black rounded-md hover:bg-orange-500/90 disabled:opacity-50"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 text-xs text-gray-400 hover:text-white"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-[var(--text-silver)] mb-2">{comment.content}</p>
              <div className="flex items-center gap-3">
                {level < 3 && (
                  <button
                    onClick={() => onReply(comment.id)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-[var(--accent-orange)]"
                  >
                    <FiSend className="w-3 h-3" />
                    Répondre
                  </button>
                )}
                {comment.userId === currentUserId && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-[var(--accent-orange)]"
                    >
                      <FiEdit2 className="w-3 h-3" />
                      Modifier
                    </button>
                    <button
                      onClick={() => onDelete(comment.id)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400"
                    >
                      <FiTrash2 className="w-3 h-3" />
                      Supprimer
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <AnimatePresence>
          {showReplies && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  currentUserId={currentUserId}
                  level={level + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )
}

export function CommentSection({ documentId }: CommentSectionProps) {
  const { user } = useAuth()
  const { comments, isLoading, addComment, updateComment, deleteComment, getCommentCount } = useComments(documentId)
  const { toast } = useToast()
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Connexion requise', 'Veuillez vous connecter pour commenter')
      return
    }

    if (!newComment.trim()) return

    const comment = await addComment(newComment, replyTo || undefined)
    if (comment) {
      setNewComment('')
      setReplyTo(null)
      toast.success('Commentaire ajouté !')
    } else {
      toast.error('Erreur', 'Impossible d\'ajouter le commentaire')
    }
  }

  const handleEdit = (commentId: string, content: string) => {
    const success = updateComment(commentId, content)
    if (success) {
      toast.success('Commentaire modifié')
    } else {
      toast.error('Erreur', 'Impossible de modifier le commentaire')
    }
  }

  const handleDelete = (commentId: string) => {
    const success = deleteComment(commentId)
    if (success) {
      toast.success('Commentaire supprimé')
    } else {
      toast.error('Erreur', 'Impossible de supprimer le commentaire')
    }
  }

  const handleReply = (parentId: string) => {
    setReplyTo(parentId)
    setIsExpanded(true)
  }

  const commentCount = getCommentCount()

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-[var(--text-silver)] hover:text-white transition-colors"
      >
        <FiMessageSquare className="w-5 h-5" />
        <span className="font-medium">
          Commentaires ({commentCount})
        </span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6 border-t border-white/10 pt-6"
          >
            {user ? (
              <form onSubmit={handleSubmitComment} className="space-y-3">
                {replyTo && (
                  <div className="text-sm text-[var(--accent-orange)] flex items-center gap-2">
                    <FiSend className="w-4 h-4" />
                    Réponse en cours...
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      Annuler
                    </button>
                  </div>
                )}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent-orange)] flex items-center justify-center text-black font-semibold text-sm flex-shrink-0">
                    {user.imageUrl ? (
                      <img 
                        src={user.imageUrl} 
                        alt={user.fullName || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      (user.fullName || user.emailAddresses[0]?.emailAddress || 'U').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={replyTo ? 'Écrire une réponse...' : 'Ajouter un commentaire...'}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
                      rows={3}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {newComment.length}/500
                      </span>
                      <button
                        type="submit"
                        disabled={!newComment.trim() || isLoading || newComment.length > 500}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-orange)] text-black rounded-lg hover:bg-orange-500/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiSend className="w-4 h-4" />
                        {isLoading ? 'Envoi...' : 'Publier'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-[var(--text-silver)] mb-4">
                  Connectez-vous pour participer à la discussion
                </p>
                <a 
                  href="/auth" 
                  className="inline-flex items-center px-4 py-2 bg-[var(--accent-orange)] text-black rounded-lg hover:bg-orange-500/90 transition-colors"
                >
                  Se connecter
                </a>
              </div>
            )}

            {comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map(comment => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onReply={handleReply}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    currentUserId={user?.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiMessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-400">Aucun commentaire pour le moment</p>
                <p className="text-sm text-gray-500 mt-1">
                  Soyez le premier à commenter ce document
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}