import { supabase, PlanTier, PLAN_LIMITS } from '../supabase';

interface SubscriptionQuota {
  alerts: {
    used: number;
    limit: number;
  };
  resultsPerAlert: number;
  refreshInterval: number;
  emailDigest: 'daily' | 'instant' | 'weekly';
}

export async function activateSubscription(userId: string, planTier: PlanTier, licenseKey?: string) {
  // Validate license key if provided
  if (licenseKey) {
    const { data: license, error: licenseError } = await supabase
      .from('license_keys')
      .select()
      .eq('key', licenseKey)
      .eq('is_used', false)
      .single();

    if (licenseError || !license) {
      throw new Error('Invalid or already used license key');
    }

    // Mark license key as used
    await supabase
      .from('license_keys')
      .update({ 
        is_used: true,
        used_by: userId,
        used_at: new Date().toISOString()
      })
      .eq('id', license.id);
  }

  // Update user's subscription
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      plan_tier: planTier,
      started_at: new Date().toISOString(),
      // Set expiry for non-free plans
      expires_at: planTier === 'free' 
        ? null 
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    });

  if (error) throw error;

  // Update user's profile
  await supabase
    .from('profiles')
    .update({ plan_tier: planTier })
    .eq('id', userId);

  // Create audit log
  await supabase.rpc('create_audit_log', {
    p_user_id: userId,
    p_action: 'subscription_activated',
    p_details: { plan_tier: planTier, license_key: licenseKey },
  });
}

export async function cancelSubscription(userId: string) {
  // Update subscription status
  const { error } = await supabase
    .from('subscriptions')
    .update({ 
      cancelled_at: new Date().toISOString(),
      // Set to expire at the end of the current period
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
    .eq('user_id', userId)
    .is('cancelled_at', null);

  if (error) throw error;

  // Create audit log
  await supabase.rpc('create_audit_log', {
    p_user_id: userId,
    p_action: 'subscription_cancelled',
    p_details: {},
  });
}

export async function getSubscriptionQuota(userId: string): Promise<SubscriptionQuota> {
  // Get user's current plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan_tier')
    .eq('id', userId)
    .single();

  const planTier = (profile?.plan_tier || 'free') as PlanTier;
  const planLimits = PLAN_LIMITS[planTier];

  // Get current alert count
  const { count } = await supabase
    .from('alerts')
    .select('*', { count: 'exact' })
    .eq('user_id', userId);

  return {
    alerts: {
      used: count || 0,
      limit: planLimits.alerts,
    },
    resultsPerAlert: planLimits.resultsPerAlert,
    refreshInterval: planLimits.refreshInterval,
    emailDigest: planLimits.emailDigest,
  };
}

export async function checkSubscriptionStatus(userId: string) {
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!subscription) {
    return { isActive: false, expiresAt: null };
  }

  const now = new Date();
  const expiresAt = subscription.expires_at ? new Date(subscription.expires_at) : null;
  const isActive = expiresAt ? now < expiresAt : true;

  // If expired, downgrade to free plan
  if (!isActive && subscription.plan_tier !== 'free') {
    await supabase
      .from('profiles')
      .update({ plan_tier: 'free' })
      .eq('id', userId);

    // Create audit log
    await supabase.rpc('create_audit_log', {
      p_user_id: userId,
      p_action: 'subscription_expired',
      p_details: { previous_plan: subscription.plan_tier },
    });
  }

  return { isActive, expiresAt };
}

export async function upgradeSubscription(userId: string, newPlanTier: PlanTier) {
  const { data: currentSub } = await supabase
    .from('subscriptions')
    .select('plan_tier')
    .eq('user_id', userId)
    .single();

  if (currentSub?.plan_tier === newPlanTier) {
    throw new Error('Already subscribed to this plan');
  }

  // Implement Stripe payment logic here
  // For now, we'll just update the subscription
  await activateSubscription(userId, newPlanTier);
}

export async function getSubscriptionHistory(userId: string) {
  const { data: history, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .like('action', 'subscription_%')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return history;
}
