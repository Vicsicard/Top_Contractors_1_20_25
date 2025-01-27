import { createClient } from '@supabase/supabase-js';
import { GhostPost, GhostTag, GhostAuthor } from './ghost';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface PaginatedPosts {
    posts: GhostPost[];
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

/**
 * Gets all posts with pagination.
 */
export async function getPosts(page = 1, limit = 10): Promise<PaginatedPosts> {
    try {
        // Calculate offset
        const offset = (page - 1) * limit;

        // Get total count
        const { count } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true });

        // Get posts for current page
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .order('published_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        // Transform posts to match GhostPost interface
        const transformedPosts = posts.map(post => ({
            ...post,
            tags: post.tags ? JSON.parse(post.tags) : [],
            authors: post.authors ? JSON.parse(post.authors) : [],
        })) as GhostPost[];

        const totalPages = Math.ceil((count || 0) / limit);

        return {
            posts: transformedPosts,
            totalPages,
            currentPage: page,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}

/**
 * Gets a single post by slug.
 */
export async function getPostBySlug(slug: string): Promise<GhostPost | null> {
    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .limit(1);

        if (error) throw error;
        if (!posts || posts.length === 0) return null;

        // Transform post to match GhostPost interface
        const post = posts[0];
        return {
            ...post,
            tags: post.tags ? JSON.parse(post.tags) : [],
            authors: post.authors ? JSON.parse(post.authors) : [],
        } as GhostPost;
    } catch (error) {
        console.error('Error fetching post by slug:', error);
        throw error;
    }
}

/**
 * Gets posts by category.
 */
export async function getPostsByCategory(category: string, page = 1, limit = 10): Promise<PaginatedPosts> {
    try {
        const offset = (page - 1) * limit;

        // Get total count for category
        const { count } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .textSearch('tags', category);

        // Get posts for current page
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .textSearch('tags', category)
            .order('published_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        // Transform posts to match GhostPost interface
        const transformedPosts = posts.map(post => ({
            ...post,
            tags: post.tags ? JSON.parse(post.tags) : [],
            authors: post.authors ? JSON.parse(post.authors) : [],
        })) as GhostPost[];

        const totalPages = Math.ceil((count || 0) / limit);

        return {
            posts: transformedPosts,
            totalPages,
            currentPage: page,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
    } catch (error) {
        console.error('Error fetching posts by category:', error);
        throw error;
    }
}
