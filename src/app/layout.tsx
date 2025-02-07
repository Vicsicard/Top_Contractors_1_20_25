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
import AnalyticsDimensions from '@/components/AnalyticsDimensions';

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
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
        <AnalyticsDimensions />
        {/* Resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
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
