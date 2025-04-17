import { NextRequest } from 'next/server';

export function checkHoneypot(formData: FormData | Record<string, any>) {
  // Check honeypot fields
  const honeypotFields = ['website', 'phone', 'address'];
  
  for (const field of honeypotFields) {
    const value = formData instanceof FormData 
      ? formData.get(field) 
      : formData[field];
      
    if (value && value !== '') {
      return true; // Bot detected
    }
  }

  return false;
}

export function isBot(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || '';
  const botPatterns = [
    /bot/i,
    /crawl/i,
    /spider/i,
    /headless/i,
    /selenium/i,
    /puppet/i,
  ];

  // Check user agent
  if (botPatterns.some(pattern => pattern.test(userAgent))) {
    return true;
  }

  // Check request headers
  const suspiciousHeaders = [
    'x-forwarded-for',
    'forwarded',
    'via',
    'proxy-connection',
  ];

  for (const header of suspiciousHeaders) {
    if (req.headers.get(header)) {
      return true;
    }
  }

  return false;
}
