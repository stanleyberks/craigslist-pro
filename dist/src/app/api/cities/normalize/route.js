import { NextResponse } from 'next/server';
import { normalizeCityInput } from '@/lib/openai';
export async function POST(request) {
    try {
        const { cities } = await request.json();
        if (!Array.isArray(cities) || cities.length === 0) {
            return NextResponse.json({ error: 'Invalid input. Expected non-empty array of cities.' }, { status: 400 });
        }
        // Normalize each city input
        const results = await Promise.all(cities.map(async (city) => {
            if (typeof city !== 'string') {
                return { input: city, matches: [], confidence: 0 };
            }
            return normalizeCityInput(city);
        }));
        // Combine all matches and remove duplicates
        const allMatches = Array.from(new Set(results.flatMap(result => result.matches)));
        return NextResponse.json({
            results,
            allMatches,
            totalMatches: allMatches.length
        });
    }
    catch (error) {
        console.error('Error normalizing cities:', error);
        return NextResponse.json({ error: 'Failed to normalize cities' }, { status: 500 });
    }
}
