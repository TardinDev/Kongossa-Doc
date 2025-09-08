import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageSquare } from 'react-icons/fi'
import { useComments } from '../hooks/useComments'
import { useToast } from '../hooks/useToast'
import { useAuth } from '@clerk/clerk-react'
import { CommentComposer } from './comments/CommentComposer'
import { CommentsList } from './comments/CommentsList'
import { EmptyComments } from './comments/EmptyComments'

interface CommentSectionProps {
  documentId: string
}

// Item, composer et listes sont désormais externalisés dans ./comments/*

export function CommentSection({ documentId }: CommentSectionProps) {
  const { userId } = useAuth()
  const user = { id: userId }
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
              <CommentComposer
                value={newComment}
                onChange={setNewComment}
                onSubmit={handleSubmitComment}
                isLoading={isLoading}
                replyTo={replyTo}
                onCancelReply={() => setReplyTo(null)}
                userInitial={'U'}
                maxLength={500}
              />
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
              <CommentsList
                comments={comments}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentUserId={user.id || undefined}
              />
            ) : (
              <EmptyComments />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
