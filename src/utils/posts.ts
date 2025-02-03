import { supabase } from '@/lib/supabase';
import type { Post } from '@/types/blog';

function extractFirstImage(html: string): { url: string; alt: string } | null {
  const imgRegex = /<img[^>]+src="([^">]+)"[^>]*alt="([^">]*)"[^>]*>/i;
  const match = html.match(imgRegex);
  if (match && match[1]) {
    return {
      url: match[1],
      alt: match[2] || ''
    };
  }
  return null;
}

export async function getPosts(limit = 6, category?: string) {
  console.log('Fetching posts from Supabase...', { limit, category });
  
  try {
    let query = supabase
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (category) {
      console.log('Filtering by category:', category);
      const variations = [
        category,
        category.replace('-', ' '),
        category.split('-')[0],
      ];
      console.log('Using category variations:', variations);
      query = query.in('trade_category', variations);
    }

    console.log('Executing Supabase query...');
    const { data: posts, error } = await query.limit(limit);

    if (error) {
      console.error('Supabase query error:', error);
      return null;
    }

    console.log('Found posts:', posts?.length || 0);

    // Transform posts and parse JSONB fields
    const transformedPosts = posts.map(post => {
      let authors = [];
      try {
        authors = typeof post.authors === 'string' ? JSON.parse(post.authors) : post.authors || [];
      } catch (e) {
        console.error('Error parsing authors for post:', post.title, e);
        authors = [{
          id: 'default',
          name: 'Top Contractors Denver',
          slug: 'top-contractors-denver',
          profile_image: null,
          bio: null,
          url: null
        }];
      }

      let tags = [];
      try {
        tags = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags || [];
      } catch (e) {
        console.error('Error parsing tags for post:', post.title, e);
        tags = [];
      }

      const firstImage = !post.feature_image && post.html ? extractFirstImage(post.html) : null;

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        html: post.html || '',
        excerpt: post.excerpt || post.html?.substring(0, 150) + '...',
        feature_image: post.feature_image || firstImage?.url || null,
        feature_image_alt: post.feature_image_alt || firstImage?.alt || post.title,
        published_at: post.published_at,
        updated_at: post.updated_at,
        reading_time: post.reading_time || Math.ceil((post.html?.length || 0) / 1500),
        trade_category: post.trade_category,
        authors: authors,
        tags: tags
      };
    });

    return {
      posts: transformedPosts,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      totalPosts: transformedPosts.length
    };
  } catch (error) {
    console.error('Error in getPosts:', error);
    return null;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  console.log('Fetching post by slug:', slug);
  
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  if (!post) {
    console.log('No post found with slug:', slug);
    return null;
  }

  console.log('Raw post data from Supabase:', JSON.stringify(post, null, 2));

  // Extract first image from content if no feature image
  const firstImage = !post.feature_image && post.html ? extractFirstImage(post.html) : null;

  // Parse JSONB fields
  let authors = [];
  try {
    authors = typeof post.authors === 'string' ? JSON.parse(post.authors) : post.authors || [];
  } catch (e) {
    console.error('Error parsing authors:', e);
    authors = [{
      id: 'default',
      name: 'Top Contractors Denver',
      slug: 'top-contractors-denver',
      profile_image: null,
      bio: null,
      url: null
    }];
  }

  let tags = [];
  try {
    tags = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags || [];
  } catch (e) {
    console.error('Error parsing tags:', e);
    tags = [];
  }

  // Transform to match the Post type format
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    html: post.html || '',
    excerpt: post.excerpt || post.html?.substring(0, 150) + '...',
    feature_image: post.feature_image || firstImage?.url || null,
    feature_image_alt: post.feature_image_alt || firstImage?.alt || post.title,
    published_at: post.published_at,
    updated_at: post.updated_at,
    reading_time: post.reading_time || Math.ceil((post.html?.length || 0) / 1500),
    trade_category: post.trade_category,
    authors: authors,
    tags: tags
  };
}
