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
    loc: `${baseUrl}/`,
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
      loc: `${baseUrl}/${page.path}/`,
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
      loc: `${baseUrl}/trades/${trade.slug}/`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9,
    });

    // Add subregion pages for each trade
    const subregions = await getAllSubregions();
    for (const subregion of subregions) {
      urls.push({
        loc: `${baseUrl}/trades/${trade.slug}/${subregion.slug}/`,
        lastmod: currentDate,
        changefreq: 'daily',
        priority: 0.8,
      });
    }
  }

  // Add blog posts
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, trade_category, updated_at')
      .filter('status', 'eq', 'published');

    if (error) {
      console.error('Error fetching blog posts for sitemap:', error);
    } else if (posts) {
      for (const post of posts) {
        const category = post.trade_category?.toLowerCase().replace(' ', '-') || 'general';
        urls.push({
          loc: `${baseUrl}/blog/trades/${category}/${post.slug}/`,
          lastmod: post.updated_at || currentDate,
          changefreq: 'weekly',
          priority: 0.7,
        });
      }
    }
  } catch (e) {
    console.error('Exception fetching blog posts for sitemap:', e);
  }

  // Add videos
  try {
    const { data: videos, error } = await supabase
      .from('videos')
      .select('id, category, updated_at');

    if (error) {
      console.error('Error fetching videos for sitemap:', error);
    } else if (videos) {
      for (const video of videos) {
        urls.push({
          loc: `${baseUrl}/videos/${video.category}/${video.id}/`,
          lastmod: video.updated_at || currentDate,
          changefreq: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch (e) {
    console.error('Exception fetching videos for sitemap:', e);
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
