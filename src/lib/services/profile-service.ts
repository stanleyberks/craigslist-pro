import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';
import type {
  Profile,
  SubscriptionTier,
  SubscriptionStatus,
  EmailFrequency,
} from '@/lib/types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(
  userId: string,
  profile: Partial<Profile>
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSubscription(
  userId: string,
  tier: SubscriptionTier,
  status: SubscriptionStatus,
  endDate?: string
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      subscription_tier: tier,
      subscription_status: status,
      subscription_end_date: endDate,
      // Update limits based on the new tier
      alert_limit: tier === 'free' ? 3 : tier === 'pro' ? 999999 : 999999,
      city_limit: tier === 'free' ? 2 : tier === 'pro' ? 10 : 999999,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEmailPreferences(
  userId: string,
  notifications: boolean,
  frequency?: EmailFrequency
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      email_notifications: notifications,
      email_frequency: notifications ? frequency : null,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAccount(userId: string): Promise<void> {
  // First, delete all user data
  const { error: alertsError } = await supabase
    .from('alerts')
    .delete()
    .eq('user_id', userId);

  if (alertsError) throw alertsError;

  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (profileError) throw profileError;

  // Finally, delete the user auth record
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);

  if (authError) throw authError;
}

// Hook up to Stripe webhook
export async function handleSubscriptionUpdated(
  userId: string,
  stripeSubscription: any
): Promise<void> {
  const tier: SubscriptionTier =
    stripeSubscription.plan.nickname === 'Enterprise Plan'
      ? 'enterprise'
      : stripeSubscription.plan.nickname === 'Pro Plan'
      ? 'pro'
      : 'free';

  const status: SubscriptionStatus =
    stripeSubscription.status === 'active'
      ? 'active'
      : stripeSubscription.status === 'past_due'
      ? 'past_due'
      : 'canceled';

  await updateSubscription(
    userId,
    tier,
    status,
    new Date(stripeSubscription.current_period_end * 1000).toISOString()
  );
}

// Create initial profile for new users
export async function createInitialProfile(
  userId: string,
  email: string
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email,
      subscription_tier: 'free',
      subscription_status: 'active',
      alert_limit: 3,
      city_limit: 2,
      email_notifications: true,
      email_frequency: 'daily',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
