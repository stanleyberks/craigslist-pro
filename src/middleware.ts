import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit } from './middleware/rate-limit';
import { csrfProtection, generateCsrfToken } from './middleware/csrf';

export async function middleware(req: NextRequest) {
  // Check rate limits first
  const rateLimitResponse = await rateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // Check CSRF token
  const csrfResponse = await csrfProtection(req);
  if (csrfResponse) return csrfResponse;

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is not signed in and the current path starts with /app
  // redirect the user to /login
  if (!session && req.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Set CSRF token cookie for GET requests
  if (req.method === 'GET' && !req.cookies.get('csrf_token')) {
    const csrfToken = generateCsrfToken();
    res.cookies.set('csrf_token', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  return res;
}

export const config = {
  matcher: [
    '/app/:path*',
    '/api/:path*',
  ],
};
