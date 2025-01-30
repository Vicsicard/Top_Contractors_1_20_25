import { NextResponse } from 'next/server';

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
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    status: 200
  });
}
