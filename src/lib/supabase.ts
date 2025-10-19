import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. API calls will fail.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Helper function to get authenticated user from Clerk
export async function setSupabaseAuth(clerkToken: string) {
  // Set the Supabase auth token from Clerk
  // This allows Supabase RLS to work with Clerk authentication
  await supabase.auth.setSession({
    access_token: clerkToken,
    refresh_token: clerkToken
  })
}
