import { notifySearchEngines } from './indexing';
import { tradesData } from '../lib/trades-data';

// Ghost Configuration
let NEW_GHOST_URL = process.env.NEXT_PUBLIC_GHOST_URL;
let NEW_GHOST_KEY = process.env.NEXT_PUBLIC_GHOST_ORG_CONTENT_API_KEY;
let OLD_GHOST_URL = process.env.NEXT_PUBLIC_OLD_GHOST_URL;
let OLD_GHOST_KEY = process.env.NEXT_PUBLIC_OLD_GHOST_ORG_CONTENT_API_KEY;

// Allow overriding Ghost configuration for scripts
export function setGhostConfig(config: {
    newGhostUrl?: string;
    newGhostKey?: string;
    oldGhostUrl?: string;
    oldGhostKey?: string;
}) {
    if (config.newGhostUrl) NEW_GHOST_URL = config.newGhostUrl;
    if (config.newGhostKey) NEW_GHOST_KEY = config.newGhostKey;
    if (config.oldGhostUrl) OLD_GHOST_URL = config.oldGhostUrl;
    if (config.oldGhostKey) OLD_GHOST_KEY = config.oldGhostKey;
}

// Debug environment variables and runtime context
console.log('=== Ghost Configuration Debug ===');
console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    IS_VERCEL: process.env.VERCEL === '1'
});
console.log('Ghost URLs:', {
    NEW_GHOST_URL,
    OLD_GHOST_URL
});
console.log('API Keys Status:', {
    NEW_GHOST_KEY_LENGTH: NEW_GHOST_KEY ? NEW_GHOST_KEY.length : 0,
    NEW_GHOST_KEY_PRESENT: !!NEW_GHOST_KEY,
    OLD_GHOST_KEY_LENGTH: OLD_GHOST_KEY ? OLD_GHOST_KEY.length : 0,
    OLD_GHOST_KEY_PRESENT: !!OLD_GHOST_KEY
});

if (!NEW_GHOST_URL || NEW_GHOST_URL !== 'https://top-contractors-denver-2.ghost.io') {
    console.error('Error: NEXT_PUBLIC_GHOST_URL is not set correctly. Expected: https://top-contractors-denver-2.ghost.io, Got:', NEW_GHOST_URL);
}

if (!NEW_GHOST_KEY || NEW_GHOST_KEY !== '6229b20c390c831641ea577093') {
    console.error('Error: NEXT_PUBLIC_GHOST_ORG_CONTENT_API_KEY is not set correctly');
}

if (!OLD_GHOST_URL || OLD_GHOST_URL !== 'https://top-contractors-denver-1.ghost.io') {
    console.error('Error: NEXT_PUBLIC_OLD_GHOST_URL is not set correctly. Expected: https://top-contractors-denver-1.ghost.io, Got:', OLD_GHOST_URL);
}

if (!OLD_GHOST_KEY || OLD_GHOST_KEY !== '130d98b20875066982b1a8314f') {
    console.error('Error: NEXT_PUBLIC_OLD_GHOST_ORG_CONTENT_API_KEY is not set correctly');
}

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

// Fetch options based on environment
interface NextFetchOptions {
    next: {
        revalidate: number;
    };
}

const getFetchOptions = (): RequestInit & { next: { revalidate: number } } => {
    const baseOptions: RequestInit = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
        // Node.js environment (scripts)
        return {
            ...baseOptions,
            next: { revalidate: 3600 }
        };
    } else {
        // Next.js environment
        return {
            ...baseOptions,
            next: { revalidate: 3600 }
        };
    }
};

/**
 * Fetches all posts from a Ghost instance.
 * 
 * @param url The URL of the Ghost instance.
 * @param key The API key for the Ghost instance.
 * @returns A promise that resolves to an array of Ghost posts.
 */
