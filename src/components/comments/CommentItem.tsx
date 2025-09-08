import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiTrash2, FiEdit2 } from 'react-icons/fi'
import type { Comment } from '../../types/comments'

export interface CommentItemProps {
  comment: Comment
  onReply: (parentId: string) => void
  onEdit: (commentId: string, content: string) => void
  onDelete: (commentId: string) => void
  currentUserId?: string
  level?: number
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  if (diffInHours < 1) return "À l'instant"
  if (diffInHours < 24) return `Il y a ${diffInHours}h`
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

export function CommentItem({ comment, onReply, onEdit, onDelete, currentUserId, level = 0 }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [showReplies] = useState(true)

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

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`space-y-3 ${level > 0 ? 'ml-8 border-l border-white/10 pl-4' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--accent-orange)] flex items-center justify-center text-black font-semibold text-sm flex-shrink-0">
          {comment.userAvatar ? (
            <img src={comment.userAvatar} alt={comment.userName} className="w-8 h-8 rounded-full object-cover" />
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
                <button onClick={handleEdit} disabled={!editContent.trim()} className="px-3 py-1 text-xs bg-[var(--accent-orange)] text-black rounded-md hover:bg-orange-500/90 disabled:opacity-50">
                  Sauvegarder
                </button>
                <button onClick={handleCancelEdit} className="px-3 py-1 text-xs text-gray-400 hover:text-white">Annuler</button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-[var(--text-silver)] mb-2">{comment.content}</p>
              <div className="flex items-center gap-3">
                {level < 3 && (
                  <button onClick={() => onReply(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[var(--accent-orange)]">
                    <FiSend className="w-3 h-3" />
                    Répondre
                  </button>
                )}
                {comment.userId === currentUserId && (
                  <>
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[var(--accent-orange)]">
                      <FiEdit2 className="w-3 h-3" />
                      Modifier
                    </button>
                    <button onClick={() => onDelete(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400">
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
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} onReply={onReply} onEdit={onEdit} onDelete={onDelete} currentUserId={currentUserId} level={level + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )
}

