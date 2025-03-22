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
  return { featureImage, imageAlt, contentWithoutImage };
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
    
    // Fetch posts from primary Supabase instance (blog project)
    console.log('[DEBUG] Fetching posts from primary Supabase instance (blog project)');
    const { data: primaryPosts, error: primaryError } = await blogSupabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      // Remove the posted_on_site filter as we discovered none of the posts have this flag set to true
      .order('created_at', { ascending: false });

    if (primaryError) {
      console.error('[ERROR] Error fetching primary posts:', primaryError);
      throw new Error(`Failed to fetch primary posts: ${primaryError.message}`);
    } 
    
    console.log(`[DEBUG] Fetched ${primaryPosts?.length || 0} posts from primary Supabase project`);
    
    // Log sample post structure for debugging
    if (primaryPosts && primaryPosts.length > 0) {
      console.log('[DEBUG] Sample primary post structure:', JSON.stringify({
        id: primaryPosts[0].id,
        title: primaryPosts[0].title,
        tags: primaryPosts[0].tags
      }, null, 2));
    }

    // Fetch posts from secondary Supabase instance (main project)
    let secondaryPosts: any[] = [];
    
    if (secondaryBlogSupabase) {
      try {
        console.log('[DEBUG] Fetching posts from secondary Supabase instance (main project)');
        // For the secondary project, we need to use the 'posts' table instead of 'blog_posts'
        const { data: secPosts, error: secondaryError } = await secondaryBlogSupabase
          .from('posts')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false });
        
        if (secondaryError) {
          console.error('[ERROR] Error fetching secondary posts:', secondaryError);
        } else {
          secondaryPosts = secPosts || [];
          console.log(`[DEBUG] Fetched ${secondaryPosts.length} posts from secondary Supabase project`);
          
          // Log sample post structure for debugging
          if (secondaryPosts && secondaryPosts.length > 0) {
            console.log('[DEBUG] Sample secondary post structure:', JSON.stringify({
              id: secondaryPosts[0].id,
              title: secondaryPosts[0].title,
              tags: secondaryPosts[0].tags
            }, null, 2));
          }
        }
      } catch (error) {
        console.error('[ERROR] Error with secondary Supabase client:', error);
        // Continue with just the primary posts
        secondaryPosts = [];
      }
    } else {
      console.log('[DEBUG] Secondary Supabase client not available');
    }

    // Filter primary posts by project tags
    const filteredPrimaryPosts = (primaryPosts || []).filter(post => {
      const belongs = postBelongsToProject(post.tags);
      if (belongs) {
        console.log(`[DEBUG] Primary post matched project tags: ${post.title}`);
      }
      return belongs;
    });
    
    console.log(`[DEBUG] After filtering: ${filteredPrimaryPosts.length} primary posts match project criteria`);

    // Combine posts from both sources
    const allPosts = [...filteredPrimaryPosts, ...secondaryPosts];
    
    if (!allPosts || allPosts.length === 0) {
      console.log('[DEBUG] No posts found from either source');
      return { posts: [], totalPosts: 0, hasMore: false };
    }

    console.log(`[DEBUG] Combined total: ${allPosts.length} posts`);

    // Sort all posts by creation date (newest first)
    allPosts.sort((a, b) => {
      const dateA = new Date(b.created_at || b.published_at || b.date || 0).getTime();
      const dateB = new Date(a.created_at || a.published_at || a.date || 0).getTime();
      return dateA - dateB;
    });
    
    // Apply pagination after combining and filtering
    const paginatedPosts = allPosts.slice(start, start + perPage);
    console.log(`[DEBUG] Returning ${paginatedPosts.length} posts for current page`);

    // Map the posts fields to the Post type
    const mappedPosts = paginatedPosts.map((post, index) => {
      try {
        console.log(`[DEBUG] Transforming post ${index + 1}/${paginatedPosts.length}: ${post.title || 'Untitled'}`);
        
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

    const totalPosts = allPosts.length;
    const hasMore = totalPosts > (page * perPage);

    console.log(`[DEBUG] getPosts function completed successfully. Returning ${mappedPosts.length} posts.`);
    return {
      posts: mappedPosts,
      totalPosts,
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
  const { data: post, error } = await blogSupabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  if (!post) return null;
  
  // Check if this post belongs to our project
  if (!postBelongsToProject(post.tags)) {
    console.warn(`Post with slug "${slug}" does not belong to this project`);
    return null;
  }

  // Convert markdown to HTML
  const htmlContent = convertMarkdownToHtml(post.content);
  
  // Extract image from images array if available
  const { imageUrl, imageAlt } = extractImageFromArray(post.images);
  
  // Fallback to extracting image from content if no image in array
  const { featureImage, imageAlt: contentImageAlt } = extractFeatureImage(post.content);

  // Map the blog_posts fields to the Post type
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    html: htmlContent,
    excerpt: post.content.substring(0, 160), // Create excerpt from content if not available
    feature_image: imageUrl || post.image || post.feature_image || featureImage,
    feature_image_alt: imageAlt || post.image_alt || post.feature_image_alt || contentImageAlt || post.title,
    authors: post.authors,
    tags: post.tags,
    reading_time: estimateReadingTime(post.content),
    trade_category: post.trade_category || undefined,
    created_at: post.created_at || post.published_at || new Date().toISOString(),
    published_at: post.published_at,
    updated_at: post.updated_at
  };
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
      excerpt: post.content.substring(0, 160),
      feature_image: featureImage,
      feature_image_alt: imageAlt || post.title,
      authors: post.authors,
      tags: post.tags,
      reading_time: estimateReadingTime(post.content),
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
