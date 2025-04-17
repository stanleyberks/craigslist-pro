import { createClient } from '@/lib/supabase/server';
import { scrapeListings, processListings } from '@/lib/apify';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BATCH_SIZE = 5; // Process alerts in batches
const BATCH_DELAY_MS = 2000; // Delay between batches to avoid rate limits

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
  try {
    const supabase = createClient();

    // Get all active alerts that haven't been checked in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: alerts, error: alertsError } = await supabase
      .from('alerts')
      .select('*')
      .eq('is_active', true)
      .lt('last_check_at', oneHourAgo)
      .order('last_check_at', { ascending: true });

    if (alertsError) {
      console.error('Error fetching alerts:', alertsError);
      return NextResponse.json(
        { error: 'Failed to fetch alerts' },
        { status: 500 }
      );
    }

    if (!alerts || alerts.length === 0) {
      return NextResponse.json({ success: true, message: 'No alerts to process' });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Process alerts in batches
    for (let i = 0; i < alerts.length; i += BATCH_SIZE) {
      const batch = alerts.slice(i, i + BATCH_SIZE);
      
      // Process batch concurrently
      const batchResults = await Promise.allSettled(
        batch.map(async (alert) => {
          try {
            // Get listings for each alert
            const listings = await scrapeListings(
              alert.cities,
              alert.category
            );

            // Process and store the listings
            await processListings(listings, alert.user_id, alert.use_advanced_filter || false);

            // Update last check time
            await supabase
              .from('alerts')
              .update({ 
                last_check_at: new Date().toISOString(),
                error_count: 0, // Reset error count on success
                last_error: null
              })
              .eq('id', alert.id);

            return { success: true, alertId: alert.id };
          } catch (error) {
            // Update error information
            await supabase
              .from('alerts')
              .update({ 
                last_check_at: new Date().toISOString(),
                error_count: alert.error_count ? alert.error_count + 1 : 1,
                last_error: error instanceof Error ? error.message : 'Unknown error'
              })
              .eq('id', alert.id);

            throw error;
          }
        })
      );

      // Process batch results
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          results.success++;
        } else {
          results.failed++;
          results.errors.push(result.reason?.message || 'Unknown error');
        }
      });

      // Wait before processing next batch
      if (i + BATCH_SIZE < alerts.length) {
        await sleep(BATCH_DELAY_MS);
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.success + results.failed,
      successful: results.success,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
