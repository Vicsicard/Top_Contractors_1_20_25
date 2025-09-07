import { NextResponse } from 'next/server';

// This API route has been disabled in favor of using a static manifest.json file
// to prevent conflicts and 401 errors
/*
export async function GET() {
  const manifest = {
    name: "Top Contractors Denver",
    short_name: "Denver Contractors",
    description: "Find the best local contractors in Denver. Compare verified reviews, ratings, and get free quotes.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3366FF",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
    orientation: "portrait",
    categories: ["business", "utilities"]
  };

  return new NextResponse(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
*/

// Properly redirect to the static manifest.json file
export async function GET(request: Request) {
  // Get the host from the request
  const host = request.headers.get('host') || 'topcontractorsdenver.com';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  
  // Create an absolute URL for the redirect
  const absoluteUrl = `${protocol}://${host}/manifest.json`;
  
  // Use an absolute URL as required by Next.js in production
  return NextResponse.redirect(new URL(absoluteUrl), 308);
}
