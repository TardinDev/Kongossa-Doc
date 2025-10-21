import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-react'

const queryClient = new QueryClient()

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined

export function AppProviders({ children }: PropsWithChildren) {
  // Check if Clerk key is missing
  if (!clerkPubKey || clerkPubKey === 'pk_test_xxxxx') {
    return (
      <div className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--bg-card)] border border-red-500/30 rounded-xl p-6 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-3">Configuration Manquante</h1>
          <p className="text-[var(--text-silver)] mb-4">
            Les variables d'environnement Clerk ne sont pas configurées.
          </p>
          <div className="bg-black/30 rounded-lg p-4 text-left text-sm font-mono">
            <p className="text-red-400 mb-2">Variables requises :</p>
            <p className="text-gray-300">VITE_CLERK_PUBLISHABLE_KEY</p>
          </div>
          <p className="text-xs text-[var(--text-silver)] mt-4">
            Configurez ces variables dans votre dashboard Vercel ou fichier .env
          </p>
        </div>
      </div>
    )
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey} afterSignOutUrl={'/'}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ClerkProvider>
  )
}

