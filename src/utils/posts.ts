import { blogSupabase, secondaryBlogSupabase } from './supabase-blog-client';
import type { Post } from '@/types/blog';
import { marked } from 'marked';

// List of valid tags for this project (from tag-mapper.ts)
const VALID_PROJECT_TAGS: string[] = [
  'bathroom remodeling',
  'decks',
  'electrician',
  'epoxy garage',
  'fencing',
  'flooring',
  'home remodeling',
  'hvac',
  'kitchen remodeling',
  'landscaper',
  'masonry',
  'plumbing',
  'roofer',
  'siding gutters',
  'windows'
];

// Helper function to check if a post belongs to this project based on tags
function postBelongsToProject(tags: string | null): boolean {
  if (!tags) return false;
  
  const tagList = tags.split(',').map(tag => tag.trim().toLowerCase());
  const belongs = tagList.some(tag => VALID_PROJECT_TAGS.includes(tag));
  
  // For debugging purposes
  if (!belongs) {
    console.log(`Post tags not matching: ${tags}`);
  }
  
  return belongs;
}

// Helper function to convert markdown to HTML
function convertMarkdownToHtml(markdown: string): string {
  try {
    if (!markdown) {
      console.warn('[WARN] Empty markdown content received in convertMarkdownToHtml');
      return '';
    }
    
    // Replace custom tags like [h3] with proper HTML
    const customTagReplacements = [
      { pattern: /\[h3\]/g, replacement: '### ' },
      { pattern: /\[\/h3\]/g, replacement: '' },
      { pattern: /\[h2\]/g, replacement: '## ' },
      { pattern: /\[\/h2\]/g, replacement: '' },
      { pattern: /\[h1\]/g, replacement: '# ' },
      { pattern: /\[\/h1\]/g, replacement: '' },
      { pattern: /\[b\]/g, replacement: '**' },
      { pattern: /\[\/b\]/g, replacement: '**' },
      { pattern: /\[i\]/g, replacement: '*' },
      { pattern: /\[\/i\]/g, replacement: '*' },
      { pattern: /\[ul\]/g, replacement: '' },
      { pattern: /\[\/ul\]/g, replacement: '' },
      { pattern: /\[li\]/g, replacement: '- ' },
      { pattern: /\[\/li\]/g, replacement: '' },
      { pattern: /\[p\]/g, replacement: '\n\n' },
      { pattern: /\[\/p\]/g, replacement: '' }
    ];
    
    let cleanedMarkdown = markdown;
    
    // Apply all custom tag replacements
    customTagReplacements.forEach(({ pattern, replacement }) => {
      cleanedMarkdown = cleanedMarkdown.replace(pattern, replacement);
    });
    
    // Use marked.parse to convert markdown to HTML
    const html = marked.parse(cleanedMarkdown) as string;
    
    // Log success for debugging
    console.log('[DEBUG] Successfully converted markdown to HTML');
    
    return html;
  } catch (error) {
    console.error('[ERROR] Error converting markdown to HTML:', error);
    // Return a basic sanitized version of the markdown as fallback
    return markdown
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
      .replace(/\[.*?\]/g, ''); // Remove any remaining custom tags
  }
}

