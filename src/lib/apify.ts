import type { CategoryKey } from './categories';
import type { CraigslistListing } from './types';
import { SupabaseClient } from '@supabase/supabase-js';
import { getCategoryCode } from './categories';

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_ACTOR_ID = 'ivanvs~craigslist-scraper';

interface ApifyInput {
  maxConcurrency: number;
  paginationEnabled: boolean;
  proxyConfiguration: {
    useApifyProxy: boolean;
  };
  urls: {
    url: string;
  }[];
}

interface ApifyResponse {
  id: string;
  url: string;
  title: string;
  datetime: string;
  location: string;
  category: CategoryKey;
  price?: string;
  longitude?: string;
  latitude?: string;
  mapAccuracy?: string;
  post?: string;
  notices?: string[];
  phoneNumbers?: string[];
  pics?: string[];
  amenities?: string[];
  availableFrom?: string;
  manufacturer?: string;
  condition?: string;
  model?: string;
  attributes?: string[];
  compensation?: string;
  employmentType?: string;
  jobTitle?: string;
  education?: string;
  dates?: string;
}

export interface ScrapeOptions {
  keywords?: string[];
  cities: string[];
  category: CategoryKey;
  minPrice?: number;
  maxPrice?: number;
  maxListings?: number;
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function scrapeListings(
  options: ScrapeOptions,
  retryCount = 0
): Promise<CraigslistListing[]> {
  if (!Array.isArray(options.cities) || options.cities.length === 0) {
    throw new Error('No cities provided');
  }

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 5000; // 5 seconds

  if (!APIFY_API_TOKEN) {
    throw new Error('APIFY_API_TOKEN is required');
  }

  try {
    const categoryCode = getCategoryCode(options.category);

    const urls = options.cities.map(city => ({
      url: `https://${city}.craigslist.org/search/${categoryCode}${options.keywords ? `?query=${encodeURIComponent(options.keywords.join(' '))}` : ''}${options.minPrice ? `&min_price=${options.minPrice}` : ''}${options.maxPrice ? `&max_price=${options.maxPrice}` : ''}`
    }));

    const maxConcurrency = 2; // Increased for better performance while staying within limits
    const maxResults = options.maxListings || Infinity;

    const input: ApifyInput = {
      maxConcurrency,
      paginationEnabled: true,
      proxyConfiguration: {
        useApifyProxy: true
      },
      urls
    };

    const response = await fetch(
      `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Apify API error: ${response.statusText}. Details: ${errorText}`);
    }

    const data = await response.json();
    
    // Validate response data
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: expected an array');
    }

    // Filter out invalid listings
    const validListings = data
      .filter((listing: any): listing is CraigslistListing => (
        typeof listing.id === 'string' &&
        typeof listing.url === 'string' &&
        typeof listing.title === 'string' &&
        typeof listing.datetime === 'string' &&
        typeof listing.location === 'string'
      ));

    return validListings.slice(0, maxResults).map(listing => ({
      ...listing,
      category: options.category
    }));
  } catch (error) {
    if (error instanceof Error) {
      if (retryCount < MAX_RETRIES && 
          (error.message.includes('rate limit') || 
           error.message.includes('429') || 
           error.message.includes('timeout'))) {
        console.log(`Attempt ${retryCount + 1}/${MAX_RETRIES} failed. Retrying in ${RETRY_DELAY/1000} seconds...`);
        await delay(RETRY_DELAY);
        return scrapeListings(options, retryCount + 1);
      }

      // Add context to the error
      error.message = `Scraping failed for ${options.cities.join(', ')} - ${options.category}: ${error.message}`;
    }
    throw error;
  }
}

export async function processListings(
  listings: CraigslistListing[],
  userId: string,
  useAdvancedFilter: boolean
): Promise<CraigslistListing[]> {
  // Apply spam filtering
  const filteredListings = useAdvancedFilter
    ? listings.filter(listing => {
        // Advanced spam detection logic
        const isSpam =
          // Check for keyword stuffing
          listing.title.split(' ').length > 20 ||
          // Check for excessive capitalization
          (listing.title.match(/[A-Z]/g)?.length || 0) > listing.title.length * 0.5 ||
          // Check for price manipulation
          listing.title.match(/\$+/) ||
          // Check for suspicious patterns
          listing.title.match(/\d{10}/) ||
          listing.title.match(/bit\.ly/) ||
          listing.title.match(/goo\.gl/);
        return !isSpam;
      })
    : listings;

  // Deduplicate listings
  const seen = new Set<string>();
  const uniqueListings = filteredListings.filter(listing => {
    const key = `${listing.title}-${listing.price}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return uniqueListings;

}
