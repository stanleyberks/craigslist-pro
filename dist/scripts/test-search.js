import { scrapeListings } from '../lib/scraper.js';
import { normalizeCityInput } from '../lib/openai.js';
const testCases = [
    // Test state names and codes
    { input: 'CA', category: 'software' },
    { input: 'California', category: 'web' },
    { input: 'NY', category: 'admin' },
    { input: 'New York', category: 'software' },
    { input: 'TX', category: 'web' },
    { input: 'Texas', category: 'software' },
    // Test city names and aliases
    { input: 'SF', category: 'software' },
    { input: 'Bay Area', category: 'web' },
    { input: 'NYC', category: 'admin' },
    { input: 'Manhattan', category: 'software' },
    { input: 'LA', category: 'web' },
    { input: 'Seattle', category: 'software' },
    // Test common misspellings
    { input: 'Seatle', category: 'software' },
    { input: 'San Fransisco', category: 'web' },
    { input: 'Los Angelas', category: 'admin' },
    // Test multiple cities
    { input: ['SF', 'LA', 'NYC'], category: 'software' },
    { input: ['CA', 'NY', 'TX'], category: 'web' },
];
const categories = [
    'software', 'web', 'admin', 'qa', 'dba', 'security',
    'devops', 'cloud', 'network', 'systems', 'support',
    'tech', 'computer'
];
async function runTests() {
    let passedTests = 0;
    let totalTests = 0;
    // Test both scrapers
    for (const preferImages of [true, false]) {
        console.log(`\n=== Testing ${preferImages ? 'with' : 'without'} images ===`);
        // Test city/state variations
        for (const testCase of testCases) {
            totalTests++;
            if (await testSearch(testCase.input, testCase.category, preferImages)) {
                passedTests++;
            }
        }
        // Test each category
        for (const category of categories) {
            totalTests++;
            if (await testSearch('SF', category, preferImages)) {
                passedTests++;
            }
        }
    }
    console.log(`\nTests complete: ${passedTests} of ${totalTests} passed`);
}
async function testSearch(input, category, preferImages) {
    const inputStr = Array.isArray(input) ? input.join(', ') : input;
    try {
        console.log(`\nTesting search for ${inputStr} in category ${category} (${preferImages ? 'with' : 'without'} images)`);
        // Normalize city input
        const normalizedCities = Array.isArray(input)
            ? (await Promise.all(input.map(i => normalizeCityInput(i)))).flatMap(r => r.matches)
            : (await normalizeCityInput(input)).matches;
        console.log('Normalized cities:', normalizedCities);
        // Search listings
        const options = {
            cities: normalizedCities,
            category,
            preferImages,
            maxListings: 10 // Limit results for testing
        };
        const listings = await scrapeListings(options);
        console.log(`Found ${listings.length} listings`);
        if (listings.length > 0) {
            console.log('Sample listing:', JSON.stringify(listings[0], null, 2));
            if (preferImages) {
                console.log('Images found:', listings.filter(l => l.thumbnail).length);
            }
        }
        return true;
    }
    catch (error) {
        console.error('Test failed:', error);
        return false;
    }
}
// Run the tests
runTests().catch(console.error);
