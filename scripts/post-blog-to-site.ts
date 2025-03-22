import { blogSupabase } from '../src/utils/supabase-blog-client';
import { mainSupabase } from '../src/utils/supabase';
import { Database } from '../src/types/supabase';

// Define contractor categories and their related terms (same as fetch-posts.ts)
const CONTRACTOR_CATEGORIES = {
  'bathroom remodeling': ['bathroom remodel', 'bathroom renovation', 'bathroom contractor', 'bath remodeling'],
  'kitchen remodeling': ['kitchen remodel', 'kitchen renovation', 'kitchen contractor', 'kitchen remodeling'],
  'home remodeling': ['home remodel', 'home renovation', 'remodeling contractor', 'house remodeling'],
  'decks': ['deck builder', 'deck installation', 'deck contractor', 'deck construction'],
  'electrician': ['electrical contractor', 'licensed electrician', 'electrical service', 'electrical installation'],
  'epoxy garage': ['epoxy flooring', 'garage floor coating', 'epoxy contractor', 'garage floor epoxy'],
  'fencing': ['fence contractor', 'fence installation', 'fencing company', 'fence builder'],
  'flooring': ['flooring contractor', 'floor installation', 'flooring company', 'floor replacement'],
  'hvac': ['hvac contractor', 'hvac service', 'heating contractor', 'air conditioning contractor'],
  'landscaper': ['landscape contractor', 'landscaping company', 'professional landscaper', 'landscaping service'],
  'masonry': ['masonry contractor', 'brick contractor', 'stone mason', 'masonry company'],
  'plumbing': ['plumbing contractor', 'licensed plumber', 'plumbing company', 'plumbing service'],
  'roofer': ['roofing contractor', 'roof replacement', 'roofing company', 'professional roofer'],
  'siding gutters': ['siding contractor', 'gutter contractor', 'siding installation', 'gutter installation'],
  'windows': ['window contractor', 'window installation', 'window replacement', 'window company']
};

const LOCATION_TERMS = [
  'denver',
  'denver metro',
  'denver co',
  'denver, co',
  'denver, colorado',
  'denver colorado'
];

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  tags: string | null;
  posted_on_site: boolean | null;
  images: string[] | null;
}

function findMatchingCategories(text: string): string[] {
  const normalizedText = text.toLowerCase();
  return Object.entries(CONTRACTOR_CATEGORIES)
    .filter(([category, terms]) =>
      terms.filter(term => normalizedText.includes(term.toLowerCase())).length >= 2
    )
    .map(([category]) => category);
}

function isLocationRelevant(text: string): boolean {
  const normalizedText = text.toLowerCase();
  return LOCATION_TERMS.some(term => 
    normalizedText.includes(term.toLowerCase()) &&
    !normalizedText.includes(`@${term}`) &&
    !normalizedText.includes(`://${term}`)
  );
}

function generatePreview(content: string): string {
  return content
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image markdown
    .replace(/\[|\]|\(|\)|#|\*/g, '') // Remove other markdown
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .slice(0, 150) + '...';
}

async function postBlogToSite() {
  try {
    console.log('Connecting to Blog Supabase...');
    
    // Fetch all posts from blog Supabase
    const { data: allPosts, error: fetchError } = await blogSupabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching posts:', fetchError);
      return;
    }

    console.log(`\nTotal posts in blog database: ${allPosts?.length || 0}`);

    // Filter relevant posts
    const validPosts = (allPosts as BlogPost[]).filter(post => {
      const fullText = `${post.title} ${post.content}`;
      const matchingCategories = findMatchingCategories(fullText);
      return matchingCategories.length > 0 && isLocationRelevant(fullText);
    });

    console.log(`\nFound ${validPosts.length} Denver contractor-related posts to transfer\n`);

    // Get existing posts from main site to avoid duplicates
    const { data: existingPosts, error: existingError } = await mainSupabase
      .from('blog_posts')
      .select('slug');

    if (existingError) {
      console.error('Error fetching existing posts:', existingError);
      return;
    }

    const existingSlugs = new Set((existingPosts || []).map(post => post.slug));
    let postsAdded = 0;
    let postsSkipped = 0;

    // Transfer each valid post
    for (const post of validPosts) {
      if (existingSlugs.has(post.slug)) {
        console.log(`Skipping existing post: ${post.title}`);
        postsSkipped++;
        continue;
      }

      const categories = findMatchingCategories(`${post.title} ${post.content}`);
      const preview = generatePreview(post.content);

      const { error: insertError } = await mainSupabase
        .from('blog_posts')
        .insert({
          title: post.title,
          slug: post.slug,
          content: post.content,
          tags: post.tags,
          created_at: post.created_at,
          category: categories[0], // Use the first matching category
          preview: preview
        });

      if (insertError) {
        console.error(`Error inserting post "${post.title}":`, insertError);
      } else {
        console.log(`Added post: ${post.title}`);
        postsAdded++;
      }
    }

    console.log('\nTransfer complete:');
    console.log(`- Posts added: ${postsAdded}`);
    console.log(`- Posts skipped (already exist): ${postsSkipped}`);
    console.log(`- Total posts processed: ${validPosts.length}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

postBlogToSite();
