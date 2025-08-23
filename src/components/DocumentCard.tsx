import { motion } from 'framer-motion'
import type { DocumentItem } from '../lib/types'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { memo, useState } from 'react'
import { FaShare, FaHeart, FaRegHeart } from 'react-icons/fa'
import { SiTiktok, SiFacebook, SiInstagram, SiLinkedin, SiWhatsapp, SiX } from 'react-icons/si'
import { FiCopy, FiEye, FiDownload, FiFolder } from 'react-icons/fi'
import { useShareMenu } from '../hooks/useShareMenu'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from '../hooks/useToast'
import { SOCIAL_SHARE_URLS } from '../constants/socialShare'
import { CollectionModal } from './CollectionModal'
import { OptimizedImage } from './OptimizedImage'

function typeEmoji(type: DocumentItem['type']) {
  switch (type) {
    case 'pdf':
      return '📄'
    case 'image':
      return '🖼️'
    case 'audio':
      return '🎧'
    case 'video':
      return '🎬'
    default:
      return '📁'
  }
}

interface DocumentCardProps {
  doc: DocumentItem
  onPreview: (doc: DocumentItem) => void
}

export const DocumentCard = memo<DocumentCardProps>(({ doc, onPreview }) => {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()
  const { showShare, setShowShare, shareRef, closeMenu, copyToClipboard } = useShareMenu()
  const { toggleFavorite, isFavorite, isAuthenticated } = useFavorites()
  const { toast } = useToast()
  const [showCollectionModal, setShowCollectionModal] = useState(false)


  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isSignedIn) {
      navigate('/auth')
      return
    }
    const link = doc.downloadUrl ?? doc.previewUrl
    window.open(link, '_blank', 'noopener')
    toast.success('Téléchargement démarré', `${doc.title} est en cours de téléchargement`)
  }

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onPreview(doc)
  }

  const openWindow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const shareUrl = `${window.location.origin}/d/${doc.id}`
  const shareText = `Consultez ce document: ${doc.title}`

  const handleCopyShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const success = await copyToClipboard(shareUrl)
    if (success) {
      toast.success('Lien copié !', 'Le lien a été copié dans votre presse-papier')
    } else {
      toast.error('Erreur', 'Impossible de copier le lien')
    }
    closeMenu()
  }

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }

    const isNowFavorite = toggleFavorite(doc.id)
    toast.success(
      isNowFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris',
      isNowFavorite ? `${doc.title} a été ajouté à vos favoris` : `${doc.title} a été retiré de vos favoris`
    )
  }

  const handleCollectionToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }

    setShowCollectionModal(true)
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="group rounded-xl border border-white/10 bg-white/5 shadow-sm hover:shadow-md transition-shadow backdrop-blur"
      data-keyboard-navigable
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black/30">
        {doc.type === 'image' ? (
          <OptimizedImage
            src={doc.thumbnailUrl ?? doc.previewUrl}
            alt={doc.title}
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-5xl">{typeEmoji(doc.type)}</div>
        )}
        
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label={isFavorite(doc.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          {isFavorite(doc.id) ? (
            <FaHeart className="w-4 h-4 text-red-500" />
          ) : (
            <FaRegHeart className="w-4 h-4" />
          )}
        </button>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-white line-clamp-1">{doc.title}</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-[var(--text-silver)]">{doc.type.toUpperCase()}</span>
          </div>
          
          {doc.tags && doc.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {doc.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-orange)]/20 text-[var(--accent-orange)]">
                  #{tag}
                </span>
              ))}
              {doc.tags.length > 3 && (
                <span className="text-xs text-gray-400">+{doc.tags.length - 3}</span>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {doc.viewCount && (
              <div className="flex items-center gap-1">
                <FiEye className="w-3 h-3" />
                <span>{doc.viewCount}</span>
              </div>
            )}
            {doc.downloadCount && (
              <div className="flex items-center gap-1">
                <FiDownload className="w-3 h-3" />
                <span>{doc.downloadCount}</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            className="px-3 py-1.5 rounded-md bg-white/10 text-[var(--text-silver)] hover:bg-white/15 transition-colors"
            onClick={handlePreviewClick}
          >
            Prévisualiser
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCollectionToggle}
              className="px-2.5 py-1 text-xs rounded-md bg-white/10 text-[var(--text-silver)] hover:bg-white/15 transition-colors flex items-center justify-center"
              aria-label="Ajouter à une collection"
              title="Ajouter à une collection"
            >
              <FiFolder className="w-3.5 h-3.5" />
            </button>
            <div className="relative" ref={shareRef}>
            <button
              className="px-2.5 py-1 text-xs rounded-md bg-white/10 text-[var(--text-silver)] hover:bg-white/15 transition-colors flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowShare((s) => !s);
              }}
              aria-label="Partager"
              title="Partager"
            >
              <FaShare className="w-3.5 h-3.5" />
              <span className="sr-only">Partager</span>
            </button>
            {showShare ? (
              <div className="absolute right-0 mt-2 z-50 w-44 rounded-md border border-white/10 bg-white/10 backdrop-blur shadow-lg p-1 text-xs">
                <ul className="divide-y divide-white/10">
                  <li>
                    <button
                      className="w-full px-2 py-1 hover:bg-white/10 flex items-center justify-start gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        openWindow(SOCIAL_SHARE_URLS.tiktok(shareUrl, shareText))
                        closeMenu()
                      }}
                    >
                      <SiTiktok size={14} />
                      <span>TikTok</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full px-2 py-1 hover:bg-white/10 flex items-center justify-start gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        openWindow(SOCIAL_SHARE_URLS.facebook(shareUrl))
                        closeMenu()
                      }}
                    >
                      <SiFacebook size={14} />
                      <span>Facebook</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full px-2 py-1 hover:bg-white/10 flex items-center justify-start gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        openWindow(SOCIAL_SHARE_URLS.instagram(shareUrl))
                        closeMenu()
                      }}
                    >
                      <SiInstagram size={14} />
                      <span>Instagram</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full px-2 py-1 hover:bg-white/10 flex items-center justify-start gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        openWindow(SOCIAL_SHARE_URLS.linkedin(shareUrl))
                        closeMenu()
                      }}
                    >
                      <SiLinkedin size={14} />
                      <span>LinkedIn</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full px-2 py-1 hover:bg-white/10 flex items-center justify-start gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        openWindow(SOCIAL_SHARE_URLS.whatsapp(shareUrl, shareText))
                        closeMenu()
                      }}
                    >
                      <SiWhatsapp size={14} />
                      <span>WhatsApp</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full px-2 py-1 hover:bg-white/10 flex items-center justify-start gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        openWindow(SOCIAL_SHARE_URLS.twitter(shareUrl, shareText))
                        closeMenu()
                      }}
                    >
                      <SiX size={14} />
                      <span>X (Twitter)</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full px-2 py-1 hover:bg-white/10 flex items-center justify-start gap-2"
                      onClick={handleCopyShare}
                    >
                      <FiCopy size={14} />
                      <span>Copier le lien</span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : null}
            </div>
            <button
              className="px-2.5 py-1 text-xs rounded-md bg-[var(--accent-orange)] text-black font-semibold hover:bg-orange-500/90 transition-colors"
              onClick={handleDownload}
              aria-label="Télécharger"
              title="Télécharger"
            >
              <span aria-hidden>↓</span>
              <span className="sr-only">Télécharger</span>
            </button>
          </div>
        </div>
      </div>
      
      <CollectionModal
        isOpen={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        documentId={doc.id}
        mode="manage"
      />
    </motion.div>
  )
})

