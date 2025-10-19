// @ts-nocheck
// Re-export database types for convenience
export type { Database } from '../lib/database.types'

// Helper types for working with Supabase tables
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type DbDocument = Tables<'documents'>
export type DbComment = Tables<'comments'>
export type DbFavorite = Tables<'favorites'>
export type DbCollection = Tables<'collections'>
export type DbCollectionDocument = Tables<'collection_documents'>
export type DbUserProfile = Tables<'user_profiles'>

// Insert types
export type InsertDocument = Inserts<'documents'>
export type InsertComment = Inserts<'comments'>
export type InsertFavorite = Inserts<'favorites'>
export type InsertCollection = Inserts<'collections'>

// Update types
export type UpdateDocument = Updates<'documents'>
export type UpdateComment = Updates<'comments'>
export type UpdateCollection = Updates<'collections'>
