import { Analytics } from '@vercel/analytics/react';
import { ReactNode } from 'react';
import { analytics, EventType } from '@/lib/services/analytics-service';
import { performance } from '@/lib/services/performance-service';

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  // Track page views
  const handleRouteChange = (url: string) => {
    analytics.trackPageView(url);
    performance.trackPageLoad(url);
  };

  // Track performance metrics
  const handleWebVitals = ({ id, name, label, value }: any) => {
    analytics.trackEvent(EventType.WEB_VITALS, {
      id,
      name,
      label,
      value,
    });
  };

  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
