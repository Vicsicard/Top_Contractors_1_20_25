'use client';

import Script from 'next/script';
import { useAnalytics } from '@/hooks/useAnalytics';

const GA_MEASUREMENT_ID = 'G-QWSJFJZGNL';

export default function GoogleAnalytics() {
  // Initialize analytics tracking
  useAnalytics();

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            send_page_view: false,
            custom_map: {
              dimension1: 'user_type',
              dimension2: 'service_category',
              dimension3: 'region',
              metric1: 'interaction_time',
              metric2: 'scroll_depth'
            }
          });
        `}
      </Script>
    </>
  );
}
