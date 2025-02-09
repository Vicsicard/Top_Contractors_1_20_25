import { getAllTrades, getAllSubregions } from './database';
import { createClient } from './supabase-server';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export async function generateSitemapUrls(): Promise<SitemapUrl[]> {
  const baseUrl = 'https://topcontractorsdenver.com';
  const currentDate = new Date().toISOString();
  const urls: SitemapUrl[] = [];
  const supabase = createClient();

  // Add homepage
  urls.push({
    loc: baseUrl,
    lastmod: currentDate,
    changefreq: 'daily',
    priority: 1.0,
  });

  // Add static pages
  const staticPages = [
    { path: 'about', priority: 0.6, changefreq: 'monthly' as const },
    { path: 'contact', priority: 0.6, changefreq: 'monthly' as const },
    { path: 'trades', priority: 0.8, changefreq: 'weekly' as const },
    { path: 'blog', priority: 0.9, changefreq: 'daily' as const },
    { path: 'videos', priority: 0.9, changefreq: 'daily' as const },
  ];

  for (const page of staticPages) {
    urls.push({
      loc: `${baseUrl}/${page.path}`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  }

  // Add trades pages
  const trades = await getAllTrades();
  for (const trade of trades) {
    // Main trade page
    urls.push({
      loc: `${baseUrl}/trades/${trade.slug}`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9,
    });

    // Trade blog page
    urls.push({
      loc: `${baseUrl}/blog/trades/${trade.slug}`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.8,
    });

    // Add trade-subregion combination pages
    const subregions = await getAllSubregions();
    for (const subregion of subregions) {
      urls.push({
        loc: `${baseUrl}/trades/${trade.slug}/${subregion.slug}`,
        lastmod: currentDate,
        changefreq: 'daily',
        priority: 0.8,
      });
    }
  }

  // Add blog posts
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at, published_at')
    .order('published_at', { ascending: false });

  if (posts) {
    for (const post of posts) {
      urls.push({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: post.updated_at || post.published_at,
        changefreq: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Add videos
  const { data: videos } = await supabase
    .from('videos')
    .select('id, category, created_at')
    .order('created_at', { ascending: false });

  if (videos) {
    for (const video of videos) {
      urls.push({
        loc: `${baseUrl}/videos/${video.category}/${video.id}`,
        lastmod: video.created_at,
        changefreq: 'weekly',
        priority: 0.8,
      });
    }
  }

  return urls;
}

export function generateSitemapXml(urls: SitemapUrl[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}
