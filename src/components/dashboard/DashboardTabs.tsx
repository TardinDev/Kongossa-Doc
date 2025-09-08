import type { ReactNode } from 'react'

export type TabId = 'overview' | 'documents' | 'analytics' | 'collections' | 'integrations'

export interface TabItem {
  id: TabId
  label: string
  icon?: ReactNode
}

interface DashboardTabsProps {
  items: TabItem[]
  active: TabId
  onChange: (id: TabId) => void
}

export function DashboardTabs({ items, active, onChange }: DashboardTabsProps) {
  return (
    <div className="border-b border-white/10">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {items.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              active === tab.id
                ? 'border-[var(--accent-orange)] text-[var(--accent-orange)]'
                : 'border-transparent text-[var(--text-silver)] hover:text-white hover:border-white/20'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

