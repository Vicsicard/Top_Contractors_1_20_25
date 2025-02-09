import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DOMAIN = 'https://topcontractors.com';
const currentDate = new Date().toISOString();

async function generateSitemap() {
  try {
    // Fetch all posts from Supabase
    const { data: posts, error } = await supabase
      .from('posts')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Start XML content
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${DOMAIN}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${DOMAIN}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${DOMAIN}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Blog Posts -->`;

    // Add each blog post
    posts?.forEach(post => {
      xml += `
  <url>
    <loc>${DOMAIN}/blog/${post.slug}</loc>
    <lastmod>${post.updated_at}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // Close XML
    xml += '\n</urlset>';

    // Write to file
    fs.writeFileSync('public/sitemap.xml', xml);
    console.log(`✅ Sitemap generated with ${posts?.length} blog posts`);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the generator
generateSitemap();
