import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { supabase } from '../lib/supabase'

/**
 * Hook to synchronize Clerk authentication with Supabase
 * This enables Supabase Row Level Security to work with Clerk users
 */
export function useSupabaseAuth() {
  const { getToken, userId } = useAuth()

  useEffect(() => {
    const syncAuth = async () => {
      if (!userId) {
        // User is signed out, clear Supabase session
        await supabase.auth.signOut()
        return
      }

      try {
        // Get JWT token from Clerk
        // Note: You need to create a JWT template in Clerk Dashboard
        // Template should include: { "sub": "{{user.id}}" }
        const token = await getToken({ template: 'supabase' })

        if (token) {
          // Set Supabase session with Clerk token
          await supabase.auth.setSession({
            access_token: token,
            refresh_token: token
          })
        }
      } catch (error) {
        console.error('Error syncing auth with Supabase:', error)
      }
    }

    syncAuth()
  }, [getToken, userId])

  return { userId }
}
