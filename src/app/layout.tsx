import './globals.css'
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
  verification: {
    google: 'Uc0OPZIJKQg-K8pxzJAKqYGANtZvY_IzDMqhN9vQwpI',
    other: {
      'facebook-domain-verification': ['7n22l22v4th5rqv1eoxa3knlb19ptr']
    }
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#3366FF' }],
};

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
        {/* Resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        <link 
          rel="manifest" 
          href="/manifest.json" 
          crossOrigin="use-credentials"
          type="application/manifest+json"
        />
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="x9s4rXhtvM7jWVn7bFKrpA" async></script>
      </head>
      <body className={inter.className}>
        <header className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <Navigation />
          </div>
        </header>
        <ErrorBoundary>
          <main className="min-h-screen bg-gray-50 pt-20">
            {children}
          </main>
        </ErrorBoundary>
        <Footer />
        <GoogleAnalytics />
        <PerformanceMonitor />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
