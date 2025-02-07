import { Post, PaginatedPosts, Author, Tag } from '@/types/blog';
import { supabase } from '@/utils/supabase';
import { getStandardCategory, isValidCategory } from '@/utils/category-mapper';

const POSTS_PER_PAGE = 12; // Standardized posts per page across the site - optimized for 3-column grid

/**
 * Validate Supabase connection and table structure
 */
async function validateSupabaseConnection() {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('id, trade_category')
            .limit(1);
            
        if (error) {
            console.error('Supabase connection error:', error);
            return false;
        }
        
        if (!data || !Array.isArray(data)) {
            console.error('Invalid posts table structure');
            return false;
        }
        
        console.log('Supabase connection and table structure validated');
        return true;
    } catch (error) {
        console.error('Failed to validate Supabase connection:', error);
        return false;
    }
}

/**
 * Transform raw post data to match Post interface
 */
function transformPost(post: any): Post {
    const authors = post.authors ? [post.authors].map((author: any): Author => ({
        id: author.id,
        name: author.name,
        slug: author.slug,
        profile_image: author.profile_image,
        bio: author.bio,
        url: author.url
    })) : [];

    return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        html: post.html,
        excerpt: post.excerpt,
        feature_image: post.feature_image,
        feature_image_alt: post.feature_image_alt,
        published_at: post.published_at,
        updated_at: post.updated_at,
        reading_time: post.reading_time,
        trade_category: post.trade_category,
        author: authors[0]?.name || 'Top Contractors Denver',
        author_url: authors[0]?.url || '#',
        authors,
        tags: post.tags ? post.tags.map((tag: any): Tag => ({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            description: tag.description
        })) : []
    };
}

/**
 * Gets all posts with pagination.
 */
export async function getPosts(page = 1, limit = POSTS_PER_PAGE): Promise<PaginatedPosts> {
    try {
        // Validate connection first
        const isConnected = await validateSupabaseConnection();
        if (!isConnected) {
            throw new Error('Failed to connect to Supabase');
        }

        // Get total count for pagination
        const { count } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true });

        // Calculate pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // Fetch posts with authors and tags
        const { data: posts, error } = await supabase
            .from('posts')
            .select(`
                id,
                title,
                slug,
                html,
                excerpt,
                feature_image,
                feature_image_alt,
                published_at,
                updated_at,
                reading_time,
                authors (*),
                tags (*),
                trade_category
            `)
            .order('published_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        // Transform posts to match Post interface
        const transformedPosts = posts.map(transformPost);

        const totalPages = Math.ceil((count || 0) / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            posts: transformedPosts,
            totalPages,
            hasNextPage,
            hasPrevPage,
            totalPosts: count || 0
        };
    } catch (error) {
        console.error('Error fetching posts:', error);
        return {
            posts: [],
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
            totalPosts: 0
        };
    }
}

/**
 * Gets a single post by slug and optionally filters by trade category.
 */
export async function getPostBySlug(slug: string, trade?: string): Promise<Post | null> {
    try {
        console.log('DEBUG: getPostBySlug called with:', { 
            slug, 
            trade,
            timestamp: new Date().toISOString()
        });

        // If trade is provided, validate it's a known category
        if (trade) {
            if (!isValidCategory(trade)) {
                console.log('DEBUG: Invalid trade category requested:', trade);
                return null;
            }
        }

        // Only select the fields we need
        // Build query with case-insensitive slug matching
        const query = supabase
            .from('posts')
            .select(`
                id,
                title,
                slug,
                html,
                excerpt,
                feature_image,
                feature_image_alt,
                published_at,
                updated_at,
                reading_time,
                trade_category
            `)
            .ilike('slug', slug)
            .limit(1);

        // Add trade category filter if provided
        if (trade) {
            const standardizedTrade = getStandardCategory(trade);
            query.or(`trade_category.ilike.${trade},trade_category.ilike.${standardizedTrade}`);
        }

        const { data: posts, error } = await query;

        // Enhanced error handling
        if (error) {
            console.error('DEBUG: Database error:', error);
            throw new Error(`Failed to fetch post: ${error.message}`);
        }

        if (!posts || posts.length === 0) {
            console.log('DEBUG: No posts found:', { 
                slug,
                trade,
                timestamp: new Date().toISOString()
            });
            throw new Error('Post not found');
        }

        const post = posts[0];

        console.log('DEBUG: Found matching post:', {
            id: post.id,
            slug: post.slug,
            originalCategory: post.trade_category,
            standardizedCategory: getStandardCategory(post.trade_category),
            requestedTrade: trade,
            standardizedTrade: trade ? getStandardCategory(trade) : null
        });

        // Transform post to match Post interface
        return transformPost(post);
    } catch (error) {
        console.error('Error fetching post by slug:', error);
        return null;
    }
}

