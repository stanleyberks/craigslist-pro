import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';
import { type Alert, type Match, type UserQuota, type SubscriptionTier, PLAN_LIMITS } from '@/lib/types';

interface CreateAlertInput {
  name: string;
  keywords: string;
  category: string;
  cities: string[];
  min_price?: number;
  max_price?: number;
}

interface UpdateAlertInput extends Partial<CreateAlertInput> {
  last_check_at?: string;
  is_active?: boolean;
  error_count?: number;
}

function checkForSpam(text: string): boolean {
  const spamPatterns = [
    /\b(xxx|porn|sex)\b/i,
    /\b(casino|gambling|bet)\b/i,
    /\b(viagra|cialis)\b/i,
    /\b(\$\d+\/hr|\$\d+\/hour)\b/i,
    /\b(work from home|make money fast)\b/i
  ];
  return spamPatterns.some(pattern => pattern.test(text));
}
import type { CraigslistListing } from '@/lib/types';
import { scrapeListings, processListings } from '@/lib/apify';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function createAlert(userId: string, input: CreateAlertInput) {
  // Check alert quota
  const quota = await getUserQuota(userId);
  if (quota.alerts.used >= quota.alerts.limit) {
    throw new Error('Alert quota exceeded for your plan');
  }

  // Validate input
  if (!input.name || !input.keywords || !input.category || !input.cities?.length) {
    throw new Error('Missing required fields');
  }

  // Check for spam keywords
  if (checkForSpam(input.keywords)) {
    throw new Error('Alert contains blocked keywords');
  }

  const { data: alert, error } = await supabase
    .from('alerts')
    .insert({
      ...input,
      user_id: userId,
      is_active: true,
      error_count: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return alert;
}

export async function updateAlert(alertId: string, userId: string, input: UpdateAlertInput) {
  // Validate ownership
  const { data: existing } = await supabase
    .from('alerts')
    .select()
    .eq('id', alertId)
    .eq('user_id', userId)
    .single();

  if (!existing) {
    throw new Error('Alert not found or access denied');
  }

  // Check for spam if keywords are being updated
  if (input.keywords && checkForSpam(input.keywords)) {
    throw new Error('Alert contains blocked keywords');
  }

  const { data: alert, error } = await supabase
    .from('alerts')
    .update(input)
    .eq('id', alertId)
    .select()
    .single();

  if (error) throw error;
  return alert;
}

export async function deleteAlert(alertId: string, userId: string) {
  const { error } = await supabase
    .from('alerts')
    .delete()
    .eq('id', alertId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function getAlerts(userId: string) {
  const { data: alerts, error } = await supabase
    .from('alerts')
    .select(`
      *,
      matches: matches(count),
      new_matches: matches(count)
    `)
    .eq('user_id', userId)
    .eq('matches.is_new', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return alerts;
}

export async function getAlert(alertId: string, userId: string) {
  const { data: alert, error } = await supabase
    .from('alerts')
    .select(`
      *,
      matches: matches(count),
      new_matches: matches(count)
    `)
    .eq('id', alertId)
    .eq('user_id', userId)
    .eq('matches.is_new', true)
    .single();

  if (error) throw error;
  return alert;
}

export async function refreshAlert(alertId: string, userId: string) {
  // Validate ownership and get alert details
  const { data: alert } = await supabase
    .from('alerts')
    .select('*, user:profiles(plan_tier)')
    .eq('id', alertId)
    .eq('user_id', userId)
    .single();

  if (!alert) {
    throw new Error('Alert not found or access denied');
  }

  // Check refresh rate limit based on plan
  const planTier = (alert.user?.plan_tier || 'free') as keyof typeof PLAN_LIMITS;
  const minInterval = PLAN_LIMITS[planTier].refreshInterval;
  const lastCheck = new Date(alert.last_check_at).getTime();
  const now = Date.now();

  if (now - lastCheck < minInterval * 1000) {
    throw new Error(`Please wait ${minInterval} seconds between refreshes`);
  }

  // Trigger refresh
  const { error } = await supabase.rpc('refresh_alert', {
    p_alert_id: alertId,
  });

  if (error) throw error;
}

export async function toggleAlert(alertId: string, userId: string, isActive: boolean) {
  const { data: alert, error } = await supabase
    .from('alerts')
    .update({ is_active: isActive })
    .eq('id', alertId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return alert;
}

export async function getUserAlerts(userId: string): Promise<Alert[]> {
  const { data, error } = await supabase
    .from('alerts')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAlertMatches(alertId: string): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select()
    .eq('alert_id', alertId)
    .order('datetime', { ascending: false });

  if (error) throw error;
  return data;
}

export async function refreshAlertResults(alertId: string): Promise<void> {
  // Get the alert
  const alert = await getAlert(alertId, '');

  // Scrape new listings
  const listings: CraigslistListing[] = await scrapeListings({
    keywords: alert.keywords.split(' '),
    cities: alert.cities,
    category: alert.category,
    minPrice: alert.min_price ?? undefined,
    maxPrice: alert.max_price ?? undefined,
  });


  // Process listings (filter spam, deduplicate)
  // Get user's profile to determine spam filter level
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', alert.user_id)
    .single();

  const tier = profile?.subscription_tier as SubscriptionTier;
  const processedListings: CraigslistListing[] = await processListings(
    listings,
    alert.user_id,
    PLAN_LIMITS[tier]?.spamFilter === 'advanced'
  );

  // Get user's quota
  const quota = await getUserQuota(alert.user_id);

  // Limit results based on user's plan
  const limitedListings = processedListings.slice(0, quota.results.limit);

  // Insert new matches
  const { error } = await supabase.from('matches').insert(
    limitedListings.map((listing: CraigslistListing) => ({
      alert_id: alertId,
      craigslist_id: listing.id,
      url: listing.url,
      title: listing.title,
      datetime: listing.datetime,
      location: listing.location,
      category: listing.category,
      price: listing.price,
      thumbnail: listing.thumbnail,
      pics: listing.pics,
    }))
  );

  if (error) throw error;

  // Update alert's last check time
  await updateAlert(alertId, '', {
    last_check_at: new Date().toISOString(),
  });
}

export async function getUserQuota(userId: string): Promise<UserQuota> {
  // Get user's profile to determine their plan
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select()
    .eq('id', userId)
    .single();

  if (profileError) throw profileError;

  // Get plan limits
  const tier = profile.subscription_tier as keyof typeof PLAN_LIMITS;
  const planLimits = PLAN_LIMITS[tier];

  // Get current alert count
  const { count: alertCount, error: alertError } = await supabase
    .from('alerts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (alertError) throw alertError;

  // Get city usage (across all alerts)
  const { data: alerts, error: citiesError } = await supabase
    .from('alerts')
    .select('cities')
    .eq('user_id', userId);

  if (citiesError) throw citiesError;

  const uniqueCities = new Set(alerts?.flatMap(a => a.cities) || []);

  return {
    alerts: {
      used: alertCount || 0,
      limit: planLimits.alertLimit,
    },
    cities: {
      used: uniqueCities.size,
      limit: planLimits.cityLimit,
    },
    results: {
      used: 0, // This is per alert, not global
      limit: planLimits.resultLimit,
    },
  };
}

export async function markMatchesAsSeen(alertId: string): Promise<void> {
  const { error } = await supabase
    .from('matches')
    .update({ viewed_at: new Date().toISOString() })
    .eq('alert_id', alertId)
    .is('viewed_at', null);

  if (error) throw error;
}
