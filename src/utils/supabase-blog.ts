import { createClient } from '@supabase/supabase-js';
import { BlogPost, PaginatedPosts } from '@/types/blog';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const POSTS_PER_PAGE = 12;

/**
 * Gets all posts with pagination.
 */
export async function getPosts(page = 1, limit = POSTS_PER_PAGE): Promise<PaginatedPosts> {
    try {
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
        })) as BlogPost[];

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
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
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
        } as BlogPost;
    } catch (error) {
        console.error('Error fetching post by slug:', error);
        return null;
    }
}

/**
 * Gets posts by category.
 */
export async function getPostsByCategory(category: string, page = 1, limit = POSTS_PER_PAGE): Promise<PaginatedPosts> {
    try {
        // Get total count for pagination
        const { count } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('category', category);

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
            .eq('category', category)
            .order('published_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        // Transform posts to match BlogPost interface
        const transformedPosts = posts.map(post => ({
            ...post,
            authors: post.authors ? [post.authors] : undefined,
            tags: post.tags || undefined
        })) as BlogPost[];

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
        console.error('Error fetching posts by category:', error);
        return {
            posts: [],
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false
        };
    }
}

/**
 * Gets posts by tag.
 */
export async function getPostsByTag(tag: string, page = 1, limit = POSTS_PER_PAGE): Promise<PaginatedPosts> {
    try {
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
        })) as BlogPost[];

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
