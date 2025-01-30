import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analyticsTracker } from '@/utils/analytics-tracker';

interface AnalyticsDimensions {
  userType?: string;
  serviceCategory?: string;
  region?: string;
}

export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPathRef = useRef<string>('/');

  useEffect(() => {
    const initializeAnalytics = async () => {
      if (typeof window === 'undefined') return;

      try {
        // Get analytics dimensions from meta tag
        const dimensionsTag = document.head.querySelector('meta[name="analytics-dimensions"]');
        if (dimensionsTag) {
          const dimensions: AnalyticsDimensions = JSON.parse(dimensionsTag.getAttribute('content') || '{}');
          analyticsTracker.setDimensions(dimensions);
        }

        // Track page view
        analyticsTracker.trackPageView(pathname || '/');

        // Track navigation if path changed
        const currentPath = pathname || '/';
        if (prevPathRef.current !== currentPath) {
          analyticsTracker.trackNavigation(prevPathRef.current, currentPath);
          prevPathRef.current = currentPath;
        }

        // Track search parameters if present
        if (searchParams?.toString()) {
          const searchQuery = searchParams.get('q') || searchParams.get('search');
          if (searchQuery) {
            analyticsTracker.trackSearch(searchQuery, 0); // Update count when search results are available
          }
        }

        // Track performance metrics
        if (typeof window.performance?.getEntriesByType === 'function') {
          const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigationEntry) {
            analyticsTracker.trackEvent({
              category: 'Performance',
              action: 'page_load',
              value: Math.round(navigationEntry.loadEventEnd),
              label: pathname
            });
          }
        }
      } catch (error) {
        console.error('Error initializing analytics:', error);
        analyticsTracker.trackError(error as Error);
      }
    };

    initializeAnalytics();
  }, [pathname, searchParams]);

  // Return utility functions for component-level tracking
  return {
    trackEvent: analyticsTracker.trackEvent.bind(analyticsTracker),
    trackError: analyticsTracker.trackError.bind(analyticsTracker),
    setDimensions: analyticsTracker.setDimensions.bind(analyticsTracker)
  };
}
