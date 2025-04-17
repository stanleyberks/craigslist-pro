import { getCategoryCode } from './categories.js';
const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_ACTOR_ID = 'ivanvs~craigslist-scraper';
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export async function scrapeListings(cities, category, options = {}, retryCount = 0) {
    if (!Array.isArray(cities) || cities.length === 0) {
        throw new Error('No cities provided');
    }
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 5000; // 5 seconds
    if (!APIFY_API_TOKEN) {
        throw new Error('APIFY_API_TOKEN is required');
    }
    try {
        const categoryCode = getCategoryCode(category);
        const urls = cities.map(city => ({
            url: `https://${city}.craigslist.org/search/${getCategoryCode(category)}`
        }));
        const maxConcurrency = 2; // Increased for better performance while staying within limits
        const maxResults = options.maxListings || Infinity;
        const input = {
            maxConcurrency,
            paginationEnabled: true,
            proxyConfiguration: {
                useApifyProxy: true
            },
            urls
        };
        const response = await fetch(`https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });
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
            .filter((listing) => (typeof listing.id === 'string' &&
            typeof listing.url === 'string' &&
            typeof listing.title === 'string' &&
            typeof listing.datetime === 'string' &&
            typeof listing.location === 'string'));
        return validListings.slice(0, maxResults).map(listing => ({
            ...listing,
            category
        }));
    }
    catch (error) {
        if (error instanceof Error) {
            if (retryCount < MAX_RETRIES &&
                (error.message.includes('rate limit') ||
                    error.message.includes('429') ||
                    error.message.includes('timeout'))) {
                console.log(`Attempt ${retryCount + 1}/${MAX_RETRIES} failed. Retrying in ${RETRY_DELAY / 1000} seconds...`);
                await delay(RETRY_DELAY);
                return scrapeListings(cities, category, options, retryCount + 1);
            }
            // Add context to the error
            error.message = `Scraping failed for ${cities.join(', ')} - ${category}: ${error.message}`;
        }
        throw error;
    }
}
export async function processListings(alertId, listings, supabase) {
    const processedListings = listings.map(listing => ({
        alert_id: alertId,
        craigslist_id: listing.id,
        url: listing.url,
        title: listing.title,
        datetime: new Date(listing.datetime),
        location: listing.location,
        category: listing.category,
        price: listing.price,
        longitude: listing.longitude,
        latitude: listing.latitude,
        map_accuracy: listing.mapAccuracy,
        post_content: listing.post,
        notices: listing.notices,
        phone_numbers: listing.phoneNumbers,
        pics: listing.pics,
        amenities: listing.amenities,
        available_from: listing.availableFrom ? new Date(listing.availableFrom) : null,
        manufacturer: listing.manufacturer,
        condition: listing.condition,
        model: listing.model,
        attributes: listing.attributes,
        compensation: listing.compensation,
        employment_type: listing.employmentType,
        job_title: listing.jobTitle,
        education: listing.education,
        dates: listing.dates
    }));
    // Insert listings in batches to avoid hitting size limits
    const batchSize = 100;
    for (let i = 0; i < processedListings.length; i += batchSize) {
        const batch = processedListings.slice(i, i + batchSize);
        const { error } = await supabase.from('matches').upsert(batch, {
            onConflict: 'alert_id,craigslist_id'
        });
        if (error) {
            console.error('Error inserting matches:', error);
            throw error;
        }
    }
}
