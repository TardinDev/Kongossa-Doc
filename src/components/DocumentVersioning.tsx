import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiClock, FiDownload, FiEye, FiGitBranch, FiUser, FiFileText, FiMoreVertical, FiTrash2, FiEdit3, FiRewind } from 'react-icons/fi'
import { FocusTrap } from './FocusTrap'
import type { DocumentItem } from '../lib/types'

export interface DocumentVersion {
  id: string
  version: string
  documentId: string
  title: string
  createdAt: number
  createdBy: string
  changeDescription: string
  sizeBytes?: number
  fileUrl?: string
  previewUrl?: string
  isCurrentVersion: boolean
  changeType: 'major' | 'minor' | 'patch'
  changes?: {
    added?: number
    modified?: number
    deleted?: number
  }
}

interface DocumentVersioningProps {
  document: DocumentItem
  versions: DocumentVersion[]
  onVersionSelect?: (version: DocumentVersion) => void
  onVersionDownload?: (version: DocumentVersion) => void
  onVersionRestore?: (version: DocumentVersion) => void
  onVersionDelete?: (version: DocumentVersion) => void
  isOpen: boolean
  onClose: () => void
}

export function DocumentVersioning({
  document,
  versions,
  onVersionSelect,
  onVersionDownload,
  onVersionRestore,
  onVersionDelete,
  isOpen,
  onClose
}: DocumentVersioningProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [showActions, setShowActions] = useState<string | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [compareVersions, setCompareVersions] = useState<string[]>([])

  const handleVersionClick = useCallback((version: DocumentVersion) => {
    setSelectedVersion(version.id)
    onVersionSelect?.(version)
  }, [onVersionSelect])

  const handleCompareToggle = useCallback((versionId: string) => {
    if (compareMode) {
      setCompareVersions(prev => 
        prev.includes(versionId) 
          ? prev.filter(id => id !== versionId)
          : prev.length < 2 ? [...prev, versionId] : prev
      )
    }
  }, [compareMode])

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp))
  }

  const getVersionTypeColor = (type: DocumentVersion['changeType']) => {
    switch (type) {
      case 'major': return 'text-red-400 bg-red-500/20'
      case 'minor': return 'text-yellow-400 bg-yellow-500/20'
      case 'patch': return 'text-green-400 bg-green-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getVersionTypeLabel = (type: DocumentVersion['changeType']) => {
    switch (type) {
      case 'major': return 'Majeure'
      case 'minor': return 'Mineure' 
      case 'patch': return 'Correction'
      default: return 'Inconnue'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <FocusTrap active={isOpen}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--color-bg)] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="versioning-title"
        >
          {/* Header */}
          <div className="border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="versioning-title" className="text-xl font-semibold text-white flex items-center gap-2">
                  <FiGitBranch className="w-5 h-5" />
                  Versions du document
                </h2>
                <p className="text-[var(--text-silver)] mt-1">{document.title}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    compareMode 
                      ? 'bg-[var(--accent-orange)] text-black'
                      : 'bg-white/10 text-[var(--text-silver)] hover:bg-white/20'
                  }`}
                >
                  Mode comparaison
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400"
                  aria-label="Fermer"
                >
                  ×
                </button>
              </div>
            </div>

            {compareMode && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400">
                  Sélectionnez jusqu'à 2 versions pour les comparer ({compareVersions.length}/2)
                </p>
                {compareVersions.length === 2 && (
                  <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                    Comparer les versions
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Versions List */}
          <div className="flex-1 overflow-y-auto max-h-96">
            <div className="divide-y divide-white/5">
              {versions.map((version, index) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 hover:bg-white/5 transition-colors relative ${
                    selectedVersion === version.id ? 'bg-white/10 border-r-2 border-r-[var(--accent-orange)]' : ''
                  } ${
                    compareMode && compareVersions.includes(version.id) ? 'bg-blue-500/10' : ''
                  }`}
                  onClick={() => handleVersionClick(version)}
                >
                  <div className="flex items-start gap-4">
                    {/* Comparison Checkbox */}
                    {compareMode && (
                      <input
                        type="checkbox"
                        checked={compareVersions.includes(version.id)}
                        onChange={() => handleCompareToggle(version.id)}
                        onClick={(e) => e.stopPropagation()}
                        disabled={!compareVersions.includes(version.id) && compareVersions.length >= 2}
                        className="mt-1 w-4 h-4 text-[var(--accent-orange)] bg-white/10 border-white/20 rounded focus:ring-[var(--accent-orange)] focus:ring-2"
                      />
                    )}

                    {/* Version Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm font-semibold text-white">
                          v{version.version}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getVersionTypeColor(version.changeType)}`}>
                          {getVersionTypeLabel(version.changeType)}
                        </span>
                        {version.isCurrentVersion && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                            Actuelle
                          </span>
                        )}
                      </div>

                      <p className="text-[var(--text-silver)] text-sm mb-2">{version.changeDescription}</p>

                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <FiUser className="w-3 h-3" />
                          <span>{version.createdBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          <span>{formatDate(version.createdAt)}</span>
                        </div>
                        {version.sizeBytes && (
                          <div className="flex items-center gap-1">
                            <FiFileText className="w-3 h-3" />
                            <span>{formatFileSize(version.sizeBytes)}</span>
                          </div>
                        )}
                      </div>

                      {version.changes && (
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          {version.changes.added && version.changes.added > 0 && (
                            <span className="text-green-400">+{version.changes.added} ajoutés</span>
                          )}
                          {version.changes.modified && version.changes.modified > 0 && (
                            <span className="text-yellow-400">~{version.changes.modified} modifiés</span>
                          )}
                          {version.changes.deleted && version.changes.deleted > 0 && (
                            <span className="text-red-400">-{version.changes.deleted} supprimés</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {version.previewUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(version.previewUrl, '_blank')
                          }}
                          className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                          title="Prévisualiser"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      )}
                      
                      {version.fileUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onVersionDownload?.(version)
                          }}
                          className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                          title="Télécharger"
                        >
                          <FiDownload className="w-4 h-4" />
                        </button>
                      )}

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowActions(showActions === version.id ? null : version.id)
                          }}
                          className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                          title="Plus d'actions"
                        >
                          <FiMoreVertical className="w-4 h-4" />
                        </button>

                        <AnimatePresence>
                          {showActions === version.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-full mt-1 z-10 w-48 bg-[var(--color-bg)] border border-white/10 rounded-lg shadow-xl py-1"
                            >
                              {!version.isCurrentVersion && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onVersionRestore?.(version)
                                    setShowActions(null)
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-[var(--text-silver)] hover:bg-white/5 hover:text-white flex items-center gap-2"
                                >
                                  <FiRewind className="w-4 h-4" />
                                  Restaurer cette version
                                </button>
                              )}
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // TODO: Implement version editing
                                  setShowActions(null)
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-[var(--text-silver)] hover:bg-white/5 hover:text-white flex items-center gap-2"
                              >
                                <FiEdit3 className="w-4 h-4" />
                                Modifier la description
                              </button>
                              
                              {!version.isCurrentVersion && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onVersionDelete?.(version)
                                    setShowActions(null)
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                  Supprimer cette version
                                </button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-4 bg-white/5">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{versions.length} version{versions.length !== 1 ? 's' : ''} disponible{versions.length !== 1 ? 's' : ''}</span>
              <div className="flex items-center gap-4">
                <span>Total: {formatFileSize(versions.reduce((acc, v) => acc + (v.sizeBytes || 0), 0))}</span>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </FocusTrap>
    </div>
  )
}