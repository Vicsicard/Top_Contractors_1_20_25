import { Post, PaginatedPosts, Author, Tag } from '@/types/blog';
import { supabase } from '@/utils/supabase';

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
        authors: post.authors ? [post.authors].map((author: any): Author => ({
            id: author.id,
            name: author.name,
            slug: author.slug,
            profile_image: author.profile_image,
            bio: author.bio,
            url: author.url
        })) : [],
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
        // Debug log the input parameters
        console.log('Fetching post with slug:', slug, 'trade:', trade);

        // Validate connection first
        const isConnected = await validateSupabaseConnection();
        if (!isConnected) {
            throw new Error('Failed to connect to Supabase');
        }

        // First, try to find the post without trade category filter
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug);

        // Debug log the query results
        console.log('Query results:', { posts, error });

        if (error) {
            console.error('Error fetching post:', error);
            return null;
        }

        if (!posts || posts.length === 0) {
            console.log('No posts found with slug:', slug);
            return null;
        }

        // If trade is provided, filter by trade category with flexible matching
        const post = trade 
            ? posts.find(p => {
                const postCategory = p.trade_category?.toLowerCase() || '';
                const requestedTrade = trade.toLowerCase();
                // Match exact or plural/singular variations
                return postCategory === requestedTrade || 
                       (postCategory === 'plumbing' && requestedTrade === 'plumbers') ||
                       (postCategory === 'plumbers' && requestedTrade === 'plumbing');
            })
            : posts[0];

        if (!post) {
            console.log('No post found matching trade category:', trade);
            return null;
        }

        // Debug log the final post
        console.log('Found post:', post);

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
export async function getPostsByCategory(
    category: string,
    page = 1,
    limit = POSTS_PER_PAGE
): Promise<PaginatedPosts> {
    try {
        // Validate connection and category
        const isConnected = await validateSupabaseConnection();
        if (!isConnected) {
            throw new Error('Failed to connect to Supabase');
        }
        if (!category) {
            throw new Error('Category is required');
        }

        // Calculate pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // Get count first to ensure it's properly retrieved
        const countResult = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .ilike('trade_category', category)
            .not('trade_category', 'is', null)
            .not('published_at', 'is', null)
            .lt('published_at', new Date().toISOString());

        if (countResult.error) throw countResult.error;
        if (countResult.count === null) throw new Error('Failed to get post count');

        // Then get posts
        const postsResult = await supabase
            .from('posts')
            .select(`
                id,
                title,
                slug,
                excerpt,
                feature_image,
                feature_image_alt,
                published_at,
                updated_at,
                reading_time,
                trade_category
            `)
            .ilike('trade_category', category)
            .not('trade_category', 'is', null)
            .not('published_at', 'is', null)
            .lt('published_at', new Date().toISOString())
            .order('published_at', { ascending: false })
            .range(from, to);

        // Handle post query errors
        if (postsResult.error) throw postsResult.error;
        if (!postsResult.data) throw new Error('Failed to fetch posts: posts data is null');

        const count = countResult.count;
        const posts = postsResult.data;

        // Transform posts to match Post interface
        const transformedPosts = posts.map(transformPost);

        return {
            posts: transformedPosts,
            totalPages: Math.ceil(count / limit),
            hasNextPage: from + limit < count,
            hasPrevPage: page > 1,
            totalPosts: count
        };
    } catch (error) {
        console.error('getPostsByCategory - Unexpected error:', error);
        
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error(
                typeof error === 'string' 
                    ? error 
                    : 'An unexpected error occurred while fetching blog posts'
            );
        }
    }
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
