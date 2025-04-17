import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { nanoid } from 'nanoid';

const CSRF_COOKIE = 'csrf_token';
const CSRF_HEADER = 'x-csrf-token';

export function generateCsrfToken() {
  return nanoid(32);
}

export async function csrfProtection(req: NextRequest) {
  // Skip CSRF check for GET requests
  if (req.method === 'GET') {
    return null;
  }

  const csrfCookie = req.cookies.get(CSRF_COOKIE);
  const csrfHeader = req.headers.get(CSRF_HEADER);

  // Validate CSRF token
  if (!csrfCookie || !csrfHeader || csrfCookie.value !== csrfHeader) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }

  return null;
}
