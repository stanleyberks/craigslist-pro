export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PlanType = 'free' | 'mid' | 'pro'
export type EmailFrequency = 'never' | 'daily' | 'weekly' | 'monthly'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_name: PlanType
          alert_limit: number
          results_per_alert: number
          email_digest_frequency: EmailFrequency
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_name?: PlanType
          alert_limit: number
          results_per_alert: number
          email_digest_frequency?: EmailFrequency
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_name?: PlanType
          alert_limit?: number
          results_per_alert?: number
          email_digest_frequency?: EmailFrequency
          created_at?: string
          updated_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          user_id: string
          name: string
          keywords: string
          cities: Json
          category: string
          is_active: boolean
          created_at: string
          updated_at: string
          last_check_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          keywords: string
          cities: Json
          category: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_check_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          keywords?: string
          cities?: Json
          category?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_check_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          alert_id: string
          listing_data: Json
          is_new: boolean
          created_at: string
        }
        Insert: {
          id?: string
          alert_id: string
          listing_data: Json
          is_new?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          alert_id?: string
          listing_data?: Json
          is_new?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      plan_type: PlanType
      email_frequency: EmailFrequency
    }
  }
}
