import { useUser, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchUserDocumentsMock, uploadDocumentMock, deleteDocumentMock } from '../api/mockDocuments'
import { uploadSchema } from '../lib/schemas'
import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiBarChart, FiSettings, FiFolder, FiUpload, FiTrendingUp, FiPlus, FiTrash2 } from 'react-icons/fi'
import { AnalyticsDashboard } from '../components/AnalyticsDashboard'
import { IntegrationHub } from '../components/IntegrationHub'
import { CollectionModal } from '../components/CollectionModal'
import { useCollections } from '../hooks/useCollections'
import { useAnalytics } from '../hooks/useAnalytics'

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
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['my-documents', userId],
    queryFn: () => fetchUserDocumentsMock(userId),
    enabled: !!userId,
  })
  
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'analytics' | 'integrations' | 'collections'>('overview')
  const [showCreateCollection, setShowCreateCollection] = useState(false)
  const { collections } = useCollections()
  const { getTotalStats } = useAnalytics()

  const fileRef = useRef<HTMLInputElement | null>(null)
  const [title, setTitle] = useState('')
  const totalStats = getTotalStats()

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (formData: FormData) => uploadDocumentMock(formData),
    onSuccess: () => {
      setTitle('')
      if (fileRef.current) fileRef.current.value = ''
      qc.invalidateQueries({ queryKey: ['my-documents', userId] })
    },
  })

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteDocumentMock({ id, requesterId: userId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-documents', userId] }),
  })

  const errorMessage = useMemo(() => (error instanceof Error ? error.message : null), [error])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = new FormData()
    const file = fileRef.current?.files?.[0]
    const parse = uploadSchema.safeParse({ title, file })
    if (!parse.success) return
    form.set('title', title)
    if (file) form.set('file', file)
    mutate(form)
  }

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <FiTrendingUp className="w-4 h-4" /> },
    { id: 'documents', label: 'Mes documents', icon: <FiUpload className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <FiBarChart className="w-4 h-4" /> },
    { id: 'collections', label: 'Collections', icon: <FiFolder className="w-4 h-4" /> },
    { id: 'integrations', label: 'Intégrations', icon: <FiSettings className="w-4 h-4" /> },
  ] as const

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-300">Gérez vos documents et analysez vos statistiques</p>
        </div>
      </div>
      
      <div className="border-b border-white/10">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <AnalyticsDashboard />
        </div>
      )}
      
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4 grid sm:grid-cols-[1fr_auto_auto] gap-3 items-center"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du document"
          className="w-full px-3 py-2 rounded-md border border-white/10 bg-white/5 text-[var(--text-silver)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
        />
        <input ref={fileRef} type="file" className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[var(--accent-orange)] file:text-black file:font-semibold hover:file:bg-orange-500/90" />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded-md bg-[var(--accent-orange)] text-black font-semibold hover:bg-orange-500/90 disabled:opacity-60"
        >
          {isPending ? 'Upload...' : 'Uploader'}
        </button>
        {errorMessage ? <p className="text-sm text-red-600 col-span-full">{errorMessage}</p> : null}
      </motion.form>

      <div>
        <h2 className="font-semibold mb-3 text-white">Mes documents</h2>
        {isLoading ? (
          <div className="text-gray-400">Chargement...</div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.map((d) => (
              <li key={d.id} className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                <div className="text-sm text-gray-300">{d.type}</div>
                <div className="font-medium text-white">{d.title}</div>
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={`${window.location.origin}/d/${d.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 text-[var(--text-silver)]"
                  >
                    Ouvrir
                  </a>
                  <button
                    className="px-3 py-1.5 rounded bg-[var(--accent-orange)] text-black font-semibold hover:bg-orange-500/90"
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/d/${d.id}`)}
                  >
                    Copier le lien
                  </button>
                  <button
                    disabled={isDeleting}
                    className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                    onClick={() => remove({ id: d.id })}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
          </div>
        </div>
      )}
      
      {activeTab === 'analytics' && <AnalyticsDashboard />}
      
      {activeTab === 'integrations' && <IntegrationHub />}
      
      {activeTab === 'collections' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Mes Collections</h2>
              <p className="text-[var(--text-silver)]">Organisez vos documents en collections thématiques</p>
            </div>
            <button
              onClick={() => setShowCreateCollection(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Nouvelle collection
            </button>
          </div>

          {collections.length === 0 ? (
            <div className="text-center py-20 border border-white/10 rounded-xl bg-white/5">
              <FiFolder className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Aucune collection</h3>
              <p className="text-[var(--text-silver)] mb-6 max-w-md mx-auto">
                Créez votre première collection pour organiser vos documents par thème ou sujet
              </p>
              <button
                onClick={() => setShowCreateCollection(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Créer une collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: collection.color }}
                      />
                      <h3 className="font-semibold text-white group-hover:text-[var(--accent-orange)] transition-colors">
                        {collection.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-white/10 rounded">
                        <FiSettings className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-red-500/20 rounded">
                        <FiTrash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                  
                  {collection.description && (
                    <p className="text-sm text-[var(--text-silver)] mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {collection.documentIds.length} document{collection.documentIds.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-gray-500">
                      Créée le {new Date(collection.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button className="w-full py-2 px-4 rounded-lg border border-white/20 text-[var(--text-silver)] hover:text-white hover:border-white/40 transition-colors">
                      Voir les documents
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <CollectionModal
            isOpen={showCreateCollection}
            onClose={() => setShowCreateCollection(false)}
            mode="create"
          />
        </div>
      )}
    </div>
  )
}

