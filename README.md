# 📄 KongossaDoc

> Application moderne de gestion et prévisualisation de documents avec React, TypeScript et Vite

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646cff.svg)](https://vitejs.dev/)
![License](https://img.shields.io/badge/license-Private-red.svg)

## ✨ Fonctionnalités

- 🔐 **Authentification sécurisée** avec Clerk
- 📱 **Interface responsive** et moderne avec Tailwind CSS
- 📄 **Prévisualisation de documents** PDF intégrée
- ⭐ **Système de favoris** pour accès rapide
- 🎨 **Animations fluides** avec Framer Motion
- 🔄 **Mode hors ligne** avec Service Worker
- ⚡ **Performance optimisée** avec lazy loading
- 🎯 **Raccourcis clavier** pour navigation rapide
- 📦 **Gestion de fichiers** avec support ZIP
- 🌐 **État global** avec Zustand
- 🔍 **Validation de données** avec Zod

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- npm ou yarn
- Un compte [Clerk](https://clerk.com) pour l'authentification

### Installation

1. Cloner le repository

```bash
git clone https://github.com/votre-username/kongossaDoc.git
cd kongossaDoc
```

2. Installer les dépendances

```bash
npm install
```

3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
VITE_CLERK_PUBLISHABLE_KEY=votre_clerk_publishable_key
VITE_SUPABASE_URL=votre_supabase_project_url
VITE_SUPABASE_ANON_KEY=votre_supabase_anon_key
```

> **Important** : Consultez [SUPABASE_SETUP.md](SUPABASE_SETUP.md) pour configurer votre backend Supabase

4. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173)

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement

# Production
npm run build        # Compile l'application pour la production
npm run preview      # Prévisualise la version de production

# Qualité du code
npm run lint         # Vérifie le code avec ESLint
```

## 📁 Structure du projet

```text
kongossaDoc/
├── src/
│   ├── api/              # Services et appels API
│   ├── components/       # Composants réutilisables
│   ├── constants/        # Constantes de l'application
│   ├── hooks/           # Hooks React personnalisés
│   ├── layouts/         # Layouts de l'application
│   ├── lib/             # Utilitaires et helpers
│   ├── pages/           # Pages de l'application
│   │   ├── HomePage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── DocumentPreviewPage.tsx
│   │   ├── FavoritesPage.tsx
│   │   └── AuthPage.tsx
│   ├── providers/       # Providers React (Context, etc.)
│   ├── store/           # State management (Zustand)
│   ├── types/           # Types TypeScript
│   ├── ui/              # Composants UI de base
│   ├── App.tsx          # Composant principal
│   └── main.tsx         # Point d'entrée
├── public/              # Fichiers statiques
├── dist/               # Build de production
└── package.json
```

## 🎯 Routes principales

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/auth` | Page d'authentification |
| `/dashboard` | Tableau de bord utilisateur |
| `/favorites` | Documents favoris |
| `/d/:id` | Prévisualisation de document |

## 🔧 Technologies utilisées

### Frontend

- **React 19.1** - Bibliothèque UI
- **TypeScript 5.8** - Typage statique
- **Vite 7.1** - Build tool et dev server
- **React Router 7.8** - Routing

### UI/UX

- **Tailwind CSS 4.1** - Framework CSS utilitaire
- **Framer Motion 12** - Animations
- **Lottie React** - Animations vectorielles
- **Lucide React** - Icônes modernes
- **React Icons** - Collection d'icônes

### État et données

- **Zustand 5.0** - State management
- **TanStack Query 5.85** - Gestion des requêtes async
- **Zod 4.0** - Validation de schémas

### Backend & Fonctionnalités

- **Supabase 2.75** - Backend as a Service (BaaS)
  - PostgreSQL database
  - Storage pour fichiers
  - Row Level Security (RLS)
  - Real-time subscriptions
- **Clerk 5.42** - Authentification et gestion utilisateurs
- **PDF.js 5.4** - Rendu de documents PDF
- **JSZip 3.10** - Manipulation de fichiers ZIP

### Qualité du code

- **ESLint 9** - Linting
- **TypeScript ESLint 8** - Règles TypeScript

## 🌟 Fonctionnalités avancées

### Service Worker

L'application utilise un Service Worker pour :

- Mode hors ligne
- Notifications de mise à jour
- Cache intelligent des ressources

### Raccourcis clavier

Des raccourcis clavier globaux sont disponibles pour améliorer la navigation.

### Error Boundary

Gestion gracieuse des erreurs avec affichage d'interfaces de repli.

### Lazy Loading

Chargement paresseux des pages pour optimiser les performances initiales.

## 🔐 Authentification

L'authentification est gérée par [Clerk](https://clerk.com), offrant :

- Connexion sociale (Google, GitHub, etc.)
- Authentification par email
- Gestion de session sécurisée
- Interface utilisateur personnalisable

## 🚢 Déploiement

### Vercel (Recommandé)

```bash
npm install -g vercel
vercel
```

### Build manuel

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`.

## 📝 Configuration

### Variables d'environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clé publique Clerk | ✅ |
| `VITE_SUPABASE_URL` | URL du projet Supabase | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase | ✅ |

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est privé et propriétaire.

## 👨‍💻 Auteur

Tardin Davy

## 🙏 Remerciements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Clerk](https://clerk.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- Toutes les autres bibliothèques open-source utilisées

---

Fait avec ❤️ par l'équipe KongossaDoc
