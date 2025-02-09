import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const SITE_URL = 'https://topcontractorsdenver.com';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
        { path: 'contact', priority: 0.6, changefreq: 'monthly' },
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
        if (await isUrlValid(url)) {
            urls.push({
                loc: url,
                lastmod: currentDate,
                changefreq: page.changefreq,
                priority: page.priority
            });
        } else {
            console.warn(`Warning: URL ${url} is not accessible`);
        }
    }

    return generateSitemapXml(urls, 'static');
}

async function generateBlogSitemap() {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('slug, updated_at, published_at')
        .order('published_at', { ascending: false });

    if (error) throw error;

    const urls = [];
    for (const post of posts) {
        const url = `${SITE_URL}/blog/${post.slug}`;
        if (await isUrlValid(url)) {
            urls.push({
                loc: url,
                lastmod: post.updated_at || post.published_at,
                changefreq: 'weekly',
                priority: 0.7
            });
        }
    }

    return generateSitemapXml(urls, 'blog');
}

async function generateTradesSitemap() {
    const trades = [
        'home-remodeling', 'bathroom-remodeling', 'kitchen-remodeling',
        'siding-and-gutters', 'plumbing', 'electrical', 'hvac', 'roofing',
        'painting', 'landscaping', 'masonry', 'decks', 'flooring',
        'windows', 'fencing', 'epoxy-garage'
    ];

    const subregions = [
        'denver', 'aurora', 'lakewood', 'arvada', 'westminster',
        'thornton', 'highlands-ranch', 'broomfield', 'commerce-city',
        'parker', 'littleton', 'northglenn', 'englewood', 'wheat-ridge',
        'golden'
    ];

    const urls = [];
    const currentDate = new Date().toISOString();

    for (const trade of trades) {
        // Main trade page
        const tradeUrl = `${SITE_URL}/trades/${trade}`;
        if (await isUrlValid(tradeUrl)) {
            urls.push({
                loc: tradeUrl,
                lastmod: currentDate,
                changefreq: 'daily',
                priority: 0.9
            });
        }

        // Trade blog page
        const tradeBlogUrl = `${SITE_URL}/blog/trades/${trade}`;
        if (await isUrlValid(tradeBlogUrl)) {
            urls.push({
                loc: tradeBlogUrl,
                lastmod: currentDate,
                changefreq: 'daily',
                priority: 0.8
            });
        }

        // Subregion pages
        for (const subregion of subregions) {
            const subregionUrl = `${SITE_URL}/trades/${trade}/${subregion}`;
            if (await isUrlValid(subregionUrl)) {
                urls.push({
                    loc: subregionUrl,
                    lastmod: currentDate,
                    changefreq: 'daily',
                    priority: 0.8
                });
            }
        }
    }

    return generateSitemapXml(urls, 'trades');
}

async function generateVideosSitemap() {
    const { data: videos, error } = await supabase
        .from('videos')
        .select('id, category, created_at')
        .order('created_at', { ascending: false });

    if (error) throw error;

    const urls = [];
    for (const video of videos) {
        const url = `${SITE_URL}/videos/${video.category}/${video.id}`;
        if (await isUrlValid(url)) {
            urls.push({
                loc: url,
                lastmod: video.created_at,
                changefreq: 'weekly',
                priority: 0.8
            });
        }
    }

    return generateSitemapXml(urls, 'videos');
}

async function generateAllSitemaps() {
    try {
        console.log('Generating sitemaps...');
        const publicDir = path.join(process.cwd(), 'public');

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

        console.log('All sitemaps generated successfully!');
    } catch (error) {
        console.error('Error generating sitemaps:', error);
        process.exit(1);
    }
}

generateAllSitemaps();
