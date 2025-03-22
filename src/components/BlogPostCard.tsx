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
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/blog/${post.slug}`} className="block">
        {post.feature_image && (
          <div className="relative aspect-video">
            <Image
              src={post.feature_image}
              alt={post.feature_image_alt || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="p-6">
          <h2 className="text-xl font-bold mb-2 text-gray-900 hover:text-blue-600 line-clamp-2">
            {post.title}
          </h2>

          {showExcerpt && post.excerpt && (
            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
          )}

          <div className="flex items-center justify-between">
            {showAuthor && (
              <span className="text-sm text-gray-600">
                {typeof post.authors === 'string' ? post.authors : (post.authors?.[0] || 'Top Contractors Denver')}
              </span>
            )}
            <time className="text-sm text-gray-500" dateTime={post.published_at}>
              {post.published_at ? formatDate(post.published_at) : ''}
            </time>
          </div>

          {post.tags && (
            <div className="mt-4 flex flex-wrap gap-2">
              {typeof post.tags === 'string' ? 
                post.tags.split(',').filter(Boolean).map((tag: string) => (
                  <span
                    key={tag.trim()}
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
