import { supabase } from '@/lib/supabase';
import type { Post } from '@/types/blog';

interface GetPostsOptions {
  page?: number;
  pageSize?: number;
  category?: string;
}

interface GetPostsResult {
  posts: Post[];
  total: number;
}

interface GetPostBySlugResult {
  post: Post | null;
}

export async function getPosts({ 
  page = 1, 
  pageSize = 12, 
  category 
}: GetPostsOptions = {}): Promise<GetPostsResult> {
  try {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    console.log('Fetching posts with params:', { page, pageSize, category, start, end });

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (category) {
      query = query.eq('trade_category', category);
    }

    const { data: posts, count, error } = await query.range(start, end);

    if (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }

    if (!posts) {
      console.warn('No posts found');
      return { posts: [], total: 0 };
    }

    console.log(`Found ${posts.length} posts out of ${count} total`);

    const transformedPosts = posts.map((post): Post => {
      try {
        return {
          id: post.id,
          title: post.title,
          slug: post.slug,
          html: post.html,
          published_at: post.published_at,
          updated_at: post.updated_at,
          feature_image: post.feature_image || '/images/default-post.svg',
          feature_image_alt: post.feature_image_alt || post.title,
          excerpt: post.excerpt,
          reading_time: post.reading_time,
          author: post.author || 'Top Contractors Denver',
          author_url: post.author_url || '#',
          trade_category: post.trade_category,
          tags: post.tags || [],
          authors: post.authors || []
        };
      } catch (err) {
        console.error('Error transforming post:', err, post);
        throw err;
      }
    });

    return {
      posts: transformedPosts,
      total: count || 0
    };
  } catch (error) {
    console.error('Error in getPosts:', error);
    return { posts: [], total: 0 };
  }
}

export async function getPostBySlug(
  slug: string,
  trade: string
): Promise<GetPostBySlugResult> {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('trade_category', trade)
    .eq('status', 'published')
    .single();

  if (error || !post) {
    console.error('Error fetching post:', error);
    return { post: null };
  }

  return {
    post: {
      id: post.id,
      title: post.title,
      slug: post.slug,
      html: post.html,
      published_at: post.published_at,
      feature_image: post.feature_image,
      feature_image_alt: post.feature_image_alt,
      excerpt: post.excerpt,
      reading_time: post.reading_time,
      author: post.author,
      author_url: post.author_url,
      trade_category: post.trade_category
    }
  };
}
