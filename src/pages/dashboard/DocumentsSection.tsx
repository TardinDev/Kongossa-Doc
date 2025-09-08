import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FiDownload, FiUpload } from 'react-icons/fi'
import { fetchUserDocumentsMock, uploadDocumentMock, deleteDocumentMock } from '../../api/mockDocuments'
import { UploadForm } from '../../components/dashboard/UploadForm'
import { DocumentsGrid } from '../../components/dashboard/DocumentsGrid'
import { BatchExport } from '../../components/BatchExport'
import { BatchImport } from '../../components/BatchImport'
import type { BatchDocument } from '../../types/batch'

interface DocumentsSectionProps {
  userId: string
}

export function DocumentsSection({ userId }: DocumentsSectionProps) {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['my-documents', userId],
    queryFn: () => fetchUserDocumentsMock(userId),
    enabled: !!userId,
  })

  const [showBatchExport, setShowBatchExport] = useState(false)
  const [showBatchImport, setShowBatchImport] = useState(false)

  const { mutateAsync: upload, isPending: isUploading, error } = useMutation({
    mutationFn: async (formData: FormData) => uploadDocumentMock(formData),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-documents', userId] }),
  })

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteDocumentMock({ id, requesterId: userId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-documents', userId] }),
  })

  const handleBatchImport = async (documents: BatchDocument[]) => {
    for (const doc of documents) {
      const form = new FormData()
      form.set('title', doc.name)
      if (doc.file) form.set('file', doc.file)
      await upload(form)
    }
    qc.invalidateQueries({ queryKey: ['my-documents', userId] })
  }

  return (
    <div className="space-y-6">
      <UploadForm onUpload={upload} isUploading={isUploading} error={error} />

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <h2 className="font-semibold text-white">Mes documents</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowBatchImport(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
            >
              <FiUpload className="w-4 h-4" />
              Import en lot
            </button>
            <button
              onClick={() => setShowBatchExport(true)}
              disabled={!data || data.length === 0}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiDownload className="w-4 h-4" />
              Export en lot
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-gray-400">Chargement...</div>
        ) : (
          <DocumentsGrid documents={data ?? []} onDelete={(id) => remove({ id })} isDeleting={isDeleting} />
        )}
      </div>

      {showBatchExport && data && (
        <BatchExport
          documents={data.map(doc => ({
            id: doc.id,
            name: doc.title || `Document ${doc.id}`,
            type: (doc.type as any) || 'unknown',
            size: doc.sizeBytes || 0,
            file: undefined,
            downloadUrl: doc.downloadUrl,
            uploadDate: new Date(doc.createdAt).toISOString(),
            category: doc.category || 'General',
            tags: doc.tags || [],
            description: doc.description || '',
            thumbnail: doc.thumbnailUrl
          }))}
          onClose={() => setShowBatchExport(false)}
        />
      )}

      {showBatchImport && (
        <BatchImport onImport={handleBatchImport} onClose={() => setShowBatchImport(false)} />
      )}
    </div>
  )
}

