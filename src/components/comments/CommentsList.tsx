import type { Comment } from '../../types/comments'
import { CommentItem } from './CommentItem'

interface CommentsListProps {
  comments: Comment[]
  onReply: (parentId: string) => void
  onEdit: (commentId: string, content: string) => void
  onDelete: (commentId: string) => void
  currentUserId?: string
}

export function CommentsList({ comments, onReply, onEdit, onDelete, currentUserId }: CommentsListProps) {
  return (
    <div className="space-y-6">
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  )
}

