# Quick Start Guide - KongossaDoc

Guide rapide pour démarrer avec KongossaDoc en 10 minutes.

## Prérequis

- Node.js 18+
- Un compte [Clerk](https://clerk.com) (gratuit)
- Un compte [Supabase](https://supabase.com) (gratuit)

## Installation rapide

### 1. Cloner et installer

```bash
git clone https://github.com/TardinDev/Kongossa-Doc.git
cd Kongossa-Doc
npm install
```

### 2. Configuration Clerk

1. Allez sur [dashboard.clerk.com](https://dashboard.clerk.com)
2. Créez une nouvelle application
3. Copiez la **Publishable Key**

### 3. Configuration Supabase

1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Créez un nouveau projet
3. Allez dans **Settings** → **API**
4. Copiez :
   - **Project URL**
   - **anon public key**

### 4. Configuration SQL

1. Dans Supabase Dashboard → **SQL Editor**
2. Créez une nouvelle query
3. Copiez-collez le contenu de `supabase/migrations/001_initial_schema.sql`
4. Exécutez la query

### 5. Variables d'environnement

Créez un fichier `.env` :

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

### 6. Lancer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173)

## Utilisation

### Uploader un document

```typescript
import { uploadDocument } from './api'

const handleUpload = async (file: File) => {
  const doc = await uploadDocument(file, {
    title: file.name,
    ownerId: userId,
    category: 'documents',
    tags: ['important']
  })
  console.log('Document uploadé:', doc)
}
```

### Récupérer les documents

```typescript
import { fetchDocuments } from './api'

const { data, total } = await fetchDocuments({
  page: 1,
  pageSize: 10,
  query: 'recherche',
  sortBy: 'date'
})
```

### Ajouter aux favoris

```typescript
import { toggleFavorite } from './api'

await toggleFavorite(userId, documentId)
```

### Ajouter un commentaire

```typescript
import { createComment } from './api'

await createComment({
  documentId: 'doc-id',
  userId: user.id,
  userName: user.fullName,
  userAvatar: user.imageUrl,
  content: 'Super document!'
})
```

## Prochaines étapes

- ✅ Configuration de base terminée
- 📖 Consultez [SUPABASE_SETUP.md](SUPABASE_SETUP.md) pour plus de détails
- 🎨 Personnalisez l'interface dans `src/components/`
- 🚀 Déployez sur Vercel

## Besoin d'aide ?

- [Documentation complète](README.md)
- [Configuration Supabase détaillée](SUPABASE_SETUP.md)
- [Issues GitHub](https://github.com/TardinDev/Kongossa-Doc/issues)
