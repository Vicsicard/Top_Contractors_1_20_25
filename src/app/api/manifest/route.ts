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
export async function GET() {
  // Use a relative URL to work in any environment (development, staging, production)
  return NextResponse.redirect('/manifest.json', 308);
}