/**
 * Gets all unique trade categories from posts
 */
export async function getTradeCategories(): Promise<string[]> {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('trade_category')
            .not('trade_category', 'is', null)
            .order('trade_category');

        if (error) {
            console.error('Error fetching trade categories:', error);
            return [];
        }

        // Get unique categories and filter out any null/undefined values
        const categories = [...new Set(data
            .map(post => post.trade_category)
            .filter(category => category)
        )];
        console.log('Available trade categories:', categories);
        return categories;
    } catch (error) {
        console.error('Error in getTradeCategories:', error);
        return [];
    }
}

/**
 * Gets posts by category with case-insensitive matching
 */
export async function getPostsByCategory(categorySlug: string, page: number = 1, perPage: number = 12) {
  try {
    // Calculate the range start and end
    const rangeStart = (page - 1) * perPage;
    const rangeEnd = rangeStart + perPage - 1;

    // Get total count first
    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('trade_category', categorySlug);

    // Then get the paginated results
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('trade_category', categorySlug)
      .order('published_at', { ascending: false })
      .range(rangeStart, rangeEnd);

    if (error) {
      console.error('Error fetching posts:', error);
      return { posts: [], total: 0, totalPages: 0 };
    }

    const totalPages = count ? Math.ceil(count / perPage) : 0;

    return {
      posts: posts || [],
      total: count || 0,
      totalPages
    };
  } catch (error) {
    console.error('Error in getPostsByCategory:', error);
    return { posts: [], total: 0, totalPages: 0 };
  }
}

/**
 * Gets posts by trade.
 */
export async function getPostsByTrade(trade: string, page: number = 1, pageSize: number = 12) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data: posts, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('trade', trade)
    .order('published_at', { ascending: false })
    .range(start, end);

  const totalPages = Math.ceil((count || 0) / pageSize);

  return {
    posts: posts || [],
    totalPages,
  };
}

/**
 * Gets a single post by slug and trade.
 */
export async function getPostBySlugAndTrade(slug: string, trade: string) {
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('trade', trade)
    .single();

  return post;
}

/**
 * Gets posts by tag.
 */
export async function getPostsByTag(tag: string, page = 1, limit = POSTS_PER_PAGE): Promise<PaginatedPosts> {
    try {
        // Validate connection first
        const isConnected = await validateSupabaseConnection();
        if (!isConnected) {
            throw new Error('Failed to connect to Supabase');
        }

        // Get total count for pagination
        const { count } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .contains('tags', [{ slug: tag }]);

        // Calculate pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // Fetch posts with authors and tags
        const { data: posts, error } = await supabase
            .from('posts')
            .select(`
                id,
                title,
                slug,
                html,
                excerpt,
                feature_image,
                feature_image_alt,
                published_at,
                updated_at,
                reading_time,
                authors (*),
                tags (*),
                trade_category
            `)
            .contains('tags', [{ slug: tag }])
            .order('published_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        // Transform posts to match Post interface
        const transformedPosts = posts.map(transformPost);

        const totalPages = Math.ceil((count || 0) / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            posts: transformedPosts,
            totalPages,
            hasNextPage,
            hasPrevPage,
            totalPosts: count || 0
        };
    } catch (error) {
        console.error('Error fetching posts by tag:', error);
        return {
            posts: [],
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
            totalPosts: 0
        };
    }
}

/**
 * Gets all posts with pagination
 */
export async function getAllPosts(page: number = 1, perPage: number = 12) {
  try {
    // Calculate the range start and end
    const rangeStart = (page - 1) * perPage;
    const rangeEnd = rangeStart + perPage - 1;

    // Get total count first
    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .not('published_at', 'is', null)
      .lt('published_at', new Date().toISOString());

    // Then get the paginated results
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .not('published_at', 'is', null)
      .lt('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .range(rangeStart, rangeEnd);

    if (error) {
      console.error('Error fetching posts:', error);
      return { posts: [], total: 0, totalPages: 0 };
    }

    const totalPages = count ? Math.ceil(count / perPage) : 0;

    return {
      posts: posts || [],
      total: count || 0,
      totalPages
    };
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    return { posts: [], total: 0, totalPages: 0 };
  }
}
