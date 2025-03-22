import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config({ path: '.env.local' });

const SITE_URL = 'https://topcontractorsdenver.com';

// Initialize Supabase clients
// Main Supabase client for videos and other data
const mainSupabaseUrl = process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL;
const mainSupabaseKey = process.env.NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY;

// Blog Supabase client for blog posts
const blogSupabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
const blogSupabaseKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY;

if (!mainSupabaseUrl || !mainSupabaseKey) {
    throw new Error('Missing Main Supabase environment variables');
}

if (!blogSupabaseUrl || !blogSupabaseKey) {
    throw new Error('Missing Blog Supabase environment variables');
}

const mainSupabase = createClient(mainSupabaseUrl, mainSupabaseKey);
const blogSupabase = createClient(blogSupabaseUrl, blogSupabaseKey);

// URL validation function
async function isUrlValid(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.error(`Error validating URL ${url}:`, error.message);
        return false;
    }
}

// Generate XML for a set of URLs
function generateSitemapXml(urls, type) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `    <url>
        <loc>${url.loc}</loc>
        ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`).join('\n')}
</urlset>`;
}

async function generateStaticSitemap() {
    const staticPages = [
        { path: '', priority: 1.0, changefreq: 'daily' },
        { path: 'about', priority: 0.6, changefreq: 'monthly' },
        { path: 'privacy', priority: 0.6, changefreq: 'monthly' },
        { path: 'trades', priority: 0.8, changefreq: 'weekly' },
        { path: 'blog', priority: 0.9, changefreq: 'daily' },
        { path: 'videos', priority: 0.9, changefreq: 'daily' },
        { path: 'services', priority: 0.8, changefreq: 'weekly' },
        { path: 'sitemap', priority: 0.4, changefreq: 'daily' }
    ];

    const urls = [];
    const currentDate = new Date().toISOString();

    for (const page of staticPages) {
        const url = `${SITE_URL}${page.path ? `/${page.path}` : ''}`;
        urls.push({
            loc: url,
            lastmod: currentDate,
            changefreq: page.changefreq,
            priority: page.priority
        });
    }

    return generateSitemapXml(urls, 'static');
}

async function generateBlogSitemap() {
    // Get blog posts from the blog Supabase instance
    const { data: posts, error } = await blogSupabase
        .from('blog_posts')
        .select('slug, created_at')
        .order('created_at', { ascending: false });

    if (error) throw error;

    const urls = [];
    for (const post of posts) {
        const url = `${SITE_URL}/blog/${post.slug}`;
        urls.push({
            loc: url,
            lastmod: post.created_at,
            changefreq: 'weekly',
            priority: 0.7
        });
    }

    return generateSitemapXml(urls, 'blog');
}

async function generateTradesSitemap() {
    // Get trades from the main Supabase instance
    const { data: trades, error: tradesError } = await mainSupabase
        .from('categories')
        .select('slug');

    if (tradesError) throw tradesError;

    // Get subregions from the main Supabase instance
    const { data: subregions, error: subregionsError } = await mainSupabase
        .from('subregions')
        .select('slug');

    if (subregionsError) throw subregionsError;

    const urls = [];
    const currentDate = new Date().toISOString();

    // If we couldn't get trades from the database, use a fallback list
    const tradesList = trades && trades.length > 0 
        ? trades.map(t => t.slug) 
        : [
            'home-remodeling', 'bathroom-remodeling', 'kitchen-remodeling',
            'siding-and-gutters', 'plumbing', 'electrical', 'hvac', 'roofing',
            'painting', 'landscaping', 'masonry', 'decks', 'flooring',
            'windows', 'fencing', 'epoxy-garage'
        ];

    // If we couldn't get subregions from the database, use a fallback list
    const subregionsList = subregions && subregions.length > 0
        ? subregions.map(s => s.slug)
        : [
            'denver', 'aurora', 'lakewood', 'arvada', 'westminster',
            'thornton', 'highlands-ranch', 'broomfield', 'commerce-city',
            'parker', 'littleton', 'northglenn', 'englewood', 'wheat-ridge',
            'golden'
        ];

    for (const trade of tradesList) {
        // Main trade page
        const tradeUrl = `${SITE_URL}/trades/${trade}`;
        urls.push({
            loc: tradeUrl,
            lastmod: currentDate,
            changefreq: 'daily',
            priority: 0.9
        });

        // Trade blog page
        const tradeBlogUrl = `${SITE_URL}/blog/trades/${trade}`;
        urls.push({
            loc: tradeBlogUrl,
            lastmod: currentDate,
            changefreq: 'daily',
            priority: 0.8
        });

        // Service page
        const serviceUrl = `${SITE_URL}/services/${trade}`;
        urls.push({
            loc: serviceUrl,
            lastmod: currentDate,
            changefreq: 'daily',
            priority: 0.9
        });

        // Subregion pages
        for (const subregion of subregionsList) {
            const subregionUrl = `${SITE_URL}/trades/${trade}/${subregion}`;
            urls.push({
                loc: subregionUrl,
                lastmod: currentDate,
                changefreq: 'daily',
                priority: 0.8
            });

            // Service location pages
            const serviceLocationUrl = `${SITE_URL}/services/${trade}/${subregion}`;
            urls.push({
                loc: serviceLocationUrl,
                lastmod: currentDate,
                changefreq: 'daily',
                priority: 0.8
            });
        }
    }

    return generateSitemapXml(urls, 'trades');
}

async function generateVideosSitemap() {
    // Get videos from the main Supabase instance
    const { data: videos, error } = await mainSupabase
        .from('videos')
        .select('id, category, created_at')
        .order('created_at', { ascending: false });

    if (error) throw error;

    const urls = [];
    for (const video of videos) {
        const url = `${SITE_URL}/videos/${video.category}/${video.id}`;
        urls.push({
            loc: url,
            lastmod: video.created_at,
            changefreq: 'weekly',
            priority: 0.8
        });
    }

    return generateSitemapXml(urls, 'videos');
}

async function generateSitemapIndex(sitemapFiles) {
    const currentDate = new Date().toISOString();
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapFiles.map(file => `    <sitemap>
        <loc>${SITE_URL}/${file}</loc>
        <lastmod>${currentDate}</lastmod>
    </sitemap>`).join('\n')}
</sitemapindex>`;
}

