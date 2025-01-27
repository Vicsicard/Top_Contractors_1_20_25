import { notifySearchEngines } from './indexing';

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

// Validate Ghost configuration
if (!NEW_GHOST_URL) {
    console.error('Error: NEXT_PUBLIC_GHOST_URL is not set');
}

if (!NEW_GHOST_KEY) {
    console.error('Error: NEXT_PUBLIC_GHOST_ORG_CONTENT_API_KEY is not set');
}

if (!OLD_GHOST_URL) {
    console.error('Error: NEXT_PUBLIC_OLD_GHOST_URL is not set');
}

if (!OLD_GHOST_KEY) {
    console.error('Error: NEXT_PUBLIC_OLD_GHOST_ORG_CONTENT_API_KEY is not set');
}

// Ghost API Types
export interface GhostAuthor {
    id: string;
    name: string;
    slug: string;
    profile_image?: string;
    bio?: string;
    website?: string;
    url?: string;
}

export interface GhostTag {
    id: string;
    name: string;
    slug: string;
    description?: string;
    feature_image?: string;
    visibility?: string;
    url?: string;
}

export interface GhostPost {
    id: string;
    uuid: string;
    title: string;
    slug: string;
    html: string;
    comment_id?: string;
    feature_image?: string | null;
    feature_image_alt?: string | null;
    featured: boolean;
    visibility: string;
    created_at: string;
    updated_at: string | null;
    published_at: string;
    custom_excerpt?: string;
    excerpt?: string | null;
    reading_time?: number | null;
    tags?: GhostTag[];
    authors?: GhostAuthor[];
    primary_author?: GhostAuthor;
    primary_tag?: GhostTag;
    url: string;
    canonical_url?: string;
    meta_title?: string;
    meta_description?: string;
    og_image?: string;
    og_title?: string;
    og_description?: string;
    twitter_image?: string;
    twitter_title?: string;
    twitter_description?: string;
    source?: string;
}

// Cache for posts to detect new content
const postCache: { [key: string]: string } = {};

/**
 * Configure fetch options for Ghost API calls
 */
function getFetchOptions(): RequestInit {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    };
}

/**
 * Fetches all posts from a Ghost instance with proper pagination.
 */
