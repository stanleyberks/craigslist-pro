import OpenAI from 'openai';
import { cities } from '@/data/cities';

const openai = new OpenAI({
  apiKey: '***REMOVED***',
  dangerouslyAllowBrowser: false, // Only use on server-side
});

const CITY_SYSTEM_PROMPT = `You are a city normalization service. Your task is to match user input to valid Craigslist city values and return a JSON response.
Valid cities are: ${cities.map(c => c.value).join(', ')}.

Rules:
1. If the input is a state abbreviation (e.g., "CA", "NY"), return all cities in that state
2. If the input is a state name (e.g., "California", "New York"), return all cities in that state
3. If the input is a city with common misspellings or variations, return the correct city value
4. If no match is found, return an empty array
5. Always return city values exactly as provided in the valid cities list
6. For ambiguous inputs, return all possible matches

Examples:
- Input: "SF" → Output JSON: { "matches": ["sfbay"], "confidence": 1.0 }
- Input: "NYC" → Output JSON: { "matches": ["newyork"], "confidence": 1.0 }
- Input: "CA" → Output JSON: { "matches": ["sfbay", "losangeles", "sacramento", "sandiego"], "confidence": 1.0 }
- Input: "New York" → Output JSON: { "matches": ["newyork", "buffalo", "albany"], "confidence": 1.0 }
- Input: "Seatle" → Output JSON: { "matches": ["seattle"], "confidence": 0.9 }`;

export interface CityMatch {
  input: string;
  matches: string[];
  confidence: number;
}

export async function normalizeCityInput(input: string): Promise<CityMatch> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: CITY_SYSTEM_PROMPT },
        { role: 'user', content: `Return a JSON response normalizing this city input: "${input}"` }
      ],
      temperature: 0,
      response_format: { type: 'json_object' },
      max_tokens: 150,
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      return { input, matches: [], confidence: 0 };
    }

    const parsed = JSON.parse(result) as { matches: string[]; confidence: number };
    return {
      input,
      matches: parsed.matches.filter(city => cities.some(c => c.value === city)),
      confidence: parsed.confidence
    };
  } catch (error) {
    console.error('Error normalizing city:', error);
    // Fallback to exact match
    const exactMatch = cities.find(c => 
      c.value.toLowerCase() === input.toLowerCase() ||
      c.label.toLowerCase() === input.toLowerCase()
    );
    return {
      input,
      matches: exactMatch ? [exactMatch.value] : [],
      confidence: exactMatch ? 1 : 0
    };
  }
}
