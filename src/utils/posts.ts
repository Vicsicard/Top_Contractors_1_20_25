import { supabase } from '@/lib/supabase';
import type { Post } from '@/types/blog';

function extractFirstImage(html: string): { url: string; alt: string } | null {
  const imgRegex = /<img[^>]+src="([^">]+)"[^>]*alt="([^">]*)"[^>]*>/i;
  const match = html.match(imgRegex);
  if (match && match[1]) {
    return {
      url: match[1],
      alt: match[2] || ''
    };
  }
  return null;
}

export async function getPosts(page = 1, perPage = 10): Promise<{
  posts: Post[];
  totalPosts: number;
  hasMore: boolean;
}> {
  const start = (page - 1) * perPage;
  const end = start + perPage - 1;

  const { data: posts, error: postsError, count } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      html,
      excerpt,
      feature_image,
      feature_image_alt,
      authors,
      tags,
      reading_time,
      trade_category,
      published_at,
      updated_at
    `, { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(start, end);

  if (postsError) {
    console.error('Error fetching posts:', postsError);
    return {
      posts: [],
      totalPosts: 0,
      hasMore: false
    };
  }

  // Ensure posts have all required fields
  const processedPosts = (posts || []).map(post => ({
    ...post,
    html: post.html || `<p>Content coming soon for "${post.title}"</p>`,
    excerpt: post.excerpt?.replace('undefined...', '') || `Preview coming soon for "${post.title}"`,
    authors: post.authors || [],
    tags: post.tags || [],
    reading_time: post.reading_time || null,
    trade_category: post.trade_category || null,
    feature_image: post.feature_image || null,
    feature_image_alt: post.feature_image_alt || null,
    updated_at: post.updated_at || post.published_at
  }));

  return {
    posts: processedPosts,
    totalPosts: count || 0,
    hasMore: count ? (start + perPage) < count : false
  };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      html,
      excerpt,
      feature_image,
      feature_image_alt,
      authors,
      tags,
      reading_time,
      trade_category,
      published_at,
      updated_at
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  return post;
}

export async function getPostsByTag(tag: string, page = 1, perPage = 10): Promise<{
  posts: Post[];
  totalPosts: number;
  hasMore: boolean;
}> {
  const start = (page - 1) * perPage;
  const end = start + perPage - 1;

  const { data: posts, error: postsError, count } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      html,
      excerpt,
      feature_image,
      feature_image_alt,
      authors,
      tags,
      reading_time,
      trade_category,
      published_at,
      updated_at
    `, { count: 'exact' })
    .filter('tags', 'cs', `{${tag}}`)
    .order('published_at', { ascending: false })
    .range(start, end);

  if (postsError) {
    console.error('Error fetching posts by tag:', postsError);
    return {
      posts: [],
      totalPosts: 0,
      hasMore: false
    };
  }

  // Ensure posts have all required fields
  const processedPosts = (posts || []).map(post => ({
    ...post,
    html: post.html || `<p>Content coming soon for "${post.title}"</p>`,
    excerpt: post.excerpt?.replace('undefined...', '') || `Preview coming soon for "${post.title}"`,
    authors: post.authors || [],
    tags: post.tags || [],
    reading_time: post.reading_time || null,
    trade_category: post.trade_category || null,
    feature_image: post.feature_image || null,
    feature_image_alt: post.feature_image_alt || null,
    updated_at: post.updated_at || post.published_at
  }));

  return {
    posts: processedPosts,
    totalPosts: count || 0,
    hasMore: count ? (start + perPage) < count : false
  };
}
