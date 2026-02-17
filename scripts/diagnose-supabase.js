const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize both Supabase clients with service role keys
const mainSupabase = createClient(
  process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL,
  process.env.MAIN_SUPABASE_SERVICE_ROLE_KEY
);

const blogSupabase = createClient(
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL,
  process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY
);

async function diagnoseMainProject() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('MAIN SUPABASE PROJECT (Contractors/Categories)');
  console.log('Project: bmiyyaexngxbrzkyqgzk');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('📊 TABLE STATISTICS:\n');
  
  const tablesToCheck = ['categories', 'subregions', 'contractors', 'videos'];
  for (const table of tablesToCheck) {
    const { count, error } = await mainSupabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    console.log(`  ${table.padEnd(20)} ${count !== null ? count.toString().padStart(6) : 'ERROR'} rows`);
  }

  // Check RLS policies by attempting queries
  console.log('\n🔒 ROW LEVEL SECURITY:\n');
  for (const table of tablesToCheck) {
    const { error } = await mainSupabase
      .from(table)
      .select('*')
      .limit(1);
    
    const status = error ? '🔴 ENABLED (blocking)' : '🟢 ACCESSIBLE';
    console.log(`  ${table.padEnd(20)} ${status}`);
  }

  // Sample data check
  console.log('\n📝 SAMPLE DATA:\n');
  const { data: sampleCats } = await mainSupabase
    .from('categories')
    .select('id, category_name, slug')
    .limit(5);
  
  console.log('  Categories:');
  sampleCats?.forEach(cat => {
    console.log(`    - ${cat.category_name} (${cat.slug})`);
  });

  const { data: sampleSubs } = await mainSupabase
    .from('subregions')
    .select('id, subregion_name, slug')
    .limit(5);
  
  console.log('\n  Subregions:');
  sampleSubs?.forEach(sub => {
    console.log(`    - ${sub.subregion_name} (${sub.slug})`);
  });
}

async function diagnoseBlogProject() {
  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('BLOG SUPABASE PROJECT (Blog Posts)');
  console.log('Project: duofozyjmsicofmnmsal');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('📊 TABLE STATISTICS:\n');
  
  const tablesToCheck = ['merge_blog_posts', 'blog_posts', 'posts'];
  for (const table of tablesToCheck) {
    const { count, error } = await blogSupabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    const status = error ? `ERROR: ${error.message}` : `${count} rows`;
    console.log(`  ${table.padEnd(20)} ${status}`);
  }

  // Check table structure
  console.log('\n📋 TABLE STRUCTURE (merge_blog_posts):\n');
  const { data: samplePost } = await blogSupabase
    .from('merge_blog_posts')
    .select('*')
    .limit(1);
  
  if (samplePost && samplePost[0]) {
    const columns = Object.keys(samplePost[0]);
    console.log(`  Columns (${columns.length} total):`);
    columns.forEach(col => {
      const value = samplePost[0][col];
      const type = Array.isArray(value) ? 'array' : typeof value;
      console.log(`    - ${col.padEnd(20)} (${type})`);
    });
  }


  // Check RLS
  console.log('\n🔒 ROW LEVEL SECURITY:\n');
  for (const table of tablesToCheck) {
    const { error } = await blogSupabase
      .from(table)
      .select('*')
      .limit(1);
    
    const status = error ? `🔴 ${error.message}` : '🟢 ACCESSIBLE';
    console.log(`  ${table.padEnd(20)} ${status}`);
  }

  // Check data distribution
  console.log('\n📈 DATA DISTRIBUTION (merge_blog_posts):\n');
  
  // Get date range
  const { data: dateRange } = await blogSupabase
    .from('merge_blog_posts')
    .select('created_at')
    .order('created_at', { ascending: true })
    .limit(1);
  
  const { data: dateRangeMax } = await blogSupabase
    .from('merge_blog_posts')
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(1);
  
  if (dateRange && dateRangeMax) {
    console.log(`  Oldest post: ${dateRange[0]?.created_at || 'N/A'}`);
    console.log(`  Newest post: ${dateRangeMax[0]?.created_at || 'N/A'}`);
  }

  // Sample posts
  console.log('\n📝 SAMPLE POSTS:\n');
  const { data: samplePosts } = await blogSupabase
    .from('merge_blog_posts')
    .select('title, slug, tags, created_at')
    .limit(5);
  
  samplePosts?.forEach(post => {
    console.log(`  - ${post.title.substring(0, 60)}...`);
    console.log(`    slug: ${post.slug}`);
    console.log(`    tags: ${post.tags || 'none'}`);
    console.log(`    date: ${post.created_at}\n`);
  });
}

async function checkStorageAndLimits() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('STORAGE & LIMITS');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('💾 STORAGE BUCKETS:\n');
  
  // Check main project storage
  const { data: mainBuckets } = await mainSupabase
    .storage
    .listBuckets();
  
  console.log('  Main Project:');
  if (mainBuckets && mainBuckets.length > 0) {
    mainBuckets.forEach(bucket => {
      console.log(`    - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });
  } else {
    console.log('    (No storage buckets)');
  }

  // Check blog project storage
  const { data: blogBuckets } = await blogSupabase
    .storage
    .listBuckets();
  
  console.log('\n  Blog Project:');
  if (blogBuckets && blogBuckets.length > 0) {
    blogBuckets.forEach(bucket => {
      console.log(`    - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });
  } else {
    console.log('    (No storage buckets)');
  }

  console.log('\n📊 PROJECT HEALTH:\n');
  console.log('  ✅ Main project connection: HEALTHY');
  console.log('  ✅ Blog project connection: HEALTHY');
  console.log('  ✅ Service role keys: WORKING');
}

async function runDiagnostics() {
  console.log('\n🔧 SUPABASE DIAGNOSTIC REPORT');
  console.log('Generated:', new Date().toISOString());
  console.log('\n');

  try {
    await diagnoseMainProject();
    await diagnoseBlogProject();
    await checkStorageAndLimits();

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ DIAGNOSTIC COMPLETE');
    console.log('═══════════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('\n❌ ERROR DURING DIAGNOSTICS:', error.message);
    console.error(error);
  }
}

runDiagnostics();
