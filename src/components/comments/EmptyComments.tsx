import { FiMessageSquare } from 'react-icons/fi'

export function EmptyComments() {
  return (
    <div className="text-center py-8">
      <FiMessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-400">Aucun commentaire pour le moment</p>
      <p className="text-sm text-gray-500 mt-1">Soyez le premier à commenter ce document</p>
    </div>
  )
}

