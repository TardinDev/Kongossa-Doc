import { useEffect, useCallback, RefObject } from 'react'

interface UseKeyboardNavigationProps {
  isOpen: boolean
  onClose: () => void
  containerRef?: RefObject<HTMLElement>
  autoFocus?: boolean
}

export function useKeyboardNavigation({ 
  isOpen, 
  onClose, 
  containerRef,
  autoFocus = true 
}: UseKeyboardNavigationProps) {
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return

    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        onClose()
        break
      
      case 'Tab':
        if (containerRef?.current) {
          const focusableElements = containerRef.current.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
          
          if (focusableElements.length === 0) return
          
          const firstElement = focusableElements[0] as HTMLElement
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
          
          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault()
              lastElement.focus()
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault()
              firstElement.focus()
            }
          }
        }
        break
      
      case 'ArrowDown':
      case 'ArrowUp':
        if (containerRef?.current) {
          event.preventDefault()
          const focusableElements = Array.from(
            containerRef.current.querySelectorAll('button:not([disabled]), [role="menuitem"]')
          ) as HTMLElement[]
          
          if (focusableElements.length === 0) return
          
          const currentIndex = focusableElements.findIndex(el => el === document.activeElement)
          const nextIndex = event.key === 'ArrowDown' 
            ? (currentIndex + 1) % focusableElements.length
            : (currentIndex - 1 + focusableElements.length) % focusableElements.length
          
          focusableElements[nextIndex].focus()
        }
        break
    }
  }, [isOpen, onClose, containerRef])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      
      if (autoFocus && containerRef?.current) {
        const firstFocusable = containerRef.current.querySelector(
          'button:not([disabled]), [href], input:not([disabled])'
        ) as HTMLElement
        
        if (firstFocusable) {
          setTimeout(() => firstFocusable.focus(), 0)
        }
      }
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown, autoFocus, containerRef])
}