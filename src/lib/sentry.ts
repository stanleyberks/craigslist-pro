import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    debug: false,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    environment: process.env.NODE_ENV,
    enabled: process.env.NODE_ENV === 'production',
    // Disable performance monitoring for now
    tracesSampleRate: 0,
  });
}

export function captureError(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    console.error('Error:', error, '\nContext:', context);
  }
}

export function captureMessage(message: string, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(message, {
      extra: context,
    });
  } else {
    console.log('Message:', message, '\nContext:', context);
  }
}

export function setUserContext(user: { id: string; email?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
  });
}

export function clearUserContext() {
  Sentry.setUser(null);
}

export default Sentry;
