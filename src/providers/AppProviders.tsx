import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-react'

const queryClient = new QueryClient()

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ClerkProvider publishableKey={clerkPubKey ?? 'test_publishable_key'} afterSignOutUrl={'/'}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ClerkProvider>
  )
}

