export const plans = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      '3 Basic Alerts',
      '30-minute refresh rate',
      'Email notifications',
      'Basic filters',
      '7-day history',
    ],
    limits: {
      alerts_count: 3,
      refresh_rate: 30 * 60, // 30 minutes in seconds
      results_per_alert: 50,
      history_days: 7,
    }
  },
  starter: {
    name: 'Starter',
    price: 4.99,
    features: [
      '5 Smart Alerts',
      '15-minute refresh rate',
      'Email + SMS notifications',
      'Advanced filters',
      'Keyword exclusions',
      '14-day history',
      'Basic analytics',
    ],
    limits: {
      alerts_count: 5,
      refresh_rate: 15 * 60, // 15 minutes in seconds
      results_per_alert: 100,
      history_days: 14,
    }
  },
  pro: {
    name: 'Pro',
    price: 9.99,
    features: [
      '15 Smart Alerts',
      '5-minute refresh rate',
      'All notification channels',
      'AI-powered matching',
      'Price analysis',
      'Market insights',
      '30-day history',
      'Bulk actions',
    ],
    limits: {
      alerts_count: 15,
      refresh_rate: 5 * 60, // 5 minutes in seconds
      results_per_alert: 200,
      history_days: 30,
    }
  },
  business: {
    name: 'Business',
    price: 24.99,
    features: [
      'Unlimited Smart Alerts',
      '1-minute refresh rate',
      'Priority notifications',
      'API access',
      'Custom integrations',
      'Dedicated support',
      '90-day history',
      'White-label options',
    ],
    limits: {
      alerts_count: -1, // unlimited
      refresh_rate: 60, // 1 minute in seconds
      results_per_alert: 500,
      history_days: 90,
    }
  }
} as const;

export type PlanType = keyof typeof plans;

export interface SubscriptionLimits {
  alerts_count: number;
  refresh_rate: number;
  results_per_alert: number;
  history_days: number;
}

export function getPlanLimits(planType: PlanType): SubscriptionLimits {
  return plans[planType].limits;
}

export function isWithinLimits(
  current: number,
  limit: number,
  unlimited: boolean = false
): boolean {
  if (unlimited || limit === -1) return true;
  return current < limit;
}
