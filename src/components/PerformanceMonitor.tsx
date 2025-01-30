'use client';

import { useEffect, useState } from 'react';
import { initPerformanceMonitoring } from '@/utils/performance-monitor';

interface PerformanceMetrics {
  cls: number | null;
  fid: number | null;
  lcp: number | null;
  ttfb: number | null;
  fcp: number | null;
}

interface ExtendedPerformanceEntry extends PerformanceEntry {
  value?: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cls: null,
    fid: null,
    lcp: null,
    ttfb: null,
    fcp: null,
  });

  useEffect(() => {
    // Only show metrics in development
    if (process.env.NODE_ENV === 'development') {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: ExtendedPerformanceEntry) => {
          const metricName = entry.name.toLowerCase();
          if (metricName in metrics && entry.value !== undefined) {
            setMetrics((prev) => ({
              ...prev,
              [metricName]: entry.value,
            }));
          }
        });
      });

      observer.observe({ entryTypes: ['paint', 'first-input', 'layout-shift'] });
    }

    // Initialize performance monitoring for analytics
    initPerformanceMonitoring();

    // Cleanup observer
    return () => {
      if (process.env.NODE_ENV === 'development') {
        PerformanceObserver.supportedEntryTypes.forEach(() => {
          performance.clearMarks();
          performance.clearMeasures();
        });
      }
    };
  }, [metrics]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg text-sm z-50 opacity-90 hover:opacity-100 transition-opacity">
      <h3 className="font-semibold mb-2">Performance Metrics</h3>
      <ul className="space-y-1">
        <li className={`flex justify-between ${metrics.cls !== null && metrics.cls > 0.1 ? 'text-red-600' : 'text-green-600'}`}>
          <span>CLS:</span>
          <span>{metrics.cls?.toFixed(3) || 'N/A'}</span>
        </li>
        <li className={`flex justify-between ${metrics.fid !== null && metrics.fid > 100 ? 'text-red-600' : 'text-green-600'}`}>
          <span>FID:</span>
          <span>{metrics.fid?.toFixed(1) || 'N/A'}ms</span>
        </li>
        <li className={`flex justify-between ${metrics.lcp !== null && metrics.lcp > 2500 ? 'text-red-600' : 'text-green-600'}`}>
          <span>LCP:</span>
          <span>{metrics.lcp?.toFixed(1) || 'N/A'}ms</span>
        </li>
        <li className={`flex justify-between ${metrics.ttfb !== null && metrics.ttfb > 800 ? 'text-red-600' : 'text-green-600'}`}>
          <span>TTFB:</span>
          <span>{metrics.ttfb?.toFixed(1) || 'N/A'}ms</span>
        </li>
        <li className={`flex justify-between ${metrics.fcp !== null && metrics.fcp > 1800 ? 'text-red-600' : 'text-green-600'}`}>
          <span>FCP:</span>
          <span>{metrics.fcp?.toFixed(1) || 'N/A'}ms</span>
        </li>
      </ul>
      <div className="mt-2 text-xs text-gray-500">
        <div>Good: CLS &le; 0.1, FID &le; 100ms, LCP &le; 2.5s</div>
        <div>Poor: CLS &gt; 0.25, FID &gt; 300ms, LCP &gt; 4.0s</div>
      </div>
    </div>
  );
}
