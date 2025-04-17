import { supabase } from '../supabase';
import { logger } from './logging-service';

export enum EventType {
  // User events
  USER_SIGNUP = 'user_signup',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  
  // Alert events
  ALERT_CREATED = 'alert_created',
  ALERT_UPDATED = 'alert_updated',
  ALERT_DELETED = 'alert_deleted',
  ALERT_REFRESHED = 'alert_refreshed',
  
  // Match events
  MATCH_VIEWED = 'match_viewed',
  MATCH_CLICKED = 'match_clicked',
  MATCH_REPORTED = 'match_reported',
  
  // Subscription events
  SUBSCRIPTION_STARTED = 'subscription_started',
  SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
  SUBSCRIPTION_RENEWED = 'subscription_renewed',
  
  // Feature usage
  SEARCH_PERFORMED = 'search_performed',
  FILTER_APPLIED = 'filter_applied',
  EXPORT_GENERATED = 'export_generated',
  
  // Error events
  ERROR_OCCURRED = 'error_occurred',
  QUOTA_EXCEEDED = 'quota_exceeded',

  // Performance events
  PERFORMANCE_METRIC = 'performance_metric',
  PAGE_LOAD_PERFORMANCE = 'page_load_performance',
  API_CALL_PERFORMANCE = 'api_call_performance',
  WEB_VITALS = 'web_vitals',
}

interface EventProperties {
  [key: string]: any;
}

interface UserProperties {
  userId: string;
  email?: string;
  planTier?: string;
  [key: string]: any;
}

class Analytics {
  private static instance: Analytics;
  private isProduction: boolean;
  private analyticsId: string;

  private constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.analyticsId = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID || '';
  }

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  public async trackEvent(
    eventType: EventType,
    properties: EventProperties = {},
    user?: UserProperties
  ): Promise<void> {
    try {
      // Don't track events in development
      if (!this.isProduction) {
        logger.debug('Analytics event (dev)', { eventType, properties, user });
        return;
      }

      // Save event to database
      await supabase.from('analytics_events').insert({
        event_type: eventType,
        properties,
        user_id: user?.userId,
        user_properties: user,
        timestamp: new Date().toISOString(),
      });

      // Send to Vercel Analytics if configured
      if (this.analyticsId && typeof window !== 'undefined') {
        // @ts-ignore - Vercel Analytics types
        window.va('event', {
          name: eventType,
          data: properties,
        });
      }
    } catch (error) {
      logger.error('Failed to track analytics event', { error, eventType, properties });
    }
  }

  public async identifyUser(properties: UserProperties): Promise<void> {
    try {
      if (!this.isProduction) {
        logger.debug('Analytics identify (dev)', { properties });
        return;
      }

      // Update user properties in database
      await supabase.from('analytics_users').upsert({
        user_id: properties.userId,
        properties,
        last_seen: new Date().toISOString(),
      });

      // Set user in Vercel Analytics
      if (this.analyticsId && typeof window !== 'undefined') {
        // @ts-ignore - Vercel Analytics types
        window.va('identify', properties);
      }
    } catch (error) {
      logger.error('Failed to identify user in analytics', { error, properties });
    }
  }

  public async trackPageView(
    path: string,
    properties: EventProperties = {},
    user?: UserProperties
  ): Promise<void> {
    try {
      if (!this.isProduction) {
        logger.debug('Analytics page view (dev)', { path, properties, user });
        return;
      }

      await supabase.from('analytics_pageviews').insert({
        path,
        properties,
        user_id: user?.userId,
        timestamp: new Date().toISOString(),
      });

      // Track in Vercel Analytics
      if (this.analyticsId && typeof window !== 'undefined') {
        // @ts-ignore - Vercel Analytics types
        window.va('pageview', {
          path,
          ...properties,
        });
      }
    } catch (error) {
      logger.error('Failed to track page view', { error, path, properties });
    }
  }

  public async trackError(
    error: Error,
    properties: EventProperties = {},
    user?: UserProperties
  ): Promise<void> {
    try {
      if (!this.isProduction) {
        logger.debug('Analytics error (dev)', { error, properties, user });
        return;
      }

      await this.trackEvent(EventType.ERROR_OCCURRED, {
        error_name: error.name,
        error_message: error.message,
        error_stack: error.stack,
        ...properties,
      }, user);
    } catch (trackError) {
      logger.error('Failed to track error event', { error: trackError, originalError: error });
    }
  }
}

export const analytics = Analytics.getInstance();
