import { DocumentCard } from '../components/DocumentCard'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SearchAndFilters } from '../components/SearchAndFilters'
import { LoadingSkeleton, DocumentCardSkeleton } from '../components/LoadingSkeleton'
import { HeroSection } from '../components/HeroSection'
import { useDocuments } from '../hooks/useDocuments'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/Toast'


export default function HomePage() {
  const {
    documents,
    isLoading,
    error,
    query,
    setQuery,
    page,
    setPage,
    sortBy,
    setSortBy,
    filterType,
    setFilterType,
    pagination,
    total
  } = useDocuments()
  const { toasts, removeToast } = useToast()

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">😞</div>
        <h2 className="text-xl font-semibold text-white mb-2">Erreur de chargement</h2>
        <p className="text-[var(--text-silver)] mb-4">Impossible de charger les documents.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[var(--accent-orange)] text-black rounded-lg hover:bg-orange-500/90 transition-colors"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <>
      <HeroSection />
      
      <div id="documents" className="space-y-6">
        <SearchAndFilters
          query={query}
          onQueryChange={setQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterType={filterType}
          onFilterTypeChange={setFilterType}
          resultCount={total}
        />

        {isLoading ? (
          <LoadingSkeleton />
        ) : documents.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📁</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {query || filterType ? 'Aucun résultat' : 'Aucun document'}
            </h2>
            <p className="text-[var(--text-silver)]">
              {query || filterType 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Aucun document public n\'est disponible pour le moment'
              }
            </p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {documents.map((doc) => (
                  <motion.div 
                    key={doc.id} 
                    layout 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to={`/d/${doc.id}`} className="block">
                      <DocumentCard doc={doc} onPreview={() => {}} />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-3 pt-6">
              <button
                className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
              >
                Précédent
              </button>
              <span className="text-sm text-gray-300 px-4">
                Page {pagination.currentPage} / {pagination.totalPages}
              </span>
              <button
                className="px-4 py-2 rounded-lg bg-[var(--accent-orange)] text-black font-semibold hover:bg-orange-500/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => setPage(p => p + 1)}
                disabled={!pagination.hasNext}
              >
                Suivant
              </button>
            </div>
          </>
        )}
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}

