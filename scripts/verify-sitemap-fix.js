const fs = require('fs');

const content = fs.readFileSync('public/sitemap-blog.xml', 'utf-8');
const invalidMatches = content.match(/\/blog\/-[^<]+/g);

if (invalidMatches && invalidMatches.length > 0) {
  console.log(`❌ Found ${invalidMatches.length} URLs with leading dash:`);
  invalidMatches.slice(0, 10).forEach(url => console.log(`  ${url}`));
} else {
  console.log('✅ No invalid URLs with leading dash found in sitemap-blog.xml');
}

// Count total URLs
const urlMatches = content.match(/<loc>/g);
console.log(`\n📊 Total URLs in sitemap-blog.xml: ${urlMatches ? urlMatches.length : 0}`);