// Helper function to extract feature image from content
function extractFeatureImage(content: string): { featureImage: string | undefined; imageAlt: string | undefined; contentWithoutImage: string } {
  let featureImage: string | undefined = undefined;
  let imageAlt: string | undefined = undefined;
  let contentWithoutImage = content;
  
  // Check for markdown image format: ![alt](url)
  const markdownImageRegex = /!\[(.*?)\]\((.*?)\)/;
  const markdownMatch = content.match(markdownImageRegex);
  
  if (markdownMatch && markdownMatch[2]) {
    featureImage = markdownMatch[2];
    imageAlt = markdownMatch[1] || undefined;
    // Remove the image from the content to avoid duplication
    contentWithoutImage = content.replace(markdownMatch[0], '').trim();
    return { featureImage, imageAlt, contentWithoutImage };
  }
  
  // Check for HTML image format: <img src="url" alt="alt" />
  const htmlImageRegex = /<img.*?src=["'](.*?)["'].*?alt=["'](.*?)["'].*?>/i;
  const htmlMatch = content.match(htmlImageRegex);
  
  if (htmlMatch && htmlMatch[1]) {
    featureImage = htmlMatch[1];
    imageAlt = htmlMatch[2] || undefined;
    // Remove the image from the content to avoid duplication
    contentWithoutImage = content.replace(htmlMatch[0], '').trim();
    return { featureImage, imageAlt, contentWithoutImage };
  }
  
  // If no image found, return original content
  return { featureImage, imageAlt, contentWithoutImage: content };
}

// Helper function to extract image from the images array
function extractImageFromArray(images: any): { imageUrl: string | undefined; imageAlt: string | undefined } {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return { imageUrl: undefined, imageAlt: undefined };
  }
  
  try {
    // Try to parse the first image in the array
    const firstImage = typeof images[0] === 'string' ? JSON.parse(images[0]) : images[0];
    
    if (firstImage && firstImage.url) {
      return { 
        imageUrl: firstImage.url, 
        imageAlt: firstImage.alt 
      };
    }
  } catch (error) {
    console.error('Error parsing image data:', error);
  }
  
  return { imageUrl: undefined, imageAlt: undefined };
}

