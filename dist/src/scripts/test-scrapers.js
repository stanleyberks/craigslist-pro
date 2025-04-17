import { scrapeListings as scrapeListingsOriginal } from '../lib/apify';
import { scrapeListingsWithImages } from '../lib/apify-easyapi';
import { SUBSCRIPTION_PLANS } from '../lib/plans';
const TEST_CITIES = ['sfbay', 'nyc', 'chicago'];
const TEST_CATEGORIES = ['software', 'web', 'admin'];
async function testBothScrapers() {
    const plans = ['free', 'mid', 'pro'];
    console.log('Testing both Craigslist scrapers...\n');
    for (const planName of plans) {
        console.log(`\n=== Testing plan: ${planName} ===`);
        const plan = SUBSCRIPTION_PLANS[planName];
        for (const category of TEST_CATEGORIES) {
            console.log(`\n=== Testing category: ${category} ===`);
            try {
                // Test original scraper
                console.log('\nTesting original scraper:');
                const originalResults = await scrapeListingsOriginal(TEST_CITIES, category, {
                    maxListings: plan.resultsPerAlert
                });
                console.log(`Found ${originalResults.length} listings`);
                if (originalResults.length > 0) {
                    console.log('Sample listing:', JSON.stringify(originalResults[0], null, 2));
                }
                // Test image-enabled scraper
                console.log('\nTesting image-enabled scraper:');
                const imageResults = await scrapeListingsWithImages({
                    cities: TEST_CITIES,
                    category,
                    maxListings: plan.resultsPerAlert
                });
                console.log(`Found ${imageResults.length} listings`);
                if (imageResults.length > 0) {
                    console.log('Sample listing:', JSON.stringify(imageResults[0], null, 2));
                    console.log('Listings with images:', imageResults.filter(l => l.thumbnail).length);
                }
            }
            catch (error) {
                console.error(`Error testing plan ${planName} category ${category}:`, error);
                continue;
            }
        }
    }
}
testBothScrapers().catch(console.error);
