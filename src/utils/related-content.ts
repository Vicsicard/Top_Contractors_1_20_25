import { Post } from '@/types/blog';
import { supabase } from './supabase';

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
  if (!post.tags || post.tags.length === 0) {
    // If no tags, get latest posts
    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .neq('id', post.id)
      .order('published_at', { ascending: false })
      .limit(limit);

    return posts || [];
  }

  // Get posts with similar tags
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .neq('id', post.id)
    .filter('tags', 'cs', `{${post.tags.map(tag => typeof tag === 'string' ? tag : tag.name).join(',')}}`)
    .order('published_at', { ascending: false })
    .limit(limit);

  return posts || [];
}

export async function getRelatedTradeContent(tradeSlug: string, limit = 3): Promise<RelatedPost[]> {
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      excerpt,
      feature_image,
      feature_image_alt,
      trade_category,
      published_at
    `)
    .eq('trade_category', tradeSlug)
    .order('published_at', { ascending: false })
    .limit(limit);

  return posts || [];
}
