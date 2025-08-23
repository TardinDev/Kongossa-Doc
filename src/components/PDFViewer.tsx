import { useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiDownload, FiMaximize, FiMinimize } from 'react-icons/fi'
import { motion } from 'framer-motion'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

interface PDFViewerProps {
  url: string
  title?: string
  onClose?: () => void
}

export function PDFViewer({ url, title, onClose }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
    setError(null)
  }, [])

  const onDocumentLoadError = useCallback((error: Error) => {
    setError('Erreur lors du chargement du PDF')
    setLoading(false)
    console.error('PDF loading error:', error)
  }, [])

  const goToPrevPage = useCallback(() => {
    setPageNumber(page => Math.max(1, page - 1))
  }, [])

  const goToNextPage = useCallback(() => {
    setPageNumber(page => Math.min(numPages, page + 1))
  }, [numPages])

  const zoomIn = useCallback(() => {
    setScale(scale => Math.min(3.0, scale + 0.2))
  }, [])

  const zoomOut = useCallback(() => {
    setScale(scale => Math.max(0.5, scale - 0.2))
  }, [])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  const downloadPDF = useCallback(() => {
    const link = document.createElement('a')
    link.href = url
    link.download = title || 'document.pdf'
    link.click()
  }, [url, title])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        goToPrevPage()
        break
      case 'ArrowRight':
        goToNextPage()
        break
      case '=':
      case '+':
        zoomIn()
        break
      case '-':
        zoomOut()
        break
      case 'f':
        toggleFullscreen()
        break
      case 'Escape':
        if (isFullscreen) {
          setIsFullscreen(false)
        } else if (onClose) {
          onClose()
        }
        break
    }
  }, [goToPrevPage, goToNextPage, zoomIn, zoomOut, toggleFullscreen, isFullscreen, onClose])

  return (
    <div 
      className={`pdf-viewer bg-[var(--color-bg)] text-white ${
        isFullscreen ? 'fixed inset-0 z-50' : 'relative'
      }`}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
        <div className="flex items-center gap-4">
          {title && (
            <h3 className="font-medium text-white truncate max-w-md">{title}</h3>
          )}
          <div className="text-sm text-[var(--text-silver)]">
            {numPages > 0 && `Page ${pageNumber} sur ${numPages}`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation */}
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            title="Page précédente (←)"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          
          <input
            type="number"
            min={1}
            max={numPages}
            value={pageNumber}
            onChange={(e) => {
              const page = parseInt(e.target.value)
              if (page >= 1 && page <= numPages) {
                setPageNumber(page)
              }
            }}
            className="w-16 px-2 py-1 text-center bg-white/10 border border-white/20 rounded text-sm"
          />
          
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            title="Page suivante (→)"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-50"
              title="Zoom arrière (-)"
            >
              <FiZoomOut className="w-4 h-4" />
            </button>
            
            <span className="text-sm text-[var(--text-silver)] min-w-[50px] text-center">
              {Math.round(scale * 100)}%
            </span>
            
            <button
              onClick={zoomIn}
              disabled={scale >= 3.0}
              className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-50"
              title="Zoom avant (+)"
            >
              <FiZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={downloadPDF}
              className="p-2 hover:bg-white/10 rounded-lg"
              title="Télécharger"
            >
              <FiDownload className="w-4 h-4" />
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/10 rounded-lg"
              title={isFullscreen ? "Quitter plein écran (f)" : "Plein écran (f)"}
            >
              {isFullscreen ? <FiMinimize className="w-4 h-4" /> : <FiMaximize className="w-4 h-4" />}
            </button>

            {onClose && !isFullscreen && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg ml-2"
                title="Fermer (Escape)"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-gray-200 flex items-center justify-center p-4">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-gray-600"
          >
            <div className="w-6 h-6 border-2 border-[var(--accent-orange)] border-t-transparent rounded-full animate-spin" />
            <span>Chargement du PDF...</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-red-600"
          >
            <div className="text-4xl mb-4">📄</div>
            <h3 className="font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[var(--accent-orange)] text-white rounded-lg hover:bg-orange-600"
            >
              Réessayer
            </button>
          </motion.div>
        )}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="shadow-lg"
          >
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading=""
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                loading=""
                error=""
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </motion.div>
        )}
      </div>

      {/* Keyboard shortcuts help */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur p-3 rounded-lg text-xs text-gray-300 opacity-0 hover:opacity-100 transition-opacity">
        <div className="grid grid-cols-2 gap-2 text-nowrap">
          <div>← → : Navigation</div>
          <div>+ - : Zoom</div>
          <div>F : Plein écran</div>
          <div>Esc : Fermer</div>
        </div>
      </div>
    </div>
  )
}