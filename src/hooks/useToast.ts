import { useState, useCallback } from 'react'
import type { Toast } from '../components/Toast'

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const toast = {
    success: useCallback((title: string, description?: string) => 
      addToast({ type: 'success', title, description }), [addToast]),
    error: useCallback((title: string, description?: string) => 
      addToast({ type: 'error', title, description }), [addToast]),
    warning: useCallback((title: string, description?: string) => 
      addToast({ type: 'warning', title, description }), [addToast]),
    info: useCallback((title: string, description?: string) => 
      addToast({ type: 'info', title, description }), [addToast]),
  }

  return {
    toasts,
    toast,
    removeToast,
  }
}