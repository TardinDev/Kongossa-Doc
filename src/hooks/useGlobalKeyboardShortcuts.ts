import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  description: string
  action: () => void
  condition?: () => boolean
}

export function useGlobalKeyboardShortcuts() {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()

  const shortcuts: KeyboardShortcut[] = [
    // Navigation
    {
      key: 'h',
      altKey: true,
      description: 'Aller à l\'accueil',
      action: () => navigate('/'),
    },
    {
      key: 'd',
      altKey: true,
      description: 'Aller au dashboard',
      action: () => navigate('/dashboard'),
      condition: () => isSignedIn
    },
    {
      key: 'f',
      altKey: true,
      description: 'Aller aux favoris',
      action: () => navigate('/favorites'),
      condition: () => isSignedIn
    },
    
    // Search
    {
      key: '/',
      description: 'Rechercher',
      action: () => {
        const searchInput = document.querySelector('input[placeholder*="Rechercher"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
      },
    },
    {
      key: 'Escape',
      description: 'Fermer/Annuler',
      action: () => {
        // Close modals or clear search
        const modals = document.querySelectorAll('[role="dialog"]')
        if (modals.length > 0) {
          const closeButton = document.querySelector('[aria-label="Fermer"]') as HTMLButtonElement
          if (closeButton) closeButton.click()
        } else {
          // Clear search if focused
          const searchInput = document.querySelector('input[placeholder*="Rechercher"]') as HTMLInputElement
          if (searchInput && document.activeElement === searchInput) {
            searchInput.value = ''
            searchInput.dispatchEvent(new Event('input', { bubbles: true }))
          }
        }
      },
    },

    // Actions
    {
      key: 'u',
      ctrlKey: true,
      description: 'Uploader un document',
      action: () => {
        const uploadButton = document.querySelector('[data-action="upload"]') as HTMLButtonElement
        if (uploadButton) uploadButton.click()
      },
      condition: () => isSignedIn
    },
    {
      key: 'k',
      ctrlKey: true,
      description: 'Créer une collection',
      action: () => {
        const createCollectionButton = document.querySelector('[data-action="create-collection"]') as HTMLButtonElement
        if (createCollectionButton) createCollectionButton.click()
      },
      condition: () => isSignedIn
    },

    // Theme
    {
      key: 't',
      ctrlKey: true,
      description: 'Changer de thème',
      action: () => {
        const themeToggle = document.querySelector('[data-action="theme-toggle"]') as HTMLButtonElement
        if (themeToggle) themeToggle.click()
      },
    },

    // Help
    {
      key: '?',
      shiftKey: true,
      description: 'Afficher les raccourcis',
      action: () => {
        // We'll implement this modal later
        console.log('Shortcuts help modal')
      },
    },

    // Quick navigation in lists
    {
      key: 'j',
      description: 'Élément suivant',
      action: () => navigateList('down'),
    },
    {
      key: 'k', 
      description: 'Élément précédent',
      action: () => navigateList('up'),
    },
    {
      key: 'Enter',
      description: 'Ouvrir l\'élément sélectionné',
      action: () => {
        const selected = document.querySelector('.keyboard-selected, [data-keyboard-selected="true"]') as HTMLElement
        if (selected) {
          const link = selected.querySelector('a') as HTMLAnchorElement
          if (link) link.click()
        }
      },
    },
  ]

  const navigateList = useCallback((direction: 'up' | 'down') => {
    const items = Array.from(document.querySelectorAll('[data-keyboard-navigable]')) as HTMLElement[]
    if (items.length === 0) return

    let currentIndex = items.findIndex(item => 
      item.classList.contains('keyboard-selected') || 
      item.getAttribute('data-keyboard-selected') === 'true'
    )

    // Remove current selection
    items.forEach(item => {
      item.classList.remove('keyboard-selected')
      item.removeAttribute('data-keyboard-selected')
    })

    // Calculate new index
    if (currentIndex === -1) {
      currentIndex = direction === 'down' ? 0 : items.length - 1
    } else {
      if (direction === 'down') {
        currentIndex = (currentIndex + 1) % items.length
      } else {
        currentIndex = (currentIndex - 1 + items.length) % items.length
      }
    }

    // Add selection to new item
    const newSelected = items[currentIndex]
    newSelected.classList.add('keyboard-selected')
    newSelected.setAttribute('data-keyboard-selected', 'true')
    
    // Scroll into view
    newSelected.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'nearest' 
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as any)?.contentEditable === 'true'
      ) {
        // Allow some shortcuts even in inputs (like Escape)
        if (!['Escape'].includes(event.key)) {
          return
        }
      }

      for (const shortcut of shortcuts) {
        const matches = (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !!event.ctrlKey === !!shortcut.ctrlKey &&
          !!event.altKey === !!shortcut.altKey &&
          !!event.shiftKey === !!shortcut.shiftKey &&
          !!event.metaKey === !!shortcut.metaKey
        )

        if (matches && (!shortcut.condition || shortcut.condition())) {
          event.preventDefault()
          event.stopPropagation()
          shortcut.action()
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])

  return { shortcuts: shortcuts.filter(s => !s.condition || s.condition()) }
}