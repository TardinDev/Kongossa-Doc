import { Route, Routes, useNavigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { MainLayout } from './layouts/MainLayout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingSkeleton } from './components/LoadingSkeleton'
import { useServiceWorker } from './hooks/useServiceWorker'
import { useGlobalKeyboardShortcuts } from './hooks/useGlobalKeyboardShortcuts'
import { FiHome, FiWifi } from 'react-icons/fi'

const HomePage = lazy(() => import('./pages/HomePage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const DocumentPreviewPage = lazy(() => import('./pages/DocumentPreviewPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))

function AppInner() {
  // Test both hooks
  const { isOnline, updateAvailable, updateServiceWorker } = useServiceWorker()
  useGlobalKeyboardShortcuts()
  const navigate = useNavigate()

  return (
    <ErrorBoundary>
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white py-2 text-sm shadow-lg">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiWifi className="w-4 h-4" />
              <span>Mode hors ligne - Certaines fonctionnalités peuvent être limitées</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
            >
              <FiHome className="w-3 h-3" />
              <span className="hidden sm:inline">Retour à l'accueil</span>
            </button>
          </div>
        </div>
      )}

      {/* Service Worker update notification */}
      {updateAvailable && (
        <div className="fixed bottom-4 right-4 z-50 bg-[var(--accent-orange)] text-black p-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <div>
              <div className="font-semibold">Mise à jour disponible</div>
              <div className="text-sm opacity-90">Une nouvelle version est prête à être installée</div>
            </div>
            <button
              onClick={updateServiceWorker}
              className="px-3 py-1 bg-black/20 rounded text-sm font-medium hover:bg-black/30"
            >
              Installer
            </button>
          </div>
        </div>
      )}

      <MainLayout>
        <Suspense fallback={<LoadingSkeleton />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/d/:id" element={<DocumentPreviewPage />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </ErrorBoundary>
  )
}

export default function App() {
  return <AppInner />
}
