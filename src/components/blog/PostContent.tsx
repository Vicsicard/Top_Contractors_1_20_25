import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/types/blog';

interface PostContentProps {
  post: Post;
}

export function PostContent({ post }: PostContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <time dateTime={post.published_at}>
          {new Date(post.published_at).toLocaleDateString()}
        </time>
        {post.reading_time && (
          <>
            <span className="mx-2">•</span>
            <span>{post.reading_time} min read</span>
          </>
        )}
        {post.trade_category && (
          <>
            <span className="mx-2">•</span>
            <Link
              href={`/trades/${post.trade_category}`}
              className="hover:text-blue-600"
            >
              {post.trade_category.replace(/-/g, ' ')}
            </Link>
          </>
        )}
      </div>

      {post.feature_image && (
        <div className="relative aspect-video mb-8">
          <Image
            src={post.feature_image}
            alt={post.feature_image_alt || post.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      )}

      <div dangerouslySetInnerHTML={{ __html: post.html }} />

      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 pt-4 border-t">
          <h2 className="text-lg font-semibold mb-2">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/blog/tag/${tag.slug}`}
                className="inline-block px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
