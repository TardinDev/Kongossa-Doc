import type { PropsWithChildren } from 'react'
import { Header } from '../ui/Header'
import { Footer } from '../ui/Footer'

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh flex flex-col bg-[var(--color-bg)]">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <Footer />
    </div>
  )
}

