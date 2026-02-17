const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const mainSupabase = createClient(
  process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL,
  process.env.MAIN_SUPABASE_SERVICE_ROLE_KEY
);

const blogSupabase = createClient(
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL,
  process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY
);

async function checkIndexingIssues() {
  console.log('🔍 CHECKING POTENTIAL INDEXING ISSUES\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Check for duplicate slugs in blog posts
  console.log('1️⃣ CHECKING FOR DUPLICATE BLOG POST SLUGS:\n');
  const { data: allPosts } = await blogSupabase
    .from('merge_blog_posts')
    .select('slug, title');
  
  const slugCounts = {};
  allPosts?.forEach(post => {
    slugCounts[post.slug] = (slugCounts[post.slug] || 0) + 1;
  });
  
  const duplicates = Object.entries(slugCounts).filter(([slug, count]) => count > 1);
  if (duplicates.length > 0) {
    console.log(`  ⚠️ Found ${duplicates.length} duplicate slugs:`);
    duplicates.slice(0, 10).forEach(([slug, count]) => {
      console.log(`    - ${slug} (${count} times)`);
    });
  } else {
    console.log('  ✅ No duplicate slugs found');
  }

  // Check for posts with invalid slugs
  console.log('\n2️⃣ CHECKING FOR INVALID BLOG POST SLUGS:\n');
  const invalidSlugs = allPosts?.filter(post => 
    !post.slug || 
    post.slug.trim() === '' || 
    post.slug.startsWith('-') ||
    post.slug.includes('//') ||
    post.slug.includes(' ')
  );
  
  if (invalidSlugs && invalidSlugs.length > 0) {
    console.log(`  ⚠️ Found ${invalidSlugs.length} posts with invalid slugs:`);
    invalidSlugs.slice(0, 10).forEach(post => {
      console.log(`    - "${post.slug}" (${post.title.substring(0, 50)}...)`);
    });
  } else {
    console.log('  ✅ All slugs are valid');
  }

  // Check for posts with non-contractor tags
  console.log('\n3️⃣ CHECKING TAG DISTRIBUTION:\n');
  const tagCounts = {};
  allPosts?.forEach(post => {
    if (post.tags) {
      const tags = post.tags.split(',').map(t => t.trim());
      tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  console.log('  Top 15 tags:');
  sortedTags.slice(0, 15).forEach(([tag, count]) => {
    console.log(`    - ${tag.padEnd(30)} ${count.toString().padStart(4)} posts`);
  });

  // Check contractor data
  console.log('\n4️⃣ CHECKING CONTRACTOR PAGES:\n');
  const { data: categories } = await mainSupabase
    .from('categories')
    .select('id, slug, category_name');
  
  const { data: subregions } = await mainSupabase
    .from('subregions')
    .select('id, slug, subregion_name');
  
  console.log(`  Categories: ${categories?.length || 0}`);
  console.log(`  Subregions: ${subregions?.length || 0}`);
  console.log(`  Potential trade pages: ${(categories?.length || 0) * (subregions?.length || 0)}`);

  // Check for contractors without slugs
  const { data: contractorsNoSlug } = await mainSupabase
    .from('contractors')
    .select('id, contractor_name')
    .or('slug.is.null,slug.eq.')
    .limit(10);
  
  if (contractorsNoSlug && contractorsNoSlug.length > 0) {
    console.log(`\n  ⚠️ Found ${contractorsNoSlug.length}+ contractors without slugs`);
  } else {
    console.log('\n  ✅ All contractors have slugs');
  }

  // Estimate total pages
  console.log('\n5️⃣ ESTIMATED TOTAL PAGES:\n');
  const staticPages = 5; // home, about, contact, etc.
  const tradePages = (categories?.length || 0) * (subregions?.length || 0);
  const blogPages = Math.ceil((allPosts?.length || 0) / 6); // 6 posts per page
  const individualBlogPosts = allPosts?.length || 0;
  const videoPages = 19; // from diagnostics
  
  const totalEstimated = staticPages + tradePages + blogPages + individualBlogPosts + videoPages;
  
  console.log(`  Static pages:           ${staticPages.toString().padStart(6)}`);
  console.log(`  Trade pages:            ${tradePages.toString().padStart(6)}`);
  console.log(`  Blog pagination:        ${blogPages.toString().padStart(6)}`);
  console.log(`  Individual blog posts:  ${individualBlogPosts.toString().padStart(6)}`);
  console.log(`  Video pages:            ${videoPages.toString().padStart(6)}`);
  console.log(`  ─────────────────────────────`);
  console.log(`  TOTAL ESTIMATED:        ${totalEstimated.toString().padStart(6)}`);
  console.log(`\n  Google indexed:         ${327}`);
  console.log(`  Not indexed:            ${1050}`);
  console.log(`  Total in GSC:           ${1377}`);

  // Check sitemap files
  console.log('\n6️⃣ CHECKING SITEMAP FILES:\n');
  const fs = require('fs');
  const path = require('path');
  const publicDir = path.join(__dirname, '..', 'public');
  
  const sitemapFiles = fs.readdirSync(publicDir).filter(f => f.includes('sitemap') && f.endsWith('.xml'));
  console.log(`  Found ${sitemapFiles.length} sitemap files:`);
  sitemapFiles.forEach(file => {
    const filePath = path.join(publicDir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`    - ${file.padEnd(35)} ${sizeKB.padStart(8)} KB`);
  });

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('✅ ANALYSIS COMPLETE\n');
}

checkIndexingIssues().catch(console.error);
