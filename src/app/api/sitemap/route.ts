import { generateSitemapUrls, generateSitemapXml } from '@/utils/sitemap';

export async function GET() {
  try {
    const urls = await generateSitemapUrls();
    const xml = generateSitemapXml(urls);

    // Set strong caching headers but allow revalidation
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        'X-Robots-Tag': 'noindex',  // Don't index the sitemap itself
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a 503 Service Unavailable instead of 500
    // This tells search engines to try again later
    return new Response('Error generating sitemap', { 
      status: 503,
      headers: {
        'Retry-After': '3600',
        'Content-Type': 'text/plain',
      }
    });
  }
}
