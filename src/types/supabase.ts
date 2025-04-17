export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      alerts: {
        Row: {
          id: string
          user_id: string
          name: string
          keywords: string
          cities: string[]
          category: string
          is_active: boolean
          created_at: string
          updated_at: string
          last_check_at: string
          error_count: number
          last_error: string | null
        }
        Insert: Omit<
          Database['public']['Tables']['alerts']['Row'],
          'id' | 'created_at' | 'updated_at' | 'last_check_at' | 'error_count' | 'last_error'
        >
        Update: Partial<Database['public']['Tables']['alerts']['Row']>
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          full_name: string
          plan_tier: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['profiles']['Row'],
          'id' | 'created_at' | 'updated_at'
        >
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_tier: string
          started_at: string
          expires_at: string | null
          cancelled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['subscriptions']['Row'],
          'id' | 'created_at' | 'updated_at'
        >
        Update: Partial<Database['public']['Tables']['subscriptions']['Row']>
      }
      matches: {
        Row: {
          id: string
          alert_id: string
          title: string
          url: string
          price: number | null
          location: string
          posted_at: string
          viewed_at: string | null
          manufacturer: string | null
          condition: string | null
          model: string | null
          attributes: string[] | null
          compensation: string | null
          employment_type: string | null
          job_title: string | null
          education: string | null
          dates: string | null
          created_at: string
          updated_at: string
          is_read: boolean
          is_favorite: boolean
          is_hidden: boolean
          notes: string | null
        }
        Insert: Omit<
          Database['public']['Tables']['matches']['Row'],
          'id' | 'created_at' | 'updated_at' | 'is_read' | 'is_favorite' | 'is_hidden' | 'notes'
        >
        Update: Partial<Database['public']['Tables']['matches']['Row']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
