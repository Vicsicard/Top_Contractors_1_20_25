import { Post, PaginatedPosts, Author, Tag } from '@/types/blog';
import { supabase } from '@/utils/supabase';

const POSTS_PER_PAGE = 10; // Standardized posts per page across the site

/**
 * Validate Supabase connection
 */
async function validateSupabaseConnection() {
    try {
        const { data, error } = await supabase.from('posts').select('count').limit(1);
        if (error) {
            console.error('Supabase connection error:', error);
            return false;
        }
        console.log('Supabase connection successful');
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
            hasPrevPage
        };
    } catch (error) {
        console.error('Error fetching posts:', error);
        return {
            posts: [],
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false
        };
    }
}

/**
 * Gets a single post by slug.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
    try {
        // Validate connection first
        const isConnected = await validateSupabaseConnection();
        if (!isConnected) {
            throw new Error('Failed to connect to Supabase');
        }

        const { data: post, error } = await supabase
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
            .eq('slug', slug)
            .single();

        if (error) throw error;
        if (!post) return null;

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

        // Get unique categories
        const categories = [...new Set(data.map(post => post.trade_category))];
        console.log('Available trade categories:', categories);
        return categories;
    } catch (error) {
        console.error('Error in getTradeCategories:', error);
        return [];
    }
}

export async function getPostsByCategory(
    category: string,
    page = 1,
    limit = POSTS_PER_PAGE
): Promise<PaginatedPosts> {
    try {
        console.log('getPostsByCategory - Starting with params:', { category, page, limit });

        // Validate connection first
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

        // Get total count first
        console.log('getPostsByCategory - Executing count query for category:', category);
        const countQuery = supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('trade_category', category)
            .not('trade_category', 'is', null);
            
        const { count, error: countError } = await countQuery;
        console.log('getPostsByCategory - Count query result:', { count, error: countError });

        if (countError) {
            console.error('getPostsByCategory - Count query error:', countError);
            throw new Error(`Failed to get post count: ${countError.message}`);
        }

        if (count === null) {
            throw new Error('Failed to get post count: count is null');
        }

        console.log('getPostsByCategory - Total posts count:', count);

        // Then get the actual posts
        console.log('getPostsByCategory - Building posts query');
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
                trade_category,
                authors (*),
                tags (*)
            `)
            .eq('trade_category', category)
            .not('trade_category', 'is', null)
            .order('published_at', { ascending: false })
            .range(from, to);

        console.log('getPostsByCategory - Executing query with params:', {
            category,
            from,
            to,
            orderBy: 'published_at DESC'
        });

        const { data: posts, error: postsError } = await query;
        
        console.log('getPostsByCategory - Posts query response:', {
            error: postsError,
            postsCount: posts?.length,
            firstPost: posts?.[0] ? {
                id: posts[0].id,
                title: posts[0].title,
                category: posts[0].trade_category
            } : null
        });

        if (postsError) {
            console.error('getPostsByCategory - Posts query error:', postsError);
            throw new Error(`Failed to fetch posts: ${postsError.message}`);
        }

        if (!posts) {
            throw new Error('Failed to fetch posts: posts data is null');
        }

        console.log('getPostsByCategory - Query results:', {
            category,
            postsFound: posts.length,
            posts: posts.map(p => ({
                id: p.id,
                title: p.title,
                category: p.trade_category,
                hasHtml: !!p.html,
                feature_image: p.feature_image
            }))
        });

        // Transform posts to match Post interface
        const transformedPosts = posts.map(transformPost);

        return {
            posts: transformedPosts,
            totalPages: Math.ceil(count / limit),
            hasNextPage: from + limit < count,
            hasPrevPage: page > 1
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
            hasPrevPage
        };
    } catch (error) {
        console.error('Error fetching posts by tag:', error);
        return {
            posts: [],
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false
        };
    }
}
