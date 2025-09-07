/**
 * Generate a dedicated sitemap for blog pagination pages
 * 
 * This script creates a sitemap specifically for blog pagination pages
 * to ensure they are properly indexed by search engines.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const SITE_URL = 'https://topcontractorsdenver.com';
const POSTS_PER_PAGE = 6; // Same as in blog/page.tsx
const OUTPUT_FILE = path.join(__dirname, '../public/sitemap-blog-pagination.xml');

// Initialize Supabase client
const blogSupabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
const blogSupabaseKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY;

if (!blogSupabaseUrl || !blogSupabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(blogSupabaseUrl, blogSupabaseKey);

async function generateBlogPaginationSitemap() {
  try {
    console.log('Fetching total post count from merge_blog_posts table...');
    
    // Get total post count
    const { count, error } = await supabase
      .from('merge_blog_posts')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error fetching post count:', error);
      // Use a fallback count from memory
      console.log('Using fallback post count of 1596');
      totalPosts = 1596;
    } else {
      totalPosts = count;
      console.log(`Found ${totalPosts} total posts`);
    }
    
    // Calculate total pages
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    console.log(`Generating sitemap for ${totalPages} pagination pages`);
    
    // Generate sitemap entries for pagination pages
    const urls = [];
    const currentDate = new Date().toISOString();
    
    // Add main blog page
    urls.push({
      loc: `${SITE_URL}/blog`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    });
    
    // Add pagination pages
    for (let i = 2; i <= totalPages; i++) {
      urls.push({
        loc: `${SITE_URL}/blog?page=${i}`,
        lastmod: currentDate,
        changefreq: 'daily',
        priority: 0.8
      });
    }
    
    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    // Write sitemap to file
    fs.writeFileSync(OUTPUT_FILE, sitemap);
    console.log(`Blog pagination sitemap generated at: ${OUTPUT_FILE}`);
    
    // Update the sitemap index to include this new sitemap
    updateSitemapIndex();
    
    return urls.length;
  } catch (error) {
    console.error('Error generating blog pagination sitemap:', error);
    return 0;
  }
}

function updateSitemapIndex() {
  try {
    const indexPath = path.join(__dirname, '../public/sitemap.xml');
    const currentDate = new Date().toISOString();
    
    // Check if sitemap index exists
    if (fs.existsSync(indexPath)) {
      console.log('Updating existing sitemap index...');
      
      // Read existing sitemap index
      let sitemapIndex = fs.readFileSync(indexPath, 'utf8');
      
      // Check if our pagination sitemap is already included
      if (!sitemapIndex.includes('sitemap-blog-pagination.xml')) {
        // Add our new sitemap to the index
        const newSitemapEntry = `    <sitemap>
        <loc>${SITE_URL}/sitemap-blog-pagination.xml</loc>
        <lastmod>${currentDate}</lastmod>
    </sitemap>
</sitemapindex>`;
        
        // Replace closing tag with our new entry + closing tag
        sitemapIndex = sitemapIndex.replace('</sitemapindex>', newSitemapEntry);
        
        // Write updated index
        fs.writeFileSync(indexPath, sitemapIndex);
        console.log('Sitemap index updated successfully');
      } else {
        console.log('Blog pagination sitemap already included in index');
      }
    } else {
      console.log('Sitemap index not found, creating new one...');
      
      // Create a new sitemap index
      const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${SITE_URL}/sitemap-blog-pagination.xml</loc>
        <lastmod>${currentDate}</lastmod>
    </sitemap>
</sitemapindex>`;
      
      fs.writeFileSync(indexPath, sitemapIndex);
      console.log('New sitemap index created');
    }
  } catch (error) {
    console.error('Error updating sitemap index:', error);
  }
}

// Execute the script
generateBlogPaginationSitemap()
  .then(count => {
    console.log(`Added ${count} pagination URLs to sitemap`);
    console.log('Done!');
  })
  .catch(console.error);
