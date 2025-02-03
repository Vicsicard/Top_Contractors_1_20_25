import { supabase } from '@/lib/supabase';
import type { Post } from '@/types/blog';

export async function getPosts(limit = 6, category?: string) {
  console.log('Fetching posts from Supabase...', { limit, category });
  
  try {
    let query = supabase
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (category) {
      console.log('Filtering by category:', category);
      // Try both the exact category and any variations
      const variations = [
        category,
        category.replace('-', ' '),  // e.g., "bathroom-remodeling" -> "bathroom remodeling"
        category.split('-')[0],      // e.g., "bathroom-remodeling" -> "bathroom"
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
    console.log('First post trade_category:', posts?.[0]?.trade_category);
    console.log('Raw posts from Supabase:', JSON.stringify(posts, null, 2));

    // Transform to match the Post type format
    const transformedPosts = {
      edges: posts.map(post => ({
        node: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          html: post.html,
          excerpt: post.excerpt || post.html?.substring(0, 150) + '...',
          feature_image: post.feature_image,
          feature_image_alt: post.feature_image_alt,
          published_at: post.published_at,
          updated_at: post.updated_at,
          reading_time: post.reading_time || Math.ceil((post.html?.length || 0) / 1500),
          trade_category: post.trade_category,
          authors: post.authors || [{
            id: 'default',
            name: 'Top Contractors Denver',
            slug: 'top-contractors-denver',
            profile_image: null,
            bio: null,
            url: null
          }],
          tags: post.tags || []
        } as Post
      }))
    };

    console.log('Transformed posts:', JSON.stringify(transformedPosts, null, 2));
    return transformedPosts;
  } catch (error) {
    console.error('Error in getPosts:', error);
    return null;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  // Transform to match the Post type format
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    html: post.html,
    excerpt: post.excerpt || post.html?.substring(0, 150) + '...',
    feature_image: post.feature_image,
    feature_image_alt: post.feature_image_alt,
    published_at: post.published_at,
    updated_at: post.updated_at,
    reading_time: post.reading_time || Math.ceil((post.html?.length || 0) / 1500),
    trade_category: post.trade_category,
    authors: post.authors || [{
      id: 'default',
      name: 'Top Contractors Denver',
      slug: 'top-contractors-denver',
      profile_image: null,
      bio: null,
      url: null
    }],
    tags: post.tags || []
  };
}
