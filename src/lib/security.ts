import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});


// Honeypot field schema
export const honeypotSchema = z.object({
  website: z.string().max(0, { message: 'Honeypot field must be empty' }),
  email2: z.string().max(0, { message: 'Honeypot field must be empty' }),
  _gotcha: z.string().max(0, { message: 'Honeypot field must be empty' }),
});

// Input sanitization
export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input.trim());
}

// Validate request timing
export function validateTiming(formStartTime: number): boolean {
  const submissionTime = Date.now();
  const timeDiff = submissionTime - formStartTime;
  
  // Submissions faster than 1 second are likely bots
  if (timeDiff < 1000) {
    return false;
  }
  
  // Submissions older than 1 hour are suspicious
  if (timeDiff > 3600000) {
    return false;
  }
  
  return true;
}

// Check for common bot patterns
export function detectBot(userAgent: string): boolean {
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /headless/i,
    /selenium/i,
    /puppeteer/i,
    /chrome-lighthouse/i,
  ];
  
  return botPatterns.some(pattern => pattern.test(userAgent));
}

// Rate limit by IP using Redis
export async function checkRateLimit(
  ip: string,
  action: string,
  limit: number,
  window: number
): Promise<boolean> {
  const key = `rate_limit:${action}:${ip}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, window);
  }
  
  return count <= limit;
}

// Validate request headers
export function validateHeaders(headers: Headers): boolean {
  const requiredHeaders = ['user-agent', 'accept', 'accept-language'];
  
  for (const header of requiredHeaders) {
    if (!headers.get(header)) {
      return false;
    }
  }
  
  return true;
}

// Enhanced input validation schema
export const enhancedInputSchema = z.object({
  // Form fields
  formStartTime: z.number(),
  honeypot: honeypotSchema,
  
  // Request metadata
  userAgent: z.string(),
  headers: z.instanceof(Headers),
  ip: z.string().ip(),
});

// Comprehensive security check
export async function securityCheck(data: z.infer<typeof enhancedInputSchema>) {
  // 1. Validate honeypot
  const honeypotResult = honeypotSchema.safeParse(data.honeypot);
  if (!honeypotResult.success) {
    throw new Error('Invalid form submission');
  }

  // 2. Check timing
  if (!validateTiming(data.formStartTime)) {
    throw new Error('Suspicious submission timing');
  }

  // 3. Check for bots
  if (detectBot(data.userAgent)) {
    throw new Error('Bot detected');
  }

  // 4. Validate headers
  if (!validateHeaders(data.headers)) {
    throw new Error('Invalid request headers');
  }

  // 5. Check rate limit
  const withinLimit = await checkRateLimit(
    data.ip,
    'form_submission',
    5, // 5 submissions
    300 // per 5 minutes
  );
  
  if (!withinLimit) {
    throw new Error('Rate limit exceeded');
  }

  return true;
}
