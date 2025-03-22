import { Post } from '@/types/blog';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/utils/date';

interface BlogPostCardProps {
  post: Post;
  showExcerpt?: boolean;
  showAuthor?: boolean;
}

export function BlogPostCard({ post, showExcerpt = true, showAuthor = true }: BlogPostCardProps) {
  // Add error handling for missing post data
  if (!post) {
    console.error('[ERROR] BlogPostCard received null or undefined post');
    return (
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6">
        <div className="text-center text-gray-600">Error: Post data unavailable</div>
      </article>
    );
  }

  // Ensure post has required properties
  const safePost = {
    ...post,
    id: post.id || 'unknown-id',
    title: post.title || 'Untitled Post',
    slug: post.slug || 'unknown-slug',
    excerpt: post.excerpt || '',
    feature_image: post.feature_image || '',
    feature_image_alt: post.feature_image_alt || post.title || 'Blog Image',
    authors: post.authors || 'Top Contractors Denver',
    published_at: post.published_at || post.created_at || new Date().toISOString(),
    tags: post.tags || ''
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/blog/${safePost.slug}`} className="block">
        {safePost.feature_image && (
          <div className="relative aspect-video">
            <Image
              src={safePost.feature_image}
              alt={safePost.feature_image_alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                console.error(`[ERROR] Failed to load image for post: ${safePost.title}`);
                // Replace with fallback image or hide the image container
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="p-6">
          <h2 className="text-xl font-bold mb-2 text-gray-900 hover:text-blue-600 line-clamp-2">
            {safePost.title}
          </h2>

          {showExcerpt && safePost.excerpt && (
            <p className="text-gray-600 mb-4 line-clamp-3">{safePost.excerpt}</p>
          )}

          <div className="flex items-center justify-between">
            {showAuthor && (
              <span className="text-sm text-gray-600">
                {typeof safePost.authors === 'string' ? safePost.authors : (safePost.authors?.[0] || 'Top Contractors Denver')}
              </span>
            )}
            <time className="text-sm text-gray-500" dateTime={safePost.published_at}>
              {safePost.published_at ? formatDate(safePost.published_at) : ''}
            </time>
          </div>

          {safePost.tags && (
            <div className="mt-4 flex flex-wrap gap-2">
              {typeof safePost.tags === 'string' ? 
                safePost.tags.split(',').filter(Boolean).map((tag: string, index: number) => (
                  <span
                    key={`${tag.trim()}-${index}`}
                    className="px-2 py-1 bg-gray-100 text-sm text-gray-600 rounded-full"
                  >
                    {tag.trim()}
                  </span>
                ))
              : null}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
