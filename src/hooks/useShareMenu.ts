import { useState, useEffect, useRef, useCallback } from 'react'

export function useShareMenu() {
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareRef = useRef<HTMLDivElement | null>(null)

  const closeMenu = useCallback(() => setShowShare(false), [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!showShare) return
      const target = event.target as Node
      if (shareRef.current && !shareRef.current.contains(target)) {
        closeMenu()
      }
    }

    function handleScroll() {
      if (showShare) closeMenu()
    }

    function handleKey(event: KeyboardEvent) {
      if (showShare && event.key === 'Escape') closeMenu()
    }

    if (showShare) {
      document.addEventListener('mousedown', handleClickOutside, { passive: true })
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('keydown', handleKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside as any)
      window.removeEventListener('scroll', handleScroll as any)
      window.removeEventListener('keydown', handleKey as any)
    }
  }, [showShare, closeMenu])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }, [])

  return {
    showShare,
    setShowShare,
    copied,
    shareRef,
    closeMenu,
    copyToClipboard
  }
}