import './globals.css'
import '@/styles/prism-theme.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { generateOrganizationSchema } from '@/utils/schema'
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';

// Optimize font loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const viewport: Viewport = {
  themeColor: '#3366FF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://topcontractorsdenver.com'),
  title: {
    default: 'Top Denver Contractors | Verified Local Pros for Home Improvement, Remodeling, and Repairs',
    template: '%s | Top Contractors Denver'
  },
  description: 'Discover trusted Denver contractors for home improvement, remodeling, and repairs. Our verified local pros bring your projects to life with quality workmanship and reliable service.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://topcontractorsdenver.com',
    siteName: 'Top Contractors Denver',
    title: 'Top Denver Contractors | Verified Local Pros for Home Improvement',
    description: 'Discover trusted Denver contractors for home improvement, remodeling, and repairs. Our verified local pros bring your projects to life with quality workmanship and reliable service.',
    images: [
      {
        url: '/images/denver sky 666.jpg',
        width: 1200,
        height: 630,
        alt: 'Denver skyline'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/denver sky 666.jpg']
  },
  robots: {
    index: true,
    follow: true,
  },
  // Use metadata for manifest instead of file reference to avoid 401 errors
  // manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico'
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers();
  const analyticsDimensions = headersList.get('x-analytics-dimensions') || '{}';
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema())
          }}
        />
        <meta name="google-site-verification" content="Uc0OPZIJKQg-K8pxzJAKqYGANtZvY_IzDMqhN9vQwpI" />
        <meta
          name="analytics-dimensions"
          content={analyticsDimensions}
        />
        
        {/* Resource hints - improve performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://analytics.ahrefs.com" crossOrigin="anonymous" />
        
        {/* No longer preloading this image to avoid warnings */}
        
        {/* Inline manifest to avoid 401 errors */}
        <script
          type="application/manifest+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              name: "Top Contractors Denver",
              short_name: "Denver Contractors",
              description: "Find the best local contractors in Denver. Compare verified reviews, ratings, and get free quotes.",
              start_url: "/",
              display: "standalone",
              background_color: "#ffffff",
              theme_color: "#3366FF",
              icons: [
                {
                  src: "/favicon.ico",
                  sizes: "64x64 32x32 24x24 16x16",
                  type: "image/x-icon"
                },
                {
                  src: "/apple-touch-icon.png",
                  sizes: "180x180",
                  type: "image/png"
                },
                {
                  src: "/site-icon.svg",
                  sizes: "192x192",
                  type: "image/svg+xml",
                  purpose: "any maskable"
                }
              ]
            })
          }}
        />
        
        {/* AHP Module 2.0 - AI Optimization & Bot Detection - Updated Oct 17, 2025 */}
        <script src="https://module-cdn-worker.vicsicard.workers.dev/module.js?v=2025-10-17" 
          data-api-base="https://ahp-email-scheduler-production.vicsicard.workers.dev" 
          data-customer-code="topcontractorsdenver-paid-2024"
          data-show-customer-code="true"
          data-modal-title="Subscribe to AI Visibility Reports"
          data-modal-description="Get weekly insights about AI crawlers visiting your site and enhance your website's visibility to AI systems"
          async></script>
        
        {/* Defer non-critical scripts */}
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="x9s4rXhtvM7jWVn7bFKrpA" async defer></script>
      </head>
      <body className={inter.className}>
        {/* Fixed header - avoid layout shifts by setting exact height */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg h-[72px]">
          <div className="container mx-auto px-4 py-4">
            <Navigation />
          </div>
        </header>
        <ErrorBoundary>
          {/* Add explicit margin to avoid content being hidden under fixed header */}
          <main className="min-h-screen bg-gray-50 pt-[72px]">
            {children}
          </main>
        </ErrorBoundary>
        <Footer />
        
        {/* Analytics - load at the end */}
        <GoogleAnalytics />
        <PerformanceMonitor />
        <Analytics />
        <SpeedInsights />
        
        

      </body>
    </html>
  )
}
