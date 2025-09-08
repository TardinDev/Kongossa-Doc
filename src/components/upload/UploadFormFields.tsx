interface UploadFormFieldsProps {
  title: string
  description: string
  tags: string
  category: string
  onTitle: (v: string) => void
  onDescription: (v: string) => void
  onTags: (v: string) => void
  onCategory: (v: string) => void
}

export function UploadFormFields({ title, description, tags, category, onTitle, onDescription, onTags, onCategory }: UploadFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[var(--text-silver)] mb-2">Titre *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => onTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
          placeholder="Titre du document"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[var(--text-silver)] mb-2">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => onDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
          placeholder="Description du document"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-[var(--text-silver)] mb-2">Tags</label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => onTags(e.target.value)}
            className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
            placeholder="tag1, tag2, tag3"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-[var(--text-silver)] mb-2">Catégorie</label>
          <select
            id="category"
            value={category}
            onChange={(e) => onCategory(e.target.value)}
            className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
          >
            <option value="" className="bg-[var(--color-bg)]">Sélectionner...</option>
            <option value="business" className="bg-[var(--color-bg)]">Business</option>
            <option value="construction" className="bg-[var(--color-bg)]">Construction</option>
            <option value="documentation" className="bg-[var(--color-bg)]">Documentation</option>
            <option value="presentation" className="bg-[var(--color-bg)]">Présentation</option>
            <option value="technical" className="bg-[var(--color-bg)]">Technique</option>
            <option value="meeting" className="bg-[var(--color-bg)]">Réunion</option>
            <option value="other" className="bg-[var(--color-bg)]">Autre</option>
          </select>
        </div>
      </div>
    </div>
  )
}

