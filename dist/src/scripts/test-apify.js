import { ApifyService } from '../lib/services/apify-service.js';
import { ContentFilter } from '../lib/filters/content-filter.js';
async function testApifyScraper() {
    console.log('Starting Apify scraper test...');
    const apifyService = new ApifyService();
    const contentFilter = new ContentFilter();
    try {
        // Test basic search
        console.log('\n=== Testing basic search ===');
        const listings = await apifyService.scrapeListings({
            keyword: 'macbook',
            cities: ['sfbay'],
            category: 'for-sale'
        }, {
            maxListings: 5
        });
        console.log(`Found ${listings.length} listings`);
        console.log('Sample listing:', JSON.stringify(listings[0], null, 2));
        // Test content filtering
        console.log('\n=== Testing content filtering ===');
        const filteredListings = await contentFilter.filterListings(listings, {
            useAI: true,
            validateImages: true,
            dedupeWindow: 24
        });
        console.log('Filtering results:', {
            total: listings.length,
            filtered: listings.length - filteredListings.length,
            remaining: filteredListings.length
        });
        // Test category-specific search
        console.log('\n=== Testing category search ===');
        const jobListings = await apifyService.scrapeListings({
            keyword: 'software engineer',
            cities: ['sfbay'],
            category: 'jobs'
        }, {
            maxListings: 5
        });
        console.log(`Found ${jobListings.length} job listings`);
        if (jobListings.length > 0) {
            console.log('Sample job listing:', JSON.stringify(jobListings[0], null, 2));
        }
    }
    catch (error) {
        console.error('Error running tests:', error);
        if (error && typeof error === 'object' && 'response' in error &&
            error.response && typeof error.response === 'object') {
            console.error('Response status:', 'status' in error.response ? error.response.status : 'unknown');
            console.error('Response data:', 'data' in error.response ? error.response.data : 'unknown');
        }
    }
}
testApifyScraper();
