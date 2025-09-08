import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { uploadSchema } from '../../lib/schemas'

interface UploadFormProps {
  onUpload: (form: FormData) => void | Promise<unknown>
  isUploading?: boolean
  error?: unknown
}

export function UploadForm({ onUpload, isUploading, error }: UploadFormProps) {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [title, setTitle] = useState('')

  const errorMessage = useMemo(() => (error instanceof Error ? error.message : null), [error])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = new FormData()
    const file = fileRef.current?.files?.[0]
    const parse = uploadSchema.safeParse({ title, file })
    if (!parse.success) return
    form.set('title', title)
    if (file) form.set('file', file)
    await onUpload(form)
    setTitle('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
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
        disabled={isUploading}
        className="px-4 py-2 rounded-md bg-[var(--accent-orange)] text-black font-semibold hover:bg-orange-500/90 disabled:opacity-60"
      >
        {isUploading ? 'Upload...' : 'Uploader'}
      </button>
      {errorMessage ? <p className="text-sm text-red-600 col-span-full">{errorMessage}</p> : null}
    </motion.form>
  )
}
