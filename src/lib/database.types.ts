export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          title: string
          type: 'pdf' | 'image' | 'audio' | 'video' | 'other'
          preview_url: string | null
          download_url: string | null
          file_path: string | null
          owner_id: string
          mime_type: string
          size_bytes: number | null
          created_at: string
          updated_at: string
          thumbnail_url: string | null
          tags: string[]
          view_count: number
          download_count: number
          category: string | null
          description: string | null
          document_number: string | null
        }
        Insert: {
          id?: string
          title: string
          type: 'pdf' | 'image' | 'audio' | 'video' | 'other'
          preview_url?: string | null
          download_url?: string | null
          file_path?: string | null
          owner_id: string
          mime_type: string
          size_bytes?: number | null
          created_at?: string
          updated_at?: string
          thumbnail_url?: string | null
          tags?: string[]
          view_count?: number
          download_count?: number
          category?: string | null
          description?: string | null
          document_number?: string | null
        }
        Update: {
          id?: string
          title?: string
          type?: 'pdf' | 'image' | 'audio' | 'video' | 'other'
          preview_url?: string | null
          download_url?: string | null
          file_path?: string | null
          owner_id?: string
          mime_type?: string
          size_bytes?: number | null
          created_at?: string
          updated_at?: string
          thumbnail_url?: string | null
          tags?: string[]
          view_count?: number
          download_count?: number
          category?: string | null
          description?: string | null
          document_number?: string | null
        }
      }
      comments: {
        Row: {
          id: string
          document_id: string
          user_id: string
          user_name: string
          user_avatar: string | null
          content: string
          created_at: string
          updated_at: string | null
          parent_id: string | null
        }
        Insert: {
          id?: string
          document_id: string
          user_id: string
          user_name: string
          user_avatar?: string | null
          content: string
          created_at?: string
          updated_at?: string | null
          parent_id?: string | null
        }
        Update: {
          id?: string
          document_id?: string
          user_id?: string
          user_name?: string
          user_avatar?: string | null
          content?: string
          created_at?: string
          updated_at?: string | null
          parent_id?: string | null
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          document_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          document_id?: string
          created_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      collection_documents: {
        Row: {
          id: string
          collection_id: string
          document_id: string
          added_at: string
        }
        Insert: {
          id?: string
          collection_id: string
          document_id: string
          added_at?: string
        }
        Update: {
          id?: string
          collection_id?: string
          document_id?: string
          added_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_view_count: {
        Args: {
          document_uuid: string
        }
        Returns: void
      }
      increment_download_count: {
        Args: {
          document_uuid: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
