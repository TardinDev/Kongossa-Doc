import { useUser, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { useState } from 'react'
import { FiBarChart, FiSettings, FiFolder, FiUpload, FiTrendingUp } from 'react-icons/fi'
import { AnalyticsDashboard } from '../components/AnalyticsDashboard'
import { IntegrationHub } from '../components/IntegrationHub'
import { PageHeader } from '../components/common/PageHeader'
import { DashboardTabs, type TabId, type TabItem } from '../components/dashboard/DashboardTabs'
import { DocumentsSection } from './dashboard/DocumentsSection'
import { CollectionsSection } from './dashboard/CollectionsSection'

export default function DashboardPage() {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <DashboardInner />
      </SignedIn>
    </>
  )
}

function DashboardInner() {
  const { user } = useUser()
  const userId = user?.id ?? 'me'
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [showCreateCollection, setShowCreateCollection] = useState(false)

  const tabs: TabItem[] = [
    { id: 'overview', label: "Vue d'ensemble", icon: <FiTrendingUp className="w-4 h-4" /> },
    { id: 'documents', label: 'Mes documents', icon: <FiUpload className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <FiBarChart className="w-4 h-4" /> },
    { id: 'collections', label: 'Collections', icon: <FiFolder className="w-4 h-4" /> },
    { id: 'integrations', label: 'Intégrations', icon: <FiSettings className="w-4 h-4" /> },
  ] as const

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Gérez vos documents et analysez vos statistiques"
      />

      <DashboardTabs items={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && <AnalyticsDashboard />}

      {activeTab === 'documents' && (
        <DocumentsSection userId={userId} />
      )}

      {activeTab === 'analytics' && <AnalyticsDashboard />}

      {activeTab === 'integrations' && <IntegrationHub />}

      {activeTab === 'collections' && (
        <CollectionsSection
          showCreate={showCreateCollection}
          onOpenCreate={() => setShowCreateCollection(true)}
          onCloseCreate={() => setShowCreateCollection(false)}
        />
      )}
    </div>
  )
}
