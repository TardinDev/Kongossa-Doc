import { Suspense } from 'react'
import type { ReactNode } from 'react'
import { LoadingSkeleton } from './LoadingSkeleton'

interface LazyWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

export function LazyWrapper({ children, fallback }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback || <LoadingSkeleton />}>
      {children}
    </Suspense>
  )
}