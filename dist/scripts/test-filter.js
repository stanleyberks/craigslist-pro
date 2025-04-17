import { ContentFilter } from '../lib/filters/content-filter.js';
const TEST_LISTINGS = [
    // Legitimate listing
    {
        id: '1',
        title: 'Senior Software Engineer - React/Node.js',
        description: 'Looking for an experienced software engineer with 5+ years of experience in React and Node.js. Competitive salary and benefits.',
        url: 'https://example.com/job/1',
        price: '$150,000/year',
        datetime: new Date().toISOString(),
        location: 'San Francisco',
        category: 'software'
    },
    // Spam listing
    {
        id: '2',
        title: 'MAKE $$$ FAST - WORK FROM HOME!!!',
        description: 'Easy money opportunity! No experience needed. Wire transfer required for training materials.',
        url: 'https://example.com/job/2',
        price: '$5000/day',
        datetime: new Date().toISOString(),
        location: 'Anywhere',
        category: 'software'
    },
    // Duplicate listing
    {
        id: '3',
        title: 'Senior Software Engineer - React/Node.js',
        description: 'Looking for an experienced software engineer with 5+ years of experience in React and Node.js. Competitive salary and benefits.',
        url: 'https://example.com/job/3',
        price: '$150,000/year',
        datetime: new Date().toISOString(),
        location: 'San Francisco',
        category: 'software'
    },
    // Suspicious listing
    {
        id: '4',
        title: 'Crypto Mining Opportunity - Guaranteed Returns',
        description: 'Join our exclusive crypto mining pool. Investment required. Multi-level marketing opportunity.',
        url: 'https://example.com/job/4',
        price: 'Variable',
        datetime: new Date().toISOString(),
        location: 'Remote',
        category: 'software'
    }
];
async function testContentFilter() {
    console.log('Testing content filter...\n');
    const filter = new ContentFilter();
    // Test with different subscription plans
    const plans = ['free', 'mid', 'pro'];
    for (const plan of plans) {
        console.log(`\n=== Testing ${plan} plan ===`);
        // Test without AI
        console.log('\nTesting without AI:');
        const filteredWithoutAI = await filter.filterListings(TEST_LISTINGS, {
            dedupeWindow: 24
        });
        console.log(`Filtered ${TEST_LISTINGS.length - filteredWithoutAI.length} listings`);
        console.log('Remaining listings:', filteredWithoutAI.map(l => l.title));
        // Test with AI (Pro feature)
        if (plan === 'pro') {
            console.log('\nTesting with AI:');
            const filteredWithAI = await filter.filterListings(TEST_LISTINGS, {
                dedupeWindow: 24,
                useAI: true
            });
            console.log(`Filtered ${TEST_LISTINGS.length - filteredWithAI.length} listings`);
            console.log('Remaining listings:', filteredWithAI.map(l => l.title));
        }
    }
}
testContentFilter().catch(console.error);
