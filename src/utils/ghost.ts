import { notifySearchEngines } from './indexing';

const NEW_GHOST_URL = process.env.GHOST_URL || 'https://top-contractors-denver-2.ghost.io';
const NEW_GHOST_KEY = process.env.GHOST_ORG_CONTENT_API_KEY || '6229b20c390c831641ea577093';

const OLD_GHOST_URL = 'https://top-contractors-denver-1.ghost.io';
const OLD_GHOST_KEY = '130d98b20875066982b1a8314f';

// Cache for posts to detect new content
const postCache: { [key: string]: string } = {};

interface GhostAuthor {
    id: string;
    name: string;
    slug: string;
    profile_image?: string;
}

export interface GhostPost {
    id: string;
    slug: string;
    title: string;
    html: string;
    feature_image?: string;
    feature_image_alt?: string;
    excerpt?: string;
    published_at: string;
    updated_at?: string;
    reading_time?: number;
    tags?: any[];
    authors?: GhostAuthor[];
    source?: string;
}

/**
 * Fetches all posts from a Ghost instance.
 * 
 * @param url The URL of the Ghost instance.
 * @param key The API key for the Ghost instance.
 * @returns A promise that resolves to an array of Ghost posts.
 */
async function fetchAllPosts(url: string, key: string): Promise<GhostPost[]> {
    const allPosts: GhostPost[] = [];
    let currentPage = 1;
    const limit = 100; // Maximum allowed by Ghost API
    
    while (true) {
        try {
            const response = await fetch(
                `${url}/ghost/api/content/posts/?key=${key}&limit=${limit}&page=${currentPage}&include=tags,authors`,
                { next: { revalidate: 3600 } }
            );
            
            if (!response.ok) {
                console.error(`Error fetching from ${url} page ${currentPage}:`, response.status);
                break;
            }
            
            const data = await response.json();
            if (!data.posts || data.posts.length === 0) {
                break;
            }
            
            allPosts.push(...data.posts);
            
            if (data.posts.length < limit) {
                break;
            }
            
            currentPage++;
        } catch (error) {
            console.error(`Error fetching posts from ${url}:`, error);
            break;
        }
    }
    
    return allPosts;
}

/**
 * Gets paginated posts.
 * 
 * @param page The page number to fetch.
 * @param limit The number of posts to fetch per page.
 * @returns A promise that resolves to a paginated posts object.
 */
