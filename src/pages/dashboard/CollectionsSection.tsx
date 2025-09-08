import { FiFolder, FiPlus } from 'react-icons/fi'
import { useCollections } from '../../hooks/useCollections'
import { CollectionsGrid } from '../../components/dashboard/CollectionsGrid'
import { CollectionModal } from '../../components/CollectionModal'

interface CollectionsSectionProps {
  showCreate: boolean
  onOpenCreate: () => void
  onCloseCreate: () => void
}

export function CollectionsSection({ showCreate, onOpenCreate, onCloseCreate }: CollectionsSectionProps) {
  const { collections } = useCollections()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Mes Collections</h2>
          <p className="text-[var(--text-silver)]">Organisez vos documents en collections thématiques</p>
        </div>
        <button
          onClick={onOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Nouvelle collection
        </button>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-20 border border-white/10 rounded-xl bg-white/5">
          <FiFolder className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Aucune collection</h3>
          <p className="text-[var(--text-silver)] mb-6 max-w-md mx-auto">
            Créez votre première collection pour organiser vos documents par thème ou sujet
          </p>
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Créer une collection
          </button>
        </div>
      ) : (
        <CollectionsGrid collections={collections} />
      )}

      <CollectionModal isOpen={showCreate} onClose={onCloseCreate} mode="create" />
    </div>
  )
}

