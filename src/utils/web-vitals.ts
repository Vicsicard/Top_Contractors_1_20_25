import { onCLS, onFID, onLCP, onTTFB, onFCP, onINP } from 'web-vitals';
import { analyticsTracker } from './analytics-tracker';

interface WebVitalMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  navigationType: string;
  entries: PerformanceEntry[];
}

const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  switch (name) {
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'INP':
      return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
    default:
      return 'needs-improvement';
  }
};

const reportWebVital = (metric: WebVitalMetric) => {
  // Get the rating for this metric
  const rating = getRating(metric.name, metric.value);

  // Track the metric in analytics
  analyticsTracker.trackEvent({
    category: 'Web Vitals',
    action: metric.name,
    label: `${rating} | ${metric.navigationType}`,
    value: Math.round(metric.value),
    nonInteraction: true
  });

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Web Vital: ${metric.name}`, {
      value: Math.round(metric.value),
      rating,
      navigationType: metric.navigationType
    });
  }
};

export const initWebVitals = () => {
  try {
    // Core Web Vitals
    onCLS(metric => reportWebVital(metric as WebVitalMetric));
    onFID(metric => reportWebVital(metric as WebVitalMetric));
    onLCP(metric => reportWebVital(metric as WebVitalMetric));

    // Additional metrics
    onTTFB(metric => reportWebVital(metric as WebVitalMetric));
    onFCP(metric => reportWebVital(metric as WebVitalMetric));
    onINP(metric => reportWebVital(metric as WebVitalMetric));

    // Track additional performance metrics
    if (typeof window !== 'undefined' && window.performance) {
      // Navigation Timing
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationTiming) {
        analyticsTracker.trackEvent({
          category: 'Performance',
          action: 'Navigation Timing',
          label: 'DOM Interactive',
          value: Math.round(navigationTiming.domInteractive)
        });

        analyticsTracker.trackEvent({
          category: 'Performance',
          action: 'Navigation Timing',
          label: 'DOM Complete',
          value: Math.round(navigationTiming.domComplete)
        });
      }

      // Resource Timing
      const resources = performance.getEntriesByType('resource');
      const resourceStats = resources.reduce((stats, resource) => ({
        total: stats.total + 1,
        size: stats.size + (resource as PerformanceResourceTiming).encodedBodySize,
        duration: stats.duration + resource.duration
      }), { total: 0, size: 0, duration: 0 });

      analyticsTracker.trackEvent({
        category: 'Performance',
        action: 'Resource Stats',
        label: `Resources: ${resourceStats.total}`,
        value: Math.round(resourceStats.duration)
      });

      // Memory Usage (Chrome only)
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        analyticsTracker.trackEvent({
          category: 'Performance',
          action: 'Memory Usage',
          label: 'JS Heap Size',
          value: Math.round(memory.usedJSHeapSize / (1024 * 1024)) // Convert to MB
        });
      }

      // First Paint (if available)
      const paint = performance.getEntriesByType('paint');
      const firstPaint = paint.find(entry => entry.name === 'first-paint');
      if (firstPaint) {
        analyticsTracker.trackEvent({
          category: 'Performance',
          action: 'Paint Timing',
          label: 'First Paint',
          value: Math.round(firstPaint.startTime)
        });
      }
    }
  } catch (error) {
    console.error('Error initializing web vitals:', error);
    analyticsTracker.trackError(error as Error);
  }
};
