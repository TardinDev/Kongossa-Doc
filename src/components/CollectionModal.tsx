import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiPlus, FiFolder, FiCheck } from 'react-icons/fi'
import { FocusTrap } from './FocusTrap'
import { useCollections } from '../hooks/useCollections'
import type { Collection } from '../types/collections'
import { useToast } from '../hooks/useToast'

interface CollectionModalProps {
  isOpen: boolean
  onClose: () => void
  documentId?: string
  mode: 'create' | 'manage'
}

export function CollectionModal({ isOpen, onClose, documentId, mode }: CollectionModalProps) {
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionDescription, setNewCollectionDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  
  const { 
    collections, 
    createCollection, 
    addDocumentToCollection, 
    removeDocumentFromCollection, 
    getCollectionsForDocument 
  } = useCollections()
  
  const { toast } = useToast()

  const documentCollections = documentId ? getCollectionsForDocument(documentId) : []

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newCollectionName.trim()) {
      toast.error('Le nom est requis')
      return
    }

    setIsCreating(true)
    
    try {
      const collection = createCollection(newCollectionName, newCollectionDescription)
      
      if (collection && documentId) {
        addDocumentToCollection(collection.id, documentId)
      }
      
      toast.success('Collection créée !', `La collection "${newCollectionName}" a été créée`)
      setNewCollectionName('')
      setNewCollectionDescription('')
      
      if (mode === 'create') {
        onClose()
      }
    } catch (error) {
      toast.error('Erreur', 'Impossible de créer la collection')
    } finally {
      setIsCreating(false)
    }
  }

  const handleToggleDocument = (collection: Collection) => {
    if (!documentId) return
    
    const isInCollection = collection.documentIds.includes(documentId)
    
    if (isInCollection) {
      removeDocumentFromCollection(collection.id, documentId)
      toast.success('Document retiré', `Retiré de "${collection.name}"`)
    } else {
      addDocumentToCollection(collection.id, documentId)
      toast.success('Document ajouté', `Ajouté à "${collection.name}"`)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <FocusTrap active={isOpen}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[var(--color-bg)] border border-white/10 rounded-xl shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="collection-modal-title"
          >
            <div className="border-b border-white/10 p-6 flex items-center justify-between">
              <h2 id="collection-modal-title" className="text-xl font-semibold text-white flex items-center gap-2">
                <FiFolder className="w-5 h-5" />
                {mode === 'create' ? 'Nouvelle collection' : 'Gérer les collections'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-96 overflow-y-auto scrollbar-thin">
              {mode === 'manage' && documentId && collections.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-[var(--text-silver)]">
                    Ajouter à une collection existante
                  </h3>
                  <div className="space-y-2">
                    {collections.map(collection => {
                      const isInCollection = collection.documentIds.includes(documentId)
                      return (
                        <button
                          key={collection.id}
                          onClick={() => handleToggleDocument(collection)}
                          className={`w-full p-3 rounded-lg border text-left transition-colors flex items-center justify-between ${
                            isInCollection
                              ? 'border-[var(--accent-orange)] bg-[var(--accent-orange)]/10'
                              : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: collection.color }}
                            />
                            <div>
                              <div className="font-medium text-white">{collection.name}</div>
                              {collection.description && (
                                <div className="text-xs text-gray-400">{collection.description}</div>
                              )}
                              <div className="text-xs text-gray-500">
                                {collection.documentIds.length} document{collection.documentIds.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                          {isInCollection && <FiCheck className="w-4 h-4 text-[var(--accent-orange)]" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {(mode === 'create' || (mode === 'manage' && collections.length > 0)) && (
                <div className="border-t border-white/10 pt-6" />
              )}

              <div className="space-y-4">
                <h3 className="font-medium text-[var(--text-silver)] flex items-center gap-2">
                  <FiPlus className="w-4 h-4" />
                  Créer une nouvelle collection
                </h3>
                <form onSubmit={handleCreateCollection} className="space-y-4">
                  <div>
                    <label htmlFor="collection-name" className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                      Nom de la collection *
                    </label>
                    <input
                      id="collection-name"
                      type="text"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
                      placeholder="Nom de la collection"
                    />
                  </div>

                  <div>
                    <label htmlFor="collection-description" className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                      Description (optionnelle)
                    </label>
                    <textarea
                      id="collection-description"
                      value={newCollectionDescription}
                      onChange={(e) => setNewCollectionDescription(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
                      placeholder="Description de la collection"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!newCollectionName.trim() || isCreating}
                    className="w-full px-4 py-2 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? 'Création...' : 'Créer la collection'}
                  </button>
                </form>
              </div>

              {collections.length === 0 && mode === 'manage' && (
                <div className="text-center py-8">
                  <FiFolder className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400">Aucune collection trouvée</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Créez votre première collection ci-dessus
                  </p>
                </div>
              )}
            </div>

            {mode === 'manage' && (
              <div className="border-t border-white/10 p-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-[var(--text-silver)] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Fermer
                </button>
              </div>
            )}
          </motion.div>
        </FocusTrap>
      </div>
    </AnimatePresence>
  )
}