export async function fetchAllPosts(url: string, key: string): Promise<GhostPost[]> {
    try {
        const posts: GhostPost[] = [];
        let page = 1;
        const limit = 100; // Increased from 15 to 100 for faster fetching
        let hasMore = true;

        while (hasMore) {
            console.log(`[DEBUG] Fetching page ${page} from Ghost URL: ${url}`);
            const apiUrl = `${url}/ghost/api/v3/content/posts/?key=${key}&page=${page}&limit=${limit}&include=authors,tags&formats=html`;
            
            const response = await fetch(apiUrl, getFetchOptions());
            if (!response.ok) {
                console.error(`[DEBUG] Ghost API error: ${response.status} ${response.statusText}`);
                throw new Error(`Ghost API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            if (data.posts && data.posts.length > 0) {
                console.log(`[DEBUG] Got ${data.posts.length} posts from ${url} (page ${page})`);
                posts.push(...data.posts);
                
                // Check if we have more posts to fetch
                if (data.posts.length < limit) {
                    hasMore = false;
                    console.log(`[DEBUG] No more posts to fetch from ${url}`);
                } else {
                    console.log(`[DEBUG] Moving to next page for ${url}`);
                    page++;
                    // Add a small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } else {
                hasMore = false;
                console.log(`[DEBUG] No posts found on page ${page} for ${url}`);
            }
        }

        console.log(`[DEBUG] Total posts fetched from ${url}: ${posts.length}`);
        return posts;
    } catch (error) {
        console.error('[DEBUG] Error fetching posts from Ghost:', error);
        return [];
    }
}

/**
 * Set Ghost configuration for API calls
 */
export function setGhostConfig(config: {
    newGhostUrl?: string;
    newGhostKey?: string;
    oldGhostUrl?: string;
    oldGhostKey?: string;
}) {
    if (config.newGhostUrl) process.env.NEXT_PUBLIC_GHOST_URL = config.newGhostUrl;
    if (config.newGhostKey) process.env.NEXT_PUBLIC_GHOST_ORG_CONTENT_API_KEY = config.newGhostKey;
    if (config.oldGhostUrl) process.env.NEXT_PUBLIC_OLD_GHOST_URL = config.oldGhostUrl;
    if (config.oldGhostKey) process.env.NEXT_PUBLIC_OLD_GHOST_ORG_CONTENT_API_KEY = config.oldGhostKey;
}

/**
 * Gets all posts.
 * 
 * @returns A promise that resolves to an array of Ghost posts.
 */
export async function getAllPosts(): Promise<GhostPost[]> {
    try {
        console.log('[DEBUG] Getting all posts from both Ghost instances');
        const [newPosts, oldPosts] = await Promise.all([
            fetchAllPosts(NEW_GHOST_URL!, NEW_GHOST_KEY!),
            fetchAllPosts(OLD_GHOST_URL!, OLD_GHOST_KEY!)
        ]);

        console.log(`[DEBUG] Got ${newPosts.length} new posts and ${oldPosts.length} old posts`);
        
        // Add source identifier to each post
        const postsWithSource = [
            ...newPosts.map(post => ({ ...post, source: 'new' })),
            ...oldPosts.map(post => ({ ...post, source: 'old' }))
        ];

        console.log(`[DEBUG] Total combined posts: ${postsWithSource.length}`);
        return postsWithSource;
    } catch (error) {
        console.error('[DEBUG] Error in getAllPosts:', error);
        throw error;
    }
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

export function extractPostCategory(post: GhostPost): string | null {
    console.log(`[DEBUG Category] Analyzing category for post: "${post.title}" with slug: "${post.slug}"`);
    
    if (!post.slug) {
        console.log(`[DEBUG Category] No slug found for post: "${post.title}"`);
        return null;
    }

    // Convert slug to a standardized format for matching
    const normalizedSlug = post.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // First, check for base category words that are always in the URL
    const baseCategories: Record<string, string[]> = {
        // 1. Plumber - plumbing services, repairs, installations
        'plumber': [
            'plumb', 'drain', 'pipe', 'water-heater', 'leak', 'faucet', 'toilet', 
            'water-line', 'sewer', 'clog', 'plumbing-repair', 'water-damage', 
            'water-system', 'backflow', 'hydro-jetting', 'repiping', 'water-pressure'
        ],
        
        // 2. Electrical
        'electrician': [
            'electric', 'wiring', 'circuit', 'power', 'lighting', 'outlet', 'breaker', 
            'panel', 'surge-protection', 'generator', 'electrical-repair', 'electrical-upgrade',
            'electrical-installation', 'electrical-safety', 'electrical-code', 'electrical-permit',
            'electrical-inspection'
        ],
        
        // 3. HVAC
        'hvac': [
            'hvac', 'heating', 'cooling', 'air-condition', 'furnace', 'ac', 'heat',
            'ventilation', 'air-quality', 'thermostat', 'ductwork', 'heat-pump',
            'air-handler', 'refrigerant', 'temperature-control'
        ],
        
        // 4. Roofing
        'roofer': [
            'roof', 'shingle', 'metal-roof', 'tile-roof', 'flat-roof', 'roof-repair',
            'roof-replacement', 'roof-maintenance', 'roof-inspection', 'roofing-material',
            'roof-leak', 'roof-ventilation', 'roof-installation'
        ],
        
        // 5. Painting
        'painter': [
            'paint', 'painting', 'interior-paint', 'exterior-paint', 'wall-covering',
            'paint-color', 'paint-finish', 'paint-type', 'painting-service', 'stain',
            'wallpaper', 'paint-removal', 'paint-preparation'
        ],
        
        // 6. Landscaping - Updated
        'landscaper': [
            'landscap', // This will catch both 'landscape' and 'landscaping'
            'lawn-care',
            'garden',
            'yard-work',
            'sprinkler',
            'irrigation',
            'outdoor-design',
            'plant-selection',
            'tree-service',
            'shrub',
            'mulch',
            'hardscape',
            'soil',
            'grass',
            'weed-control',
            'lawn-maintenance',
            'outdoor-lighting',
            'xeriscap', // For xeriscaping
            'water-feature',
            'rock-garden',
            'flower-bed',
            'yard-maintenance'
        ],
        
        // 7. Home Remodeling
        'home-remodeling': [
            'home-remodel', 'renovation', 'home-improvement', 'remodeling', 'home-addition',
            'house-renovation', 'whole-house', 'living-space', 'basement-finish',
            'room-addition', 'interior-remodel', 'home-upgrade'
        ],
        
        // 8. Bathroom Remodeling
        'bathroom-remodeling': [
            'bathroom-remodel', 'bath-renovation', 'bathroom', 'bath-remodel', 'shower',
            'bathtub', 'toilet', 'vanity', 'bathroom-design', 'bathroom-fixture',
            'bathroom-tile', 'bathroom-plumbing', 'bathroom-cabinet'
        ],
        
        // 9. Kitchen Remodeling
        'kitchen-remodeling': [
            'kitchen-remodel', 'kitchen-renovation', 'kitchen', 'cabinet', 'countertop',
            'kitchen-design', 'kitchen-appliance', 'kitchen-island', 'kitchen-storage',
            'kitchen-sink', 'kitchen-backsplash', 'kitchen-lighting'
        ],
        
        // 10. Siding and Gutters - Updated
        'siding-gutters': [
            'siding-',   // Will catch siding-installation, siding-repair, etc.
            '-siding',   // Will catch vinyl-siding, metal-siding, etc.
            'gutter-',   // Will catch gutter-installation, gutter-repair, etc.
            '-gutter',   // Will catch seamless-gutter, etc.
            'rain-gutter',
            'downspout',
            'vinyl-siding',
            'fiber-cement',
            'hardie',    // For Hardie board siding
            'aluminum-siding',
            'metal-siding',
            'wood-siding',
            'gutter-guard',
            'gutter-screen',
            'gutter-clean',
            'gutter-maintenance',
            'fascia',
            'soffit',
            'seamless-gutter',
            'rain-chain',
            'water-diversion',
            'exterior-drainage'
        ],
        
        // 11. Masonry
        'masonry': [
            'masonry', 'brick', 'stone', 'concrete', 'block', 'masonry service',
            'brick work', 'stone work', 'concrete work', 'retaining wall',
            'masonry contractor', 'brick repair', 'stone mason'
        ],
        
        // 12. Decks - Updated
        'decks': [
            'deck-',     // Will catch deck-building, deck-repair, etc.
            '-deck',     // Will catch patio-deck, wood-deck, etc.
            'decking',
            'porch',
            'outdoor-living',
            'composite-decking',
            'wood-decking',
            'deck-stain',
            'deck-seal',
            'deck-rail',
            'deck-board',
            'deck-design',
            'deck-build',
            'deck-construct',
            'deck-install',
            'deck-repair',
            'deck-maintain'
        ],
        
        // 13. Flooring
        'flooring': [
            'floor', 'hardwood', 'tile-floor', 'carpet', 'vinyl', 'laminate',
            'floor-installation', 'wood-floor', 'tile-installation', 'flooring-repair',
            'floor-refinishing', 'floor-sanding', 'floor-staining'
        ],
        
        // 14. Windows - Updated
        'windows': [
            'window-',   // Will catch window-replacement, window-installation, etc.
            '-window',   // Will catch bay-window, picture-window, etc.
            'double-hung',
            'single-hung',
            'casement',
            'sliding-window',
            'bay-window',
            'bow-window',
            'picture-window',
            'window-frame',
            'window-glass',
            'window-seal',
            'window-pane',
            'energy-efficient-window',
            'vinyl-window',
            'window-screen',
            'window-treatment'
        ],
        
        // 15. Fencing - Updated
        'fencing': [
            'fence-',    // Will catch fence-installation, fence-repair, etc.
            '-fence',    // Will catch privacy-fence, wood-fence, etc.
            'fencing',
            'privacy-screen',
            'yard-enclosure',
            'gate-',
            'wood-fence',
            'vinyl-fence',
            'metal-fence',
            'chain-link',
            'wrought-iron',
            'fence-post',
            'fence-panel',
            'fence-repair',
            'fence-install',
            'fence-maintain',
            'security-fence',
            'pool-fence',
            'pet-fence'
        ],
        
        // 16. Epoxy Garage Floors
        'epoxy-garage': [
            'epoxy', 'garage-floor', 'floor-coating', 'epoxy-coating', 'garage-epoxy',
            'epoxy-floor', 'garage-floor-coating', 'concrete-coating', 'garage-makeover',
            'epoxy-specialist', 'garage-flooring'
        ]
    };

    // Check for base category words first
    for (const [trade, baseWords] of Object.entries(baseCategories)) {
        const matchedWord = baseWords.find(word => normalizedSlug.includes(word));
        if (matchedWord) {
            // Additional check for home remodeling to avoid bathroom/kitchen posts
            if (trade === 'home-remodeling') {
                if (normalizedSlug.includes('bathroom') || normalizedSlug.includes('kitchen')) {
                    continue; // Skip this match and keep looking
                }
            }
            console.log(`[DEBUG Category] Found trade "${trade}" from base word match in slug: ${matchedWord}`);
            return trade;
        }
    }

    // If no base category found, fall back to detailed keyword matching
    const tradeKeywords: Record<string, string[]> = {
        // 1. Plumbing
        'plumber': [
            'plumb', 'drain', 'pipe', 'water-heater', 'leak', 'faucet', 'toilet', 
            'water-line', 'sewer', 'clog', 'plumbing-repair', 'water-damage', 
            'water-system', 'backflow', 'hydro-jetting', 'repiping', 'water-pressure'
        ],
        
        // 2. Electrical
        'electrician': [
            'electric', 'wiring', 'circuit', 'power', 'lighting', 'outlet', 'breaker', 
            'panel', 'surge-protection', 'generator', 'electrical-repair', 'electrical-upgrade',
            'electrical-installation', 'electrical-safety', 'electrical-code', 'electrical-permit',
            'electrical-inspection'
        ],
        
        // 3. HVAC
        'hvac': [
            'hvac', 'heating', 'cooling', 'air-condition', 'furnace', 'ac', 'heat',
            'ventilation', 'air-quality', 'thermostat', 'ductwork', 'heat-pump',
            'air-handler', 'refrigerant', 'temperature-control'
        ],
        
        // 4. Roofing
        'roofer': [
            'roof', 'shingle', 'metal-roof', 'tile-roof', 'flat-roof', 'roof-repair',
            'roof-replacement', 'roof-maintenance', 'roof-inspection', 'roofing-material',
            'roof-leak', 'roof-ventilation', 'roof-installation'
        ],
        
        // 5. Painting
        'painter': [
            'paint', 'painting', 'interior-paint', 'exterior-paint', 'wall-covering',
            'paint-color', 'paint-finish', 'paint-type', 'painting-service', 'stain',
            'wallpaper', 'paint-removal', 'paint-preparation'
        ],
        
        // 6. Landscaping - Updated
        'landscaper': [
            'landscap', // This will catch both 'landscape' and 'landscaping'
            'lawn-care',
            'garden',
            'yard-work',
            'sprinkler',
            'irrigation',
            'outdoor-design',
            'plant-selection',
            'tree-service',
            'shrub',
            'mulch',
            'hardscape',
            'soil',
            'grass',
            'weed-control',
            'lawn-maintenance',
            'outdoor-lighting',
            'xeriscap', // For xeriscaping
            'water-feature',
            'rock-garden',
            'flower-bed',
            'yard-maintenance'
        ],
        
        // 7. Home Remodeling
        'home-remodeling': [
            'home-remodel', 'renovation', 'home-improvement', 'remodeling', 'home-addition',
            'house-renovation', 'whole-house', 'living-space', 'basement-finish',
            'room-addition', 'interior-remodel', 'home-upgrade'
        ],
        
        // 8. Bathroom Remodeling
        'bathroom-remodeling': [
            'bathroom-remodel', 'bath-renovation', 'bathroom', 'bath-remodel', 'shower',
            'bathtub', 'toilet', 'vanity', 'bathroom-design', 'bathroom-fixture',
            'bathroom-tile', 'bathroom-plumbing', 'bathroom-cabinet'
        ],
        
        // 9. Kitchen Remodeling
        'kitchen-remodeling': [
            'kitchen-remodel', 'kitchen-renovation', 'kitchen', 'cabinet', 'countertop',
            'kitchen-design', 'kitchen-appliance', 'kitchen-island', 'kitchen-storage',
            'kitchen-sink', 'kitchen-backsplash', 'kitchen-lighting'
        ],
        
        // 10. Siding and Gutters - Updated
        'siding-gutters': [
            'siding-',   // Will catch siding-installation, siding-repair, etc.
            '-siding',   // Will catch vinyl-siding, metal-siding, etc.
            'gutter-',   // Will catch gutter-installation, gutter-repair, etc.
            '-gutter',   // Will catch seamless-gutter, etc.
            'rain-gutter',
            'downspout',
            'vinyl-siding',
            'fiber-cement',
            'hardie',    // For Hardie board siding
            'aluminum-siding',
            'metal-siding',
            'wood-siding',
            'gutter-guard',
            'gutter-screen',
            'gutter-clean',
            'gutter-maintenance',
            'fascia',
            'soffit',
            'seamless-gutter',
            'rain-chain',
            'water-diversion',
            'exterior-drainage'
        ],
        
        // 11. Masonry
        'masonry': [
            'masonry', 'brick', 'stone', 'concrete', 'block', 'masonry service',
            'brick work', 'stone work', 'concrete work', 'retaining wall',
            'masonry contractor', 'brick repair', 'stone mason'
        ],
        
        // 12. Decks - Updated
        'decks': [
            'deck-',     // Will catch deck-building, deck-repair, etc.
            '-deck',     // Will catch patio-deck, wood-deck, etc.
            'decking',
            'porch',
            'outdoor-living',
            'composite-decking',
            'wood-decking',
            'deck-stain',
            'deck-seal',
            'deck-rail',
            'deck-board',
            'deck-design',
            'deck-build',
            'deck-construct',
            'deck-install',
            'deck-repair',
            'deck-maintain'
        ],
        
        // 13. Flooring
        'flooring': [
            'floor', 'hardwood', 'tile-floor', 'carpet', 'vinyl', 'laminate',
            'floor-installation', 'wood-floor', 'tile-installation', 'flooring-repair',
            'floor-refinishing', 'floor-sanding', 'floor-staining'
        ],
        
        // 14. Windows - Updated
        'windows': [
            'window-',   // Will catch window-replacement, window-installation, etc.
            '-window',   // Will catch bay-window, picture-window, etc.
            'double-hung',
            'single-hung',
            'casement',
            'sliding-window',
            'bay-window',
            'bow-window',
            'picture-window',
            'window-frame',
            'window-glass',
            'window-seal',
            'window-pane',
            'energy-efficient-window',
            'vinyl-window',
            'window-screen',
            'window-treatment'
        ],
        
        // 15. Fencing - Updated
        'fencing': [
            'fence-',    // Will catch fence-installation, fence-repair, etc.
            '-fence',    // Will catch privacy-fence, wood-fence, etc.
            'fencing',
            'privacy-screen',
            'yard-enclosure',
            'gate-',
            'wood-fence',
            'vinyl-fence',
            'metal-fence',
            'chain-link',
            'wrought-iron',
            'fence-post',
            'fence-panel',
            'fence-repair',
            'fence-install',
            'fence-maintain',
            'security-fence',
            'pool-fence',
            'pet-fence'
        ],
        
        // 16. Epoxy Garage Floors
        'epoxy-garage': [
            'epoxy', 'garage-floor', 'floor-coating', 'epoxy-coating', 'garage-epoxy',
            'epoxy-floor', 'garage-floor-coating', 'concrete-coating', 'garage-makeover',
            'epoxy-specialist', 'garage-flooring'
        ]
    };

    // Look for trade keywords in the slug
    for (const [trade, keywords] of Object.entries(tradeKeywords)) {
        const matchedWord = keywords.find(keyword => normalizedSlug.includes(keyword));
        if (matchedWord) {
            console.log(`[DEBUG Category] Found trade "${trade}" from keyword match in slug: ${matchedWord}`);
            return trade;
        }
    }

    console.log(`[DEBUG Category] No trade category found for post`);
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
        console.log(`[DEBUG] Got ${allPosts.length} total posts`);

        // Filter posts by category
        const categoryPosts = allPosts.filter(post => {
            const postCategory = extractPostCategory(post);
            console.log(`[DEBUG] Post "${post.title}" category: ${postCategory}`);
            return postCategory === category;
        });
        console.log(`[DEBUG] Found ${categoryPosts.length} posts in category ${category}`);

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
