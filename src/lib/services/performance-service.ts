import { logger } from './logging-service';
import { analytics, EventType } from './analytics-service';

interface PerformanceMetrics {
  timeToFirstByte?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
  timeToInteractive?: number;
  domContentLoaded?: number;
  loadComplete?: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private isProduction: boolean;
  private observer?: PerformanceObserver;

  private constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.initObserver();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private reportMetric(metric: string, value: number): void {
    if (this.isProduction) {
      analytics.trackEvent(EventType.PERFORMANCE_METRIC, {
        metric,
        value,
      });
    }

    logger.debug('Performance metric reported', {
      metric,
      value,
    });
  }

  private initObserver(): void {
    if (typeof window === 'undefined') return;

    try {
      // Observe paint timing
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const metric = entry.name;
          const value = entry.startTime;
          
          this.reportMetric(metric, value);
        });
      });

      this.observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

      // Track First Input Delay
      this.observer.observe({ entryTypes: ['first-input'] });

      // Track Layout Shifts
      this.observer.observe({ entryTypes: ['layout-shift'] });

    } catch (error) {
      logger.error('Failed to initialize PerformanceObserver', { error });
    }
  }

  public async trackPageLoad(route: string): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const metrics = this.collectMetrics();
      
      // Log metrics
      logger.info('Page load performance metrics', { 
        route,
        metrics,
      });

      // Track in analytics
      if (this.isProduction) {
        await analytics.trackEvent(EventType.PAGE_LOAD_PERFORMANCE, {
          route,
          ...metrics,
        });
      }

      // Report to monitoring service if thresholds exceeded
      this.checkThresholds(metrics);

    } catch (error) {
      logger.error('Failed to track page load performance', { error, route });
    }
  }

  private collectMetrics(): PerformanceMetrics {
    const metrics: PerformanceMetrics = {};

    try {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = window.performance.getEntriesByType('paint');
      
      // Navigation timing
      if (navigation) {
        metrics.timeToFirstByte = navigation.responseStart - navigation.requestStart;
        metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.requestStart;
        metrics.loadComplete = navigation.loadEventEnd - navigation.requestStart;
      }

      // Paint timing
      paint.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          metrics.firstContentfulPaint = entry.startTime;
        }
      });

      // Largest Contentful Paint
      const lcp = window.performance.getEntriesByType('largest-contentful-paint').slice(-1)[0];
      if (lcp) {
        metrics.largestContentfulPaint = lcp.startTime;
      }

      // First Input Delay
      const fid = window.performance.getEntriesByType('first-input')[0] as PerformanceEventTiming;
      if (fid) {
        metrics.firstInputDelay = fid.processingStart - fid.startTime;
      }

      // Cumulative Layout Shift
      let cls = 0;
      window.performance.getEntriesByType('layout-shift').forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
        if (!entry.hadRecentInput && entry.value) {
          cls += entry.value;
        }
      });
      metrics.cumulativeLayoutShift = cls;

    } catch (error) {
      logger.error('Failed to collect performance metrics', { error });
    }

    return metrics;
  }

  private checkThresholds(metrics: PerformanceMetrics): void {
    const thresholds = {
      timeToFirstByte: 600,
      firstContentfulPaint: 1800,
      largestContentfulPaint: 2500,
      firstInputDelay: 100,
      cumulativeLayoutShift: 0.1,
      timeToInteractive: 3800,
      domContentLoaded: 2000,
      loadComplete: 4000,
    };

    Object.entries(metrics).forEach(([metric, value]) => {
      const threshold = thresholds[metric as keyof typeof thresholds];
      if (value && threshold && value > threshold) {
        logger.warn(`Performance threshold exceeded for ${metric}`, {
          metric,
          value,
          threshold,
        });
      }
    });
  }

  public trackApiCall(
    endpoint: string,
    startTime: number,
    endTime: number,
    success: boolean
  ): void {
    const duration = endTime - startTime;

    logger.info('API call performance', {
      endpoint,
      duration,
      success,
    });

    if (duration > 1000) {
      logger.warn('Slow API call detected', {
        endpoint,
        duration,
      });
    }

    if (this.isProduction) {
      analytics.trackEvent(EventType.API_CALL_PERFORMANCE, {
        endpoint,
        duration,
        success,
      });
    }
  }

  public cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

export const performance = PerformanceMonitor.getInstance();
