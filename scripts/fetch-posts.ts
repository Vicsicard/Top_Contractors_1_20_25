import { resolve } from 'path';
import { blogSupabase } from '../src/utils/supabase-blog-client';

// Define contractor categories and their related terms
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

function generatePreview(content: string): string {
  return content
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image markdown
    .replace(/\[|\]|\(|\)|#|\*/g, '') // Remove other markdown
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .slice(0, 150) + '...';
}

async function fetchPosts() {
  try {
    console.log('Connecting to Blog Supabase...');
    
    const { data: allPosts, error } = await blogSupabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    console.log(`\nTotal posts in database: ${allPosts?.length || 0}`);

    // Filter posts that match contractor categories
    const validPosts = (allPosts as BlogPost[]).filter(post => {
      const fullText = `${post.title} ${post.content}`;
      const matchingCategories = findMatchingCategories(fullText);
      return matchingCategories.length > 0;
    });

    console.log(`\nFound ${validPosts.length} contractor-related posts:\n`);
    
    validPosts.forEach((post, index) => {
      const matchingCategories = findMatchingCategories(`${post.title} ${post.content}`);
      const preview = generatePreview(post.content);

      console.log(`${index + 1}. ${post.title}`);
      console.log(`   Categories: ${matchingCategories.join(', ')}`);
      console.log(`   Created: ${new Date(post.created_at).toLocaleString()}`);
      console.log(`   Tags: ${post.tags || 'No tags'}`);
      console.log(`   Preview: ${preview}`);
      console.log(`   URL: /blog/${post.slug}`);
      console.log(''); // Empty line for readability
    });

    if (validPosts.length === 0) {
      console.log('\nNo contractor-related posts found. Consider:');
      console.log('1. Creating new posts about contractor services');
      console.log('2. Using more specific contractor-related terms in content');
      console.log('3. Updating post tags to include contractor categories');
      console.log('\nSuggested post topics:');
      Object.keys(CONTRACTOR_CATEGORIES).forEach(category => {
        console.log(`- Top ${category} services and tips`);
        console.log(`  • How to choose a ${category} contractor`);
        console.log(`  • ${category} costs and planning`);
        console.log(`  • ${category} best practices`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

fetchPosts();
