import { Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { MainLayout } from './layouts/MainLayout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingSkeleton } from './components/LoadingSkeleton'
import { useServiceWorker } from './hooks/useServiceWorker'
import { useGlobalKeyboardShortcuts } from './hooks/useGlobalKeyboardShortcuts'

const HomePage = lazy(() => import('./pages/HomePage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const DocumentPreviewPage = lazy(() => import('./pages/DocumentPreviewPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))

function AppInner() {
  // Initialize service worker and keyboard shortcuts
  const { isOnline, updateAvailable, updateServiceWorker } = useServiceWorker()
  useGlobalKeyboardShortcuts()

  return (
    <ErrorBoundary>
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center py-2 text-sm">
          🔌 Mode hors ligne - Certaines fonctionnalités peuvent être limitées
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
