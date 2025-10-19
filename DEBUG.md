# Debug - Page Blanche

## Problème
Page blanche au démarrage de l'application

## Solutions à essayer

### 1. Vérifier la console du navigateur
1. Ouvrez http://localhost:5173 (ou le port indiqué)
2. Ouvrez les DevTools (F12 ou Cmd+Option+I sur Mac)
3. Regardez l'onglet **Console** pour voir les erreurs

### 2. Erreurs communes

#### Erreur : "VITE_CLERK_PUBLISHABLE_KEY is not defined"
**Solution :** Vérifiez que votre fichier `.env` contient la bonne clé Clerk

```bash
# Vérifiez votre .env
cat .env
```

#### Erreur liée à Supabase
**Solution temporaire :** Les APIs Supabase ne sont pas encore utilisées dans l'app. Elles ne devraient pas causer de problème.

#### Erreur : "Cannot find module"
**Solution :** Réinstallez les dépendances

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 3. Tester avec un composant minimal

Si le problème persiste, testez avec ce code dans `src/App.tsx` :

```typescript
export default function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test App</h1>
      <p>Si vous voyez ce message, React fonctionne !</p>
    </div>
  )
}
```

### 4. Vérifier les Service Workers

Les Service Workers peuvent causer des problèmes. Pour les désactiver temporairement :

**Dans votre navigateur :**
1. DevTools → Application (ou Stockage)
2. Service Workers
3. Cliquez sur "Unregister" pour tous les service workers
4. Rafraîchissez la page (Cmd+R ou Ctrl+R)

### 5. Mode incognito

Testez dans une fenêtre de navigation privée pour éviter les problèmes de cache

### 6. Afficher les erreurs Vite

Lancez le serveur et copiez-moi les erreurs s'il y en a :

```bash
npm run dev
```

### 7. Build de production

Testez si le build fonctionne :

```bash
npm run build
npm run preview
```

## Informations utiles

- Port du serveur : Vérifiez le message dans le terminal après `npm run dev`
- Fichiers critiques :
  - `src/main.tsx` - Point d'entrée
  - `src/App.tsx` - Composant principal
  - `src/providers/AppProviders.tsx` - Providers (Clerk, React Query)
  - `.env` - Variables d'environnement

## Que faire ensuite

1. Ouvrez http://localhost:5173 dans votre navigateur
2. Ouvrez la console (F12)
3. Copiez-moi les messages d'erreur en rouge
4. Je pourrai alors identifier et corriger le problème spécifique
