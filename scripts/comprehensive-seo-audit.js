const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const mainSupabase = createClient(
  process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL,
  process.env.MAIN_SUPABASE_SERVICE_ROLE_KEY
);

const blogSupabase = createClient(
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL,
  process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY
);

async function auditSEO() {
  console.log('🔍 COMPREHENSIVE SEO AUDIT\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // 1. Check robots.txt
  console.log('1️⃣ ROBOTS.TXT ANALYSIS:\n');
  const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
  const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
  const robotsLines = robotsContent.split('\n').filter(l => l.trim());
  
  const sitemapsInRobots = robotsLines.filter(l => l.startsWith('Sitemap:')).map(l => l.split('Sitemap:')[1].trim());
  console.log(`  Sitemaps declared: ${sitemapsInRobots.length}`);
  sitemapsInRobots.forEach(s => console.log(`    - ${s}`));
  
  const disallowRules = robotsLines.filter(l => l.startsWith('Disallow:'));
  console.log(`\n  Disallow rules: ${disallowRules.length}`);
  disallowRules.forEach(r => console.log(`    ${r}`));

  // 2. Check actual sitemap files
  console.log('\n2️⃣ SITEMAP FILES ON DISK:\n');
  const publicDir = path.join(__dirname, '..', 'public');
  const actualSitemaps = fs.readdirSync(publicDir).filter(f => f.includes('sitemap') && f.endsWith('.xml'));
  
  console.log(`  Files found: ${actualSitemaps.length}`);
  const orphanedSitemaps = actualSitemaps.filter(f => 
    !sitemapsInRobots.some(s => s.includes(f))
  );
  
  if (orphanedSitemaps.length > 0) {
    console.log(`\n  ⚠️ ORPHANED (not in robots.txt): ${orphanedSitemaps.length}`);
    orphanedSitemaps.forEach(f => console.log(`    - ${f}`));
  }

  // 3. Analyze sitemap content
  console.log('\n3️⃣ SITEMAP CONTENT ANALYSIS:\n');
  
  const sitemapBlogPath = path.join(publicDir, 'sitemap-blog.xml');
  if (fs.existsSync(sitemapBlogPath)) {
    const blogSitemapContent = fs.readFileSync(sitemapBlogPath, 'utf-8');
    const urlMatches = blogSitemapContent.match(/<loc>/g);
    console.log(`  sitemap-blog.xml: ${urlMatches ? urlMatches.length : 0} URLs`);
    
    // Check for invalid slugs in sitemap
    const invalidUrlMatches = blogSitemapContent.match(/\/blog\/-[^<]+/g);
    if (invalidUrlMatches && invalidUrlMatches.length > 0) {
      console.log(`  ⚠️ Found ${invalidUrlMatches.length} URLs with leading dash (need regeneration)`);
    }
  }

  // 4. Check for noindex in code
  console.log('\n4️⃣ CHECKING FOR NOINDEX TAGS IN CODE:\n');
  
  const srcDir = path.join(__dirname, '..', 'src');
  let noindexFiles = [];
  
  function searchForNoindex(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        searchForNoindex(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content.includes('noindex') || content.includes('noIndex')) {
          const lines = content.split('\n');
          const noindexLines = lines
            .map((line, idx) => ({ line, num: idx + 1 }))
            .filter(({ line }) => line.includes('noindex') || line.includes('noIndex'));
          
          if (noindexLines.length > 0) {
            noindexFiles.push({
              file: filePath.replace(srcDir, 'src'),
              lines: noindexLines
            });
          }
        }
      }
    }
  }
  
  searchForNoindex(srcDir);
  
  if (noindexFiles.length > 0) {
    console.log(`  ⚠️ Found noindex in ${noindexFiles.length} files:`);
    noindexFiles.forEach(({ file, lines }) => {
      console.log(`\n    ${file}:`);
      lines.forEach(({ line, num }) => {
        console.log(`      Line ${num}: ${line.trim().substring(0, 80)}`);
      });
    });
  } else {
    console.log('  ✅ No noindex tags found in source code');
  }

  // 5. Check metadata quality
  console.log('\n5️⃣ METADATA QUALITY CHECK:\n');
  
  // Check blog posts for missing metadata
  const { data: posts } = await blogSupabase
    .from('merge_blog_posts')
    .select('id, title, slug, content, tags');
  
  const postsWithoutTags = posts?.filter(p => !p.tags || p.tags.trim() === '') || [];
  const postsWithShortContent = posts?.filter(p => !p.content || p.content.length < 200) || [];
  const postsWithLongTitles = posts?.filter(p => p.title && p.title.length > 60) || [];
  
  console.log(`  Total blog posts: ${posts?.length || 0}`);
  console.log(`  Posts without tags: ${postsWithoutTags.length} (${((postsWithoutTags.length / (posts?.length || 1)) * 100).toFixed(1)}%)`);
  console.log(`  Posts with short content (<200 chars): ${postsWithShortContent.length}`);
  console.log(`  Posts with long titles (>60 chars): ${postsWithLongTitles.length}`);

  // 6. Check contractor pages
  console.log('\n6️⃣ CONTRACTOR PAGES ANALYSIS:\n');
  
  const { data: categories } = await mainSupabase.from('categories').select('*');
  const { data: subregions } = await mainSupabase.from('subregions').select('*');
  const { data: contractors } = await mainSupabase.from('contractors').select('*');
  
  console.log(`  Categories: ${categories?.length || 0}`);
  console.log(`  Subregions: ${subregions?.length || 0}`);
  console.log(`  Total contractors: ${contractors?.length || 0}`);
  console.log(`  Potential trade/location pages: ${(categories?.length || 0) * (subregions?.length || 0)}`);
  
  // Check for contractors without proper data
  const contractorsNoPhone = contractors?.filter(c => !c.phone) || [];
  const contractorsNoAddress = contractors?.filter(c => !c.address) || [];
  
  console.log(`\n  Contractors missing phone: ${contractorsNoPhone.length}`);
  console.log(`  Contractors missing address: ${contractorsNoAddress.length}`);

  // 7. Check for duplicate content
  console.log('\n7️⃣ DUPLICATE CONTENT CHECK:\n');
  
  const titleCounts = {};
  posts?.forEach(p => {
    const normalized = p.title.toLowerCase().trim();
    titleCounts[normalized] = (titleCounts[normalized] || 0) + 1;
  });
  
  const duplicateTitles = Object.entries(titleCounts).filter(([_, count]) => count > 1);
  if (duplicateTitles.length > 0) {
    console.log(`  ⚠️ Found ${duplicateTitles.length} duplicate titles:`);
    duplicateTitles.slice(0, 5).forEach(([title, count]) => {
      console.log(`    - "${title.substring(0, 60)}..." (${count} times)`);
    });
  } else {
    console.log('  ✅ No duplicate titles found');
  }

  // 8. URL structure analysis
  console.log('\n8️⃣ URL STRUCTURE ANALYSIS:\n');
  
  const blogUrls = posts?.map(p => `/blog/${p.slug}/`) || [];
  const tradeUrls = [];
  
  categories?.forEach(cat => {
    subregions?.forEach(sub => {
      tradeUrls.push(`/trades/${cat.slug}/${sub.slug}/`);
    });
  });
  
  console.log(`  Blog URLs: ${blogUrls.length}`);
  console.log(`  Trade URLs: ${tradeUrls.length}`);
  console.log(`  Total dynamic URLs: ${blogUrls.length + tradeUrls.length}`);
  
  // Check for URL length issues
  const longUrls = [...blogUrls, ...tradeUrls].filter(url => url.length > 100);
  if (longUrls.length > 0) {
    console.log(`\n  ⚠️ ${longUrls.length} URLs longer than 100 characters`);
    longUrls.slice(0, 3).forEach(url => console.log(`    - ${url}`));
  }

  // 9. Internal linking opportunities
  console.log('\n9️⃣ INTERNAL LINKING ANALYSIS:\n');
  
  const contractorTags = ['electrician', 'plumbing', 'hvac', 'roofer', 'kitchen', 'bathroom', 'remodeling'];
  const taggedPosts = {};
  
  contractorTags.forEach(tag => {
    const matching = posts?.filter(p => 
      p.tags?.toLowerCase().includes(tag) || 
      p.title?.toLowerCase().includes(tag)
    ) || [];
    if (matching.length > 0) {
      taggedPosts[tag] = matching.length;
    }
  });
  
  console.log('  Blog posts by contractor category:');
  Object.entries(taggedPosts).forEach(([tag, count]) => {
    console.log(`    - ${tag.padEnd(20)} ${count.toString().padStart(4)} posts`);
  });

  // 10. Performance indicators
  console.log('\n🔟 SEO PERFORMANCE INDICATORS:\n');
  
  const totalPages = 5 + tradeUrls.length + blogUrls.length + Math.ceil(posts?.length / 6) + 19;
  const indexedPages = 327;
  const indexRate = ((indexedPages / totalPages) * 100).toFixed(1);
  
  console.log(`  Total pages: ${totalPages}`);
  console.log(`  Indexed by Google: ${indexedPages}`);
  console.log(`  Index rate: ${indexRate}%`);
  console.log(`  Target: >80%`);
  console.log(`  Status: ${indexRate > 80 ? '✅ GOOD' : indexRate > 50 ? '⚠️ NEEDS IMPROVEMENT' : '❌ CRITICAL'}`);

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('✅ SEO AUDIT COMPLETE\n');
}

auditSEO().catch(console.error);
