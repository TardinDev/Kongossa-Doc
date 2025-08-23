import { create } from 'zustand'
import type { AppUser } from '../lib/types'

interface AuthState {
  user: AppUser | null
  setUser: (user: AppUser | null) => void
  signOutLocal: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  signOutLocal: () => set({ user: null }),
}))

