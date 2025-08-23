import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUpload, FiFile } from 'react-icons/fi'
import { FocusTrap } from './FocusTrap'
import { useToast } from '../hooks/useToast'
import { uploadDocumentMock } from '../api/mockDocuments'
import type { DocumentItem } from '../lib/types'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (document: DocumentItem) => void
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ACCEPTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]

export function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const resetForm = useCallback(() => {
    setFile(null)
    setTitle('')
    setDescription('')
    setTags('')
    setCategory('')
    setIsUploading(false)
    setDragActive(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleClose = useCallback(() => {
    if (!isUploading) {
      resetForm()
      onClose()
    }
  }, [isUploading, resetForm, onClose])

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'Le fichier est trop volumineux (max 50MB)'
    }
    
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Type de fichier non supporté'
    }
    
    return null
  }

  const handleFileSelect = (selectedFile: File) => {
    const error = validateFile(selectedFile)
    if (error) {
      toast.error('Fichier invalide', error)
      return
    }
    
    setFile(selectedFile)
    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }, [])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      toast.error('Aucun fichier sélectionné')
      return
    }

    if (!title.trim()) {
      toast.error('Le titre est requis')
      return
    }

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title.trim())
      formData.append('description', description.trim())
      formData.append('tags', tags.trim())
      formData.append('category', category.trim())
      
      const uploadedDoc = await uploadDocumentMock(formData)
      
      toast.success('Upload réussi !', `${title} a été téléversé avec succès`)
      onSuccess?.(uploadedDoc)
      handleClose()
      
    } catch (error) {
      toast.error('Erreur d\'upload', 'Une erreur est survenue lors du téléversement')
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
          onClick={handleClose}
        />
        
        <FocusTrap active={isOpen}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-[var(--color-bg)] border border-white/10 rounded-xl shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-modal-title"
          >
            <div className="sticky top-0 bg-[var(--color-bg)]/90 backdrop-blur border-b border-white/10 p-6 flex items-center justify-between">
              <h2 id="upload-modal-title" className="text-xl font-semibold text-white">
                Téléverser un document
              </h2>
              <button
                onClick={handleClose}
                disabled={isUploading}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                aria-label="Fermer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-[var(--accent-orange)] bg-[var(--accent-orange)]/10' 
                    : 'border-white/20 hover:border-white/40'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="space-y-4">
                    <FiFile className="w-12 h-12 mx-auto text-[var(--accent-orange)]" />
                    <div>
                      <p className="font-medium text-white">{file.name}</p>
                      <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-[var(--accent-orange)] hover:text-orange-400"
                    >
                      Changer de fichier
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FiUpload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-white font-medium">
                        Glissez-déposez votre fichier ici
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        ou{' '}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[var(--accent-orange)] hover:text-orange-400 underline"
                        >
                          parcourir
                        </button>
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, Images, Audio, Vidéo - Max 50MB
                    </p>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  accept={ACCEPTED_TYPES.join(',')}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                    Titre *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
                    placeholder="Titre du document"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
                    placeholder="Description du document"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                      Tags
                    </label>
                    <input
                      id="tags"
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                      Catégorie
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
                    >
                      <option value="" className="bg-[var(--color-bg)]">Sélectionner...</option>
                      <option value="business" className="bg-[var(--color-bg)]">Business</option>
                      <option value="construction" className="bg-[var(--color-bg)]">Construction</option>
                      <option value="documentation" className="bg-[var(--color-bg)]">Documentation</option>
                      <option value="presentation" className="bg-[var(--color-bg)]">Présentation</option>
                      <option value="technical" className="bg-[var(--color-bg)]">Technique</option>
                      <option value="meeting" className="bg-[var(--color-bg)]">Réunion</option>
                      <option value="other" className="bg-[var(--color-bg)]">Autre</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isUploading}
                  className="px-4 py-2 text-[var(--text-silver)] hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!file || !title.trim() || isUploading}
                  className="px-6 py-2 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Upload en cours...' : 'Téléverser'}
                </button>
              </div>
            </form>
          </motion.div>
        </FocusTrap>
      </div>
    </AnimatePresence>
  )
}