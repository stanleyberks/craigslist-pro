import Stripe from 'stripe';
import { plans, type PlanType } from '@/config/pricing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

const STRIPE_PRODUCTS = {
  starter: process.env.STRIPE_STARTER_PRODUCT_ID!,
  pro: process.env.STRIPE_PRO_PRODUCT_ID!,
  business: process.env.STRIPE_BUSINESS_PRODUCT_ID!,
} as const;

const STRIPE_PRICES = {
  starter: {
    monthly: process.env.STRIPE_STARTER_PRICE_MONTHLY!,
    yearly: process.env.STRIPE_STARTER_PRICE_YEARLY!,
  },
  pro: {
    monthly: process.env.STRIPE_PRO_PRICE_MONTHLY!,
    yearly: process.env.STRIPE_PRO_PRICE_YEARLY!,
  },
  business: {
    monthly: process.env.STRIPE_BUSINESS_PRICE_MONTHLY!,
    yearly: process.env.STRIPE_BUSINESS_PRICE_YEARLY!,
  },
} as const;

export async function createStripeCustomer(email: string, name: string) {
  return stripe.customers.create({
    email,
    name,
    metadata: {
      source: 'craigslist_alert_pro',
    },
  });
}

export async function createStripeSubscription(
  customerId: string,
  planType: PlanType,
  billingPeriod: 'monthly' | 'yearly' = 'monthly'
) {
  if (planType === 'free') {
    throw new Error('Cannot create Stripe subscription for free plan');
  }

  const priceId = STRIPE_PRICES[planType][billingPeriod];

  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
    metadata: {
      plan_type: planType,
      billing_period: billingPeriod,
    },
  });
}

export async function updateStripeSubscription(
  subscriptionId: string,
  planType: PlanType,
  billingPeriod: 'monthly' | 'yearly' = 'monthly'
) {
  if (planType === 'free') {
    return stripe.subscriptions.cancel(subscriptionId);
  }

  const priceId = STRIPE_PRICES[planType][billingPeriod];

  return stripe.subscriptions.update(subscriptionId, {
    items: [{ price: priceId }],
    metadata: {
      plan_type: planType,
      billing_period: billingPeriod,
    },
  });
}

export async function cancelStripeSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId);
}

export async function getStripeSubscription(subscriptionId: string) {
  const response = await stripe.subscriptions.retrieve(subscriptionId);
  const subscription = response as unknown as Stripe.Subscription & {
    current_period_end: number;
  };
  return subscription;
}

// Sync subscription data with our database
export async function syncSubscriptionWithDatabase(
  stripeSubscription: Stripe.Subscription & {
    current_period_end: number;
  },
  userId: string,
  supabaseClient: any
) {
  const { plan_type, billing_period } = stripeSubscription.metadata;
  
  const subscriptionData = {
    user_id: userId,
    plan_tier: plan_type as PlanType,
    stripe_subscription_id: stripeSubscription.id,
    stripe_customer_id: stripeSubscription.customer as string,
    price: plans[plan_type as PlanType].price,
    currency: 'USD',
    billing_period,
    started_at: new Date(stripeSubscription.start_date * 1000).toISOString(),
    expires_at: stripeSubscription.cancel_at 
      ? new Date(stripeSubscription.cancel_at * 1000).toISOString()
      : null,
    cancelled_at: stripeSubscription.canceled_at
      ? new Date(stripeSubscription.canceled_at * 1000).toISOString()
      : null,
    next_billing_date: stripeSubscription.current_period_end
      ? new Date(stripeSubscription.current_period_end * 1000).toISOString()
      : null,
  };

  const { error } = await supabaseClient
    .from('subscriptions')
    .upsert(subscriptionData, {
      onConflict: 'stripe_subscription_id',
    });

  if (error) {
    throw new Error(`Failed to sync subscription: ${error.message}`);
  }
}
