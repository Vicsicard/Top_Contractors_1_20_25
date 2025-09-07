import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Debug environment variables
console.log('Environment variables loaded:');
console.log('NEXT_PUBLIC_MAIN_SUPABASE_URL:', process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL ? '✓ Set' : '✗ Missing');
console.log('NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing');
console.log('NEXT_PUBLIC_BLOG_SUPABASE_URL:', process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL ? '✓ Set' : '✗ Missing');
console.log('NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing');

const SITE_URL = 'https://topcontractorsdenver.com';
const RATE_LIMIT_DELAY = 100; // 100ms delay between operations

// Helper function to add delay between operations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize Supabase clients for both projects
const mainSupabaseUrl = process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL;
const mainSupabaseKey = process.env.NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY;
const blogSupabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
const blogSupabaseKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY;

if (!mainSupabaseUrl || !mainSupabaseKey || !blogSupabaseUrl || !blogSupabaseKey) {
    throw new Error('Missing Supabase environment variables. Please ensure NEXT_PUBLIC_MAIN_SUPABASE_URL, NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY, NEXT_PUBLIC_BLOG_SUPABASE_URL, and NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY are set in .env.local');
}

const mainSupabase = createClient(mainSupabaseUrl, mainSupabaseKey);
const blogSupabase = createClient(blogSupabaseUrl, blogSupabaseKey);

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
        // Fetch all blog posts from the merged table
        console.log('Fetching blog posts from merged_blog_posts table...');
        const { data: posts, error: postsError } = await blogSupabase
            .from('merge_blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (postsError) {
            console.error('Error fetching from merge_blog_posts:', postsError);
            throw postsError;
        }

        console.log(`Found ${posts?.length || 0} blog posts in merged table`);
        
        // Calculate and add blog pagination pages
        const POSTS_PER_PAGE = 6; // Same as in blog/page.tsx
        const totalPages = Math.ceil((posts?.length || 0) / POSTS_PER_PAGE);
        console.log(`Adding ${totalPages} blog pagination pages to sitemap`);
        
        for (let i = 1; i <= totalPages; i++) {
            urls.push({
                loc: i === 1 ? `${SITE_URL}/blog` : `${SITE_URL}/blog?page=${i}`,
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: i === 1 ? 0.9 : 0.8
            });
            await delay(RATE_LIMIT_DELAY);
        }
        
        // Add blog posts to sitemap
        for (const post of posts) {
            urls.push({
                loc: `${SITE_URL}/blog/${post.slug}`,
                lastmod: post.created_at || new Date().toISOString(),
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

        // Fetch all videos from main Supabase project
        console.log('Fetching videos from main Supabase project...');
        const { data: videos, error: videosError } = await mainSupabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });

        if (videosError) {
            console.error('Error fetching videos:', videosError);
            throw videosError;
        }

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
