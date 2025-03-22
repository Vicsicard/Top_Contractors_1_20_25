import { Post } from '@/types/blog';
import { blogSupabase } from './supabase-blog-client';

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  feature_image: string | null;
  feature_image_alt: string | null;
  trade_category: string | null;
  published_at: string;
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  if (!post.tags || typeof post.tags !== 'string' || post.tags.length === 0) {
    // If no tags, get latest posts
    const { data: posts } = await blogSupabase
      .from('blog_posts')
      .select('*')
      .neq('id', post.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!posts || posts.length === 0) return [];

    // Map the blog_posts fields to the Post type
    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      html: post.content, // Use content as html
      excerpt: post.excerpt,
      feature_image: post.feature_image,
      feature_image_alt: post.feature_image_alt,
      authors: post.authors,
      tags: post.tags,
      reading_time: post.reading_time,
      trade_category: post.trade_category,
      published_at: post.created_at,
      updated_at: post.updated_at,
      created_at: post.created_at
    }));
  }

  // Get posts with similar tags
  const { data: posts } = await blogSupabase
    .from('blog_posts')
    .select('*')
    .neq('id', post.id)
    .ilike('tags', `%${post.tags}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!posts || posts.length === 0) return [];

  // Map the blog_posts fields to the Post type
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    html: post.content, // Use content as html
    excerpt: post.excerpt,
    feature_image: post.feature_image,
    feature_image_alt: post.feature_image_alt,
    authors: post.authors,
    tags: post.tags,
    reading_time: post.reading_time,
    trade_category: post.trade_category,
    published_at: post.created_at,
    updated_at: post.updated_at,
    created_at: post.created_at
  }));
}

export async function getRelatedTradeContent(tradeSlug: string, limit = 3): Promise<RelatedPost[]> {
  const { data: posts } = await blogSupabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, feature_image, feature_image_alt, trade_category, created_at')
    .eq('trade_category', tradeSlug)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!posts || posts.length === 0) return [];

  // Map the fields to match the RelatedPost interface
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    feature_image: post.feature_image,
    feature_image_alt: post.feature_image_alt,
    trade_category: post.trade_category,
    published_at: post.created_at
  }));
}
