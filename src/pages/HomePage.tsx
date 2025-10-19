import { DocumentCard } from '../components/DocumentCard'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SearchAndFilters } from '../components/SearchAndFilters'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { HeroSection } from '../components/HeroSection'
import { useDocuments } from '../hooks/useDocuments'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/Toast'
import { Pagination } from '../components/Pagination'


export default function HomePage() {
  const {
    documents,
    isLoading,
    error,
    query,
    setQuery,
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

      {/* Section separator with gradient */}
      <div className="relative my-12">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[var(--color-bg)] px-6 py-2 text-sm text-[var(--text-silver)] rounded-full border border-white/10 backdrop-blur-sm">
            📚 Documents disponibles
          </span>
        </div>
      </div>

      <div id="documents" className="space-y-8">
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
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    layout
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ y: -8 }}
                  >
                    <Link to={`/d/${doc.id}`} className="block h-full">
                      <DocumentCard doc={doc} onPreview={() => {}} />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasPrev={pagination.hasPrev}
              hasNext={pagination.hasNext}
              onPrev={() => setPage(p => Math.max(1, p - 1))}
              onNext={() => setPage(p => p + 1)}
            />
          </>
        )}
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}
