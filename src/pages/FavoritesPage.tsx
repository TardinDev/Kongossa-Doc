import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa'
import { DocumentCard } from '../components/DocumentCard'
import { useFavorites } from '../hooks/useFavorites'
import { useQuery } from '@tanstack/react-query'
import { MOCK_DOCUMENTS } from '../api/mockDocuments'
import { LoadingSkeleton } from '../components/LoadingSkeleton'

export default function FavoritesPage() {
  const { favorites, isAuthenticated } = useFavorites()
  
  const { data: favoriteDocuments, isLoading } = useQuery({
    queryKey: ['favorite-documents', favorites],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 300))
      return MOCK_DOCUMENTS.filter(doc => favorites.includes(doc.id))
    },
    enabled: isAuthenticated && favorites.length > 0
  })

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <FaHeart className="w-16 h-16 mx-auto text-gray-400 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-4">
          Favoris
        </h1>
        <p className="text-[var(--text-silver)] mb-6">
          Connectez-vous pour voir vos documents favoris
        </p>
        <Link
          to="/auth"
          className="inline-flex items-center px-6 py-3 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors"
        >
          Se connecter
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (favorites.length === 0 || !favoriteDocuments || favoriteDocuments.length === 0) {
    return (
      <div className="text-center py-20">
        <FaHeart className="w-16 h-16 mx-auto text-gray-400 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-4">
          Aucun favori
        </h1>
        <p className="text-[var(--text-silver)] mb-6">
          Vous n'avez pas encore ajouté de documents à vos favoris
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors"
        >
          Découvrir les documents
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FaHeart className="w-6 h-6 text-red-500" />
        <h1 className="font-heading text-2xl font-bold text-white">
          Mes favoris
        </h1>
        <span className="px-2 py-1 text-xs bg-white/10 text-[var(--text-silver)] rounded-full">
          {favoriteDocuments.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favoriteDocuments.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/d/${doc.id}`} className="block">
              <DocumentCard doc={doc} onPreview={() => {}} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}