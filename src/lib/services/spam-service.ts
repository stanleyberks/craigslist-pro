// Common spam patterns and keywords
const SPAM_PATTERNS = [
  /\b(cash|money).{0,20}(fast|quick|easy)\b/i,
  /\b(work|earn).{0,20}(home|online)\b/i,
  /\b(free|discount).{0,20}(gift|prize)\b/i,
  /\b(limited|exclusive).{0,20}(offer|deal)\b/i,
  /\b(guaranteed|promise).{0,20}(results|success)\b/i,
  /\b(investment|invest).{0,20}(opportunity|return)\b/i,
  /\b(miracle|amazing).{0,20}(cure|solution)\b/i,
  /\bact.{0,10}now\b/i,
  /\bdon'?t.{0,10}wait\b/i,
  /\b(only|just).{0,10}\$\d+\b/i,
];

// Blocked keywords that are commonly associated with scams
const BLOCKED_KEYWORDS = [
  'mlm',
  'pyramid scheme',
  'get rich quick',
  'make money fast',
  'work from home opportunity',
  'business opportunity',
  'investment opportunity',
  'miracle cure',
  'weight loss secret',
  'free gift',
];

export function checkForSpam(text: string): boolean {
  const normalizedText = text.toLowerCase();

  // Check for blocked keywords
  if (BLOCKED_KEYWORDS.some(keyword => normalizedText.includes(keyword.toLowerCase()))) {
    return true;
  }

  // Check for spam patterns
  if (SPAM_PATTERNS.some(pattern => pattern.test(normalizedText))) {
    return true;
  }

  // Check for excessive special characters
  const specialCharRatio = (text.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/g) || []).length / text.length;
  if (specialCharRatio > 0.1) {
    return true;
  }

  // Check for excessive capitalization
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsRatio > 0.5) {
    return true;
  }

  // Check for repetitive characters
  if (/(.)\1{4,}/.test(text)) {
    return true;
  }

  // Check for excessive numbers in non-price context
  if ((text.match(/\d/g) || []).length > text.length * 0.3 && !text.includes('$')) {
    return true;
  }

  return false;
}

export function filterSpamListings(listings: any[]): { filtered: any[]; spamCount: number } {
  const filtered = listings.filter(listing => {
    const textToCheck = [
      listing.title,
      listing.description,
      listing.price?.toString(),
      listing.location,
    ]
      .filter(Boolean)
      .join(' ');

    return !checkForSpam(textToCheck);
  });

  return {
    filtered,
    spamCount: listings.length - filtered.length,
  };
}

export function getSpamScore(text: string): number {
  let score = 0;

  // Check for blocked keywords (highest weight)
  BLOCKED_KEYWORDS.forEach(keyword => {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      score += 3;
    }
  });

  // Check for spam patterns
  SPAM_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) {
      score += 2;
    }
  });

  // Check character patterns
  const specialCharRatio = (text.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/g) || []).length / text.length;
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  const numberRatio = (text.match(/\d/g) || []).length / text.length;

  if (specialCharRatio > 0.1) score += 1;
  if (capsRatio > 0.5) score += 1;
  if (numberRatio > 0.3 && !text.includes('$')) score += 1;
  if (/(.)\1{4,}/.test(text)) score += 1;

  return score;
}
