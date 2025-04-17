import 'dotenv/config';
import { scrapeListings } from '../lib/apify.js';
import { scrapeListingsWithImages } from '../lib/apify-easyapi.js';
import { ContentFilter } from '../lib/filters/content-filter.js';
const TEST_CITIES = [
    'sfbay', // San Francisco Bay Area
    'newyork', // New York
    'chicago', // Chicago
    'seattle', // Seattle
    'miami', // Miami
    'austin', // Austin
    'denver', // Denver
    'boston', // Boston
    'portland', // Portland
    'lasvegas' // Las Vegas
];
const TEST_CATEGORIES = [
    'software', // Software Jobs
    'web', // Web Design
    'admin', // Systems/Admin
    'qa', // QA Testing
    'security', // Security
    'devops', // DevOps
    'tech', // Technical Support
    'dba' // Database Admin
];
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function runTest(city, category) {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 5000; // 5 seconds
    const result = {
        city,
        category,
        listingsCount: 0,
        withImages: 0
    };
    try {
        // Test both scrapers
        let listings = [];
        let imageListings = [];
        let retries = 0;
        while (retries < MAX_RETRIES) {
            try {
                [listings, imageListings] = await Promise.all([
                    scrapeListings([city], category, { maxListings: 50 }),
                    scrapeListingsWithImages([city], category, { maxListings: 50 })
                ]);
                break;
            }
            catch (error) {
                if (error instanceof Error && 'isRateLimit' in error && error.isRateLimit) {
                    if (retries < MAX_RETRIES - 1) {
                        console.log(`Rate limit hit, retrying in ${RETRY_DELAY / 1000} seconds...`);
                        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                        retries++;
                        continue;
                    }
                }
                throw error;
            }
        }
        result.listingsCount = listings.length;
        result.withImages = imageListings.filter(l => l.pics?.length).length;
        // Basic validation
        const regularIds = new Set(listings.map(l => l.id));
        const imageIds = new Set(imageListings.map(l => l.id));
        const overlap = [...regularIds].filter(id => imageIds.has(id)).length;
        console.log(`\n=== ${city} - ${category} ===`);
        console.log(`Regular listings: ${listings.length}`);
        console.log(`Image listings: ${imageListings.length}`);
        console.log(`Listings with images: ${result.withImages}`);
        console.log(`ID overlap: ${overlap}`);
        // Sample listing details
        if (listings.length > 0) {
            const sample = listings[0];
            console.log('\nSample listing:');
            console.log(`Title: ${sample.title}`);
            console.log(`URL: ${sample.url}`);
            console.log(`Price: ${sample.price}`);
            console.log(`Location: ${sample.location}`);
            console.log(`Date: ${sample.datetime}`);
        }
    }
    catch (error) {
        result.error = error instanceof Error ? error.message : String(error);
        console.error(`Error testing ${city} - ${category}:`, result.error);
    }
    return result;
}
function getMockListings() {
    return [
        {
            id: '1',
            title: 'Legitimate Software Developer Position',
            description: 'Looking for an experienced developer. Local candidates only.',
            url: 'https://example.com/1',
            price: '120000',
            location: 'San Francisco',
            datetime: new Date().toISOString(),
            category: 'software',
            pics: ['https://example.com/pic1.jpg']
        },
        {
            id: '2',
            title: 'MAKE $$$ FAST WORK FROM HOME!!!',
            description: 'Make thousands daily! Too good to be true! Contact WhatsApp +1234567890',
            url: 'https://example.com/2',
            price: '999999',
            location: 'Anywhere',
            datetime: new Date().toISOString(),
            category: 'software',
            pics: ['https://example.com/fake.jpg']
        },
        {
            id: '3',
            title: 'Senior Software Engineer - React Native',
            description: 'Join our team to build mobile apps. Competitive salary and benefits.',
            url: 'https://example.com/3',
            price: '150000',
            location: 'San Francisco',
            datetime: new Date().toISOString(),
            category: 'software',
            pics: ['https://example.com/valid1.jpg', 'https://example.com/valid2.jpg']
        }
    ];
}
async function runFilterTests() {
    console.log('Starting content filter tests...');
    const contentFilter = new ContentFilter();
    const mockListings = getMockListings();
    console.log(`\n=== Testing with ${mockListings.length} mock listings ===`);
    try {
        // Use the same listings for both regular and image testing
        const regularListings = mockListings;
        const imageListings = mockListings;
        console.log(`Found ${regularListings.length} regular listings`);
        console.log(`Found ${imageListings.length} image-enabled listings`);
        // Test different filter combinations
        const testCases = [
            { name: 'Basic filtering', options: { dedupeWindow: 24 } },
            { name: 'AI filtering', options: { useAI: true, dedupeWindow: 24 } },
            { name: 'Image validation', options: { validateImages: true, dedupeWindow: 24 } },
            { name: 'Full filtering', options: { useAI: true, validateImages: true, dedupeWindow: 24, batchSize: 5 } }
        ];
        for (const { name, options } of testCases) {
            console.log(`\n--- ${name} ---`);
            // Test regular listings
            const filteredRegular = await contentFilter.filterListings(regularListings, options);
            console.log('Regular listings:', {
                total: regularListings.length,
                filtered: regularListings.length - filteredRegular.length,
                remaining: filteredRegular.length
            });
            // Test image listings
            const filteredImages = await contentFilter.filterListings(imageListings, options);
            console.log('Image listings:', {
                total: imageListings.length,
                filtered: imageListings.length - filteredImages.length,
                remaining: filteredImages.length
            });
            // Sample filtered listing
            if (filteredImages.length > 0) {
                const sample = filteredImages[0];
                console.log('\nSample filtered listing:', {
                    title: sample.title,
                    location: sample.location,
                    hasImages: Boolean(sample.pics?.length)
                });
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error running tests:', error.message);
        }
        else {
            console.error('Unknown error running tests');
        }
    }
}
async function runComprehensiveTest() {
    const results = await Promise.all(TEST_CITIES.flatMap(city => TEST_CATEGORIES.map(category => runTest(city, category))));
    console.log('\nFailed tests:', results.filter(r => r.error).length);
    // City coverage
    console.log('\nCity Coverage:');
    for (const city of TEST_CITIES) {
        const cityResults = results.filter(r => r.city === city);
        const success = cityResults.filter(r => !r.error).length;
        console.log(`${city}: ${success}/${cityResults.length} categories successful`);
    }
    // Category coverage
    console.log('\nCategory Coverage:');
    for (const category of TEST_CATEGORIES) {
        const catResults = results.filter(r => r.category === category);
        const success = catResults.filter(r => !r.error).length;
        console.log(`${category}: ${success}/${catResults.length} cities successful`);
    }
    // Error summary
    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
        console.log('\nErrors encountered:');
        errors.forEach(({ city, category, error }) => {
            console.log(`${city} - ${category}: ${error}`);
        });
    }
}
// Run the filter tests
runFilterTests().catch(error => {
    console.error('Tests failed:', error);
    process.exit(1);
});
