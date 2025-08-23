import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchDocumentByIdMock } from '../api/mockDocuments'
import { CommentSection } from '../components/CommentSection'
import { useAnalytics } from '../hooks/useAnalytics'
import { useEffect } from 'react'
import { FiDownload, FiShare2, FiHeart, FiEye } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function DocumentPreviewPage() {
  const { id } = useParams<{ id: string }>()
  const { trackEvent } = useAnalytics()
  const { data, isLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: () => fetchDocumentByIdMock(id ?? ''),
    enabled: !!id,
  })

  useEffect(() => {
    if (data) {
      trackEvent('view', data.id, data.title)
    }
  }, [data, trackEvent])

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-[var(--text-silver)]">Chargement...</div>
    </div>
  )
  
  if (!data) return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">📄</div>
      <h1 className="text-xl font-bold text-white mb-2">Document introuvable</h1>
      <p className="text-[var(--text-silver)]">Le document demandé n'existe pas ou a été supprimé.</p>
    </div>
  )

  const shareUrl = `${window.location.origin}/d/${data.id}`

  const handleDownload = () => {
    trackEvent('download', data.id, data.title)
    const link = data.downloadUrl ?? data.previewUrl
    window.open(link, '_blank', 'noopener')
  }

  const handleShare = () => {
    trackEvent('share', data.id, data.title)
    navigator.clipboard.writeText(shareUrl)
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-white mb-2">{data.title}</h1>
            <div className="flex items-center gap-4 text-sm text-[var(--text-silver)]">
              <div className="flex items-center gap-1">
                <FiEye className="w-4 h-4" />
                <span>{data.viewCount || 0} vues</span>
              </div>
              <span className="px-2 py-1 bg-white/10 rounded text-xs">{data.type.toUpperCase()}</span>
              <span>{new Date(data.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              Télécharger
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-[var(--text-silver)] hover:bg-white/15 rounded-lg transition-colors"
            >
              <FiShare2 className="w-4 h-4" />
              Partager
            </button>
          </div>
        </div>

        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] rounded text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-white/10 bg-white/5 p-6"
      >
        {data.type === 'image' ? (
          <img 
            src={data.previewUrl} 
            alt={data.title} 
            className="max-w-full h-auto rounded-lg mx-auto" 
          />
        ) : data.type === 'video' ? (
          <video 
            src={data.previewUrl} 
            controls 
            className="max-w-full h-auto rounded-lg mx-auto"
            poster={data.thumbnailUrl}
          />
        ) : data.type === 'audio' ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎧</div>
            <audio src={data.previewUrl} controls className="w-full max-w-md mx-auto" />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-semibold text-white mb-2">Document PDF</h3>
            <p className="text-[var(--text-silver)] mb-6">
              Cliquez sur le bouton ci-dessous pour ouvrir le document dans un nouvel onglet
            </p>
            <a 
              href={data.previewUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              Ouvrir le document
            </a>
          </div>
        )}
      </motion.div>

      {data.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
          <p className="text-[var(--text-silver)]">{data.description}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 border border-white/10 rounded-xl p-6"
      >
        <CommentSection documentId={data.id} />
      </motion.div>
    </div>
  )
}


