export interface SubscriptionPlan {
  name: 'free' | 'mid' | 'pro';
  alertLimit: number;
  resultsPerAlert: number;
  emailDigestFrequency: 'daily' | 'hourly' | 'realtime';
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    name: 'free',
    alertLimit: 3,
    resultsPerAlert: 5,
    emailDigestFrequency: 'daily'
  },
  mid: {
    name: 'mid',
    alertLimit: 10,
    resultsPerAlert: 20,
    emailDigestFrequency: 'hourly'
  },
  pro: {
    name: 'pro',
    alertLimit: Infinity,
    resultsPerAlert: 100,
    emailDigestFrequency: 'realtime'
  }
};