export async function getPosts(page = 1, limit = 10): Promise<PaginatedPosts> {
    try {
        // Fetch all posts from both Ghost instances
        const [newGhostPosts, oldGhostPosts] = await Promise.all([
            fetchAllPosts(NEW_GHOST_URL, NEW_GHOST_KEY),
            fetchAllPosts(OLD_GHOST_URL, OLD_GHOST_KEY)
        ]);

        // Create a Map to store unique posts by slug
        const uniquePosts = new Map<string, GhostPost>();
        
        // Process new posts first (they take precedence)
        if (newGhostPosts.length > 0) {
            newGhostPosts.forEach((post: GhostPost) => {
                uniquePosts.set(post.slug, {
                    ...post,
                    source: 'new'
                });
            });
        }
        
        // Add old posts only if they don't exist in new posts
        if (oldGhostPosts.length > 0) {
            oldGhostPosts.forEach((post: GhostPost) => {
                if (!uniquePosts.has(post.slug)) {
                    uniquePosts.set(post.slug, {
                        ...post,
                        source: 'old'
                    });
                }
            });
        }

        // Convert Map to array and sort by date
        const allPosts = Array.from(uniquePosts.values())
            .sort((a, b) => {
                const dateA = new Date(a.published_at).getTime();
                const dateB = new Date(b.published_at).getTime();
                return dateB - dateA;
            });

        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const paginatedPosts = allPosts.slice(startIndex, startIndex + limit);
        const totalPages = Math.ceil(allPosts.length / limit);

        return {
            posts: paginatedPosts,
            totalPages,
            currentPage: page,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
    } catch (error) {
        console.error('Error fetching posts:', error);
        return {
            posts: [],
            totalPages: 0,
            currentPage: 1,
            hasNextPage: false,
            hasPrevPage: false
        };
    }
}

/**
 * Gets all posts.
 * 
 * @returns A promise that resolves to an array of Ghost posts.
 */
export async function getAllPosts(): Promise<GhostPost[]> {
    try {
        const [newPosts, oldPosts] = await Promise.all([
            fetchAllPosts(NEW_GHOST_URL, NEW_GHOST_KEY),
            fetchAllPosts(OLD_GHOST_URL, OLD_GHOST_KEY)
        ]);

        const combinedPosts = [...newPosts, ...oldPosts];
        
        // Check for new or updated posts
        const newUrls: string[] = [];
        combinedPosts.forEach(post => {
            const cacheKey = `${post.id}-${post.updated_at || post.published_at}`;
            if (!postCache[post.id] || postCache[post.id] !== cacheKey) {
                postCache[post.id] = cacheKey;
                newUrls.push(`https://topcontractorsdenver.com/blog/${post.slug}`);
            }
        });

        // If we found new or updated posts, notify search engines
        if (newUrls.length > 0) {
            await notifySearchEngines(newUrls);
        }

        return combinedPosts;
    } catch (error) {
        console.error('Error fetching all posts:', error);
        return [];
    }
}

/**
 * Gets a post by slug.
 * 
 * @param slug The slug of the post to fetch.
 * @returns A promise that resolves to a Ghost post or null if not found.
 */
export async function getPostBySlug(slug: string): Promise<GhostPost | null> {
    try {
        // Try to fetch from new Ghost first
        const newResponse = await fetch(
            `${NEW_GHOST_URL}/ghost/api/content/posts/slug/${slug}/?key=${NEW_GHOST_KEY}&include=tags,authors`,
            { next: { revalidate: 3600 } }
        );
        
        if (newResponse.ok) {
            const data = await newResponse.json();
            if (data.posts?.[0]) {
                return { ...data.posts[0], source: 'new' };
            }
        }

        // If not found in new Ghost, try old Ghost
        const oldResponse = await fetch(
            `${OLD_GHOST_URL}/ghost/api/content/posts/slug/${slug}/?key=${OLD_GHOST_KEY}&include=tags,authors`,
            { next: { revalidate: 3600 } }
        );
        
        if (oldResponse.ok) {
            const data = await oldResponse.json();
            if (data.posts?.[0]) {
                return { ...data.posts[0], source: 'old' };
            }
        }

        return null;
    } catch (error) {
        console.error('Error fetching post by slug:', error);
        return null;
    }
}

/**
 * Gets posts by tag.
 * 
 * @param tag The tag to filter by.
 * @param page The page number to fetch.
 * @param limit The number of posts to fetch per page.
 * @returns A promise that resolves to a paginated posts object.
 */
export async function getPostsByTag(tag: string, page = 1, limit = 10): Promise<PaginatedPosts> {
    try {
        // Fetch all posts from both Ghost instances
        const [newGhostPosts, oldGhostPosts] = await Promise.all([
            fetchAllPosts(NEW_GHOST_URL, NEW_GHOST_KEY),
            fetchAllPosts(OLD_GHOST_URL, OLD_GHOST_KEY)
        ]);

        // Combine and process posts, filtering by tag
        const allPosts: GhostPost[] = [];
        
        if (newGhostPosts.length > 0) {
            const filteredPosts = newGhostPosts.filter(post => 
                post.tags?.some(t => t.slug === tag || t.name.toLowerCase() === tag.toLowerCase())
            );
            allPosts.push(...filteredPosts.map(post => ({
                ...post,
                source: 'new'
            })));
        }
        
        if (oldGhostPosts.length > 0) {
            const filteredPosts = oldGhostPosts.filter(post => 
                post.tags?.some(t => t.slug === tag || t.name.toLowerCase() === tag.toLowerCase())
            );
            allPosts.push(...filteredPosts.map(post => ({
                ...post,
                source: 'old'
            })));
        }

        // Sort posts by date
        allPosts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const paginatedPosts = allPosts.slice(startIndex, startIndex + limit);
        const totalPages = Math.ceil(allPosts.length / limit);

        return {
            posts: paginatedPosts,
            totalPages,
            currentPage: page,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
    } catch (error) {
        console.error('Error fetching posts by tag:', error);
        return {
            posts: [],
            totalPages: 0,
            currentPage: 1,
            hasNextPage: false,
            hasPrevPage: false
        };
    }
}

/**
 * Interface for paginated posts.
 */
export interface PaginatedPosts {
    posts: GhostPost[];
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
