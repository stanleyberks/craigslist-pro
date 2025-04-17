import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export type PlanTier = 'free' | 'basic' | 'pro' | 'enterprise';

export const PLAN_LIMITS: Record<PlanTier, {
  alerts: number;
  resultsPerAlert: number;
  refreshInterval: number; // in minutes
  emailDigest: 'daily' | 'instant' | 'weekly';
}> = {
  free: {
    alerts: 3,
    resultsPerAlert: 10,
    refreshInterval: 1440, // once per day
    emailDigest: 'daily',
  },
  basic: {
    alerts: 10,
    resultsPerAlert: 25,
    refreshInterval: 360, // every 6 hours
    emailDigest: 'daily',
  },
  pro: {
    alerts: 50,
    resultsPerAlert: 100,
    refreshInterval: 60, // hourly
    emailDigest: 'instant',
  },
  enterprise: {
    alerts: 200,
    resultsPerAlert: 250,
    refreshInterval: 15, // every 15 minutes
    emailDigest: 'instant',
  },
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];

export type Profile = Tables['profiles']['Row'];
export type Subscription = Tables['subscriptions']['Row'];
export type Alert = Tables['alerts']['Row'];
export type Match = Tables['matches']['Row'];
