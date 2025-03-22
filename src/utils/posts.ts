import { blogSupabase } from './supabase-blog-client';
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
  return tagList.some(tag => VALID_PROJECT_TAGS.includes(tag));
}

// Helper function to convert markdown to HTML
function convertMarkdownToHtml(markdown: string): string {
  try {
    // Replace custom tags like [h3] with proper HTML
    const cleanedMarkdown = markdown
      .replace(/\[h3\]/g, '### ')
      .replace(/\[\/h3\]/g, '')
      .replace(/\[h2\]/g, '## ')
      .replace(/\[\/h2\]/g, '')
      .replace(/\[h1\]/g, '# ')
      .replace(/\[\/h1\]/g, '');
    
    // Use marked.parse to ensure we get a string, not a Promise
    return marked.parse(cleanedMarkdown) as string;
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return markdown;
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
  const start = (page - 1) * perPage;
  const end = start + perPage - 1;

  const { data: posts, error, count: totalCount } = await blogSupabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], totalPosts: 0, hasMore: false };
  }

  if (!posts) {
    return { posts: [], totalPosts: 0, hasMore: false };
  }

  // Filter posts that belong to this project based on tags
  const projectPosts = posts.filter(post => postBelongsToProject(post.tags));

  // Map the blog_posts fields to the Post type
  const mappedPosts = projectPosts.map(post => {
    // Convert markdown to HTML
    const htmlContent = convertMarkdownToHtml(post.content);
    
    // Extract image from images array if available
    const { imageUrl, imageAlt } = extractImageFromArray(post.images);
    
    // Fallback to extracting image from content if no image in array
    const { featureImage, imageAlt: contentImageAlt } = extractFeatureImage(post.content);

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      html: htmlContent,
      excerpt: post.content.substring(0, 160),
      feature_image: imageUrl || post.image || featureImage,
      feature_image_alt: imageAlt || post.image_alt || contentImageAlt || post.title,
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
    feature_image: imageUrl || post.image || featureImage,
    feature_image_alt: imageAlt || post.image_alt || contentImageAlt || post.title,
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
