import { createClient } from './supabase-server';

interface Post {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  category?: string;
  tags?: string[];
}

export async function getRelatedPosts(currentPost: Post, limit = 3): Promise<Post[]> {
  const supabase = createClient();
  
  // If the post has tags, find posts with matching tags
  if (currentPost.tags && currentPost.tags.length > 0) {
    const { data: taggedPosts } = await supabase
      .from('posts')
      .select('*')
      .neq('id', currentPost.id)
      .contains('tags', currentPost.tags)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (taggedPosts && taggedPosts.length >= limit) {
      return taggedPosts;
    }
  }

  // If not enough posts found by tags, find posts in the same category
  if (currentPost.category) {
    const { data: categoryPosts } = await supabase
      .from('posts')
      .select('*')
      .neq('id', currentPost.id)
      .eq('category', currentPost.category)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (categoryPosts && categoryPosts.length > 0) {
      return categoryPosts;
    }
  }

  // If still not enough posts, get the most recent posts
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('*')
    .neq('id', currentPost.id)
    .order('published_at', { ascending: false })
    .limit(limit);

  return recentPosts || [];
}

export async function getRelatedTradeContent(tradeSlug: string, limit = 3) {
  const supabase = createClient();

  // Get related blog posts for the trade
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('category', tradeSlug)
    .order('published_at', { ascending: false })
    .limit(limit);

  // Get related videos for the trade
  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .eq('category', tradeSlug)
    .order('created_at', { ascending: false })
    .limit(limit);

  return {
    posts: posts || [],
    videos: videos || []
  };
}
