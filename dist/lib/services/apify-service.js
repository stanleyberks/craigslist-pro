import { ApiRateLimitError } from '../errors.js';
const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_ACTOR_ID = 'ivanvs/craigslist-scraper';
export class ApifyService {
    baseUrl = 'https://api.apify.com/v2';
    actorId = APIFY_ACTOR_ID;
    constructor() {
        if (!APIFY_API_TOKEN) {
            throw new Error('Missing APIFY_API_TOKEN environment variable');
        }
    }
    /**
     * Run a scraping job on Apify and return the results
     */
    async scrapeListings(input, options = {}) {
        try {
            // Start the actor run
            const run = await this.startActorRun(input);
            // Wait for the run to complete
            const dataset = await this.waitForRunCompletion(run.id);
            // Get the results
            const items = await this.getDatasetItems(dataset.id, options.maxListings);
            // Transform the results to our listing format
            return this.transformListings(items);
        }
        catch (error) {
            if (error && typeof error === 'object' && 'response' in error &&
                error.response && typeof error.response === 'object' &&
                'status' in error.response && error.response.status === 429) {
                throw new ApiRateLimitError('Apify rate limit exceeded');
            }
            throw error;
        }
    }
    /**
     * Start an actor run with the given input
     */
    async startActorRun(input) {
        const response = await fetch(`${this.baseUrl}/acts/${this.actorId}/runs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${APIFY_API_TOKEN}`
            },
            body: JSON.stringify({ input })
        });
        if (!response.ok) {
            throw new Error(`Failed to start actor run: ${response.statusText}`);
        }
        return response.json();
    }
    /**
     * Wait for a run to complete and return its dataset
     */
    async waitForRunCompletion(runId, maxAttempts = 30) {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const response = await fetch(`${this.baseUrl}/acts/${this.actorId}/runs/${runId}`, {
                headers: {
                    'Authorization': `Bearer ${APIFY_API_TOKEN}`
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to check run status: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.status === 'SUCCEEDED') {
                return { id: data.defaultDatasetId };
            }
            if (data.status === 'FAILED') {
                throw new Error(`Actor run failed: ${data.meta?.error?.message || 'Unknown error'}`);
            }
            // Wait 2 seconds before next attempt
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        throw new Error('Timeout waiting for actor run completion');
    }
    /**
     * Get items from a dataset
     */
    async getDatasetItems(datasetId, limit) {
        const url = new URL(`${this.baseUrl}/datasets/${datasetId}/items`);
        if (limit) {
            url.searchParams.set('limit', limit.toString());
        }
        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${APIFY_API_TOKEN}`
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to get dataset items: ${response.statusText}`);
        }
        return response.json();
    }
    /**
     * Transform raw Apify results into our listing format
     */
    transformListings(items) {
        return items.map(item => ({
            id: item.id || item.postId,
            title: item.title,
            description: item.description,
            url: item.url,
            price: item.price,
            location: item.location,
            datetime: item.postedAt || item.datetime,
            category: item.category,
            pics: item.imageUrls || [],
            attributes: item.attributes || [],
            notices: item.notices || [],
            phone_numbers: item.phoneNumbers || [],
            longitude: item.longitude,
            latitude: item.latitude,
            map_accuracy: item.mapAccuracy,
            post_content: item.postContent,
            available_from: item.availableFrom,
            manufacturer: item.manufacturer,
            condition: item.condition,
            model: item.model,
            compensation: item.compensation,
            employment_type: item.employmentType,
            job_title: item.jobTitle,
            education: item.education,
            dates: item.dates
        }));
    }
}
