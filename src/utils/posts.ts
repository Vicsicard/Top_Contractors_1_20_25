import { blogSupabase, mainSupabase } from './supabase-blog-client';
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

export async function getPosts(page: number, perPage: number): Promise<{
  posts: Post[];
  totalPosts: number;
  hasMore: boolean;
}> {
  try {
    console.log(`[DEBUG] Starting getPosts function for page ${page}, perPage ${perPage}`);
    const start = (page - 1) * perPage;
    const end = start + perPage - 1;
    
    console.log(`[DEBUG] Range calculation: start=${start}, end=${end}`);
    
    // Always get the total count for accurate pagination
    let totalCount = 0;
    
    // Check if we have a valid Supabase client
    if (!blogSupabase) {
      console.error('[ERROR] blogSupabase client is not initialized');
      return { posts: [], totalPosts: 0, hasMore: false };
    }
    
    try {
      // Get count of posts from the merged table
      console.log('[DEBUG] Fetching total count from merge_blog_posts table');
      const { count, error } = await blogSupabase
        .from('merge_blog_posts')
        .select('*', { count: 'exact', head: true });
        
      if (!error) {
        totalCount = count || 0;
        console.log(`[DEBUG] Merged table has ${totalCount} total posts`);
      } else {
        console.error('[ERROR] Error getting post count from merged table:', error);
        
        // Fallback to a hardcoded count if we can't get it from the database
        totalCount = 1596; // Based on the memory that says there are 1,596 posts
        console.log(`[DEBUG] Using fallback count of ${totalCount} posts`);
      }
    } catch (error) {
      console.error('[ERROR] Error getting post count from merged table:', error);
      
      // Fallback to a hardcoded count if we can't get it from the database
      totalCount = 1596; // Based on the memory that says there are 1,596 posts
      console.log(`[DEBUG] Using fallback count of ${totalCount} posts`);
    }
    
    // Fetch posts from the merged table with pagination
    console.log(`[DEBUG] Fetching posts from merged_blog_posts table with range: ${start}-${end}`);
    const { data: mergedPosts, error: mergedError } = await blogSupabase
      .from('merge_blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(start, end);

    if (mergedError) {
      console.error('[ERROR] Error fetching posts from merged table:', mergedError);
      throw new Error(`Failed to fetch posts from merged table: ${mergedError.message}`);
    } 
    
    console.log(`[DEBUG] Fetched ${mergedPosts?.length || 0} posts from merged table for page ${page}`);
    
    // Use all posts without filtering
    const filteredPosts = mergedPosts || [];
    
    console.log(`[DEBUG] Total posts to display: ${filteredPosts.length}`);

    if (!filteredPosts || filteredPosts.length === 0) {
      console.log('[DEBUG] No posts found from merged table');
      return { posts: [], totalPosts: totalCount, hasMore: false };
    }

    // Map the posts fields to the Post type
    const mappedPosts = filteredPosts.map((post, index) => {
      try {
        // Convert markdown to HTML
        const htmlContent = convertMarkdownToHtml(post.content || '');
        
        // Extract image from images array if available
        const { imageUrl, imageAlt } = extractImageFromArray(post.images);
        
        // Fallback to extracting image from content if no image in array
        const { featureImage, imageAlt: contentImageAlt } = extractFeatureImage(post.content || '');
        
        // Handle authors field to match the Post interface (string[])
        const authors: string[] = ['Top Contractors Denver'];
        
        const transformedPost: Post = {
          id: post.id || `post-${index}`,
          title: post.title || 'Untitled Post',
          slug: post.slug || `post-${post.id || index}`,
          html: htmlContent,
          excerpt: post.content ? post.content.substring(0, 160) : '',
          feature_image: imageUrl || featureImage || undefined,
          feature_image_alt: imageAlt || contentImageAlt || post.title || undefined,
          authors: authors,
          tags: post.tags || null,
          reading_time: estimateReadingTime(post.content || ''),
          trade_category: undefined,
          published_at: post.created_at || new Date().toISOString(),
          updated_at: post.created_at || new Date().toISOString(),
          created_at: post.created_at || new Date().toISOString()
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

    console.log(`[DEBUG] Returning ${mappedPosts.length} posts with totalPosts=${totalCount}, hasMore=${totalCount > (page * perPage)}`);
    return {
      posts: mappedPosts,
      totalPosts: totalCount,
      hasMore: totalCount > (page * perPage)
    };
  } catch (error) {
    console.error('[ERROR] Error in getPosts function:', error);
    // Return a fallback total count even when there's an error
    return { posts: [], totalPosts: 1596, hasMore: true };
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  console.log(`[DEBUG] getPostBySlug called with slug: ${slug}`);
  
  try {
    // Find the post in the merged table
    const { data: post, error } = await blogSupabase
      .from('merge_blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('[ERROR] Error fetching post from merged table:', error);
    }

    // If we found a post, return it
    if (post) {
      console.log(`[DEBUG] Found post in merged table: ${post.title}`);
      
      // Convert markdown to HTML
      const htmlContent = convertMarkdownToHtml(post.content);
      
      // Extract image from images array if available
      const { imageUrl, imageAlt } = extractImageFromArray(post.images);
      
      // Fallback to extracting image from content if no image in array
      const { featureImage, imageAlt: contentImageAlt } = extractFeatureImage(post.content);

      // Map the fields to the Post type
      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        html: htmlContent,
        excerpt: post.content ? post.content.substring(0, 160) : '',
        feature_image: imageUrl || featureImage,
        feature_image_alt: imageAlt || contentImageAlt || post.title,
        authors: ['Top Contractors Denver'],
        tags: post.tags,
        reading_time: estimateReadingTime(post.content),
        trade_category: undefined,
        created_at: post.created_at || new Date().toISOString(),
        published_at: post.created_at,
        updated_at: post.created_at
      };
    }

    console.log(`[DEBUG] Post with slug "${slug}" not found in merged table`);
    
    // If we still can't find the post, try the original methods as fallback
    // This is a safety measure during the transition period
    
    // Try primary database
    const { data: primaryPost } = await blogSupabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (primaryPost) {
      console.log(`[DEBUG] Found post in primary database as fallback: ${primaryPost.title}`);
      // Convert and return as before...
      const htmlContent = convertMarkdownToHtml(primaryPost.content);
      const { imageUrl, imageAlt } = extractImageFromArray(primaryPost.images);
      const { featureImage, imageAlt: contentImageAlt } = extractFeatureImage(primaryPost.content);
      
      return {
        id: primaryPost.id,
        title: primaryPost.title,
        slug: primaryPost.slug,
        html: htmlContent,
        excerpt: primaryPost.content ? primaryPost.content.substring(0, 160) : '',
        feature_image: imageUrl || featureImage,
        feature_image_alt: imageAlt || contentImageAlt || primaryPost.title,
        authors: ['Top Contractors Denver'],
        tags: primaryPost.tags,
        reading_time: estimateReadingTime(primaryPost.content),
        trade_category: undefined,
        created_at: primaryPost.created_at,
        published_at: primaryPost.created_at,
        updated_at: primaryPost.created_at
      };
    }
    
    // Try secondary database if available
    if (mainSupabase) {
      const { data: secondaryPost } = await mainSupabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (secondaryPost) {
        console.log(`[DEBUG] Found post in secondary database as fallback: ${secondaryPost.title}`);
        
        return {
          id: secondaryPost.id,
          title: secondaryPost.title,
          slug: secondaryPost.slug,
          html: secondaryPost.html,
          excerpt: secondaryPost.excerpt,
          feature_image: secondaryPost.feature_image,
          feature_image_alt: secondaryPost.feature_image_alt,
          authors: secondaryPost.authors || ['Top Contractors Denver'],
          tags: secondaryPost.tags,
          reading_time: secondaryPost.reading_time,
          trade_category: secondaryPost.trade_category,
          created_at: secondaryPost.created_at,
          published_at: secondaryPost.published_at,
          updated_at: secondaryPost.updated_at
        };
      }
    } else {
      console.log('[WARN] Secondary database client not available, skipping secondary database check');
    }
    
    console.log(`[DEBUG] Post with slug "${slug}" not found in any database`);
    return null;
  } catch (error) {
    console.error('[ERROR] Error in getPostBySlug function:', error);
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
    .from('merge_blog_posts')
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
  const projectPosts = posts.filter(post => {
    const belongs = postBelongsToProject(post.tags);
    if (belongs) {
      console.log(`[DEBUG] Post matched project tags: ${post.title}`);
    }
    return belongs;
  });

  // Map the posts fields to the Post type
  const mappedPosts = projectPosts.map(post => {
    // Extract feature image from content if available
    const { featureImage, imageAlt } = extractFeatureImage(post.content);

    // Convert markdown to HTML
    const htmlContent = convertMarkdownToHtml(post.content);

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      html: htmlContent,
      excerpt: post.content.substring(0, 160),
      feature_image: featureImage,
      feature_image_alt: imageAlt || post.title,
      authors: ['Top Contractors Denver'],
      tags: post.tags,
      reading_time: estimateReadingTime(post.content),
      trade_category: undefined,
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
