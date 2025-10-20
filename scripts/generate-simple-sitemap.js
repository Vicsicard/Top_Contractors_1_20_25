/**
 * Simple Sitemap Generator
 * 
 * This script generates a basic sitemap for the Top Contractors Denver website
 * without requiring database access. It creates static sitemaps based on known
 * site structure and URL patterns.
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://topcontractorsdenver.com';
const PUBLIC_DIR = path.join(__dirname, '../public');
const CURRENT_DATE = new Date().toISOString();

// Define the site structure
const staticPages = [
  { path: '', priority: 1.0, changefreq: 'daily' },
  { path: 'about', priority: 0.6, changefreq: 'monthly' },
  { path: 'contact', priority: 0.6, changefreq: 'monthly' },
  { path: 'trades', priority: 0.8, changefreq: 'weekly' },
  { path: 'blog', priority: 0.9, changefreq: 'daily' },
  { path: 'videos', priority: 0.9, changefreq: 'daily' },
  { path: 'sitemap', priority: 0.5, changefreq: 'monthly' }
];

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

// Generate static sitemap
function generateStaticSitemap() {
  const urls = [];
  
  // Add static pages
  staticPages.forEach(page => {
    urls.push({
      loc: `${SITE_URL}/${page.path}/`,
      lastmod: CURRENT_DATE,
      changefreq: page.changefreq,
      priority: page.priority
    });
  });
  
  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  // Write to file
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-static.xml'), xml);
  console.log(`Generated sitemap-static.xml with ${urls.length} URLs`);
}

// Generate trades sitemap
function generateTradesSitemap() {
  const urls = [];
  
  // Add main trades page
  urls.push({
    loc: `${SITE_URL}/trades/`,
    lastmod: CURRENT_DATE,
    changefreq: 'weekly',
    priority: 0.8
  });
  
  // Add individual trade pages
  trades.forEach(trade => {
    urls.push({
      loc: `${SITE_URL}/trades/${trade}/`,
      lastmod: CURRENT_DATE,
      changefreq: 'weekly',
      priority: 0.8
    });
    
    // Add trade subregion pages
    subregions.forEach(subregion => {
      urls.push({
        loc: `${SITE_URL}/trades/${trade}/${subregion}/`,
        lastmod: CURRENT_DATE,
        changefreq: 'weekly',
        priority: 0.7
      });
    });
  });
  
  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  // Write to file
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-trades.xml'), xml);
  console.log(`Generated sitemap-trades.xml with ${urls.length} URLs`);
}

// Generate sitemap index
function generateSitemapIndex() {
  const sitemaps = [
    { name: 'static', lastmod: CURRENT_DATE },
    { name: 'blog', lastmod: CURRENT_DATE },
    { name: 'trades', lastmod: CURRENT_DATE },
    { name: 'videos', lastmod: CURRENT_DATE }
  ];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `    <sitemap>
        <loc>${SITE_URL}/sitemap-${sitemap.name}.xml</loc>
        <lastmod>${sitemap.lastmod}</lastmod>
    </sitemap>`).join('\n')}
</sitemapindex>`;
  
  // Write to file
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml);
  console.log(`Generated sitemap.xml index with ${sitemaps.length} sitemaps`);
}

// Generate placeholder for blog and videos sitemaps
function generatePlaceholderSitemaps() {
  // Blog sitemap placeholder
  if (!fs.existsSync(path.join(PUBLIC_DIR, 'sitemap-blog.xml'))) {
    const blogXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/blog/</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-blog.xml'), blogXml);
    console.log('Generated placeholder sitemap-blog.xml');
  }
  
  // Videos sitemap placeholder
  if (!fs.existsSync(path.join(PUBLIC_DIR, 'sitemap-videos.xml'))) {
    const videosXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/videos/</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-videos.xml'), videosXml);
    console.log('Generated placeholder sitemap-videos.xml');
  }
}

// Main function
function generateSitemaps() {
  console.log('Starting sitemap generation...');
  
  // Create public directory if it doesn't exist
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }
  
  // Generate sitemaps
  generateStaticSitemap();
  generateTradesSitemap();
  generatePlaceholderSitemaps();
  generateSitemapIndex();
  
  console.log('Sitemap generation complete!');
}

// Run the generator
generateSitemaps();
