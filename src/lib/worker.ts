import { createClient } from '@supabase/supabase-js';
import { scrapeListings, processListings } from './apify';
import type { CategoryKey } from './categories';
import type { Database } from '@/lib/database.types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

interface Alert {
  id: string;
  user_id: string;
  name: string;
  keywords: string;
  cities: string[];
  category: CategoryKey;
  minPrice?: number;
  maxPrice?: number;
  is_active: boolean;
  last_check_at: string | null;
  error_count: number;
  last_error: string | null;
}

async function updateAlertStatus(
  alertId: string,
  status: {
    last_check_at?: string;
    error_count?: number;
    last_error?: string | null;
  }
) {
  const { error } = await supabase
    .from('alerts')
    .update(status)
    .eq('id', alertId);

  if (error) {
    console.error(`Failed to update alert ${alertId}:`, error);
  }
}

async function processAlert(alert: Alert) {
  try {
    // Split keywords by spaces or commas and filter out empty strings
    const keywords = alert.keywords
      .split(/[\s,]+/)
      .filter(k => k.length > 0);

    // Scrape listings for this alert
    const listings = await scrapeListings({
      cities: alert.cities,
      category: alert.category,
      keywords,
      maxListings: 100
    });

    // Process and store the listings
    await processListings(listings, alert.user_id, true);

    // Update alert status
    await updateAlertStatus(alert.id, {
      last_check_at: new Date().toISOString(),
      error_count: 0,
      last_error: null
    });

  } catch (error) {
    console.error(`Error processing alert ${alert.id}:`, error);
    
    // Update alert with error information
    await updateAlertStatus(alert.id, {
      last_check_at: new Date().toISOString(),
      error_count: (alert.error_count || 0) + 1,
      last_error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function processAllAlerts() {
  const { data: alerts, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('is_active', true)
    .order('last_check_at', { ascending: true, nullsFirst: true });

  if (error) {
    console.error('Failed to fetch alerts:', error);
    return;
  }

  // Process alerts sequentially to avoid rate limits
  for (const alert of alerts) {
    await processAlert(alert);
    // Add a small delay between alerts
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