export async function getPosts(page = 1, perPage = 10): Promise<{
  posts: Post[];
  totalPosts: number;
  hasMore: boolean;
}> {
  try {
    console.log(`[DEBUG] Starting getPosts function for page ${page}, perPage ${perPage}`);
    const start = (page - 1) * perPage;
    
    // Set a reasonable limit for database queries to prevent timeouts
    const DB_QUERY_LIMIT = 1000; // Increased from 100 to handle more posts
    
    // For all pages, we need to get the total counts to calculate pagination
    let primaryTotalCount = 0;
    let secondaryTotalCount = 0;
    
    try {
      // Get count of primary posts with project tags
      const { count, error } = await blogSupabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });
        
      if (!error) {
        primaryTotalCount = count || 0;
        console.log(`[DEBUG] Primary Supabase has ${primaryTotalCount} total posts`);
      }
    } catch (error) {
      console.error('[ERROR] Error getting primary post count:', error);
    }
    
    try {
      // Get count of secondary posts
      if (secondaryBlogSupabase) {
        const { count, error } = await secondaryBlogSupabase
          .from('posts')
          .select('*', { count: 'exact', head: true });
          
        if (!error) {
          secondaryTotalCount = count || 0;
          console.log(`[DEBUG] Secondary Supabase has ${secondaryTotalCount} total posts`);
        }
      }
    } catch (error) {
      console.error('[ERROR] Error getting secondary post count:', error);
    }
    
    // Calculate the range for fetching posts based on the current page
    const rangeStart = Math.min(start, DB_QUERY_LIMIT - 1);
    const rangeEnd = Math.min(start + perPage * 2, DB_QUERY_LIMIT - 1); // Fetch more than needed for the current page
    
    // Fetch posts from primary Supabase instance (blog project) with pagination
    console.log(`[DEBUG] Fetching posts from primary Supabase instance (blog project) range: ${rangeStart}-${rangeEnd}`);
    const { data: primaryPosts, error: primaryError } = await blogSupabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(rangeStart, rangeEnd); // Use calculated range

    if (primaryError) {
      console.error('[ERROR] Error fetching primary posts:', primaryError);
      throw new Error(`Failed to fetch primary posts: ${primaryError.message}`);
    } 
    
    console.log(`[DEBUG] Fetched ${primaryPosts?.length || 0} posts from primary Supabase project`);
    
    // Filter primary posts by project tags
    const filteredPrimaryPosts = (primaryPosts || []).filter(post => {
      const belongs = postBelongsToProject(post.tags);
      if (belongs) {
        console.log(`[DEBUG] Primary post matched project tags: ${post.title}`);
      }
      return belongs;
    });
    
    console.log(`[DEBUG] After filtering: ${filteredPrimaryPosts.length} primary posts match project criteria`);

    // For the secondary project, calculate a separate range if needed for higher pages
    let secondaryRangeStart = 0;
    let secondaryRangeEnd = DB_QUERY_LIMIT - 1;
    
    // If we're on a higher page and didn't get enough primary posts, adjust the secondary range
    if (page > 1 && filteredPrimaryPosts.length < perPage) {
      secondaryRangeStart = Math.max(0, rangeStart - filteredPrimaryPosts.length);
      secondaryRangeEnd = Math.min(secondaryRangeStart + perPage * 2, DB_QUERY_LIMIT - 1);
    }
    
    // Fetch posts from secondary Supabase instance (main project) with pagination
    let secondaryPosts: any[] = [];
    
    if (secondaryBlogSupabase) {
      try {
        console.log(`[DEBUG] Fetching posts from secondary Supabase instance (main project) range: ${secondaryRangeStart}-${secondaryRangeEnd}`);
        // For the secondary project, we need to use the 'posts' table instead of 'blog_posts'
        const { data: secPosts, error: secondaryError } = await secondaryBlogSupabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .range(secondaryRangeStart, secondaryRangeEnd); // Use calculated range
        
        if (secondaryError) {
          console.error('[ERROR] Error fetching secondary posts:', secondaryError);
        } else {
          secondaryPosts = secPosts || [];
          console.log(`[DEBUG] Fetched ${secondaryPosts.length} posts from secondary Supabase project`);
        }
      } catch (error) {
        console.error('[ERROR] Error with secondary Supabase client:', error);
        secondaryPosts = [];
      }
    } else {
      console.log('[DEBUG] Secondary Supabase client not available');
    }

    // Combine posts from both sources
    const allPosts = [...filteredPrimaryPosts, ...secondaryPosts];
    
    if (!allPosts || allPosts.length === 0) {
      console.log('[DEBUG] No posts found from either source');
      return { posts: [], totalPosts: 0, hasMore: false };
    }

    console.log(`[DEBUG] Combined total: ${allPosts.length} posts before pagination`);

    // Sort all posts by creation date (newest first)
    allPosts.sort((a, b) => {
      const dateA = new Date(b.created_at || b.published_at || b.date || 0).getTime();
      const dateB = new Date(a.created_at || a.published_at || a.date || 0).getTime();
      return dateA - dateB;
    });
    
    // Apply pagination to the combined and sorted posts
    const paginatedPosts = allPosts.slice(start, start + perPage);
    console.log(`[DEBUG] Returning ${paginatedPosts.length} posts for current page ${page}`);

    // Map the posts fields to the Post type
    const mappedPosts = paginatedPosts.map((post, index) => {
      try {
        // Handle different tag formats between primary and secondary sources
        let postTags = '';
        if (post.tags) {
          if (Array.isArray(post.tags)) {
            // Handle array of tags (might be from secondary source)
            postTags = post.tags.join(',');
          } else {
            // Handle string of tags (likely from primary source)
            postTags = post.tags;
          }
        }
        
        // Convert markdown to HTML
        const htmlContent = convertMarkdownToHtml(post.content || post.html || '');
        
        // Extract image from images array if available
        const { imageUrl, imageAlt } = extractImageFromArray(post.images);
        
        // Fallback to extracting image from content if no image in array
        const { featureImage, imageAlt: contentImageAlt, contentWithoutImage } = extractFeatureImage(post.content || '');
        
        // Handle authors field to match the Post interface (string[])
        let authors: string[] = [];
        if (post.authors) {
          if (typeof post.authors === 'string') {
            authors = [post.authors];
          } else if (Array.isArray(post.authors)) {
            authors = post.authors;
          }
        } else if (post.author) {
          if (typeof post.author === 'string') {
            authors = [post.author];
          } else if (Array.isArray(post.author)) {
            authors = post.author;
          }
        } else {
          authors = ['Top Contractors Denver'];
        }

        const transformedPost: Post = {
          id: post.id || `post-${index}`,
          title: post.title || 'Untitled Post',
          slug: post.slug || `post-${post.id || index}`,
          html: htmlContent,
          excerpt: post.excerpt || (post.content || '').substring(0, 160),
          feature_image: imageUrl || post.image || post.feature_image || featureImage || undefined,
          feature_image_alt: imageAlt || post.image_alt || post.feature_image_alt || contentImageAlt || post.title || undefined,
          authors: authors,
          tags: postTags || null,
          reading_time: estimateReadingTime(post.content || post.html || ''),
          trade_category: post.trade_category || post.category,
          published_at: post.published_at || post.created_at || post.date || new Date().toISOString(),
          updated_at: post.updated_at || post.created_at || post.published_at || post.date || new Date().toISOString(),
          created_at: post.created_at || post.published_at || post.date || new Date().toISOString()
        };
        
        return transformedPost;
      } catch (error) {
        console.error(`[ERROR] Error transforming post ${post.id || index}:`, error);
        // Return a minimal valid post to prevent the entire page from failing
        return {
          id: post.id || `error-post-${index}`,
          title: post.title || `Error Processing Post ${index + 1}`,
          slug: post.slug || `error-post-${index}`,
          html: '<p>Error processing post content</p>',
          excerpt: 'Error processing post content',
          feature_image: undefined,
          feature_image_alt: undefined,
          authors: ['Top Contractors Denver'],
          tags: null,
          reading_time: 1,
          published_at: post.created_at || new Date().toISOString(),
          updated_at: post.created_at || new Date().toISOString(),
          created_at: post.created_at || new Date().toISOString(),
        } as Post;
      }
    });

    // Calculate total posts - use either the counts from the database or the length of filtered posts
    const estimatedTotalPosts = Math.max(
      filteredPrimaryPosts.length + secondaryPosts.length,
      primaryTotalCount + secondaryTotalCount
    );
    
    // Determine if there are more posts to load
    const hasMore = estimatedTotalPosts > (page * perPage);

    console.log(`[DEBUG] getPosts function completed successfully. Returning ${mappedPosts.length} posts with estimated total of ${estimatedTotalPosts}.`);
    return {
      posts: mappedPosts,
      totalPosts: estimatedTotalPosts,
      hasMore
    };
  } catch (error) {
    console.error('[ERROR] Fatal error in getPosts function:', error);
    // Return empty result instead of throwing to prevent page from crashing
    return {
      posts: [],
      totalPosts: 0,
      hasMore: false
    };
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  console.log(`[DEBUG] getPostBySlug called with slug: ${slug}`);
  
  try {
    // First, try to find the post in the primary database
    const { data: primaryPost, error: primaryError } = await blogSupabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (primaryError && primaryError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('[ERROR] Error fetching post from primary database:', primaryError);
    }

    // If we found a post in the primary database and it belongs to our project, return it
    if (primaryPost && postBelongsToProject(primaryPost.tags)) {
      console.log(`[DEBUG] Found post in primary database: ${primaryPost.title}`);
      
      // Convert markdown to HTML
      const htmlContent = convertMarkdownToHtml(primaryPost.content);
      
      // Extract image from images array if available
      const { imageUrl, imageAlt } = extractImageFromArray(primaryPost.images);
      
      // Fallback to extracting image from content if no image in array
      const { featureImage, imageAlt: contentImageAlt, contentWithoutImage } = extractFeatureImage(primaryPost.content);

      // Map the blog_posts fields to the Post type
      return {
        id: primaryPost.id,
        title: primaryPost.title,
        slug: primaryPost.slug,
        html: htmlContent,
        excerpt: primaryPost.excerpt || (primaryPost.content || '').substring(0, 160),
        feature_image: imageUrl || primaryPost.image || primaryPost.feature_image || featureImage,
        feature_image_alt: imageAlt || primaryPost.image_alt || primaryPost.feature_image_alt || contentImageAlt || primaryPost.title,
        authors: primaryPost.authors,
        tags: primaryPost.tags,
        reading_time: estimateReadingTime(primaryPost.content),
        trade_category: primaryPost.trade_category || undefined,
        created_at: primaryPost.created_at || primaryPost.published_at || primaryPost.date || new Date().toISOString(),
        published_at: primaryPost.published_at,
        updated_at: primaryPost.updated_at
      };
    }

    // If not found in primary database or doesn't belong to our project, try the secondary database
    if (secondaryBlogSupabase) {
      console.log(`[DEBUG] Post not found in primary database or doesn't belong to project, trying secondary database`);
      
      const { data: secondaryPost, error: secondaryError } = await secondaryBlogSupabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (secondaryError && secondaryError.code !== 'PGRST116') {
        console.error('[ERROR] Error fetching post from secondary database:', secondaryError);
      }

      if (secondaryPost) {
        console.log(`[DEBUG] Found post in secondary database: ${secondaryPost.title}`);
        
        // Convert markdown to HTML
        const htmlContent = convertMarkdownToHtml(secondaryPost.content || secondaryPost.html || '');
        
        // Handle different tag formats
        let postTags = '';
        if (secondaryPost.tags) {
          if (Array.isArray(secondaryPost.tags)) {
            postTags = secondaryPost.tags.join(',');
          } else {
            postTags = secondaryPost.tags;
          }
        }
        
        // Extract image from images array if available
        const { imageUrl, imageAlt } = extractImageFromArray(secondaryPost.images);
        
        // Fallback to extracting image from content if no image in array
        const { featureImage, imageAlt: contentImageAlt, contentWithoutImage } = 
          extractFeatureImage(secondaryPost.content || '');
        
        // Handle authors field
        let authors: string[] = [];
        if (secondaryPost.authors) {
          if (typeof secondaryPost.authors === 'string') {
            authors = [secondaryPost.authors];
          } else if (Array.isArray(secondaryPost.authors)) {
            authors = secondaryPost.authors;
          }
        }

        // Map the posts fields to the Post type
        return {
          id: secondaryPost.id,
          title: secondaryPost.title,
          slug: secondaryPost.slug,
          html: htmlContent,
          excerpt: secondaryPost.excerpt || (secondaryPost.content || '').substring(0, 160),
          feature_image: imageUrl || secondaryPost.image || secondaryPost.feature_image || featureImage,
          feature_image_alt: imageAlt || secondaryPost.image_alt || secondaryPost.feature_image_alt || contentImageAlt || secondaryPost.title,
          authors: authors,
          tags: postTags,
          reading_time: estimateReadingTime(secondaryPost.content || secondaryPost.html || ''),
          trade_category: secondaryPost.trade_category || undefined,
          created_at: secondaryPost.created_at || secondaryPost.published_at || secondaryPost.date || new Date().toISOString(),
          published_at: secondaryPost.published_at,
          updated_at: secondaryPost.updated_at
        };
      }
    }

    console.log(`[DEBUG] Post with slug "${slug}" not found in either database`);
    return null;
  } catch (error) {
    console.error(`[ERROR] Unexpected error in getPostBySlug:`, error);
    return null;
  }
}

