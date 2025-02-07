import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getAllPosts() {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data;
}

const SITE_URL = 'https://www.topcontractorsdenver.com';

// URL structure for sitemap entries
// {
//     loc: string;
//     lastmod?: string;
//     changefreq: 'daily' | 'weekly' | 'monthly';
//     priority: number;
// }

async function generateSitemap() {
    const urls = [];
    
    // Add static pages
    const staticPages = [
        { path: '', priority: 1.0 },
        { path: 'about', priority: 0.8 },
        { path: 'contact', priority: 0.8 },
        { path: 'blog', priority: 0.9 },
        { path: 'services', priority: 0.9 },
        { path: 'privacy-policy', priority: 0.5 },
        { path: 'terms-of-service', priority: 0.5 },
    ];

    // Add blog categories
    const categories = [
        'bathroom-remodeling',
        'kitchen-remodeling',
        'home-remodeling',
        'siding-gutters',
        'plumbing',
        'electrician',
        'hvac',
        'roofer',
        'masonry',
        'decks',
        'flooring',
        'windows',
        'fencing',
        'epoxy-garage'
    ];

    // Add static pages to sitemap
    staticPages.forEach(({ path, priority }) => {
        urls.push({
            loc: `${SITE_URL}${path ? `/${path}` : ''}`,
            lastmod: new Date().toISOString(),
            changefreq: 'monthly',
            priority
        });
    });

    // Add category pages to sitemap
    categories.forEach(category => {
        // Main category page
        urls.push({
            loc: `${SITE_URL}/blog/trades/${category}`,
            lastmod: new Date().toISOString(),
            changefreq: 'daily',
            priority: 0.9
        });

        // Category page with pagination
        urls.push({
            loc: `${SITE_URL}/blog/trades/${category}/page/1`,
            lastmod: new Date().toISOString(),
            changefreq: 'daily',
            priority: 0.8
        });

        // Trade service page
        urls.push({
            loc: `${SITE_URL}/trades/${category}`,
            lastmod: new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.8
        });
    });

    try {
        // Fetch all blog posts
        console.log('Fetching blog posts...');
        const posts = await getAllPosts();
        console.log(`Found ${posts.length} blog posts`);

        // Add blog posts to sitemap
        posts.forEach(post => {
            urls.push({
                loc: `${SITE_URL}/blog/${post.slug}`,
                lastmod: new Date(post.published_at).toISOString(),
                changefreq: 'weekly',
                priority: 0.7
            });
        });

        // Add blog pagination
        const postsPerPage = 12;
        const totalPages = Math.ceil(posts.length / postsPerPage);
        
        for (let i = 1; i <= totalPages; i++) {
            urls.push({
                loc: `${SITE_URL}/blog/page/${i}`,
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: 0.8
            });
        }

        // Generate sitemap XML
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(url => `
    <url>
        <loc>${url.loc}</loc>
        ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`).join('')}
</urlset>`;

        // Write sitemap to public directory
        const publicDir = path.join(process.cwd(), 'public');
        fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
        console.log('Sitemap generated successfully!');
        
        // Also write a copy for verification
        fs.writeFileSync(path.join(publicDir, 'sitemap_new.xml'), sitemap);
        console.log('Sitemap verification copy created as sitemap_new.xml');
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
}

generateSitemap().catch(console.error);
