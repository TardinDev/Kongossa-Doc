import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { FiRefreshCw, FiHome } from 'react-icons/fi'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="text-6xl mb-4">💥</div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Oups ! Quelque chose s'est mal passé
            </h1>
            <p className="text-[var(--text-silver)] mb-6">
              Une erreur inattendue s'est produite. Veuillez actualiser la page ou revenir à l'accueil.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-orange)] text-black rounded-lg hover:bg-orange-500/90 transition-colors"
              >
                <FiRefreshCw size={16} />
                Actualiser
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/15 transition-colors"
              >
                <FiHome size={16} />
                Accueil
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                  Détails de l'erreur (dev)
                </summary>
                <pre className="mt-2 p-3 bg-black/30 rounded text-xs text-red-400 overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}