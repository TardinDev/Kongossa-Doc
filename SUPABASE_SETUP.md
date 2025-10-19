# Guide de Configuration Supabase pour KongossaDoc

Ce guide vous aidera à configurer Supabase comme backend pour votre application KongossaDoc.

## Étape 1 : Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - **Name** : KongossaDoc (ou votre choix)
   - **Database Password** : Créez un mot de passe sécurisé (sauvegardez-le !)
   - **Region** : Choisissez la région la plus proche de vos utilisateurs
5. Cliquez sur "Create new project"
6. Attendez que le projet soit provisionné (environ 2 minutes)

## Étape 2 : Obtenir les clés API

1. Dans le dashboard Supabase, allez dans **Settings** → **API**
2. Copiez les valeurs suivantes :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **Project API Key (anon public)** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Étape 3 : Configurer les variables d'environnement

1. Ouvrez le fichier `.env` à la racine de votre projet
2. Remplacez les valeurs suivantes :

```env
VITE_SUPABASE_URL=https://votre-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=votre-anon-key-ici
```

## Étape 4 : Exécuter les migrations de base de données

1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Cliquez sur **New Query**
3. Copiez tout le contenu du fichier `supabase/migrations/001_initial_schema.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **Run** pour exécuter le script
6. Vérifiez qu'il n'y a pas d'erreurs (toutes les commandes doivent s'exécuter avec succès)

## Étape 5 : Configurer le Storage

Le script SQL a déjà créé le bucket `documents`, mais vérifiez :

1. Allez dans **Storage** dans la sidebar
2. Vous devriez voir un bucket nommé `documents`
3. Si ce n'est pas le cas, créez-le manuellement :
   - Cliquez sur "New bucket"
   - Name: `documents`
   - Public bucket: ✅ (coché)
   - Cliquez sur "Create bucket"

## Étape 6 : Configurer l'authentification avec Clerk

Supabase utilise Row Level Security (RLS) qui s'attend à recevoir un token JWT de Clerk.

### Option A : Configuration JWT Custom (Recommandé)

1. Dans Clerk Dashboard, allez dans **JWT Templates**
2. Créez un nouveau template "Supabase"
3. Ajoutez les claims suivants :

```json
{
  "sub": "{{user.id}}"
}
```

4. Dans votre code, utilisez ce template pour obtenir le token JWT de Clerk

### Option B : Utiliser l'ID utilisateur Clerk directement

Pour simplifier, le schéma actuel utilise simplement l'ID utilisateur Clerk comme `owner_id`.
Les politiques RLS vérifient `auth.uid()::text = owner_id`.

Pour que cela fonctionne avec Clerk :

1. Modifiez le fichier [src/lib/supabase.ts](src/lib/supabase.ts) pour synchroniser l'authentification
2. Utilisez la fonction `setSupabaseAuth()` après la connexion Clerk

Exemple :

```typescript
import { useAuth } from '@clerk/clerk-react'
import { setSupabaseAuth } from './lib/supabase'

// Dans votre composant
const { getToken, userId } = useAuth()

useEffect(() => {
  const syncAuth = async () => {
    const token = await getToken({ template: 'supabase' })
    if (token) {
      await setSupabaseAuth(token)
    }
  }
  syncAuth()
}, [getToken])
```

## Étape 7 : Vérifier la configuration

### Test de connexion

Créez un fichier de test `src/test-supabase.ts` :

```typescript
import { supabase } from './lib/supabase'

async function testConnection() {
  const { data, error } = await supabase
    .from('documents')
    .select('count')
    .limit(1)

  if (error) {
    console.error('Erreur de connexion:', error)
  } else {
    console.log('✅ Connexion Supabase réussie!')
  }
}

