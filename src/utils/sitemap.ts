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

  // Add blog posts from the merged table
  try {
    console.log('Fetching blog posts from merged_blog_posts table for sitemap');
    const { data: posts, error } = await supabase
      .from('merge_blog_posts')
      .select('slug, created_at, tags');

    if (error) {
      console.error('Error fetching blog posts for sitemap:', error);
    } else if (posts) {
      console.log(`Found ${posts.length} blog posts for sitemap`);
      
      // Add blog pagination pages based on the total number of posts
      const postsPerPage = 6; // Same as in blog/page.tsx
      const totalPages = Math.ceil(posts.length / postsPerPage);
      
      console.log(`Adding ${totalPages} blog pagination pages to sitemap`);
      for (let i = 1; i <= totalPages; i++) {
        urls.push({
          loc: i === 1 ? `${baseUrl}/blog/` : `${baseUrl}/blog/?page=${i}`,
          lastmod: currentDate,
          changefreq: 'daily',
          priority: i === 1 ? 0.9 : 0.8,
        });
      }
      
      // Add individual blog post pages
      for (const post of posts) {
        // Skip posts without a valid slug
        if (!post.slug) {
          console.log('Skipping post with missing slug');
          continue;
        }
        
        // Extract trade category from tags if available
        let category = 'general';
        if (post.tags) {
          const tags = post.tags.split(',').map((t: string) => t.trim().toLowerCase());
          const validTradeNames = trades.map((t: { category_name: string }) => t.category_name.toLowerCase());
          
          // Find the first tag that matches a valid trade
          const matchedTrade = tags.find((tag: string) => validTradeNames.includes(tag));
          if (matchedTrade) {
            category = matchedTrade.replace(' ', '-');
          }
        }
        
        // Add both URL formats for blog posts to ensure all are indexed
        // Primary URL format
        urls.push({
          loc: `${baseUrl}/blog/${post.slug}/`,
          lastmod: post.created_at || currentDate,
          changefreq: 'weekly',
          priority: 0.7,
        });
        
        // Secondary URL format with category
        urls.push({
          loc: `${baseUrl}/blog/trades/${category}/${post.slug}/`,
          lastmod: post.created_at || currentDate,
          changefreq: 'weekly',
          priority: 0.6,
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
          changefreq: 'weekly',
          priority: 0.7,
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