async function generateAllSitemaps() {
    try {
        console.log('Generating sitemaps...');
        const publicDir = path.join(process.cwd(), 'public');
        
        // Make sure the public directory exists
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        // Generate each sitemap
        console.log('Generating static sitemap...');
        const staticSitemap = await generateStaticSitemap();
        fs.writeFileSync(path.join(publicDir, 'sitemap-static.xml'), staticSitemap);

        console.log('Generating blog sitemap...');
        const blogSitemap = await generateBlogSitemap();
        fs.writeFileSync(path.join(publicDir, 'sitemap-blog.xml'), blogSitemap);

        console.log('Generating trades sitemap...');
        const tradesSitemap = await generateTradesSitemap();
        fs.writeFileSync(path.join(publicDir, 'sitemap-trades.xml'), tradesSitemap);

        console.log('Generating videos sitemap...');
        const videosSitemap = await generateVideosSitemap();
        fs.writeFileSync(path.join(publicDir, 'sitemap-videos.xml'), videosSitemap);

        // Generate sitemap index file
        console.log('Generating sitemap index...');
        const sitemapIndex = await generateSitemapIndex([
            'sitemap-static.xml',
            'sitemap-blog.xml',
            'sitemap-trades.xml',
            'sitemap-videos.xml'
        ]);
        fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndex);

        console.log('All sitemaps generated successfully!');
    } catch (error) {
        console.error('Error generating sitemaps:', error);
        process.exit(1);
    }
}

generateAllSitemaps();