export async function getPostsByTag(tag: string, page = 1, perPage = 10): Promise<{
  posts: Post[];
  totalPosts: number;
  hasMore: boolean;
}> {
  const start = (page - 1) * perPage;
  const end = start + perPage - 1;

  const { data: posts, error, count: totalCount } = await blogSupabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .ilike('tags', `%${tag}%`)
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) {
    console.error('Error fetching posts by tag:', error);
    return { posts: [], totalPosts: 0, hasMore: false };
  }

  if (!posts) {
    return { posts: [], totalPosts: 0, hasMore: false };
  }

  // Filter posts that belong to this project based on tags
  const projectPosts = posts.filter(post => postBelongsToProject(post.tags));

  // Map the blog_posts fields to the Post type
  const mappedPosts = projectPosts.map(post => {
    // Extract feature image from content if available
    const { featureImage, imageAlt, contentWithoutImage } = extractFeatureImage(post.content);

    // Convert markdown to HTML
    const htmlContent = convertMarkdownToHtml(contentWithoutImage);

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      html: htmlContent,
      excerpt: contentWithoutImage.substring(0, 160),
      feature_image: featureImage,
      feature_image_alt: imageAlt || post.title,
      authors: post.authors,
      tags: post.tags,
      reading_time: estimateReadingTime(contentWithoutImage),
      trade_category: post.trade_category || undefined,
      published_at: post.created_at,
      updated_at: post.created_at,
      created_at: post.created_at
    };
  });

  const totalPosts = totalCount || 0;
  const hasMore = totalPosts > (page * perPage);

  return {
    posts: mappedPosts,
    totalPosts,
    hasMore
  };
}

// Helper function to estimate reading time
function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
