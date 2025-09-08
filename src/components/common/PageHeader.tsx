import type { PropsWithChildren, ReactNode } from 'react'

interface PageHeaderProps extends PropsWithChildren {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">{title}</h1>
        {subtitle ? <p className="text-gray-300">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}

