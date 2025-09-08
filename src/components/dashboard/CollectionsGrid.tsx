import { motion } from 'framer-motion'
import { FiSettings, FiTrash2 } from 'react-icons/fi'
import type { Collection } from '../../types/collections'

interface CollectionsGridProps {
  collections: Collection[]
  onOpen?: (id: string) => void
  onDelete?: (id: string) => void
}

export function CollectionsGrid({ collections, onOpen, onDelete }: CollectionsGridProps) {
  if (collections.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <motion.div
          key={collection.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: collection.color }} />
              <h3 className="font-semibold text-white group-hover:text-[var(--accent-orange)] transition-colors">
                {collection.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 hover:bg-white/10 rounded" aria-label="Paramètres de la collection">
                <FiSettings className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-1 hover:bg-red-500/20 rounded" aria-label="Supprimer la collection" onClick={() => onDelete?.(collection.id)}>
                <FiTrash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
              </button>
            </div>
          </div>
          {collection.description && (
            <p className="text-sm text-[var(--text-silver)] mb-4 line-clamp-2">{collection.description}</p>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              {collection.documentIds.length} document{collection.documentIds.length !== 1 ? 's' : ''}
            </span>
            <span className="text-gray-500">Créée le {new Date(collection.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              className="w-full py-2 px-4 rounded-lg border border-white/20 text-[var(--text-silver)] hover:text-white hover:border-white/40 transition-colors"
              onClick={() => onOpen?.(collection.id)}
            >
              Voir les documents
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

