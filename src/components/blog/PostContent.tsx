import Image from 'next/image';
import type { Post } from '@/types/blog';

interface PostContentProps {
  post: Post;
}

export function PostContent({ post }: PostContentProps) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          {post.title}
        </h1>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-medium text-gray-900">
              {post.authors?.[0]?.name || 'Top Contractors Denver'}
            </div>
            <time className="text-sm text-gray-500">
              {new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.slug}
                  className="px-3 py-1 bg-gray-100 text-sm text-gray-600 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
        {post.feature_image && (
          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.feature_image}
              alt={post.feature_image_alt || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        )}
      </header>
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
}