testConnection()
```

## Structure de la base de données

Voici les tables créées :

### Tables principales

1. **documents** : Stocke les métadonnées des documents
2. **comments** : Commentaires sur les documents
3. **favorites** : Documents favoris des utilisateurs
4. **collections** : Collections de documents créées par les utilisateurs
5. **collection_documents** : Table de liaison entre collections et documents
6. **user_profiles** : Profils utilisateurs (cache des données Clerk)

### Fonctions disponibles

- `increment_view_count(document_uuid)` : Incrémente le compteur de vues
- `increment_download_count(document_uuid)` : Incrémente le compteur de téléchargements
- `get_documents_with_favorites(user_id)` : Récupère les documents avec le statut favori

## Utilisation dans l'application

### Exemple : Récupérer des documents

```typescript
import { fetchDocuments } from './api/documents'

const result = await fetchDocuments({
  page: 1,
  pageSize: 10,
  query: 'recherche',
  sortBy: 'date',
  filterType: 'pdf'
})

console.log(result.data) // Tableau de documents
console.log(result.total) // Nombre total
```

### Exemple : Upload de document

```typescript
import { uploadDocument } from './api/documents'

const file = // ... obtenir le fichier
const document = await uploadDocument(file, {
  title: 'Mon document',
  ownerId: userId,
  category: 'business',
  tags: ['important', 'projet'],
  description: 'Description du document'
})
```

### Exemple : Gérer les favoris

```typescript
import { toggleFavorite, getFavoriteDocuments } from './api/favorites'

// Ajouter/retirer des favoris
await toggleFavorite(userId, documentId)

// Récupérer tous les favoris
const favorites = await getFavoriteDocuments(userId)
```

### Exemple : Gérer les commentaires

```typescript
import { createComment, fetchComments } from './api/comments'

// Créer un commentaire
await createComment({
  documentId: 'doc-id',
  userId: 'user-id',
  userName: 'John Doe',
  userAvatar: 'https://...',
  content: 'Mon commentaire'
})

// Récupérer tous les commentaires (avec réponses imbriquées)
const comments = await fetchComments('doc-id')
```

## Sécurité

### Row Level Security (RLS)

Toutes les tables ont RLS activé avec les politiques suivantes :

- **Documents** : Tout le monde peut voir, seuls les propriétaires peuvent modifier/supprimer
- **Comments** : Tout le monde peut voir, seuls les auteurs peuvent modifier/supprimer
- **Favorites** : Les utilisateurs ne voient que leurs propres favoris
- **Collections** : Les utilisateurs ne voient que leurs propres collections

### Storage Security

Le bucket `documents` est public en lecture, mais seuls les utilisateurs authentifiés peuvent uploader.
Les utilisateurs ne peuvent modifier/supprimer que leurs propres fichiers.

## Monitoring et Maintenance

### Dashboard Supabase

- **Table Editor** : Voir et modifier les données directement
- **Database** : Gérer les tables, fonctions, triggers
- **Storage** : Gérer les fichiers uploadés
- **Auth** : Gérer l'authentification (si utilisé)
- **Logs** : Voir les logs d'erreurs et requêtes

### Limites du plan gratuit

- **Database** : 500 MB
- **Storage** : 1 GB
- **Bandwidth** : 2 GB / mois
- **Requêtes API** : Illimitées

Pour plus de capacité, passez au plan Pro (25$/mois).

## Troubleshooting

### Erreur : "relation does not exist"

→ Les migrations SQL n'ont pas été exécutées. Retournez à l'Étape 4.

### Erreur : "Missing Supabase environment variables"

→ Vérifiez que `.env` contient bien `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

### Erreur : "new row violates row-level security policy"

→ Problème d'authentification. Vérifiez que le token Clerk est bien synchronisé avec Supabase.

### Les fichiers ne s'uploadent pas

→ Vérifiez que le bucket `documents` existe et est public.

## Prochaines étapes

1. ✅ Configurez Supabase (ce guide)
2. Testez l'upload de documents
3. Testez les commentaires et favoris
4. Configurez les webhooks Clerk → Supabase (optionnel)
5. Déployez sur Vercel avec les variables d'environnement

## Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase + Clerk Guide](https://supabase.com/docs/guides/auth/social-login/auth-clerk)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

Besoin d'aide ? Consultez les [GitHub Issues](https://github.com/TardinDev/Kongossa-Doc/issues)
