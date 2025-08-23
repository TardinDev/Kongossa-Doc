import { Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { MainLayout } from './layouts/MainLayout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingSkeleton } from './components/LoadingSkeleton'

const HomePage = lazy(() => import('./pages/HomePage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const DocumentPreviewPage = lazy(() => import('./pages/DocumentPreviewPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))

export default function App() {
  return (
    <ErrorBoundary>
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
