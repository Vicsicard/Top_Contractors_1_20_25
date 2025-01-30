import { onCLS, onFID, onLCP, onTTFB, onFCP } from 'web-vitals';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  navigationType: string;
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
    default:
      return 'needs-improvement';
  }
};

const sendToAnalytics = (metric: PerformanceMetric) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: window.location.pathname,
      value: Math.round(metric.value),
      metric_rating: metric.rating,
      metric_value: metric.value,
      metric_navigation_type: metric.navigationType,
      non_interaction: true,
    });
  }
};

export const initPerformanceMonitoring = () => {
  try {
    if (typeof window !== 'undefined') {
      // Core Web Vitals
      onCLS((metric) => {
        const performanceMetric: PerformanceMetric = {
          name: 'CLS',
          value: metric.value,
          rating: getRating('CLS', metric.value),
          navigationType: metric.navigationType || 'unknown',
        };
        sendToAnalytics(performanceMetric);
      });

      onFID((metric) => {
        const performanceMetric: PerformanceMetric = {
          name: 'FID',
          value: metric.value,
          rating: getRating('FID', metric.value),
          navigationType: metric.navigationType || 'unknown',
        };
        sendToAnalytics(performanceMetric);
      });

      onLCP((metric) => {
        const performanceMetric: PerformanceMetric = {
          name: 'LCP',
          value: metric.value,
          rating: getRating('LCP', metric.value),
          navigationType: metric.navigationType || 'unknown',
        };
        sendToAnalytics(performanceMetric);
      });

      // Additional metrics
      onTTFB((metric) => {
        const performanceMetric: PerformanceMetric = {
          name: 'TTFB',
          value: metric.value,
          rating: getRating('TTFB', metric.value),
          navigationType: metric.navigationType || 'unknown',
        };
        sendToAnalytics(performanceMetric);
      });

      onFCP((metric) => {
        const performanceMetric: PerformanceMetric = {
          name: 'FCP',
          value: metric.value,
          rating: getRating('FCP', metric.value),
          navigationType: metric.navigationType || 'unknown',
        };
        sendToAnalytics(performanceMetric);
      });

      // Resource timing
      if (window.performance?.getEntriesByType) {
        const resources = window.performance.getEntriesByType('resource');
        resources.forEach((resource: PerformanceResourceTiming) => {
          if (resource.initiatorType === 'script' || resource.initiatorType === 'css' || resource.initiatorType === 'img') {
            window.gtag?.('event', 'resource_timing', {
              event_category: 'Performance',
              event_label: resource.name,
              resource_type: resource.initiatorType,
              duration: Math.round(resource.duration),
              transfer_size: resource.transferSize,
              non_interaction: true,
            });
          }
        });
      }

      // Memory usage
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        window.gtag?.('event', 'memory_usage', {
          event_category: 'Performance',
          used_js_heap_size: Math.round(memory.usedJSHeapSize / 1048576), // Convert to MB
          total_js_heap_size: Math.round(memory.totalJSHeapSize / 1048576),
          js_heap_size_limit: Math.round(memory.jsHeapSizeLimit / 1048576),
          non_interaction: true,
        });
      }
    }
  } catch (error) {
    console.error('Error initializing performance monitoring:', error);
  }
};
