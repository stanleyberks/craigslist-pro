import type { CraigslistListing } from '../types.js';
import { BLACKLISTED_PHRASES } from './blacklist.js';
import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


interface FilterOptions {
  useAI?: boolean;
  dedupeWindow?: number; // Time window in hours for deduplication
  validateImages?: boolean;
  batchSize?: number;
}

interface FilterResult {
  isFiltered: boolean;
  reasons: string[];
  aiScore?: number;
  imageValidation?: {
    hasValidImages: boolean;
    invalidImageUrls: string[];
  };
}

export class ContentFilter {
  private openai: OpenAI | null = null;
  private dedupeCache: Map<string, Set<string>> = new Map();

  constructor() {
    if (OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: OPENAI_API_KEY
      });
    }

    // Supabase client is not required for testing
  }

  private containsBlacklistedPhrases(text: string): string[] {
    const lowerText = text.toLowerCase();
    return BLACKLISTED_PHRASES.filter(phrase => 
      lowerText.includes(phrase.toLowerCase())
    );
  }

  private async validateImageUrls(listing: CraigslistListing): Promise<{ hasValidImages: boolean; invalidImageUrls: string[] }> {
    if (!listing.pics || listing.pics.length === 0) {
      return { hasValidImages: false, invalidImageUrls: [] };
    }

    const invalidImageUrls: string[] = [];
    const validImageUrls: string[] = [];

    await Promise.all(
      listing.pics.map(async (url) => {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
            invalidImageUrls.push(url);
          } else {
            validImageUrls.push(url);
          }
        } catch {
          invalidImageUrls.push(url);
        }
      })
    );

    return {
      hasValidImages: validImageUrls.length > 0,
      invalidImageUrls
    };
  }

  private async checkWithAI(listing: CraigslistListing): Promise<number> {
    if (!this.openai) {
      return 1; // Default to safe if AI not configured
    }

    const prompt = `Analyze this Craigslist listing for potential spam, scams, or inappropriate content:
Title: ${listing.title}
Price: ${listing.price || 'Not specified'}
Description: ${listing.description || 'No description'}

Rate this listing from 0 (definitely spam/scam) to 1 (definitely legitimate) based on:
1. Presence of common scam patterns
2. Unrealistic pricing
3. Suspicious contact methods
4. Inappropriate content
5. Overall legitimacy

Return only a number between 0 and 1.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: 'You are a content filter that rates Craigslist listings. Respond only with a number between 0 (spam/scam) and 1 (legitimate).'
        }, {
          role: 'user',
          content: prompt
        }],
        max_tokens: 1,
        temperature: 0.1,
      });

      const score = parseFloat(response.choices[0]?.message?.content || '1');
      return isNaN(score) ? 1 : score;
    } catch (error) {
      console.error('AI check failed:', error);
      return 1; // Default to safe on error
    }
  }

  private isDuplicate(listing: CraigslistListing, windowHours: number): boolean {
    const now = Date.now();
    const windowMs = windowHours * 60 * 60 * 1000;
    
    // Clean old entries
    for (const [key, timestamps] of Array.from(this.dedupeCache.entries())) {
      const validTimestamps = new Set(
        Array.from(timestamps).filter(ts => now - parseInt(ts) < windowMs)
      );
      if (validTimestamps.size === 0) {
        this.dedupeCache.delete(key);
      } else {
        this.dedupeCache.set(key, validTimestamps);
      }
    }

    // Check for duplicates
    const key = [
      listing.title.toLowerCase(),
      listing.price,
      listing.location.toLowerCase()
    ].join('|');

    const timestamps = this.dedupeCache.get(key) || new Set();
    if (timestamps.size > 0) {
      return true;
    }

    timestamps.add(now.toString());
    this.dedupeCache.set(key, timestamps);
    return false;
  }

  async filter(
    listing: CraigslistListing,
    options: FilterOptions = {}
  ): Promise<FilterResult> {
    const result: FilterResult = {
      isFiltered: false,
      reasons: []
    };

    // Check blacklisted phrases
    const blacklistedPhrases = this.containsBlacklistedPhrases(
      [listing.title, listing.description].join(' ')
    );
    if (blacklistedPhrases.length > 0) {
      result.isFiltered = true;
      result.reasons.push(
        `Contains blacklisted phrases: ${blacklistedPhrases.join(', ')}`
      );
    }

    // Check for duplicates
    if (options.dedupeWindow && this.isDuplicate(listing, options.dedupeWindow)) {
      result.isFiltered = true;
      result.reasons.push('Duplicate listing detected');
    }

    // AI-based validation for pro users
    if (options.useAI) {
      const aiScore = await this.checkWithAI(listing);
      result.aiScore = aiScore;
      
      if (aiScore < 0.4) {
        result.isFiltered = true;
        result.reasons.push('Failed AI validation check');
      }
    }

    // Image validation
    if (options.validateImages) {
      const imageValidation = await this.validateImageUrls(listing);
      result.imageValidation = imageValidation;

      if (!imageValidation.hasValidImages && listing.pics && listing.pics.length > 0) {
        result.isFiltered = true;
        result.reasons.push('No valid images found');
      }
    }

    return result;
  }

  async filterListings(
    listings: CraigslistListing[],
    options: FilterOptions = {}
  ): Promise<CraigslistListing[]> {
    const batchSize = options.batchSize || 10;
    const filteredListings: CraigslistListing[] = [];
    const batches = [];

    // Split listings into batches
    for (let i = 0; i < listings.length; i += batchSize) {
      batches.push(listings.slice(i, i + batchSize));
    }

    // Process batches concurrently
    for (const batch of batches) {
      const results = await Promise.all(
        batch.map(listing => this.filter(listing, options))
      );

      // Add non-filtered listings to results
      batch.forEach((listing, index) => {
        if (!results[index].isFiltered) {
          filteredListings.push(listing);
        }
      });

      // Supabase storage is disabled for testing
    }

    return filteredListings;
  }
}
