import { createClient } from '@supabase/supabase-js';
import { Post, PaginatedPosts } from '@/types/blog';
import { supabase } from '@/utils/supabase';

const POSTS_PER_PAGE = 12;

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
                *,
                authors (*),
                tags (*)
            `)
            .order('published_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        // Transform posts to match BlogPost interface
        const transformedPosts = posts.map(post => ({
            ...post,
            authors: post.authors ? [post.authors] : undefined,
            tags: post.tags || undefined
        })) as Post[];

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
                *,
                authors (*),
                tags (*)
            `)
            .eq('slug', slug)
            .single();

        if (error) throw error;
        if (!post) return null;

        // Transform post to match BlogPost interface
        return {
            ...post,
            authors: post.authors ? [post.authors] : undefined,
            tags: post.tags || undefined
        } as Post;
    } catch (error) {
        console.error('Error fetching post by slug:', error);
        return null;
    }
}

/**
 * Gets posts by category.
 */
export async function getPostsByCategory(
    category: string,
    page = 1,
    limit = POSTS_PER_PAGE
): Promise<PaginatedPosts> {
    try {
        console.log('getPostsByCategory - Starting with params:', { category, page, limit });

        if (!category) {
            throw new Error('Category is required');
        }

        // Calculate pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // Get total count first
        const { count, error: countError } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('trade_category', category);

        if (countError) {
            console.error('getPostsByCategory - Count query error:', countError);
            throw new Error(`Failed to get post count: ${countError.message}`);
        }

        if (count === null) {
            throw new Error('Failed to get post count: count is null');
        }

        console.log('getPostsByCategory - Total posts count:', count);

        // Then get the actual posts
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
            .eq('trade_category', category)
            .order('published_at', { ascending: false })
            .range(from, to);

        console.log('getPostsByCategory - Executing query with params:', {
            category,
            from,
            to,
            orderBy: 'published_at DESC'
        });

        const { data: posts, error: postsError } = await query;

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
                hasHtml: !!p.html
            }))
        });

        // Transform the posts to include empty authors and tags arrays
        const transformedPosts = posts.map(post => ({
            ...post,
            authors: [],
            tags: []
        }));

        return {
            posts: transformedPosts,
            totalPages: Math.ceil(count / limit),
            hasNextPage: from + limit < count,
            hasPrevPage: page > 1
        };
    } catch (error) {
        console.error('getPostsByCategory - Unexpected error:', error);
        
        // Convert any error to a proper Error object with a message
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
                *,
                authors (*),
                tags (*)
            `)
            .contains('tags', [{ slug: tag }])
            .order('published_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        // Transform posts to match BlogPost interface
        const transformedPosts = posts.map(post => ({
            ...post,
            authors: post.authors ? [post.authors] : undefined,
            tags: post.tags || undefined
        })) as Post[];

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
