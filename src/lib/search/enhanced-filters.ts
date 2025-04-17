import { z } from 'zod';

export const enhancedFilterSchema = z.object({
  // Basic filters
  keywords: z.string(),
  excludeKeywords: z.string().optional(),
  cities: z.array(z.string()),
  category: z.string(),
  minPrice: z.number().nullable(),
  maxPrice: z.number().nullable(),
  
  // Advanced filters
  condition: z.enum(['new', 'like-new', 'excellent', 'good', 'fair', 'salvage']).optional(),
  sellerType: z.enum(['owner', 'dealer', 'both']).optional(),
  hasImages: z.boolean().optional(),
  postedToday: z.boolean().optional(),
  radius: z.number().optional(),
  titleOnly: z.boolean().optional(),
  
  // AI Enhancement
  smartMatch: z.boolean().optional(), // Enable AI-powered matching
  priceAnalysis: z.boolean().optional(), // Enable price trend analysis
  qualityScore: z.boolean().optional(), // Enable listing quality scoring
});

export type EnhancedFilterValues = z.infer<typeof enhancedFilterSchema>;

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  url: string;
  postedAt: Date;
  category: string;
  condition?: string;
  sellerType?: string;
  
  // Enhanced metadata
  qualityScore?: number; // 0-100 score based on listing completeness
  priceDelta?: number; // % difference from market average
  similarListings?: number; // Count of similar active listings
  marketTrend?: 'rising' | 'falling' | 'stable';
  spam_score?: number; // Probability of being spam (0-1)
}

export interface SearchStats {
  totalResults: number;
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  popularKeywords: string[];
  topLocations: string[];
  marketInsights: {
    trend: 'up' | 'down' | 'stable';
    competition: 'high' | 'medium' | 'low';
    bestTimeToSearch: string[];
    priceHistory: {
      date: string;
      avgPrice: number;
    }[];
  };
}
