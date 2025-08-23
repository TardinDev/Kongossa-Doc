import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCloud, FiSettings, FiCheck, FiExternalLink, FiKey, FiRefreshCw } from 'react-icons/fi'
import { SiGoogledrive, SiDropbox, SiMicrosoft } from 'react-icons/si'
import { useToast } from '../hooks/useToast'

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  isConnected: boolean
  features: string[]
  color: string
}

const integrations: Integration[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Synchronisez vos documents avec Google Drive pour un accès facile depuis tous vos appareils.',
    icon: <SiGoogledrive className="w-8 h-8" />,
    isConnected: false,
    features: ['Synchronisation automatique', 'Sauvegarde cloud', 'Partage collaboratif'],
    color: '#4285f4'
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Connectez votre compte Dropbox pour importer et exporter des documents facilement.',
    icon: <SiDropbox className="w-8 h-8" />,
    isConnected: true,
    features: ['Import/Export', 'Synchronisation', 'Historique des versions'],
    color: '#0061ff'
  },
  {
    id: 'onedrive',
    name: 'Microsoft OneDrive',
    description: 'Intégrez OneDrive pour une collaboration fluide avec les outils Microsoft.',
    icon: <SiMicrosoft className="w-8 h-8" />,
    isConnected: false,
    features: ['Office 365', 'SharePoint', 'Teams collaboration'],
    color: '#0078d4'
  }
]

interface WebhookConfig {
  id: string
  name: string
  url: string
  events: string[]
  isActive: boolean
}

