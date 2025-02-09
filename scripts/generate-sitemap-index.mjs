import { createClient } from '@supabase/supabase-js';
import { getAllTrades, getAllSubregions } from '../src/utils/database.ts';
import { getAllPosts } from '../src/utils/posts.ts';
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://www.topcontractorsdenver.com';
const MAX_URLS_PER_SITEMAP = 10000; // Google's limit is 50,000 but we'll be conservative

async function generateSitemapFile(urls, filename) {
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

    const publicDir = path.join(process.cwd(), 'public');
    fs.writeFileSync(path.join(publicDir, filename), sitemap);
    console.log(`Generated ${filename} with ${urls.length} URLs`);
    return `${SITE_URL}/${filename}`;
}

async function generateSitemapIndex(sitemapUrls) {
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemapUrls.map(url => `
    <sitemap>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>`).join('')}
</sitemapindex>`;

    const publicDir = path.join(process.cwd(), 'public');
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndex);
    console.log('Generated sitemap index');
}

async function generateSitemaps() {
    const sitemapUrls = [];
    let currentUrls = [];
    let sitemapCount = 1;

    // Static pages
    const staticPages = [
        { path: '', priority: 1.0 },
        { path: 'about', priority: 0.8 },
        { path: 'contact', priority: 0.8 },
        { path: 'blog', priority: 0.9 },
        { path: 'trades', priority: 0.9 },
        { path: 'videos', priority: 0.9 },
        { path: 'privacy-policy', priority: 0.5 },
        { path: 'terms-of-service', priority: 0.5 },
    ];

    staticPages.forEach(({ path, priority }) => {
        currentUrls.push({
            loc: `${SITE_URL}${path ? `/${path}` : ''}`,
            changefreq: 'monthly',
            priority
        });
    });

    // Trade pages
    console.log('Fetching trades...');
    const trades = await getAllTrades();
    const subregions = await getAllSubregions();

    trades.forEach(trade => {
        // Main trade page
        currentUrls.push({
            loc: `${SITE_URL}/trades/${trade.slug}`,
            changefreq: 'weekly',
            priority: 0.8
        });

        // Trade + subregion pages
        subregions.forEach(subregion => {
            currentUrls.push({
                loc: `${SITE_URL}/trades/${trade.slug}/${subregion.slug}`,
                changefreq: 'weekly',
                priority: 0.7
            });
        });

        if (currentUrls.length >= MAX_URLS_PER_SITEMAP) {
            sitemapUrls.push(generateSitemapFile(currentUrls, `sitemap-${sitemapCount}.xml`));
            currentUrls = [];
            sitemapCount++;
        }
    });

    // Blog posts
    console.log('Fetching blog posts...');
    const posts = await getAllPosts();
    
    posts.forEach(post => {
        currentUrls.push({
            loc: `${SITE_URL}/blog/trades/${post.trade_category}/${post.slug}`,
            lastmod: new Date(post.published_at).toISOString(),
            changefreq: 'weekly',
            priority: 0.7
        });

        if (currentUrls.length >= MAX_URLS_PER_SITEMAP) {
            sitemapUrls.push(generateSitemapFile(currentUrls, `sitemap-${sitemapCount}.xml`));
            currentUrls = [];
            sitemapCount++;
        }
    });

    // Videos
    console.log('Fetching videos...');
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: videos } = await supabase.from('videos').select('*');

    if (videos) {
        videos.forEach(video => {
            currentUrls.push({
                loc: `${SITE_URL}/videos/${video.category}/${video.id}`,
                lastmod: new Date(video.created_at).toISOString(),
                changefreq: 'monthly',
                priority: 0.6
            });

            if (currentUrls.length >= MAX_URLS_PER_SITEMAP) {
                sitemapUrls.push(generateSitemapFile(currentUrls, `sitemap-${sitemapCount}.xml`));
                currentUrls = [];
                sitemapCount++;
            }
        });
    }

    // Generate final sitemap if there are remaining URLs
    if (currentUrls.length > 0) {
        sitemapUrls.push(await generateSitemapFile(currentUrls, `sitemap-${sitemapCount}.xml`));
    }

    // Generate sitemap index
    await generateSitemapIndex(sitemapUrls);
}

generateSitemaps().catch(console.error);
