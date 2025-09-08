import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { FiFile, FiUpload } from 'react-icons/fi'

interface UploadDropzoneProps {
  file: File | null
  onSelect: (file: File) => void
  accept: string[]
}

export interface UploadDropzoneHandle {
  clear: () => void
  open: () => void
}

export const UploadDropzone = forwardRef<UploadDropzoneHandle, UploadDropzoneProps>(function UploadDropzone(
  { file, onSelect, accept },
  ref
) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    clear: () => {
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
    open: () => fileInputRef.current?.click(),
  }))

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = e.dataTransfer.files
    if (files && files[0]) onSelect(files[0])
  }, [onSelect])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-[var(--accent-orange)] bg-[var(--accent-orange)]/10' : 'border-white/20 hover:border-white/40'}`}
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
            <p className="text-white font-medium">Glissez-déposez votre fichier ici</p>
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
          <p className="text-xs text-gray-500">PDF, Images, Audio, Vidéo - Max 50MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])}
        accept={accept.join(',')}
        className="hidden"
      />
    </div>
  )
})
