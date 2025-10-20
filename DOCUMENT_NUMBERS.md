# Système de Numérotation des Documents

## Vue d'ensemble

Chaque document uploadé sur KongossaDocs reçoit automatiquement un **numéro d'identification unique** qui commence par `#` (par exemple: `#1001`, `#1002`, etc.).

Ce système permet de :
- Identifier rapidement et facilement un document spécifique
- Partager des références précises entre utilisateurs
- Rechercher un document par son numéro unique

## Fonctionnalités

### 1. Attribution Automatique

Lorsqu'un utilisateur upload un nouveau document, le système génère automatiquement un numéro unique :
```
Document 1 → #1001
Document 2 → #1002
Document 3 → #1003
...
```

Le numéro commence à **#1001** et s'incrémente automatiquement pour chaque nouveau document.

### 2. Recherche par Numéro

Vous pouvez rechercher un document de **trois manières** :

#### a) Par le numéro exact
```
Recherche : #1001
Résultat : Le document avec le numéro #1001 uniquement
```

#### b) Par le titre du document
```
Recherche : "Mon rapport"
Résultat : Tous les documents contenant "Mon rapport" dans leur titre
```

#### c) Par tags
```
Recherche : "business"
Résultat : Tous les documents taggés avec "business"
```

### 3. Affichage du Numéro

Le numéro de document est affiché à plusieurs endroits :

#### Sur les cartes de documents (HomePage, Browse)
```
┌─────────────────────────────┐
│   [Image du document]       │
│                             │
│ Titre du Document           │
│ #1001                       │ ← Numéro en orange
│ #tag1 #tag2                 │
│ 👁 125  ⬇ 45               │
└─────────────────────────────┘
```

#### Sur la page de prévisualisation
```
Mon Super Document  [#1001]
                     ↑
              Badge orange avec le numéro
```

## Implémentation Technique

### Migration SQL

Le champ `document_number` a été ajouté à la table `documents` avec :
- **Type** : `VARCHAR(20)`
- **Contrainte** : `UNIQUE` (pas de doublons)
- **Génération** : Automatique via trigger PostgreSQL
- **Format** : `#XXXX` où XXXX est un nombre entier

```sql
-- Voir le fichier : supabase/migrations/002_add_document_number.sql
```

### API TypeScript

Nouvelle fonction ajoutée dans `src/api/documents.ts` :

```typescript
// Rechercher un document par son numéro
export async function fetchDocumentByNumber(documentNumber: string): Promise<DocumentItem | null>

// Exemple d'utilisation :
const doc = await fetchDocumentByNumber('#1001')
// ou
const doc = await fetchDocumentByNumber('1001') // Le # est ajouté automatiquement
```

### Types TypeScript

Le type `DocumentItem` inclut maintenant :

```typescript
export interface DocumentItem {
  // ... autres champs
  documentNumber?: string  // Ex: "#1001"
}
```

## Exemples d'Utilisation

### Pour les Utilisateurs

1. **Partager une référence** :
   ```
   "Hey, regarde le document #1234, il est super intéressant !"
   ```

2. **Rechercher rapidement** :
   - Tapez `#1234` dans la barre de recherche
   - Le document s'affiche immédiatement

3. **Support client** :
   ```
   Client : "J'ai un problème avec mon document"
   Support : "Pouvez-vous me donner le numéro du document ?"
   Client : "#1567"
   Support : "Merci, je vais vérifier tout de suite"
   ```

### Pour les Développeurs

1. **Récupérer un document par ID** :
   ```typescript
   import { fetchDocumentById } from '@/api/documents'
   const doc = await fetchDocumentById('uuid-here')
   console.log(doc.documentNumber) // "#1001"
   ```

2. **Récupérer un document par numéro** :
   ```typescript
   import { fetchDocumentByNumber } from '@/api/documents'
   const doc = await fetchDocumentByNumber('#1001')
   // ou
   const doc = await fetchDocumentByNumber('1001')
   ```

3. **Recherche combinée** :
   ```typescript
   import { fetchDocuments } from '@/api/documents'

   // Recherche par titre ou numéro
   const results = await fetchDocuments({ query: 'rapport' })

   // Recherche spécifique par numéro
   const results = await fetchDocuments({ query: '#1001' })
   ```

## Configuration Supabase

### Étape 1 : Exécuter la migration

Dans votre projet Supabase, exécutez le fichier SQL :
```bash
supabase/migrations/002_add_document_number.sql
```

### Étape 2 : Vérifier le trigger

Le trigger `trigger_set_document_number` doit être actif sur la table `documents`.

### Étape 3 : Tester

Insérez un document de test :
```sql
INSERT INTO documents (title, type, mime_type, owner_id)
VALUES ('Test Document', 'pdf', 'application/pdf', 'user-id-here')
RETURNING document_number;
```

Vous devriez voir : `#1001` (ou le prochain numéro disponible).

## Dépannage

### Le numéro ne s'affiche pas

1. Vérifiez que la migration SQL a été exécutée :
   ```sql
   SELECT column_name FROM information_schema.columns
   WHERE table_name = 'documents' AND column_name = 'document_number';
   ```

2. Vérifiez que le trigger existe :
   ```sql
   SELECT trigger_name FROM information_schema.triggers
   WHERE event_object_table = 'documents';
   ```

3. Vérifiez les documents existants :
   ```sql
   SELECT id, title, document_number FROM documents LIMIT 10;
   ```

### Les documents existants n'ont pas de numéro

La migration inclut un script pour attribuer des numéros aux documents existants. Si nécessaire, exécutez manuellement :

```sql
UPDATE documents
SET document_number = generate_document_number()
WHERE document_number IS NULL;
```

## Améliorations Futures

Fonctionnalités possibles à ajouter :

1. **Numérotation par catégorie**
   - PDFs : `#P1001`, `#P1002`
   - Images : `#I1001`, `#I1002`
   - Vidéos : `#V1001`, `#V1002`

2. **Numérotation par année**
   - 2025 : `#2025-0001`
   - 2026 : `#2026-0001`

3. **QR Code**
   - Générer un QR code avec le numéro du document

4. **Historique des versions**
   - `#1001.1`, `#1001.2` pour les versions d'un même document

## Support

Pour toute question ou problème avec le système de numérotation, contactez l'équipe de développement ou créez une issue sur GitHub.

---

**Dernière mise à jour** : 2025-10-20
**Version** : 1.0.0
