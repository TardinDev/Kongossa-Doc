import { ResponsiveGrid } from '../layout/ResponsiveGrid'
import { motion } from 'framer-motion'
import { FiDownload, FiTrash2 } from 'react-icons/fi'
import type { DocumentItem } from '../../lib/types'

interface DocumentsGridProps {
  documents: DocumentItem[]
  onDelete?: (id: string) => void
  isDeleting?: boolean
}

export function DocumentsGrid({ documents, onDelete, isDeleting }: DocumentsGridProps) {
  if (!documents || documents.length === 0) {
    return <div className="text-gray-400">Aucun document</div>
  }

  return (
    <ResponsiveGrid>
      {documents.map((d) => (
        <motion.div key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
            <div className="text-sm text-gray-300">{d.type}</div>
            <div className="font-medium text-white">{d.title}</div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a
                href={`${window.location.origin}/d/${d.id}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 text-[var(--text-silver)]"
              >
                Ouvrir
              </a>
              {d.downloadUrl ? (
                <a
                  href={d.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 text-[var(--text-silver)]"
                >
                  <FiDownload className="w-4 h-4" /> Télécharger
                </a>
              ) : null}
              <button
                className="px-3 py-1.5 rounded bg-[var(--accent-orange)] text-black font-semibold hover:bg-orange-500/90"
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/d/${d.id}`)}
              >
                Copier le lien
              </button>
              {onDelete ? (
                <button
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                  onClick={() => onDelete(d.id)}
                >
                  <FiTrash2 className="w-4 h-4" />
                  Supprimer
                </button>
              ) : null}
            </div>
          </div>
        </motion.div>
      ))}
    </ResponsiveGrid>
  )
}

