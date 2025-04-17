import { scrapeListings as scrapeListingsOriginal } from './apify';
import { scrapeListingsWithImages } from './apify-easyapi';
import { SUBSCRIPTION_PLANS } from './plans';
export async function scrapeListings(options) {
    // Apply plan limits
    const plan = options.plan || SUBSCRIPTION_PLANS.free;
    const maxResults = Math.min(options.maxListings || Infinity, plan.resultsPerAlert);
    const { preferImages = true } = options;
    try {
        // Try the image-enabled scraper first if images are preferred
        if (preferImages) {
            try {
                const listings = await scrapeListingsWithImages({
                    ...options,
                    maxListings: maxResults
                });
                if (listings && listings.length > 0) {
                    return listings;
                }
            }
            catch (error) {
                console.warn('Image scraper failed, falling back to original scraper:', error);
            }
        }
        // Fall back to the original scraper
        return await scrapeListingsOriginal(options.cities, options.category, {
            keywords: options.keywords,
            maxListings: maxResults
        });
    }
    catch (error) {
        console.error('All scrapers failed:', error);
        throw error;
    }
}
