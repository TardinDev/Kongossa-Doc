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

export interface CommentItemProps {
  comment: Comment
  onReply: (commentId: string) => void
  onEdit: (commentId: string, newContent: string) => void
  onDelete: (commentId: string) => void
  currentUserId?: string
  level?: number
}