async function fetchAllPosts(url: string, key: string): Promise<GhostPost[]> {
    const posts: GhostPost[] = [];
    let currentPage = 1;
    const limit = 15;
    let hasMore = true;

    while (hasMore) {
        try {
            // Remove /ghost/api/content/posts from the URL if it's already included
            const baseUrl = url.replace(/\/ghost\/api\/content\/posts\/?$/, '');
            const apiUrl = `${baseUrl}/ghost/api/content/posts/?key=${key}&limit=${limit}&page=${currentPage}&include=tags,authors&formats=html`;
            
            console.log(`[${process.env.NODE_ENV}] Fetching page ${currentPage} from: ${url}`);
            
            const response = await fetch(apiUrl, getFetchOptions());
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch posts from ${url}: ${response.status} ${response.statusText}\n${errorText}`);
            }

            const data = await response.json();
            
            if (!data.posts || !Array.isArray(data.posts)) {
                throw new Error(`Invalid response from ${url}: Expected posts array`);
            }

            posts.push(...data.posts);

            // Check if there are more posts
            hasMore = data.meta?.pagination?.pages > currentPage;
            currentPage++;

        } catch (error) {
            console.error(`Error fetching posts from ${url}:`, error);
            throw error;
        }
    }

    return posts;
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
        // Get posts from both Ghost instances
        const [newPosts, oldPosts] = await Promise.all([
            fetchAllPosts(NEW_GHOST_URL!, NEW_GHOST_KEY!),
            fetchAllPosts(OLD_GHOST_URL!, OLD_GHOST_KEY!)
        ]);

        // Combine and sort posts
        const allPosts = [...newPosts, ...oldPosts].sort((a, b) => 
            new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );

        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const totalPages = Math.ceil(allPosts.length / limit);

        // Get posts for current page
        const paginatedPosts = allPosts.slice(startIndex, endIndex);

        // Check for new posts
        const newPostsFound = paginatedPosts.some(post => {
            const isNew = !postCache[post.id];
            if (isNew) {
                postCache[post.id] = post.updated_at || post.published_at;
                return true;
            }
            return false;
        });

        // Notify search engines if new posts are found
        if (newPostsFound) {
            const urls = paginatedPosts
                .filter(post => !postCache[post.id])
                .map(post => `https://topcontractorsdenver.com/blog/${post.slug}`);
            await notifySearchEngines(urls);
        }

        return {
            posts: paginatedPosts,
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
 * Gets all posts.
 * 
 * @returns A promise that resolves to an array of Ghost posts.
 */
export async function getAllPosts(): Promise<GhostPost[]> {
    try {
        // Get posts from both Ghost instances
        const [newPosts, oldPosts] = await Promise.all([
            fetchAllPosts(NEW_GHOST_URL!, NEW_GHOST_KEY!),
            fetchAllPosts(OLD_GHOST_URL!, OLD_GHOST_KEY!)
        ]);

        // Combine and sort posts
        return [...newPosts, ...oldPosts].sort((a, b) => 
            new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );
    } catch (error) {
        console.error('Error fetching all posts:', error);
        throw error;
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
            `${NEW_GHOST_URL}/ghost/api/content/posts/slug/${slug}/?key=${NEW_GHOST_KEY}&include=tags,authors&formats=html`,
            getFetchOptions()
        );
        
        if (newResponse.ok) {
            const data = await newResponse.json();
            return data.posts[0] || null;
        }

        // If not found in new Ghost, try old Ghost
        const oldResponse = await fetch(
            `${OLD_GHOST_URL}/ghost/api/content/posts/slug/${slug}/?key=${OLD_GHOST_KEY}&include=tags,authors&formats=html`,
            getFetchOptions()
        );
        
        if (oldResponse.ok) {
            const data = await oldResponse.json();
            return data.posts[0] || null;
        }

        return null;
    } catch (error) {
        console.error('Error fetching post by slug:', error);
        throw error;
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
        // Get all posts
        const allPosts = await getAllPosts();

        // Filter posts by tag
        const taggedPosts = allPosts.filter(post => 
            post.tags?.some(t => t.slug === tag || t.name.toLowerCase() === tag.toLowerCase())
        );

        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const totalPages = Math.ceil(taggedPosts.length / limit);

        return {
            posts: taggedPosts.slice(startIndex, endIndex),
            totalPages,
            currentPage: page,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
    } catch (error) {
        console.error('Error fetching posts by tag:', error);
        throw error;
    }
}

/**
 * Extracts the category from a post's content based on the hyperlinked trade category.
 * 
 * @param post The Ghost post to extract the category from
 * @returns The category ID or null if not found
 */
export function extractPostCategory(post: GhostPost): string | null {
    if (!post.html) return null;

    // Remove HTML tags and decode entities for text analysis
    const cleanHtml = (html: string) => {
        return html
            .replace(/<[^>]+>/g, ' ') // Remove HTML tags
            .replace(/&nbsp;/g, ' ')  // Replace &nbsp; with space
            .replace(/&amp;/g, '&')   // Replace &amp; with &
            .replace(/&lt;/g, '<')    // Replace &lt; with <
            .replace(/&gt;/g, '>')    // Replace &gt; with >
            .replace(/&quot;/g, '"')  // Replace &quot; with "
            .replace(/&#39;/g, "'")   // Replace &#39; with '
            .replace(/\s+/g, ' ')     // Replace multiple spaces with single space
            .trim();
    };

    // Get clean text from title and content
    const titleAndContent = `${post.title} ${cleanHtml(post.html)}`.toLowerCase();
    
    // Define specific phrases that strongly indicate a particular trade
    const tradeIndicators: Record<string, string[]> = {
        'plumber': [
            'plumbing', 'plumber', 'drain', 'pipe', 'water heater', 'leak', 'faucet', 'toilet',
            'water line', 'sewer', 'clog', 'plumbing service', 'plumbing repair'
        ],
        'electrician': [
            'electrical', 'electrician', 'wiring', 'circuit', 'power', 'electrical service',
            'electrical repair', 'electrical installation', 'lighting', 'outlet', 'breaker'
        ],
        'hvac': [
            'hvac', 'heating', 'cooling', 'air conditioning', 'furnace', 'ac', 'heat',
            'hvac service', 'hvac repair', 'hvac installation', 'air conditioner'
        ],
        'roofer': [
            'roof', 'roofing', 'shingle', 'metal roof', 'tile roof', 'roofing service',
            'roof repair', 'roof installation', 'roof replacement', 'roofing contractor'
        ],
        'painter': [
            'paint', 'painting', 'interior paint', 'exterior paint', 'painting service',
            'house painter', 'residential painting', 'commercial painting', 'paint job',
            'painting contractor', 'professional painter', 'paint color'
        ],
        'landscaper': [
            'landscape', 'landscaping', 'lawn', 'garden', 'yard', 'landscaping service',
            'lawn care', 'lawn maintenance', 'landscaping design', 'outdoor', 'tree service',
            'sprinkler', 'irrigation'
        ],
        'home-remodeling': [
            'home remodel', 'renovation', 'home improvement', 'remodeling service',
            'home renovation', 'house remodel', 'residential remodeling', 'custom home',
            'home addition', 'basement finish', 'general contractor'
        ],
        'bathroom-remodeling': [
            'bathroom remodel', 'bath renovation', 'bathroom upgrade', 'bathroom design',
            'bathroom contractor', 'bathroom project', 'master bath', 'bathroom makeover',
            'bathroom renovation service', 'bath remodel', 'bathroom specialist'
        ],
        'kitchen-remodeling': [
            'kitchen remodel', 'kitchen renovation', 'kitchen upgrade', 'kitchen design',
            'kitchen contractor', 'kitchen project', 'kitchen makeover', 'kitchen cabinet',
            'kitchen countertop', 'kitchen renovation service', 'kitchen specialist'
        ],
        'siding-gutters': [
            'siding', 'gutter', 'downspout', 'exterior', 'siding installation',
            'gutter repair', 'gutter installation', 'gutter cleaning', 'vinyl siding',
            'fiber cement siding', 'seamless gutter', 'gutter service'
        ],
        'masonry': [
            'masonry', 'brick', 'stone', 'concrete', 'block', 'masonry service',
            'brick work', 'stone work', 'concrete work', 'retaining wall',
            'masonry contractor', 'brick repair', 'stone mason'
        ],
        'decks': [
            'deck', 'patio deck', 'composite deck', 'wood deck', 'deck building',
            'deck installation', 'deck repair', 'deck contractor', 'outdoor deck',
            'custom deck', 'deck design', 'deck builder'
        ],
        'flooring': [
            'floor', 'hardwood', 'tile floor', 'carpet', 'vinyl', 'flooring service',
            'floor installation', 'floor repair', 'flooring contractor', 'laminate',
            'wood floor', 'tile installation', 'floor covering'
        ],
        'windows': [
            'window', 'window replacement', 'window installation', 'window repair',
            'window contractor', 'window service', 'replacement window', 'new window',
            'window upgrade', 'energy efficient window', 'window specialist'
        ],
        'fencing': [
            'fence', 'fencing', 'privacy fence', 'yard fence', 'fence installation',
            'fence repair', 'fence contractor', 'fence service', 'wood fence',
            'vinyl fence', 'chain link fence', 'fence builder', 'security fence',
            'residential fence', 'commercial fence', 'fence company', 'fence specialist',
            'fencing service', 'fencing contractor', 'fence estimate'
        ],
        'epoxy-garage': [
            'epoxy', 'garage floor', 'floor coating', 'epoxy coating', 'garage epoxy',
            'epoxy floor', 'garage floor coating', 'concrete coating', 'garage makeover',
            'epoxy specialist', 'garage flooring'
        ]
    };

    // Define negative indicators that suggest the content is NOT about a particular trade
    const negativeIndicators: Record<string, string[]> = {
        'bathroom-remodeling': ['kitchen', 'outdoor', 'garage', 'landscape'],
        'kitchen-remodeling': ['bathroom', 'outdoor', 'garage', 'landscape'],
        'home-remodeling': ['specific trade', 'single trade'],
        'siding-gutters': ['interior', 'indoor', 'inside'],
        'windows': ['window shopping', 'window of opportunity', 'browser window'],
        'painter': ['artist', 'painting class', 'art', 'gallery'],
        'landscaper': ['indoor', 'interior', 'inside'],
        'flooring': ['upper floor', 'next floor', 'floor plan', 'floor manager'],
        'fencing': ['sword', 'sport', 'competition', 'olympic']
    };

    // Look for direct trade mentions in the title
    const titleOnly = post.title.toLowerCase();
    for (const [tradeId, indicators] of Object.entries(tradeIndicators)) {
        // Skip if title contains negative indicators
        if (negativeIndicators[tradeId]?.some(neg => titleOnly.includes(neg))) {
            continue;
        }

        // Check for strong indicators in the title
        const hasTitleIndicator = indicators.some(indicator => {
            const indicatorRegex = new RegExp(`\\b${indicator}\\b`, 'i');
            return indicatorRegex.test(titleOnly);
        });

        if (hasTitleIndicator) {
            return tradeId;
        }
    }

    // If no match in title, check full content
    for (const [tradeId, indicators] of Object.entries(tradeIndicators)) {
        // Skip if content contains negative indicators
        if (negativeIndicators[tradeId]?.some(neg => titleAndContent.includes(neg))) {
            continue;
        }

        // Look for strong indicators in the content
        const hasStrongIndicator = indicators.some(indicator => {
            const indicatorRegex = new RegExp(`\\b${indicator}\\b`, 'i');
            return indicatorRegex.test(titleAndContent);
        });

        // Look for trade name in URL-like patterns
        const urlPatterns = [
            new RegExp(`\\b${tradeId.replace('-', '\\s*')}\\s+in\\s+denver\\b`, 'i'),
            new RegExp(`\\b${tradeId.replace('-', '\\s*')}\\s+services\\b`, 'i'),
            new RegExp(`\\bdenver\\s+${tradeId.replace('-', '\\s*')}\\b`, 'i'),
            new RegExp(`\\b${tradeId.replace('-', '\\s*')}\\s+contractor`, 'i'),
            new RegExp(`\\b${tradeId.replace('-', '\\s*')}\\s+specialist`, 'i'),
            new RegExp(`\\b${tradeId.replace('-', '\\s*')}\\s+company`, 'i'),
            new RegExp(`\\b${tradeId.replace('-', '\\s*')}\\s+expert`, 'i')
        ];

        const hasUrlPattern = urlPatterns.some(pattern => pattern.test(titleAndContent));

        if (hasStrongIndicator || hasUrlPattern) {
            return tradeId;
        }
    }

    return null;
}

/**
 * Gets posts by category.
 * 
 * @param category The category ID to filter by
 * @param page The page number to fetch
 * @param limit The number of posts to fetch per page
 * @returns A promise that resolves to a paginated posts object
 */
export async function getPostsByCategory(category: string, page = 1, limit = 10): Promise<PaginatedPosts> {
    try {
        // Get all posts
        const allPosts = await getAllPosts();

        // Filter posts by category
        const categoryPosts = allPosts.filter(post => extractPostCategory(post) === category);

        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const totalPages = Math.ceil(categoryPosts.length / limit);

        return {
            posts: categoryPosts.slice(startIndex, endIndex),
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