export function IntegrationHub() {
  const [activeTab, setActiveTab] = useState<'cloud' | 'webhooks' | 'api'>('cloud')
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: '1',
      name: 'Document Upload Notifications',
      url: 'https://example.com/webhook',
      events: ['document.uploaded', 'document.updated'],
      isActive: true
    }
  ])
  const [newWebhook, setNewWebhook] = useState({ name: '', url: '', events: [] as string[] })
  const [apiKey, setApiKey] = useState('kg_xxxxxxxxxxxxxxxxxxxxxxxx')
  const { toast } = useToast()

  const handleConnect = (integrationId: string) => {
    toast.success('Connexion simulée', `Integration ${integrationId} connectée avec succès`)
  }

  const handleDisconnect = (integrationId: string) => {
    toast.success('Déconnexion simulée', `Integration ${integrationId} déconnectée`)
  }

  const generateNewApiKey = () => {
    const newKey = `kg_${Math.random().toString(36).substr(2, 24)}`
    setApiKey(newKey)
    toast.success('Nouvelle clé API générée', 'Votre ancienne clé a été révoquée')
  }

  const addWebhook = () => {
    if (!newWebhook.name || !newWebhook.url) {
      toast.error('Champs requis', 'Veuillez remplir le nom et l\'URL')
      return
    }

    const webhook: WebhookConfig = {
      id: Date.now().toString(),
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      isActive: true
    }

    setWebhooks([...webhooks, webhook])
    setNewWebhook({ name: '', url: '', events: [] })
    toast.success('Webhook ajouté', 'Le webhook a été configuré avec succès')
  }

  const toggleWebhook = (id: string) => {
    setWebhooks(webhooks.map(webhook =>
      webhook.id === id ? { ...webhook, isActive: !webhook.isActive } : webhook
    ))
  }

  const deleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id))
    toast.success('Webhook supprimé')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Intégrations</h1>
        <p className="text-[var(--text-silver)]">
          Connectez KongossaDoc à vos outils préférés pour améliorer votre workflow
        </p>
      </div>

      <div className="border-b border-white/10">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'cloud', label: 'Cloud Storage', icon: <FiCloud className="w-4 h-4" /> },
            { id: 'webhooks', label: 'Webhooks', icon: <FiSettings className="w-4 h-4" /> },
            { id: 'api', label: 'API', icon: <FiKey className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
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

      {activeTab === 'cloud' && (
        <div className="grid gap-6">
          {integrations.map(integration => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${integration.color}20`, color: integration.color }}
                  >
                    {integration.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                      {integration.isConnected && (
                        <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                          <FiCheck className="w-3 h-3" />
                          Connecté
                        </span>
                      )}
                    </div>
                    <p className="text-[var(--text-silver)] mb-4">{integration.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {integration.features.map(feature => (
                        <span key={feature} className="text-xs bg-white/10 text-[var(--text-silver)] px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {integration.isConnected ? (
                    <>
                      <button
                        onClick={() => handleDisconnect(integration.id)}
                        className="px-4 py-2 text-[var(--text-silver)] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        Déconnecter
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 text-[var(--text-silver)] hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <FiSettings className="w-4 h-4" />
                        Configurer
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleConnect(integration.id)}
                      className="flex items-center gap-2 px-6 py-2 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors"
                    >
                      <FiExternalLink className="w-4 h-4" />
                      Connecter
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Ajouter un webhook</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                  Nom du webhook
                </label>
                <input
                  type="text"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
                  placeholder="Ex: Notifications Slack"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                  URL du webhook
                </label>
                <input
                  type="url"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
                  placeholder="https://hooks.slack.com/..."
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-[var(--text-silver)] mb-2">
                Événements
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['document.uploaded', 'document.updated', 'document.deleted', 'comment.added'].map(event => (
                  <label key={event} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newWebhook.events.includes(event)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewWebhook({ ...newWebhook, events: [...newWebhook.events, event] })
                        } else {
                          setNewWebhook({ ...newWebhook, events: newWebhook.events.filter(e => e !== event) })
                        }
                      }}
                      className="rounded border-white/20 bg-white/5"
                    />
                    <span className="text-[var(--text-silver)]">{event}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={addWebhook}
              className="mt-4 px-6 py-2 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors"
            >
              Ajouter le webhook
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Webhooks configurés</h3>
            {webhooks.map(webhook => (
              <div key={webhook.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">{webhook.name}</h4>
                    <p className="text-sm text-[var(--text-silver)]">{webhook.url}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {webhook.events.map(event => (
                        <span key={event} className="text-xs bg-white/10 text-[var(--text-silver)] px-2 py-1 rounded">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWebhook(webhook.id)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        webhook.isActive
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {webhook.isActive ? 'Actif' : 'Inactif'}
                    </button>
                    <button
                      onClick={() => deleteWebhook(webhook.id)}
                      className="px-3 py-1 text-xs text-red-400 hover:bg-red-500/20 rounded"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Clé API</h3>
            <p className="text-[var(--text-silver)] mb-4">
              Utilisez cette clé pour accéder à l'API KongossaDoc depuis vos applications.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={apiKey}
                readOnly
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm"
              />
              <button
                onClick={() => navigator.clipboard.writeText(apiKey)}
                className="px-4 py-2 bg-white/10 text-[var(--text-silver)] hover:text-white hover:bg-white/15 rounded-lg transition-colors"
              >
                Copier
              </button>
              <button
                onClick={generateNewApiKey}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors"
              >
                <FiRefreshCw className="w-4 h-4" />
                Régénérer
              </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Documentation API</h3>
            <p className="text-[var(--text-silver)] mb-4">
              Découvrez comment intégrer KongossaDoc dans vos applications avec notre API REST.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">GET</span>
                  <code className="text-[var(--accent-orange)] font-mono text-sm">/api/documents</code>
                </div>
                <p className="text-sm text-[var(--text-silver)]">Récupérer la liste des documents</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">POST</span>
                  <code className="text-[var(--accent-orange)] font-mono text-sm">/api/documents</code>
                </div>
                <p className="text-sm text-[var(--text-silver)]">Uploader un nouveau document</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">PUT</span>
                  <code className="text-[var(--accent-orange)] font-mono text-sm">/api/documents/:id</code>
                </div>
                <p className="text-sm text-[var(--text-silver)]">Modifier un document existant</p>
              </div>
            </div>
            <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/10 text-[var(--text-silver)] hover:text-white hover:bg-white/15 rounded-lg transition-colors">
              <FiExternalLink className="w-4 h-4" />
              Voir la documentation complète
            </button>
          </div>
        </div>
      )}
    </div>
  )
}