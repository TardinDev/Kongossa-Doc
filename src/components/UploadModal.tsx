import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FocusTrap } from './FocusTrap'
import { useToast } from '../hooks/useToast'
import { uploadDocumentMock } from '../api/mockDocuments'
import type { DocumentItem } from '../lib/types'
import { UploadHeader } from './upload/UploadHeader'
import { UploadDropzone, type UploadDropzoneHandle } from './upload/UploadDropzone'
import { UploadFormFields } from './upload/UploadFormFields'
import { UploadFooter } from './upload/UploadFooter'
import { ACCEPTED_TYPES, MAX_FILE_SIZE } from './upload/constants'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (document: DocumentItem) => void
}

export function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  
  const dropzoneRef = useRef<UploadDropzoneHandle | null>(null)
  const { toast } = useToast()

  const resetForm = useCallback(() => {
    setFile(null)
    setTitle('')
    setDescription('')
    setTags('')
    setCategory('')
    setIsUploading(false)
    dropzoneRef.current?.clear()
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
      
    } catch {
      toast.error('Erreur d\'upload', 'Une erreur est survenue lors du téléversement')
    } finally {
      setIsUploading(false)
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
            <UploadHeader onClose={handleClose} disabled={isUploading} />

            <form onSubmit={handleUpload} className="p-6 space-y-6">
              <UploadDropzone
                ref={dropzoneRef}
                file={file}
                onSelect={(f) => handleFileSelect(f)}
                accept={ACCEPTED_TYPES}
              />

              <UploadFormFields
                title={title}
                description={description}
                tags={tags}
                category={category}
                onTitle={setTitle}
                onDescription={setDescription}
                onTags={setTags}
                onCategory={setCategory}
              />

              <UploadFooter
                onCancel={handleClose}
                submitLabel={isUploading ? 'Upload en cours...' : 'Téléverser'}
                disabled={!file || !title.trim() || isUploading}
              />
            </form>
          </motion.div>
        </FocusTrap>
      </div>
    </AnimatePresence>
  )
}
