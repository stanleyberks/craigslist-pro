import type { CategoryKey } from './categories';
export type { CategoryKey };
import type { Database } from './database.types';

export interface ApiRateLimitError extends Error {
  status: number;
  isRateLimit: boolean;
}

export interface CraigslistListing {
  description?: string;
  id: string;
  url: string;
  title: string;
  price?: string;
  datetime: string;
  location: string;
  thumbnail?: string;
  pics?: string[];
  category: CategoryKey;
}

export type Alert = Database['public']['Tables']['alerts']['Row'];
export type Match = Database['public']['Tables']['matches']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due';
export type EmailFrequency = 'instant' | 'daily' | 'weekly';

export interface PlanLimits {
  alertLimit: number;
  cityLimit: number;
  resultLimit: number;
  emailDigest: boolean;
  spamFilter: 'basic' | 'advanced';
  updateFrequency: 'hourly' | 'instant';
  refreshInterval: number; // in milliseconds
}

export const PLAN_LIMITS: Record<SubscriptionTier, PlanLimits> = {
  free: {
    alertLimit: 3,
    cityLimit: 2,
    resultLimit: 50,
    emailDigest: false,
    spamFilter: 'basic',
    updateFrequency: 'hourly',
    refreshInterval: 3600000 // 1 hour,
  },
  pro: {
    alertLimit: Infinity,
    cityLimit: 5,
    resultLimit: 100,
    emailDigest: true,
    spamFilter: 'advanced',
    updateFrequency: 'instant',
    refreshInterval: 900000 // 15 minutes
  },
  enterprise: {
    alertLimit: Infinity,
    cityLimit: Infinity,
    resultLimit: 200,
    emailDigest: true,
    spamFilter: 'advanced',
    updateFrequency: 'instant',
    refreshInterval: 300000 // 5 minutes
  },
};

export interface UserQuota {
  alerts: {
    used: number;
    limit: number;
  };
  cities: {
    used: number;
    limit: number;
  };
  results: {
    used: number;
    limit: number;
  };
}
