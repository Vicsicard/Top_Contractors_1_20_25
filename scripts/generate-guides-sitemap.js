const fs = require('fs');
const path = require('path');

// Read guides from the TypeScript file
const guidesFilePath = path.join(__dirname, '../src/data/guides.ts');
const guidesContent = fs.readFileSync(guidesFilePath, 'utf8');

// Extract all guide slugs using regex
const slugMatches = guidesContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
const slugs = Array.from(slugMatches, match => match[1]);

console.log(`Found ${slugs.length} guides`);

// Generate sitemap XML
const baseUrl = 'https://topcontractorsdenver.com';
const now = new Date().toISOString();

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/guides/</loc>
        <lastmod>${now}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
`;

// Add all guide URLs
slugs.forEach(slug => {
    xml += `    <url>
        <loc>${baseUrl}/guides/${slug}/</loc>
        <lastmod>${now}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
`;
});

xml += `</urlset>
`;

// Write to sitemap file
const sitemapPath = path.join(__dirname, '../public/sitemap-guides.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

console.log(`✅ Generated sitemap with ${slugs.length} guides`);
console.log(`📝 Written to: ${sitemapPath}`);
console.log(`\nGuides included:`);
slugs.forEach((slug, i) => console.log(`${i + 1}. ${slug}`));
