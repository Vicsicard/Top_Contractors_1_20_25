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

export async function getPosts(page: number = 1, perPage: number = 12, category?: string) {
  console.log('🔍 Fetching posts from Supabase...', { page, perPage, category });
  
  try {
    // Get total count first
    let countQuery = supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    if (category) {
      countQuery = countQuery.eq('trade_category', category);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('❌ Error getting post count:', countError);
      return null;
    }

    // Calculate pagination
    const totalPages = count ? Math.ceil(count / perPage) : 0;
    const rangeStart = (page - 1) * perPage;
    const rangeEnd = rangeStart + perPage - 1;

    // Get paginated posts
    let query = supabase
      .from('posts')
      .select('*, authors, tags')
      .order('published_at', { ascending: false })
      .range(rangeStart, rangeEnd);

    if (category) {
      console.log('📂 Filtering by category:', category);
      query = query.eq('trade_category', category);
    }

    console.log('📡 Executing Supabase query...');
    const { data: posts, error } = await query;

    if (error) {
      console.error('❌ Supabase query error:', error);
      return null;
    }

    console.log('✅ Found posts:', posts?.length || 0);
    if (posts?.[0]) {
      console.log('📝 Sample post:', {
        id: posts[0].id,
        title: posts[0].title,
        category: posts[0].trade_category
      });
    }

    // Process posts
    const processedPosts = posts?.map(post => {
      // Extract first image if no feature image
      if (!post.feature_image && post.html) {
        const firstImage = extractFirstImage(post.html);
        if (firstImage) {
          post.feature_image = firstImage.url;
          post.feature_image_alt = firstImage.alt;
        }
      }

      // Parse authors and tags if they're strings
      try {
        if (typeof post.authors === 'string') {
          post.authors = JSON.parse(post.authors);
        }
      } catch (e) {
        console.error('Error parsing authors:', e);
        post.authors = [{
          id: 'default',
          name: 'Top Contractors Denver',
          slug: 'top-contractors-denver',
          profile_image: null,
          bio: null,
          url: null
        }];
      }

      try {
        if (typeof post.tags === 'string') {
          post.tags = JSON.parse(post.tags);
        }
      } catch (e) {
        console.error('Error parsing tags:', e);
        post.tags = [];
      }

      return post;
    });

    return {
      posts: processedPosts || [],
      total: count || 0,
      totalPages,
      page,
      perPage
    };
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    return null;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*, authors, tags')
      .eq('slug', slug)
      .limit(1);

    if (error) {
      console.error('Error fetching post by slug:', error);
      return null;
    }

    if (!posts || posts.length === 0) {
      return null;
    }

    const post = posts[0];

    // Extract first image if no feature image
    if (!post.feature_image && post.html) {
      const firstImage = extractFirstImage(post.html);
      if (firstImage) {
        post.feature_image = firstImage.url;
        post.feature_image_alt = firstImage.alt;
      }
    }

    // Parse authors and tags if they're strings
    try {
      if (typeof post.authors === 'string') {
        post.authors = JSON.parse(post.authors);
      }
    } catch (e) {
      console.error('Error parsing authors:', e);
      post.authors = [{
        id: 'default',
        name: 'Top Contractors Denver',
        slug: 'top-contractors-denver',
        profile_image: null,
        bio: null,
        url: null
      }];
    }

    try {
      if (typeof post.tags === 'string') {
        post.tags = JSON.parse(post.tags);
      }
    } catch (e) {
      console.error('Error parsing tags:', e);
      post.tags = [];
    }

    return post;
  } catch (error) {
    console.error('Error in getPostBySlug:', error);
    return null;
  }
}
