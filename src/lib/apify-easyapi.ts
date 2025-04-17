import { CategoryKey, getCategoryCode } from './categories.js';
import type { ApiRateLimitError } from './types.js';

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_ACTOR_ID = 'easyapi~craigslist-search-results-scraper';

interface EasyApiInput {
  searchUrls: string[];
  maxItems?: number;
  proxyConfiguration?: {
    useApifyProxy?: boolean;
  };
}

interface EasyApiListing {
  postId: string;
  title: string;
  postUrl: string;
  description?: string;
  postedTime: string;
  location: string;
  thumbnailUrl?: string;
  imageUrls?: string[];
  timestamp: string;
  searchUrl: string;
}

export interface CraigslistListing {
  id: string;
  url: string;
  title: string;
  price?: string;
  datetime: string;
  location: string;
  thumbnail?: string;
  category: CategoryKey;
}

interface ScrapeOptions {
  keywords?: string[];
  maxListings?: number;
}

export async function scrapeListingsWithImages(
  cities: string[],
  category: CategoryKey,
  options: ScrapeOptions = {},
  retryCount = 0
): Promise<CraigslistListing[]> {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 5000; // 5 seconds

  try {
    if (!cities || cities.length === 0) {
      throw new Error('No cities provided');
    }

    const categoryCode = getCategoryCode(category);

    // Generate search URLs for each city
    const searchUrls = cities.filter(city => typeof city === 'string').map(city => 
      `https://${city}.craigslist.org/search/${categoryCode}${options.keywords?.length ? `?query=${encodeURIComponent(options.keywords.join(' '))}` : ''}`
    );

    // Prepare input for the Apify actor
    const input: EasyApiInput = {
      searchUrls,
      maxItems: options.maxListings || 100,
      proxyConfiguration: {
        useApifyProxy: true
      }
    };

    // Call the Apify actor synchronously
    const response = await fetch(
      `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync?token=${APIFY_API_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      }
    );

    if (!response.ok) {
      const errorMessage = response.statusText;
      if (response.status === 402) {
        const error = new Error('API rate limit exceeded. Please upgrade your Apify plan or try again later.') as ApiRateLimitError;
        error.status = response.status;
        error.isRateLimit = true;
        throw error;
      } else if (response.status === 401) {
        const error = new Error('Invalid or missing API token. Please check your authentication credentials.') as ApiRateLimitError;
        error.status = response.status;
        error.isRateLimit = false;
        throw error;
      } else {
        const error = new Error(`Apify API error: ${errorMessage}`) as ApiRateLimitError;
        error.status = response.status;
        error.isRateLimit = false;
        throw error;
      }
    }

    const data = await response.json();

    // Validate response data
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: expected an array');
    }

    // Filter out invalid listings
    const validListings = data
      .filter((listing: any): listing is EasyApiListing => (
        typeof listing.postId === 'string' &&
        typeof listing.title === 'string' &&
        typeof listing.postUrl === 'string' &&
        typeof listing.description === 'string' &&
        typeof listing.postedTime === 'string' &&
        typeof listing.location === 'string' &&
        typeof listing.thumbnailUrl === 'string'
      ))
      .map(listing => ({
        id: listing.postId,
        url: listing.postUrl,
        title: listing.title,
        description: listing.description,
        datetime: listing.postedTime,
        location: listing.location,
        thumbnail: listing.thumbnailUrl,
        category,
        pics: listing.imageUrls || []
      }));

    return validListings;
  } catch (error: any) {
    console.error('Error scraping listings:', error);
    throw error;
  }
}
