import { motion } from 'framer-motion'
import { FiEye, FiDownload, FiShare2, FiMessageSquare, FiTrendingUp, FiFileText } from 'react-icons/fi'
import { useAnalytics } from '../hooks/useAnalytics'
import { useMemo } from 'react'

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  trend?: number
  suffix?: string
}

function StatCard({ title, value, icon, trend, suffix = '' }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-[var(--accent-orange)]/20 rounded-lg text-[var(--accent-orange)]">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            <FiTrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-white mb-1">
          {value.toLocaleString('fr-FR')}{suffix}
        </div>
        <div className="text-sm text-[var(--text-silver)]">{title}</div>
      </div>
    </motion.div>
  )
}

interface ChartData {
  date: string
  views: number
}

function SimpleChart({ data }: { data: ChartData[] }) {
  const maxViews = Math.max(...data.map(d => d.views), 1)
  
  return (
    <div className="h-32 flex items-end gap-1">
      {data.slice(-14).map((item, index) => (
        <div
          key={item.date}
          className="flex-1 bg-[var(--accent-orange)]/20 hover:bg-[var(--accent-orange)]/40 transition-colors rounded-t relative group"
          style={{
            height: `${(item.views / maxViews) * 100}%`,
            minHeight: item.views > 0 ? '8px' : '2px'
          }}
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none">
            {item.views} vues
          </div>
        </div>
      ))}
    </div>
  )
}

export function AnalyticsDashboard() {
  const { userAnalytics, getTotalStats, getTopDocuments } = useAnalytics()
  const totalStats = getTotalStats()
  const topDocuments = getTopDocuments(5)

  const chartData = useMemo(() => {
    const last14Days = []
    for (let i = 13; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const totalViewsForDay = topDocuments.reduce((sum, doc) => {
        const dayData = doc.viewsByDay.find(d => d.date === dateStr)
        return sum + (dayData?.views || 0)
      }, 0)
      
      last14Days.push({
        date: dateStr,
        views: totalViewsForDay
      })
    }
    return last14Days
  }, [topDocuments])

  if (!userAnalytics) {
    return (
      <div className="text-center py-12">
        <FiTrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Pas encore de données
        </h2>
        <p className="text-[var(--text-silver)]">
          Vos statistiques apparaîtront ici une fois que vous aurez commencé à utiliser la plateforme
        </p>
      </div>
    )
  }

  const recentActivity = userAnalytics.recentActivity.slice(0, 10)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view': return <FiEye className="w-4 h-4" />
      case 'download': return <FiDownload className="w-4 h-4" />
      case 'share': return <FiShare2 className="w-4 h-4" />
      case 'comment': return <FiMessageSquare className="w-4 h-4" />
      case 'upload': return <FiFileText className="w-4 h-4" />
      default: return <FiEye className="w-4 h-4" />
    }
  }

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'view': return 'Vu'
      case 'download': return 'Téléchargé'
      case 'share': return 'Partagé'
      case 'comment': return 'Commenté'
      case 'upload': return 'Ajouté'
      default: return 'Action sur'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <div className="text-sm text-[var(--text-silver)]">
          Données des 30 derniers jours
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total des vues"
          value={totalStats.views}
          icon={<FiEye className="w-5 h-5" />}
          trend={12}
        />
        <StatCard
          title="Téléchargements"
          value={totalStats.downloads}
          icon={<FiDownload className="w-5 h-5" />}
          trend={8}
        />
        <StatCard
          title="Partages"
          value={totalStats.shares}
          icon={<FiShare2 className="w-5 h-5" />}
          trend={-3}
        />
        <StatCard
          title="Commentaires"
          value={totalStats.comments}
          icon={<FiMessageSquare className="w-5 h-5" />}
          trend={15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Vues des 14 derniers jours</h3>
          <SimpleChart data={chartData} />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Documents populaires</h3>
          <div className="space-y-3">
            {topDocuments.length === 0 ? (
              <p className="text-[var(--text-silver)] text-center py-8">
                Aucun document trouvé
              </p>
            ) : (
              topDocuments.map((doc, index) => (
                <div key={doc.documentId} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-6 h-6 rounded bg-[var(--accent-orange)] text-black text-sm font-semibold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">
                      Document #{doc.documentId.slice(-6)}
                    </div>
                    <div className="text-xs text-[var(--text-silver)]">
                      {doc.views} vues • {doc.downloads} téléchargements
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Activité récente</h3>
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-[var(--text-silver)] text-center py-8">
              Aucune activité récente
            </p>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors">
                <div className="p-2 bg-white/10 rounded-lg text-[var(--text-silver)]">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white">
                    {getActivityLabel(activity.type)} {activity.documentTitle || `Document #${activity.documentId?.slice(-6)}`}
                  </div>
                  <div className="text-xs text-[var(--text-silver)]">
                    {new Date(activity.timestamp).toLocaleString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}