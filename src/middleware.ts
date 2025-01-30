import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to extract trade category from URL
function getTradeCategory(pathname: string): string | null {
  const tradePaths = ['/trades/', '/blog/trades/'];
  for (const tradePath of tradePaths) {
    if (pathname.startsWith(tradePath)) {
      const parts = pathname.slice(tradePath.length).split('/');
      return parts[0] || null;
    }
  }
  return null;
}

// Helper function to extract region from URL
function getRegion(pathname: string): string | null {
  const parts = pathname.split('/');
  // Check if URL matches pattern /[trade]/[region]
  if (parts.length >= 3 && !parts[1].includes('trades')) {
    return parts[2];
  }
  return null;
}

// Helper function to determine user type based on behavior
function getUserType(request: NextRequest): string {
  const searchParams = request.nextUrl.searchParams;
  const referrer = request.headers.get('referer') || '';
  const visitCount = request.cookies.get('visit_count')?.value;

  if (searchParams.get('utm_source') === 'google' && searchParams.get('utm_medium') === 'cpc') {
    return 'paid_search';
  }
  
  if (referrer.includes('google.com')) {
    return 'organic_search';
  }

  if (visitCount && parseInt(visitCount) > 3) {
    return 'returning_visitor';
  }

  return 'new_visitor';
}

export async function middleware(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname;

  // Skip API routes and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Create response
  const response = NextResponse.next();

  // Set cache-control headers for static assets
  if (pathname.match(/\.(webp|avif)$/)) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }

  // Set security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // Track visit count
  const visitCount = request.cookies.get('visit_count');
  const newCount = visitCount ? parseInt(visitCount.value) + 1 : 1;
  response.cookies.set('visit_count', newCount.toString(), {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  // Set analytics dimensions in headers for client-side tracking
  const tradeCategory = getTradeCategory(pathname);
  const region = getRegion(pathname);
  const userType = getUserType(request);

  response.headers.set(
    'x-analytics-dimensions',
    JSON.stringify({
      userType,
      serviceCategory: tradeCategory,
      region,
    })
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};
