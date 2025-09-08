import type { PropsWithChildren } from 'react'

interface ResponsiveGridProps extends PropsWithChildren {
  columns?: string
}

// Small utility wrapper to keep grid usage consistent and responsive
export function ResponsiveGrid({ children, columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' }: ResponsiveGridProps) {
  return (
    <div className={`grid ${columns} gap-4`}>
      {children}
    </div>
  )
}

