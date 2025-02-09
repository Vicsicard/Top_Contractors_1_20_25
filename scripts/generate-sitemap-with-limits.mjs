import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SITE_URL = 'https://topcontractorsdenver.com';
const RATE_LIMIT_DELAY = 100; // 100ms delay between operations

// Helper function to add delay between operations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
    const urls = [];
    
    // Add static pages with rate limiting
    const staticPages = [
        { path: '', priority: 1.0, changefreq: 'daily' },
        { path: 'about', priority: 0.6, changefreq: 'monthly' },
        { path: 'contact', priority: 0.6, changefreq: 'monthly' },
        { path: 'trades', priority: 0.8, changefreq: 'weekly' },
        { path: 'blog', priority: 0.9, changefreq: 'daily' },
        { path: 'videos', priority: 0.9, changefreq: 'daily' }
    ];

    // Add trades categories with rate limiting
    const trades = [
        'home-remodeling',
        'bathroom-remodeling',
        'kitchen-remodeling',
        'siding-and-gutters',
        'plumbing',
        'electrical',
        'hvac',
        'roofing',
        'painting',
        'landscaping',
        'masonry',
        'decks',
        'flooring',
        'windows',
        'fencing',
        'epoxy-garage'
    ];

    // Add subregions with rate limiting
    const subregions = [
        'denver',
        'aurora',
        'lakewood',
        'arvada',
        'westminster',
        'thornton',
        'highlands-ranch',
        'broomfield',
        'commerce-city',
        'parker',
        'littleton',
        'northglenn',
        'englewood',
        'wheat-ridge',
        'golden'
    ];

    console.log('Adding static pages...');
    for (const { path, priority } of staticPages) {
        urls.push({
            loc: `${SITE_URL}${path ? `/${path}` : ''}`,
            changefreq: 'monthly',
            priority
        });
        await delay(RATE_LIMIT_DELAY);
    }

    console.log('Adding trade pages...');
    for (const trade of trades) {
        // Add main trade page
        urls.push({
            loc: `${SITE_URL}/trades/${trade}`,
            changefreq: 'weekly',
            priority: 0.8
        });
        await delay(RATE_LIMIT_DELAY);

        // Add trade subregion pages
        for (const subregion of subregions) {
            urls.push({
                loc: `${SITE_URL}/trades/${trade}/${subregion}`,
                changefreq: 'weekly',
                priority: 0.7
            });
            await delay(RATE_LIMIT_DELAY);
        }
    }

    try {
        // Fetch all blog posts with pagination
        console.log('Fetching blog posts...');
        const { data: posts, error: postsError } = await supabase
            .from('posts')
            .select('*')
            .order('published_at', { ascending: false });

        if (postsError) throw postsError;

        console.log(`Found ${posts.length} blog posts`);
        
        // Add blog posts to sitemap
        for (const post of posts) {
            urls.push({
                loc: `${SITE_URL}/blog/${post.slug}`,
                lastmod: post.updated_at || post.published_at,
                changefreq: 'weekly',
                priority: 0.7
            });
            await delay(RATE_LIMIT_DELAY);
        }

        // Add trade blog pages
        console.log('Adding trade blog pages...');
        for (const trade of trades) {
            urls.push({
                loc: `${SITE_URL}/blog/trades/${trade}`,
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: 0.9
            });
            await delay(RATE_LIMIT_DELAY);
        }

        // Fetch all videos
        console.log('Fetching videos...');
        const { data: videos, error: videosError } = await supabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });

        if (videosError) throw videosError;

        console.log(`Found ${videos.length} videos`);

        // Add video pages to sitemap
        for (const video of videos) {
            urls.push({
                loc: `${SITE_URL}/videos/${video.category}/${video.id}`,
                lastmod: video.created_at,
                changefreq: 'weekly',
                priority: 0.8
            });
            await delay(RATE_LIMIT_DELAY);
        }

        // Generate sitemap XML with proper formatting
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `    <url>
        <loc>${url.loc}</loc>
        ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`).join('\n')}
</urlset>`;

        // Write sitemap to public directory
        const publicDir = path.join(process.cwd(), 'public');
        fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
        console.log('Sitemap generated successfully!');
        
        // Write verification copy
        fs.writeFileSync(path.join(publicDir, 'sitemap_new.xml'), sitemap);
        console.log('Sitemap verification copy created as sitemap_new.xml');
        
        // Log total URLs
        console.log(`Total URLs in sitemap: ${urls.length}`);
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
}

generateSitemap().catch(console.error);
